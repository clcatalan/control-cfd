require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// DB_TARGET=local uses DATABASE_URL_LOCAL (your Homebrew Postgres); anything else uses DATABASE_URL (Neon)
const useLocal = process.env.DB_TARGET === 'local';
const connectionString = useLocal ? process.env.DATABASE_URL_LOCAL : process.env.DATABASE_URL;

if (!connectionString) {
  const missingVar = useLocal ? 'DATABASE_URL_LOCAL' : 'DATABASE_URL';
  throw new Error(`${missingVar} environment variable is required`);
}

console.log(`Connecting to ${useLocal ? 'local' : 'Neon'} Postgres`);

// Hosted Postgres providers (Neon, Supabase, Railway, Render, ...) require SSL; local Postgres doesn't
const pool = new Pool({
  connectionString,
  ssl: useLocal ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client:', err.message);
});

// Initialize database schema
async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      participant_id TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS study_group TEXT
  `);
  console.log('Users table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('Admins table ready');

  // scheduled_date is stored as TEXT ('YYYY-MM-DD') rather than DATE to avoid
  // node-postgres converting it to a JS Date and shifting it across timezones
  await pool.query(`
    CREATE TABLE IF NOT EXISTS problem_schedule (
      problem_id INTEGER PRIMARY KEY,
      scheduled_date TEXT NOT NULL UNIQUE
    )
  `);
  console.log('Problem schedule table ready');

  // Records which problems a participant has completed, reported by the study frontend as they solve each one
  await pool.query(`
    CREATE TABLE IF NOT EXISTS problem_completions (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      problem_id INTEGER NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW(),
      response TEXT,
      PRIMARY KEY (user_id, problem_id)
    )
  `);
  await pool.query(`
    ALTER TABLE problem_completions ADD COLUMN IF NOT EXISTS response TEXT
  `);
  await pool.query(`
    ALTER TABLE problem_completions ADD COLUMN IF NOT EXISTS submitted_code TEXT
  `);
  await pool.query(`
    ALTER TABLE problem_completions ADD COLUMN IF NOT EXISTS leetcode_verified TEXT
  `);
  console.log('Problem completions table ready');

  // Generic log of participant UI events/metrics (e.g. "opened_problem", "language_changed").
  // New event types are just new event_name strings — no schema changes needed.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_events (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_name TEXT NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('User events table ready');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS study_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      all_problems_enabled BOOLEAN NOT NULL DEFAULT false,
      CONSTRAINT single_row CHECK (id = 1)
    )
  `);
  await pool.query(`
    INSERT INTO study_settings (id, all_problems_enabled)
    VALUES (1, false)
    ON CONFLICT (id) DO NOTHING
  `);
  console.log('Study settings table ready');

  await seedDefaultAdmin();
}

// Ensure a default admin account exists so the admin panel is reachable on a fresh database
async function seedDefaultAdmin() {
  const { rows } = await pool.query('SELECT id FROM admins WHERE username = $1', [DEFAULT_ADMIN_USERNAME]);
  if (rows.length === 0) {
    const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
    await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
      [DEFAULT_ADMIN_USERNAME, passwordHash]
    );
    console.log(`Default admin account created (username: ${DEFAULT_ADMIN_USERNAME})`);
  }
}

initializeDatabase().catch((err) => {
  console.error('Error initializing database:', err.message);
});

// Postgres unique-violation error code
const UNIQUE_VIOLATION = '23505';

// Database operations
const dbOperations = {
  // Create a new user
  createUser: async (participantId) => {
    try {
      const { rows } = await pool.query(
        'INSERT INTO users (participant_id) VALUES ($1) RETURNING id, participant_id',
        [participantId]
      );
      return { id: rows[0].id, participant_id: rows[0].participant_id };
    } catch (err) {
      if (err.code === UNIQUE_VIOLATION) {
        throw new Error('UNIQUE constraint failed: users.participant_id');
      }
      throw err;
    }
  },

  // Find user by participant ID
  findUserByParticipantId: async (participantId) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE participant_id = $1', [participantId]);
    return rows[0];
  },

  // Get all users
  getAllUsers: async () => {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  },

  // Delete user by participant ID
  deleteUser: async (participantId) => {
    const result = await pool.query('DELETE FROM users WHERE participant_id = $1', [participantId]);
    return { deleted: result.rowCount };
  },

  // Assign (or clear, with group=null) a participant's study group
  setUserGroup: async (participantId, group) => {
    const { rows } = await pool.query(
      'UPDATE users SET study_group = $1 WHERE participant_id = $2 RETURNING id, participant_id, study_group',
      [group, participantId]
    );
    return rows[0];
  },

  // Find admin by username
  findAdminByUsername: async (username) => {
    const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    return rows[0];
  },

  // Verify admin credentials, returns the admin row if valid, otherwise null
  verifyAdminCredentials: async (username, password) => {
    const admin = await dbOperations.findAdminByUsername(username);
    if (!admin) {
      return null;
    }
    const isValid = bcrypt.compareSync(password, admin.password_hash);
    return isValid ? admin : null;
  },

  // Record that a participant completed a problem, along with their accept/reject response (idempotent).
  // `code` is the edited solution text submitted after a reject, when applicable.
  markProblemCompleted: async (participantId, problemId, response, code) => {
    const user = await dbOperations.findUserByParticipantId(participantId);
    if (!user) {
      throw new Error('User not found');
    }
    await pool.query(
      `INSERT INTO problem_completions (user_id, problem_id, response, submitted_code)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET response = EXCLUDED.response, submitted_code = EXCLUDED.submitted_code`,
      [user.id, problemId, response || null, code || null]
    );
    return { userId: user.id, problemId };
  },

  // Get a participant's completed problem IDs, or null if the participant doesn't exist
  getUserCompletions: async (participantId) => {
    const user = await dbOperations.findUserByParticipantId(participantId);
    if (!user) {
      return null;
    }
    const { rows } = await pool.query(
      'SELECT problem_id, completed_at, response, submitted_code, leetcode_verified FROM problem_completions WHERE user_id = $1',
      [user.id]
    );
    return rows;
  },

  // Record an admin's manual verification of whether a rejected/edited submission
  // actually passes on LeetCode ('passed' or 'failed')
  setLeetcodeVerification: async (participantId, problemId, verification) => {
    const user = await dbOperations.findUserByParticipantId(participantId);
    if (!user) {
      throw new Error('User not found');
    }
    const { rowCount } = await pool.query(
      'UPDATE problem_completions SET leetcode_verified = $1 WHERE user_id = $2 AND problem_id = $3',
      [verification, user.id, problemId]
    );
    if (rowCount === 0) {
      throw new Error('Completion not found');
    }
    return { userId: user.id, problemId, verification };
  },

  // Log a generic UI event for a participant. eventName is free-form; metadata is an optional JSON object.
  logEvent: async (participantId, eventName, metadata) => {
    const user = await dbOperations.findUserByParticipantId(participantId);
    if (!user) {
      throw new Error('User not found');
    }
    await pool.query(
      'INSERT INTO user_events (user_id, event_name, metadata) VALUES ($1, $2, $3)',
      [user.id, eventName, metadata || null]
    );
    return { userId: user.id, eventName };
  },

  // Get a participant's logged events (most recent first), or null if the participant doesn't exist
  getUserEvents: async (participantId) => {
    const user = await dbOperations.findUserByParticipantId(participantId);
    if (!user) {
      return null;
    }
    const { rows } = await pool.query(
      'SELECT event_name, metadata, created_at FROM user_events WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );
    return rows;
  },

  // Get the full problem availability schedule
  getSchedule: async () => {
    const { rows } = await pool.query(
      'SELECT problem_id, scheduled_date FROM problem_schedule ORDER BY scheduled_date'
    );
    return rows;
  },

  // Set (or move) the date a problem becomes available
  setSchedule: async (problemId, scheduledDate) => {
    try {
      const { rows } = await pool.query(
        `INSERT INTO problem_schedule (problem_id, scheduled_date)
         VALUES ($1, $2)
         ON CONFLICT (problem_id) DO UPDATE SET scheduled_date = EXCLUDED.scheduled_date
         RETURNING problem_id, scheduled_date`,
        [problemId, scheduledDate]
      );
      return rows[0];
    } catch (err) {
      if (err.code === UNIQUE_VIOLATION) {
        throw new Error('UNIQUE constraint failed: problem_schedule.scheduled_date');
      }
      throw err;
    }
  },

  // Clear a problem's scheduled date
  clearSchedule: async (problemId) => {
    const result = await pool.query('DELETE FROM problem_schedule WHERE problem_id = $1', [problemId]);
    return { deleted: result.rowCount };
  },

  // Get study-wide settings (e.g. the "enable all problems" testing override)
  getSettings: async () => {
    const { rows } = await pool.query('SELECT all_problems_enabled FROM study_settings WHERE id = 1');
    return rows[0];
  },

  // Toggle the "enable all problems" testing override
  setAllProblemsEnabled: async (enabled) => {
    const { rows } = await pool.query(
      'UPDATE study_settings SET all_problems_enabled = $1 WHERE id = 1 RETURNING all_problems_enabled',
      [enabled]
    );
    return rows[0];
  },

  // Clear every participant's completion history, logged event timestamps, and the
  // problem schedule, then unlock all problems. Admin "Reset All Progress" action — global, irreversible.
  resetAllProgress: async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM problem_completions');
      await client.query('DELETE FROM problem_schedule');
      await client.query('DELETE FROM user_events');
      const { rows } = await client.query(
        'UPDATE study_settings SET all_problems_enabled = true WHERE id = 1 RETURNING all_problems_enabled'
      );
      await client.query('COMMIT');
      return rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};

module.exports = dbOperations;

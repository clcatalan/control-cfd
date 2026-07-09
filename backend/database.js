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
  }
};

module.exports = dbOperations;

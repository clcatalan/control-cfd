const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Create database connection
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating admins table:', err.message);
    } else {
      console.log('Admins table ready');
      seedDefaultAdmin();
    }
  });
}

// Ensure a default admin account exists so the admin panel is reachable on a fresh database
function seedDefaultAdmin() {
  db.get('SELECT id FROM admins WHERE username = ?', [DEFAULT_ADMIN_USERNAME], (err, row) => {
    if (err) {
      console.error('Error checking default admin:', err.message);
      return;
    }
    if (!row) {
      const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
      db.run(
        'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
        [DEFAULT_ADMIN_USERNAME, passwordHash],
        (err) => {
          if (err) {
            console.error('Error seeding default admin:', err.message);
          } else {
            console.log(`Default admin account created (username: ${DEFAULT_ADMIN_USERNAME})`);
          }
        }
      );
    }
  });
}

// Database operations
const dbOperations = {
  // Create a new user
  createUser: (participantId) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (participant_id) VALUES (?)';
      db.run(sql, [participantId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, participant_id: participantId });
        }
      });
    });
  },

  // Find user by participant ID
  findUserByParticipantId: (participantId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE participant_id = ?';
      db.get(sql, [participantId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all users
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Delete user by participant ID
  deleteUser: (participantId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE participant_id = ?';
      db.run(sql, [participantId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes });
        }
      });
    });
  },

  // Find admin by username
  findAdminByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM admins WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Verify admin credentials, returns the admin row if valid, otherwise null
  verifyAdminCredentials: async (username, password) => {
    const admin = await dbOperations.findAdminByUsername(username);
    if (!admin) {
      return null;
    }
    const isValid = bcrypt.compareSync(password, admin.password_hash);
    return isValid ? admin : null;
  }
};

module.exports = dbOperations;

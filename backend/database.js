const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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
  }
};

module.exports = dbOperations;

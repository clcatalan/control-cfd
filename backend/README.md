# LeetCode Clone Backend

Node.js/Express backend with SQLite database for user authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

**POST /api/auth/login**
- Body: `{ "participantId": "string" }`
- Creates new user if doesn't exist, or logs in existing user
- Returns user data and `isNewUser` flag

**GET /api/auth/validate/:participantId**
- Validates if a participant ID exists in the database
- Returns user data if found

### Users

**GET /api/users**
- Returns all users in the database
- For admin purposes

**DELETE /api/users/:participantId**
- Deletes a user by participant ID
- For admin purposes

### Health Check

**GET /api/health**
- Returns server status

## Database

Uses SQLite with the following schema:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

The database file (`users.db`) is created automatically when the server starts.

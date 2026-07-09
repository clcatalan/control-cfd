# LeetCode Clone Backend

Node.js/Express backend with SQLite database for user authentication.

## Setup

1. Use the pinned Node version and install dependencies:
```bash
nvm use
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

### Admin

**POST /api/admin/login**
- Body: `{ "username": "string", "password": "string" }`
- Validates credentials against the `admins` table
- Returns admin data on success

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

CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

The database file (`users.db`) is created automatically when the server starts. A default admin
account (`admin` / `admin123`) is seeded automatically if the `admins` table is empty — change
this password after first login.

## Serving the frontend and admin apps

In addition to the API, this server serves the built frontend and admin apps as static files:

- `frontend/dist` is served at `/`
- `admin/dist` is served at `/admin`

Build both before starting the server in production:
```bash
cd frontend && npm run build
cd ../admin && npm run build
cd ../backend && npm start
```

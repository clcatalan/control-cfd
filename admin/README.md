# Admin Dashboard

React/Vite admin panel for managing users, viewing schedule/settings, and creating studies for the LeetCode Clone platform.

## Prerequisites

- **Node.js** (version 18 or higher recommended)
- **npm**
- The [backend](../backend/README.md) running locally, since the admin panel talks to its API for login, user management, and study settings.

## Installation

From the `admin` directory:

```bash
cd admin
nvm use
npm install
```

This project pins its Node version via `.nvmrc` (18.20.4). Vite 5 requires Node 18+, so running on an older default Node (e.g. 16) will fail with errors like `crypto$2.getRandomValues is not a function`.

## Running Locally

1. Start the backend first (in a separate terminal), so the API is available at `http://localhost:3001`:
   ```bash
   cd backend
   nvm use
   npm run dev:local
   ```

2. Start the admin dev server:
   ```bash
   cd admin
   nvm use
   npm run dev
   ```

3. Open `http://localhost:5175` in your browser.

In development, the admin panel talks directly to `http://localhost:3001/api` (see `API_URL` in `src/components/*.jsx`). In production it calls `/api` on the same origin, since the backend serves the built admin app as static files under `/admin`.

### Default admin login

The backend seeds a default admin account if none exists:

- Username: `admin`
- Password: `admin123`

Change this password after first login.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the Vite dev server on port 5175 with hot reload |
| `npm run build` | Builds the app to `dist/` for production |
| `npm run preview` | Previews the production build locally |

## Production Build

To build the admin panel and have the backend serve it at `/admin`:

```bash
cd admin
npm run build
cd ../backend
npm start
```

See the [backend README](../backend/README.md#serving-the-frontend-and-admin-apps) for details on how the built apps are served.

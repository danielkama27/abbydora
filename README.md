# AbbyDora - Deploy Package

## Quick Start

1. Extract this archive on your server.
2. Run `bash start.sh` or:
   - `npm install --production`
   - `npx prisma generate`
   - `npm start`
3. The application will be available on the configured port (default: 3000).

## Environment

Ensure your `.env` file contains the required variables:
- `DATABASE_URL` — SQLite database path (e.g., `file:./prisma/dev.db`)
- `NEXTAUTH_SECRET` — Secret for NextAuth.js
- `NEXTAUTH_URL` — Public URL of your deployment

## Database

The SQLite database is included in `prisma/dev.db`. You can seed it by visiting `/api/seed` once the app is running.

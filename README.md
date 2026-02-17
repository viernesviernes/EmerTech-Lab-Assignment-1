# EmerTech-Lab-Assignment-1

## Start

1. **Backend**
   - `cd backend`
   - Create `src/config/.env` (see variables below).
   - `npm install`
   - `npm run dev`

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Env (backend)

**Path:** `backend/src/config/.env`

**Variables:**

- `MONGODB_URL` – MongoDB connection string
- `sessionSecret` – Secret for JWT/session
- `ADMIN_KEY` – Key required in body when creating an admin (e.g. `POST /admin/create`)

# Ajetix API

Standalone Express + MongoDB API that powers the admin panel, portfolio CMS,
and contact submissions for `ajetix.com`. This server is **deployed
separately from the Lovable frontend** — typically at `api.ajetix.com`.

## Stack

- Node 20 / Express 4
- MongoDB (via Mongoose) — free tier on MongoDB Atlas works
- JWT auth (`jsonwebtoken`) — 7-day tokens, server-side revocation on logout
- Bcrypt password hashing (never plain text)
- `express-rate-limit` — 5 login attempts / 15 min / IP
- `helmet` + strict CORS
- Cloudinary for image uploads
- Zod input validation on every write route

## Endpoints

```
POST   /api/auth/login              Login → { token, admin }
POST   /api/auth/logout             Revoke current token
GET    /api/auth/me                 Current admin (protected)

GET    /api/projects                Public: list published projects
GET    /api/projects/:slug          Public: single project
POST   /api/projects/:slug/view     Public: increment view counter
POST   /api/projects                Admin: create
PUT    /api/projects/:id            Admin: update
DELETE /api/projects/:id            Admin: delete
POST   /api/projects/:id/images     Admin: multipart image upload

POST   /api/contact                 Public: submit contact form (rate-limited 4/min)
GET    /api/contact-submissions     Admin: list
PATCH  /api/contact-submissions/:id Admin: update status

GET    /api/analytics/summary       Admin: dashboard stats
```

## Local setup

```bash
cd server
cp .env.example .env
# edit .env — set MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed     # creates the first admin user
npm run dev      # http://localhost:4000
```

## Deploying to Render (recommended, free tier available)

1. **MongoDB Atlas**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Add a database user and network access rule (allow `0.0.0.0/0` for Render)
   - Copy the connection string → this becomes `MONGO_URI`

2. **Cloudinary** (optional, only if you use image uploads)
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Grab the three keys from your dashboard

3. **Render**
   - New → Web Service → connect this `server/` folder (push to GitHub first)
   - Build command: `npm install`
   - Start command: `npm start`
   - Add all env vars from `.env.example`
   - Set `CORS_ORIGIN=https://ajetix.com,https://www.ajetix.com`
   - Deploy — Render gives you `https://ajetix-api.onrender.com`

4. **Point `api.ajetix.com` at Render**
   - In Render: Custom Domain → add `api.ajetix.com`
   - In your DNS: add the CNAME Render tells you to

5. **Seed the admin user** (one-time)
   - Render shell → `npm run seed`
   - You can now log in at `https://ajetix.com/admin/login`

6. **Wire the Lovable frontend to your API**
   - In the Lovable project, set env var `VITE_API_BASE_URL=https://api.ajetix.com`
   - Republish the site

## Deploying to Railway or Fly

Same shape — Node 20, `npm install`, `npm start`, env vars from
`.env.example`. Both support health checks; use `GET /health`.

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with `JWT_SECRET`
- Revoked tokens stored in Mongo `revoked_tokens` collection with TTL index
- All admin routes require valid, non-revoked JWT
- Login rate-limited to 5 attempts / 15 min / IP
- Contact endpoint rate-limited to 4 requests / min / IP
- Helmet applies secure HTTP headers
- CORS restricted to `CORS_ORIGIN` allowlist

## Rotating the admin password

```bash
# in Render shell (or locally with production MONGO_URI)
ADMIN_EMAIL=admin@ajetix.com ADMIN_PASSWORD=new-strong-password npm run seed
```

The seed script upserts by email — running it again with a new password
updates the existing admin.
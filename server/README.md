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

## Email Setup

Contact form submissions are stored in MongoDB and a notification email is
sent **directly via SMTP** using [Nodemailer](https://nodemailer.com/) — no
third-party email service (SendGrid, Resend, Mailgun, etc.) is involved.

Configure these env vars with the SMTP credentials for the `info@ajetix.com`
mailbox itself:

| Variable | Description |
|---|---|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | Usually `587` (STARTTLS) or `465` (SSL) |
| `SMTP_SECURE` | `true` for port 465, `false` for 587 |
| `SMTP_USER` | Mailbox login (e.g. `info@ajetix.com`) |
| `SMTP_PASS` | Mailbox password or app-specific password |
| `SMTP_FROM` | From address shown in emails |
| `ADMIN_NOTIFY_EMAIL` | Where notifications are sent (default: `info@ajetix.com`) |

**Where to find SMTP settings:** check with whoever hosts the
`info@ajetix.com` mailbox — common providers include
[Hostinger Titan Mail](https://support.hostinger.com/en/articles/1583229-how-to-set-up-titan-email-on-your-devices),
[Zoho Mail](https://www.zoho.com/mail/help/zoho-smtp.html), and
[Google Workspace](https://support.google.com/a/answer/176600). Each has an
SMTP settings page listing the host, port, and authentication requirements.

If email sending fails, the submission is still saved — errors are logged
server-side only.

## Cloudinary Setup

Admin project image uploads go to [Cloudinary](https://cloudinary.com) (free
tier available):

1. Create a free account at [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Open the **Dashboard** — copy either:
   - The full `CLOUDINARY_URL` (`cloudinary://…`), or
   - The three separate values: **Cloud name**, **API Key**, **API Secret**
3. Add them to your `.env` (see `.env.example`)

Uploaded images are stored under the `ajetix/projects` folder in Cloudinary
and the returned `secure_url` is saved on the project document.

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
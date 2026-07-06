Big scope. Splitting into 5 phases, all shipped in this pass. Order matches your priority.

## Phase 1 — Standalone Express + MongoDB API (in `/server`, you deploy elsewhere)

New folder `server/` — separate from the Lovable frontend, own `package.json`, own README with deploy instructions for Render/Railway/Fly.

Stack: Node 20, Express 5, Mongoose, jsonwebtoken, bcryptjs, express-rate-limit, helmet, cors, zod, dotenv, multer + Cloudinary (or S3) for image uploads.

Endpoints:
```text
POST   /api/auth/login              email+password → JWT (7d), bcrypt compare, rate-limited 5/15min per IP
POST   /api/auth/logout             invalidate token (server-side revocation list in Mongo)
GET    /api/auth/me                 protected, returns admin user

GET    /api/projects                public list (published only)
GET    /api/projects/:slug          public detail
POST   /api/projects                admin, create
PUT    /api/projects/:id            admin, update
DELETE /api/projects/:id            admin, delete
POST   /api/projects/:id/images     admin, multipart upload → Cloudinary

GET    /api/contact-submissions     admin, list w/ status filter
PATCH  /api/contact-submissions/:id admin, update status (new|replied|archived)

POST   /api/contact                 public, rate-limited 4/min, validates + stores submission

GET    /api/analytics/summary       admin, contact counts (week/month), top viewed projects
POST   /api/projects/:slug/view     public, increments view counter
```

Mongo models: `Admin`, `Project`, `ContactSubmission`, `RevokedToken`.

JWT middleware: `requireAuth` checks Bearer token, verifies signature, checks revocation list.

Seed script: `bun run seed` creates first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars, hashes with bcrypt.

Deliverable: `server/README.md` with step-by-step Render deploy, env var list, and Mongo Atlas setup.

## Phase 2 — Frontend integration + Admin Panel UI

Config: `VITE_API_BASE_URL` env var (defaults to empty → uses local `portfolio-data.ts` fallback so the Lovable preview keeps working before you deploy the API).

New client: `src/lib/api-client.ts` — thin fetch wrapper, attaches JWT from localStorage, handles 401 → redirect to `/admin/login`.

Portfolio pages: switch to `useQuery` fetching from `/api/projects`. Falls back to local data if `VITE_API_BASE_URL` unset. Skeleton loader while fetching. Retry button on error.

Admin routes (all under `_admin` layout with auth gate):
- `/admin/login` — email/password form, stores JWT, redirects to dashboard
- `/admin` — dashboard: stats cards (new submissions this week/month, top viewed projects)
- `/admin/projects` — table, create/edit/delete
- `/admin/projects/new` and `/admin/projects/$id/edit` — form with image upload
- `/admin/submissions` — table with status toggle
- Logout button in admin nav

Admin UI is clean shadcn — no 3D/Lenis, focus on speed.

## Phase 3 — 20 AI portfolio cover images + shared-element transition

Generate 20 images (fast tier) into `src/assets/portfolio/<slug>.jpg` — consistent style: abstract 3D renders, deep-blue/violet/cyan gradients, each themed to the project (neural net for AI, dashboard for SaaS, phone frame for mobile, etc.).

Card cover swapped from pure gradient to the generated image with a gradient overlay for text legibility. Subtle scale + gradient-overlay-lift on hover.

Framer Motion `layoutId` on the card image → detail page hero image expands from the clicked card. AnimatePresence wraps the portfolio + detail routes.

Images imported through Vite → automatic WebP conversion, lazy loading via `loading="lazy"`, `decoding="async"`.

## Phase 4 — Mobile responsiveness pass on Home

Hero 3D scene: detect mobile via `useIsMobile`, reduce particle count (2000 → 400), lower sphere segments, cap DPR at 1.5, disable expensive post-processing.

Hero layout at 375/390/414: larger vertical padding, tighter type scale ramp, CTA buttons full-width stacked with proper 44px min tap targets. 3D canvas becomes a 60vh backdrop behind text on mobile instead of a side element.

Add scroll-triggered fade-up animations per home section (GSAP ScrollTrigger, already installed) with mobile-friendly thresholds.

Tested breakpoints: 375, 390, 414, 768 via Playwright screenshots.

## Phase 5 — Global polish

- Branded `NotFoundComponent` on `__root` — glass card, "Return home" CTA, matches theme
- Skeleton loaders on portfolio list + detail while queries load
- Error boundary UI on each data route with Retry button that calls `router.invalidate()` + query refetch
- Lenis + browser back/forward: hook `router.subscribe('onResolved')` to call `lenis.scrollTo(0, { immediate: !isPopState })` — preserves scroll on back/forward, jumps to top on new nav
- Verify all nav flows via a Playwright sweep

## Technical notes

**Why this shape:** Express server is fully self-contained in `/server` so you can `git subtree push` or copy it to a separate repo for deploy. The Lovable frontend stays working via the local-data fallback until you flip `VITE_API_BASE_URL` to your deployed API URL.

**Secrets on your Express deploy** (you set these on Render/Railway, not here): `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_URL`, `CORS_ORIGIN=https://ajetix.com`.

**On the Lovable side** the only new env var is `VITE_API_BASE_URL` — I'll leave it blank so the preview keeps using local portfolio data until your API is live.

**Scope note:** This is ~4–5 hours of focused work compressed into one turn. I'll ship all 5 phases but the Express server won't be *runnable* here — it'll be code + deploy docs. You'll deploy it, set `VITE_API_BASE_URL`, and the admin panel goes live.

Ready to build?
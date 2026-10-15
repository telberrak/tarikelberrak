# Tarik El Berrak — Portfolio & Course Platform

A full-stack portfolio and course platform: a Next.js (App Router) frontend backed by a
Java Spring Boot REST API, with Hibernate/JPA persisting to Postgres. Everything runs
locally via Docker Compose.

- Articles, Labs and Courses all live in Postgres and are managed through an `/admin`
  panel — no file edits or SQL needed to publish content.
- Learn/courses are gated by a JWT issued by the Spring Boot API.
- Paid courses go through Stripe Checkout; a webhook (handled by the Java backend) grants
  access after payment.
- The course player tracks per-lesson watch progress and resumes playback.
- Comments (articles, labs, courses, lessons) and the contact form are stored in Postgres.

## Architecture

```
Browser
  │  (never talks to the Java API directly)
  ▼
Next.js (frontend/)                — Server Components, Server Actions, Route Handlers
  │  forwards a JWT from an httpOnly cookie as "Authorization: Bearer <token>"
  ▼
Spring Boot API (backend/)         — REST controllers, Spring Security (JWT), business logic
  │  Hibernate / Spring Data JPA
  ▼
PostgreSQL                          — schema managed by Flyway (backend/src/main/resources/db/migration)
```

The browser only ever talks to Next.js. Next.js is the one system that calls the Java
API, using a `fetch` wrapper (`frontend/src/lib/api/client.ts`) that reads the JWT from an
httpOnly cookie and attaches it as a Bearer token. Auth forms POST to small Next.js
Route Handlers (`frontend/src/app/api/auth/*`) that proxy to the Java API and set/clear that
cookie — the token itself never reaches client-side JavaScript.

## Tech stack

| Concern       | Choice                                                              |
| -------------- | -------------------------------------------------------------------- |
| Frontend        | Next.js 16 (App Router, Server Actions), TypeScript, Tailwind CSS v4 |
| Backend         | Spring Boot 3 (Java 21), Spring Web, Spring Security (JWT)           |
| Persistence     | Hibernate / Spring Data JPA, Flyway migrations                       |
| Database        | PostgreSQL 16 (Docker)                                                |
| Payments        | Stripe Checkout + Customer Portal + webhook (handled in the backend) |
| Video           | `@mux/mux-player-react`, or a custom HTML5 `<video>` fallback         |
| Email (optional)| SMTP via `spring-boot-starter-mail`                                   |
| Content         | Postgres (articles, labs, courses), edited via `/admin`               |

## Local setup

### Option A — everything in Docker (simplest)

Requires Docker and Docker Compose.

```bash
docker compose up --build
```

This builds and starts three services: `db` (Postgres), `backend` (Spring Boot API on
`:8080`, runs Flyway migrations + seed data automatically on boot), and `frontend`
(Next.js on `:3000`). Open [http://localhost:3000](http://localhost:3000).

> If port 5432 is already used by something else on your machine (a native Postgres
> install, for example), the Postgres container publishes on **5433** instead
> (`DB_HOST_PORT` in `docker-compose.yml`) — this only affects host access; the
> `backend` container still talks to `db:5432` internally.

Stop everything with `docker compose down` (add `-v` to also drop the database volume).

### Option B — hybrid (Postgres in Docker, apps run locally with hot reload)

```bash
docker compose up -d db
```

Then, in two terminals:

```bash
# Backend — from backend/
cd backend
DB_HOST=localhost DB_PORT=5433 DB_PASSWORD=portfolio JWT_SECRET=some-long-random-string \
  mvn spring-boot:run
```

```bash
# Frontend — from frontend/
cd frontend
npm install
npm run dev
```

The frontend defaults to `API_BASE_URL=http://localhost:8080` (see `.env.local`), so no
extra config is needed once the backend is up.

### Configuring Stripe (optional)

1. Create a [Stripe](https://dashboard.stripe.com) account (test mode is fine locally).
2. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as environment variables for the
   `backend` service (in `docker-compose.yml`, or your shell when running `mvn
   spring-boot:run`).
3. Forward webhooks to the backend with the [Stripe CLI](https://stripe.com/docs/stripe-cli):

   ```bash
   stripe listen --forward-to localhost:8080/api/webhooks/stripe
   ```

   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
4. Buy a paid course locally with Stripe's test card `4242 4242 4242 4242`, any future
   expiry date and any CVC. The webhook (not the success-page redirect) is what grants
   access — see `PaymentService.handleWebhook`.

### Configuring email (optional)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` for the
`backend` service to send real email for password resets, contact notifications, and
purchase receipts. Without them, the backend logs what it would have sent instead of
failing — everything else keeps working.

### Video hosting

By default, lessons play from whatever URL is stored in `lesson_assets.video_asset_id`
using a plain `<video>` element with custom controls (play/pause, seek with buffered
range, volume, 0.75×–2× speed, fullscreen).

To use [Mux](https://mux.com) instead: upload a video, grab its Playback ID, then set
that lesson's `lesson_assets.provider = 'mux'` and `video_asset_id` to the Playback ID.
The player component (`frontend/src/components/video-player/index.tsx`) picks the right
implementation automatically — no other code changes needed.

## Admin panel

Articles, labs and courses are all managed at **`/admin`** — sign in, then visit
`/admin/articles`, `/admin/labs` or `/admin/courses`. Each has a list view, a
create/edit form, and delete. Course editing also manages that course's sections and
lessons (add/edit/delete inline, including each lesson's video provider/URL and
free-preview flag) on the same page.

### Becoming an admin

There's no seeded admin account and no UI to promote a user — instead, set the
`ADMIN_EMAIL` environment variable on the **backend** to your own email address before
you sign up or next log in:

```bash
# docker-compose.yml backend service, or your shell for `mvn spring-boot:run`
ADMIN_EMAIL=you@example.com
```

The first time that account signs up or logs in, the backend promotes it to admin
automatically (`AuthService.maybePromoteToAdmin`) — no manual SQL required. An "Admin"
link then appears in the account menu.

### Content model

- **Articles/labs**: written in a rich-text editor (bold/italic/underline, headings, lists,
  quotes, code, links, alignment, text size, text colour and highlight). `content` is stored
  as HTML with a `content_format` column: rows created before the editor are `markdown` and
  still render as before; opening one in the editor converts it to formatted text, and saving
  stores it as `html`. HTML is always sanitized on render (`frontend/src/lib/sanitize.ts`).
  `tags` are a comma-separated column; `icon` must be one of
  `bars | network | hexagons | toggle | rings | wave`.
- **Courses**: `description` is a short plain-text summary for catalog cards; the rich
  "About this course" body is `courses.content` (HTML) and shows on the course page above the
  curriculum. Sections and lessons are edited inline on the same page.
- **Published vs archived**: `published` is the draft switch. **Archive** (list row or edit
  page) hides an item from the public site and moves it to the *Archived* tab; **Restore**
  brings it back. Archived courses can't be bought or joined, but people already enrolled keep
  access to the lessons.

If you'd rather seed content directly (e.g. for a fresh environment, or bulk import),
add a new Flyway migration under `backend/src/main/resources/db/migration/` following
the pattern in `V4__seed_articles_labs.sql` (articles/labs) or `V2__seed_courses.sql`
(courses) — the admin UI and direct SQL both just read/write the same tables.

## Project structure

```
frontend/                   Next.js frontend (App Router)
  src/app/                    routes, including /admin (gated to admins)
  src/actions/                 server actions — thin proxies to the Java API
  src/components/admin/        admin forms (article/lab/course, curriculum rows)
  src/components/              UI components
  src/lib/api/client.ts        fetch wrapper that forwards the JWT cookie to the backend
  src/lib/auth.ts              getCurrentUser() — calls GET /api/auth/me
  src/lib/admin.ts             admin-only reads (list/get, including unpublished)
  src/lib/articles.ts, src/lib/labs.ts, src/lib/courses.ts   public reads

backend/                    Spring Boot API
  src/main/java/.../domain       JPA entities (Article, Lab, Course, ...)
  src/main/java/.../repository   Spring Data repositories
  src/main/java/.../service      business logic (auth, content, courses, payments, ...)
  src/main/java/.../controller   REST controllers — Admin* controllers require ROLE_ADMIN
  src/main/java/.../security     JWT filter/service (embeds the admin claim)
  src/main/resources/db/migration  Flyway migrations (schema + seed data)

docker-compose.yml           db + backend + frontend
```

## Auth model

The backend issues a signed JWT (`JwtService`, HS256) on signup/login; there's no
server-side session store. Next.js Route Handlers under `/api/auth/*` are the only code
that ever sees the raw token — they set it as an httpOnly, `SameSite=Lax` cookie and the
browser never touches it directly. Every subsequent server-side call to the Java API
(Server Components, Server Actions) forwards that cookie as a Bearer token via
`apiFetch` in `frontend/src/lib/api/client.ts`.

Passwords are hashed with BCrypt (`Spring Security`'s `PasswordEncoder`). Password reset
uses a single-use, 1-hour-expiry token stored in `password_reset_tokens`.

Admin status is embedded in the JWT as an `admin` claim (set at login/signup time), and
`JwtAuthFilter` grants `ROLE_ADMIN` from it — `/api/admin/**` is protected by Spring
Security itself (`SecurityConfig`), not just a manual check in each controller. Because
the claim is baked into the token, promoting a user (via `ADMIN_EMAIL`, see **Admin
panel** below) only takes effect on their next login.

Tokens expire after 24h by default (`JWT_EXPIRATION_SECONDS`) and carry a `jti` claim.
Logging out calls `POST /api/auth/logout`, which records that `jti` in `revoked_tokens`
— `JwtAuthFilter` checks it on every request, so a signed-out token can't be replayed
even though it's technically still unexpired. Rows are pruned once the underlying token
would have expired anyway (`RevokedTokenService.pruneExpired`, daily).

## Testing

```bash
cd frontend && npm test          # Vitest — unit/component tests (frontend)
cd frontend && npm run test:e2e  # Playwright — full signup → enroll → progress flow, needs the stack running
cd backend && mvn test           # JUnit — unit + Testcontainers integration tests (backend)
```

The backend's integration tests (`AuthServiceTest`, `CourseServiceTest`,
`PaymentServiceTest`) spin up a real, throwaway Postgres via Testcontainers rather than
H2, since the Flyway migrations use Postgres-specific SQL. This needs a working Docker
daemon. On Windows with Docker Desktop, if you hit
`Could not find a valid Docker environment` even though `docker ps` works fine, delete
`~/.testcontainers.properties` and set
`DOCKER_HOST=npipe:////./pipe/dockerDesktopLinuxEngine` — Testcontainers' Windows pipe
auto-detection doesn't always land on the pipe Docker Desktop actually uses. This is a
local-environment quirk only; the CI workflow (Linux runners) doesn't hit it.

## Observability

- **Logs**: JSON to stdout (`logback-spring.xml`), one object per line — pipe straight
  into CloudWatch/Datadog/Loki/etc. Every log line within a request carries a
  `request_id` field (`RequestIdFilter`), also echoed back as an `X-Request-Id`
  response header for correlating a user's bug report to your logs.
- **Metrics**: Prometheus-format metrics at `/actuator/prometheus`, served on a
  **separate port** (`MANAGEMENT_PORT`, default `9090`) from the main API (`8080`) —
  see `deploy/Caddyfile` for why (it's never routed through the public reverse proxy;
  only reachable on the internal Docker network).
- **Errors**: `@sentry/nextjs` (frontend) and `sentry-spring-boot-starter-jakarta`
  (backend) are wired in but inert until you set `SENTRY_DSN` /
  `NEXT_PUBLIC_SENTRY_DSN` — same "no-op until configured" pattern as SMTP.

## Deploying

See [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) for the full hardening plan
this section summarizes (rate limiting, JWT revocation, security headers, non-root
containers, CI, testing, observability — all already implemented; this is the
deployment-specific remainder).

1. **Database**: use a managed Postgres instance (RDS, Cloud SQL, etc.) rather than the
   bundled `db` container — it has no backup/HA story. Run the Flyway migrations against
   it (they run automatically on backend boot).
2. **Secrets** — these have no safe default and must be set explicitly:
   - `JWT_SECRET` — a long random value. The app refuses to start with the default under
     the `prod` Spring profile (`StartupSafetyCheck`) — set `SPRING_PROFILES_ACTIVE=prod`.
   - `DB_PASSWORD` — same fail-fast protection applies.
   - `ADMIN_EMAIL` — your own address, to become the first admin.
   - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — if selling paid courses.
   - `CORS_ALLOWED_ORIGINS` — your real frontend origin (defense in depth; Next.js is
     the only actual caller of the Java API).
   - `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` — if you want error tracking.
3. **Containers**: build `backend/Dockerfile` and `frontend/Dockerfile` (both run as a
   non-root user already). Use the production overlay for sane restart/resource-limit
   defaults:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```
4. **TLS**: put a reverse proxy in front of the `frontend` service — `deploy/Caddyfile`
   is a ready-to-run example with automatic Let's Encrypt certificates. Only the
   frontend needs to be public; the backend and actuator/metrics port stay internal.
5. **Stripe webhook**: point it at `https://<your-domain>/api/webhooks/stripe` — that
   route is served by the Java backend directly (not proxied through Next.js).
6. **CI**: `.github/workflows/ci.yml` runs lint/build/unit tests (frontend), Testcontainers
   integration tests (backend), and a Playwright end-to-end smoke test against the full
   `docker compose` stack on every push/PR — plus `npm audit` and OWASP dependency-check
   as non-blocking report steps. `.github/dependabot.yml` keeps npm, Maven, Docker base
   images, and GitHub Actions themselves patched weekly.
7. **Legal pages**: `/terms` and `/privacy` exist but ship with placeholder copy only
   (clearly marked on the pages themselves) — have them reviewed before launch, given
   the paid courses and payment processing on this site.
8. **SEO**: `robots.txt` and `sitemap.xml` are generated automatically
   (`frontend/src/app/robots.ts`, `frontend/src/app/sitemap.ts`) from `NEXT_PUBLIC_SITE_URL` plus the
   live list of published articles/labs/courses — nothing to configure.

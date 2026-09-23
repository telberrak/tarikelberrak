# Production readiness implementation plan

> **Status: all six phases implemented and verified** (rate limiting, JWT
> revocation, security headers, non-root containers, tests, CI, structured
> logging, metrics, Sentry, deployment scaffolding, robots/sitemap,
> terms/privacy scaffolding). What's genuinely still outstanding — because
> it needs a decision or credential only you have — is called out in
> README.md → **Deploying**: pushing to GitHub to see CI go green, setting
> real secrets, and picking a hosting target.

## Context

The app (Next.js frontend + Spring Boot/Postgres backend, `docker-compose.yml`) is
functionally complete and manually verified end-to-end, but was built for local
development: default secrets, no tests, no CI, no rate limiting, no observability,
and containers/config that assume a trusted local network. This plan closes those
gaps in six phases, ordered so each phase is independently shippable and the
highest-risk items land first. Phases 1–4 are code changes in this repo; phase 5 is
deployment scaffolding; phase 6 is polish that can trail behind launch.

No hosting platform, CI runner budget, or legal review is assumed — those decisions
are called out inline where they'd otherwise block a step.

---

## Phase 1 — Critical hardening (auth, transport, containers)

**1.1 Fail-fast on unsafe defaults**
Add a `@PostConstruct` check (new `config/StartupSafetyCheck.java`) that throws if
`app.jwt.secret` still equals the literal dev default, or if `spring.profiles.active`
contains `prod` and `DB_PASSWORD`/`JWT_SECRET` are unset. Prevents the "it booted
fine with dev secrets" failure mode.

**1.2 Shorten JWT lifetime + add revocation on logout**
Currently `JwtService.generateToken` issues a 7-day token with no way to invalidate
it before expiry (`user-menu.tsx`'s sign-out only clears the cookie). Fix:
- Lower `app.jwt.expiration-seconds` default to 86400 (24h) in `application.yml`.
- Add a `jti` (UUID) claim in `JwtService.generateToken`/`parse`.
- New Flyway migration `V5__revoked_tokens.sql`: `revoked_tokens(jti, expires_at)`.
- New `POST /api/auth/logout` in `AuthController` (currently logout is 100% client-side
  in Next.js) that inserts the caller's `jti`.
- `JwtAuthFilter` checks `revoked_tokens` before trusting a token (indexed lookup,
  cheap at this scale — no Redis needed yet).
- Update the Next.js `/api/auth/logout` route to call the new backend endpoint
  (forwarding the cookie) before clearing it.

**1.3 Rate limiting**
Add `bucket4j-core` to `backend/pom.xml`. New `RateLimitFilter` (in-memory,
per-IP+path bucket) applied to `/api/auth/login`, `/api/auth/signup`,
`/api/auth/forgot-password`, and `/api/contact` — the four unauthenticated,
abuse-prone endpoints. Registered as a `@Bean FilterRegistrationBean` ahead of
`JwtAuthFilter`.

**1.4 Contact-form spam mitigation**
Add a hidden honeypot field to `ContactForm` (`src/components/contact-form.tsx`) and
reject in `ContactController`/`actions/contact.ts` if it's filled. Zero dependencies,
catches basic bots; rate limiting (1.3) covers the rest.

**1.5 Security headers**
Add a `headers()` function to `next.config.ts`: `Strict-Transport-Security`,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
and a `Content-Security-Policy` scoped to self + the Mux player CDN if used.

**1.6 Non-root containers**
Both `Dockerfile` (frontend) and `backend/Dockerfile`: add a non-root user in the
final stage (`node:22-alpine` → add `nextjs`/`nodejs` group+user, matching the
official Next.js standalone example; `eclipse-temurin:21-jre-alpine` → add a
`spring` user) and `USER` before `ENTRYPOINT`/`CMD`.

**1.7 Graceful shutdown**
`application.yml`: `server.shutdown: graceful` +
`spring.lifecycle.timeout-per-shutdown-phase: 20s`, so rolling deploys don't drop
in-flight requests.

---

## Phase 2 — Automated testing

Nothing is tested today (no test files in `backend/src/test`, no JS test runner).

**2.1 Backend** — add `testcontainers` + `testcontainers-postgresql` (test scope) to
`pom.xml`. Integration tests against a real Postgres container (matches Flyway/Postgres-
specific SQL already in the migrations — H2 would silently diverge):
- `AuthServiceTest`: signup, login, wrong password, admin-email auto-promotion (1.2's
  `maybePromoteToAdmin`), password reset token expiry/single-use.
- `PaymentServiceTest`: webhook idempotency (calling `handleWebhook` twice with the
  same session must not double-enroll) — this is the highest-value test given it's
  the one path that touches real money.
- `CourseServiceTest`: lesson-access gating (401 signed-out, 403 not-enrolled-not-
  preview, 200 preview/enrolled) — the core paywall logic.
- `JwtServiceTest`: plain unit test, no container needed (generate/parse/expiry/`jti`).

**2.2 Frontend** — add `vitest` + `@testing-library/react` (devDependencies). Cover
`lib/utils.ts` (`formatPrice`, `formatDuration`, `formatRelativeTime` — pure
functions, cheap to test), `ContactForm` client validation, and `CurriculumList`'s
lock/unlock rendering logic.

**2.3 One Playwright smoke test** (`e2e/`) codifying the flow already verified
manually this session: signup → enroll in free course → mark lesson complete →
progress bar updates. Runs against `docker compose up` in CI (phase 3).

---

## Phase 3 — CI/CD

**3.1** `.github/workflows/ci.yml` — two parallel jobs on push/PR:
- `frontend`: `npm ci`, `npm run lint`, `npm run build`, `npx vitest run`.
- `backend`: `mvn -B verify` (GitHub-hosted runners have Docker preinstalled, so
  Testcontainers works out of the box).

A third job (`e2e`, needs both) runs `docker compose up -d --build`, waits for
`/actuator/health`, runs the Playwright test, then `docker compose down`.

**3.2** `.github/dependabot.yml` — weekly updates for `npm`, `maven`, `docker`, and
`github-actions` ecosystems.

---

## Phase 4 — Observability

**4.1 Structured logging** — add `logstash-logback-encoder` to `pom.xml` + a
`backend/src/main/resources/logback-spring.xml` emitting JSON to console (Spring
Boot 3.3 predates the 3.4 built-in structured-logging property, so this needs the
explicit encoder). Add a `RequestIdFilter` that generates/propagates an
`X-Request-Id` header and puts it in the logging MDC.

**4.2 Error tracking** — `@sentry/nextjs` (frontend) and `sentry-spring-boot-starter`
(backend), both gated behind `SENTRY_DSN` being set — no-op otherwise, matching the
existing pattern in `MailService` for optional SMTP.

**4.3 Metrics** — add `micrometer-registry-prometheus` to `pom.xml`, expose
`/actuator/prometheus`. Bind actuator to a separate `management.server.port` (e.g.
9090) so it's reachable for scraping on an internal network but isn't published
through the public reverse proxy alongside `:8080`.

---

## Phase 5 — Deployment scaffolding

**5.1** `docker-compose.prod.yml` (overlay, used via `-f docker-compose.yml -f
docker-compose.prod.yml`): drops the `db` service's host port publish, adds
`deploy.resources.limits` (cpus/memory) to each service, sets `restart:
unless-stopped`, and documents pointing `DB_HOST`/`DB_PORT` at an external managed
Postgres instead of the bundled container (recommended — the compose Postgres has no
backup/HA story).

**5.2** Example reverse-proxy config (`deploy/Caddyfile`) terminating TLS via
Let's Encrypt and routing `/` → frontend:3000, and nothing else exposed publicly
(backend stays internal to the compose network — the frontend is the only caller,
per the existing architecture in `README.md`). Documented as a default, swappable
for nginx/a cloud load balancer.

**5.3** README: new **Production checklist** section listing every env var with no
safe default (`JWT_SECRET`, `DB_PASSWORD`, `ADMIN_EMAIL`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `CORS_ALLOWED_ORIGINS`, `SENTRY_DSN` if used) and the backup
recommendation from 5.1.

---

## Phase 6 — Polish (post-launch, non-blocking)

- `src/app/robots.ts` + `src/app/sitemap.ts` (Next.js metadata-file conventions).
- `npm audit --audit-level=high` and `mvn org.owasp:dependency-check-maven:check` as
  non-blocking CI report steps (3.1), tightened to blocking once the baseline is clean.
- `/terms` and `/privacy` **route scaffolding only** — I can create the pages and
  layout, but not write compliant legal text; they'll ship with clearly-marked
  placeholder copy for you (or counsel) to fill in.

---

## Verification

- Phase 1: `mvn -q -DskipTests package` + `docker compose up --build`, then confirm
  `/api/auth/login` gets rate-limited after N rapid attempts (curl loop), logout
  followed by reusing the old token returns 401, and `docker exec <container> whoami`
  is non-root on both images.
- Phase 2–3: `mvn verify` and `npx vitest run` pass locally; push a branch and confirm
  the GitHub Actions run goes green end-to-end (including the Playwright job).
- Phase 4: hit `/actuator/prometheus` on the management port; trigger a deliberate
  exception and confirm it appears in Sentry (with `SENTRY_DSN` set).
- Phase 5: `docker compose -f docker-compose.yml -f docker-compose.prod.yml config`
  to confirm the overlay merges cleanly; smoke-test the Caddyfile against a local TLS
  cert or a staging domain.

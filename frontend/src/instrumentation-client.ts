import * as Sentry from "@sentry/nextjs";

// Client-side counterpart to instrumentation.ts. Also a no-op without
// NEXT_PUBLIC_SENTRY_DSN — it has to be NEXT_PUBLIC_-prefixed here since
// this file ships to the browser.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "local",
  tracesSampleRate: 0.1,
});

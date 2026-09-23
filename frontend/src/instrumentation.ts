import * as Sentry from "@sentry/nextjs";

// Sentry.init no-ops internally when dsn is undefined, so this is a
// complete no-op in any environment that doesn't set SENTRY_DSN — no
// separate gating needed, matching the pattern used for optional SMTP
// (see lib/resend equivalent on the backend, MailService).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT ?? "local",
      tracesSampleRate: 0.1,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT ?? "local",
      tracesSampleRate: 0.1,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;

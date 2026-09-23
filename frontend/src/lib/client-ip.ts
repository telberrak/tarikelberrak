import "server-only";

/**
 * Best-effort real client IP, read from the headers a reverse proxy sets in
 * front of Next.js (see deploy/Caddyfile). Forwarded to the backend as
 * `X-Client-IP` so its rate limiter keys on the actual visitor rather than
 * this Next.js server, which is the only thing that ever calls the Java API
 * directly. Falls back to "unknown" locally, where there's no proxy in front
 * of `next dev` — rate limiting then collapses to a single shared bucket,
 * which is fine for local testing.
 */
export function extractClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

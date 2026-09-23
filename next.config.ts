import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

// Fonts are self-hosted by next/font (no runtime request to Google), so
// font-src/style-src don't need a Google Fonts allowance. Mux domains are
// included for when a lesson's video provider is "mux" (see
// src/components/video-player) — most lessons use the plain HTML5 fallback.
//
// script-src includes 'unsafe-inline' for the theme no-flash script
// (src/lib/theme-script.ts, inlined in the root layout's <head>) and because
// Next.js's own hydration bootstrap isn't nonce-scoped here. Tightening this
// to a nonce-based CSP (via middleware) is a reasonable follow-up but is a
// larger change than this pass covers.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://image.mux.com",
  "font-src 'self'",
  // The sentry.io allowance is only exercised when SENTRY_DSN/
  // NEXT_PUBLIC_SENTRY_DSN are actually set (see src/instrumentation*.ts) —
  // harmless to include unconditionally otherwise.
  "connect-src 'self' https://stream.mux.com https://*.ingest.sentry.io https://*.sentry.io",
  "media-src 'self' https://stream.mux.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

// withSentryConfig only does meaningful work (source map upload) when
// SENTRY_AUTH_TOKEN/SENTRY_ORG/SENTRY_PROJECT are set in the build
// environment; without them it's a harmless passthrough.
export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});

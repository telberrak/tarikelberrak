import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this site collects, uses, and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="section-y">
      <div className="container-page">
        <div className="prose-article mx-auto">
          <div className="rounded-[14px] border border-amber/40 bg-surface px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-wide text-amber">
              Placeholder — not legal advice
            </p>
            <p className="mt-2 text-sm text-text-dim">
              This page is scaffolding, not a compliant privacy policy. Replace the
              content below with text reviewed by a lawyer before launch — this site
              collects accounts, payment metadata (via Stripe), comments, and contact
              form submissions, and may need GDPR/CCPA-specific language depending on
              your audience.
            </p>
          </div>

          <h1 className="mt-8 font-display text-3xl font-semibold text-text-primary">
            Privacy Policy
          </h1>
          <p className="mt-2 font-mono text-xs text-text-faint">
            Last updated: [date] · Effective: [date]
          </p>

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-text-primary">
              1. What we collect
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              Account data (name, email, hashed password), course enrollment and
              progress, comments, contact form submissions, and — for paid courses —
              payment metadata processed by Stripe (this site never sees or stores card
              numbers). [Expand with any analytics/tracking tools in actual use.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              2. How we use it
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Account/course functionality, transactional email — password resets,
              purchase receipts — and anything else actually done with the data.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              3. Third parties
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              Stripe (payments), [SMTP provider] (transactional email), [Sentry, if
              error tracking is enabled] (error monitoring), [Mux, if used] (video
              hosting for paid lessons).
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              4. Data retention &amp; deletion
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [How long data is kept, and how a user can request deletion of their
              account and associated data.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              5. Your rights
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Access, correction, deletion, portability — as applicable under GDPR,
              CCPA, or other regimes relevant to your audience.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              6. Contact
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              Questions about this policy, or to exercise a data right: [contact email].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

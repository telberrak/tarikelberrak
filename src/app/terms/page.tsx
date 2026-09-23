import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using this site.",
};

export default function TermsPage() {
  return (
    <div className="section-y">
      <div className="container-page">
        <div className="prose-article mx-auto">
          <div className="rounded-[14px] border border-amber/40 bg-surface px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-wide text-amber">
              Placeholder — not legal advice
            </p>
            <p className="mt-2 text-sm text-text-dim">
              This page is scaffolding, not compliant legal text. Replace the content
              below with terms reviewed by a lawyer for your jurisdiction before
              launch, particularly given the paid courses and payment processing on
              this site.
            </p>
          </div>

          <h1 className="mt-8 font-display text-3xl font-semibold text-text-primary">
            Terms of Service
          </h1>
          <p className="mt-2 font-mono text-xs text-text-faint">
            Last updated: [date] · Effective: [date]
          </p>

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-text-primary">
              1. Acceptance of terms
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Describe what using the site means the visitor agrees to.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              2. Accounts
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Account creation, responsibility for credentials, eligibility.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              3. Courses &amp; payments
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Purchase terms, refund policy, access duration, Stripe as payment
              processor.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              4. User content
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Comment moderation policy, acceptable use, what can be removed and why.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              5. Limitation of liability
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              [Standard limitation-of-liability language, reviewed for your
              jurisdiction.]
            </p>

            <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">
              6. Contact
            </h2>
            <p className="mt-3 font-article text-[17px] leading-[1.75] text-text-body">
              Questions about these terms: [contact email].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

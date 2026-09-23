import Link from "next/link";

export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  credibility,
  eyebrowTone = "teal",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  credibility?: string;
  eyebrowTone?: "teal" | "amber";
}) {
  return (
    <section className="section-y">
      <div className="container-page">
        <p
          className={`font-mono text-xs uppercase tracking-[0.15em] ${
            eyebrowTone === "teal" ? "text-teal" : "text-amber"
          }`}
        >
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-text-primary md:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-dim">{description}</p>

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="rounded-[8px] bg-amber px-5 py-3 text-sm font-semibold text-amber-text hover:brightness-105"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-[8px] border border-border px-5 py-3 text-sm font-semibold text-text-body hover:border-text-dim"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}

        {credibility && (
          <p className="mt-8 font-mono text-xs text-text-faint">{credibility}</p>
        )}
      </div>
    </section>
  );
}

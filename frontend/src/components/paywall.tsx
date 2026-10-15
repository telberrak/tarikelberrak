import { createContentCheckout } from "@/actions/checkout";
import { formatPrice } from "@/lib/utils";

export function Paywall({
  kind,
  slug,
  priceCents,
  isSignedIn,
}: {
  kind: "article" | "lab";
  slug: string;
  priceCents: number;
  isSignedIn: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-border bg-surface p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-text-faint">Paid {kind}</p>
      <p className="mt-2 font-display text-xl font-semibold text-text-primary">
        Unlock the full {kind} for {formatPrice(priceCents)}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-dim">
        One-time payment through Stripe. You keep access to it from your account.
      </p>
      <form action={createContentCheckout.bind(null, kind, slug)}>
        <button
          type="submit"
          className="mt-5 rounded-[8px] bg-amber px-6 py-3 text-sm font-semibold text-amber-text hover:brightness-105"
        >
          {isSignedIn ? `Buy for ${formatPrice(priceCents)}` : "Sign in to buy"}
        </button>
      </form>
    </div>
  );
}

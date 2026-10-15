"use client";

import { useState } from "react";
import { centsToDollarsInput } from "@/lib/price";

const inputClass =
  "w-full rounded-[8px] border border-border bg-surface py-2.5 pl-7 pr-3.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal disabled:opacity-50";

export function PriceFields({
  initialIsFree = true,
  initialPriceCents = 0,
  error,
}: {
  initialIsFree?: boolean;
  initialPriceCents?: number;
  error?: string;
}) {
  const [free, setFree] = useState(initialIsFree);

  return (
    <div>
      <label htmlFor="priceDollars" className="block text-sm font-medium text-text-body">
        Price (USD)
      </label>
      <div className="mt-1.5 flex items-center gap-4">
        <div className="relative max-w-[10rem] flex-1">
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-faint">
            $
          </span>
          <input
            id="priceDollars"
            name="priceDollars"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.5"
            required={!free}
            disabled={free}
            defaultValue={centsToDollarsInput(initialPriceCents)}
            placeholder={free ? "—" : "9.00"}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-text-body">
          <input
            type="checkbox"
            name="isFree"
            checked={free}
            onChange={(e) => setFree(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-teal"
          />
          Free
        </label>
      </div>
      <p className="mt-1 text-xs text-text-faint">
        {free ? "Anyone can read this for free." : "Minimum $0.50. Readers pay once through Stripe Checkout."}
      </p>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

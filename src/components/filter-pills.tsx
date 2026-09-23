"use client";

import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterPills({
  options,
  active,
  onChange,
}: {
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
            active === option.value
              ? "border-amber text-amber"
              : "border-border-faint text-text-dim hover:border-border hover:text-text-body",
          )}
          aria-pressed={active === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

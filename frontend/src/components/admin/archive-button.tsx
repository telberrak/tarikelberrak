"use client";

import { useTransition } from "react";

export function ArchiveButton({
  action,
  archived,
  confirmMessage,
  variant = "button",
}: {
  action: () => Promise<void>;
  archived: boolean;
  confirmMessage?: string;
  variant?: "button" | "link";
}) {
  const [pending, startTransition] = useTransition();
  const label = archived ? "Restore" : "Archive";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirmMessage && !window.confirm(confirmMessage)) return;
        startTransition(() => {
          action();
        });
      }}
      className={
        variant === "link"
          ? "text-sm font-medium text-text-dim hover:text-teal disabled:opacity-60"
          : "rounded-[8px] border border-border px-4 py-2 text-sm font-medium text-text-body hover:border-teal hover:text-teal disabled:opacity-60"
      }
    >
      {pending ? "…" : label}
    </button>
  );
}

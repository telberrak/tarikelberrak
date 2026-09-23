"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage,
  label = "Delete",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="rounded-[8px] border border-border px-4 py-2 text-sm font-medium text-red-400 hover:border-red-400 disabled:opacity-60"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}

"use client";

import { useState, useTransition } from "react";
import type { AdminSection } from "@/lib/admin";

const inputClass =
  "rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-sm text-text-body focus:border-teal";

export function SectionRow({
  section,
  updateAction,
  deleteAction,
}: {
  section: AdminSection;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            await updateAction(formData);
            setEditing(false);
          });
        }}
        className="flex flex-wrap items-center gap-2 rounded-[8px] bg-surface-alt px-3 py-2"
      >
        <input name="title" defaultValue={section.title} required className={`${inputClass} flex-1`} />
        <input
          name="position"
          type="number"
          defaultValue={section.position}
          className={`${inputClass} w-20`}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-[8px] bg-teal px-3 py-1.5 text-xs font-semibold text-bg disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs text-text-dim hover:text-text-primary"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-[8px] px-3 py-2 hover:bg-surface-alt/60">
      <p className="text-sm font-medium text-text-body">{section.title}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-text-dim hover:text-text-primary"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (window.confirm(`Delete section "${section.title}"? Its lessons will be ungrouped.`)) {
              startTransition(() => {
                deleteAction();
              });
            }
          }}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

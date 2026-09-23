"use client";

import { useActionState } from "react";
import type { AdminFormState } from "@/actions/admin-articles";
import type { LabWithContent } from "@/lib/types";

const ICONS = ["bars", "network", "hexagons", "toggle", "rings", "wave"];
const STATUSES = ["Live", "In Progress", "Case Study", "Prototype"];
const CATEGORIES = ["AI & LLM", "Cloud & Kubernetes", "Trading & Quant", "Event-Driven"];

const inputClass =
  "mt-1.5 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal";

export function LabForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  initial?: LabWithContent;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(action, {
    status: "idle",
  });

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-body">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initial?.title}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-text-body">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers and hyphens only"
            defaultValue={initial?.slug}
            className={inputClass}
          />
          {state.fieldErrors?.slug && (
            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.slug}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-text-body">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={initial?.excerpt}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-text-body">
          Content (Markdown/MDX)
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={16}
          defaultValue={initial?.content}
          className={`${inputClass} font-mono text-[13px]`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-body">
            Status
          </label>
          <select id="status" name="status" defaultValue={initial?.status ?? "In Progress"} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-body">
            Category
          </label>
          <select id="category" name="category" defaultValue={initial?.category ?? CATEGORIES[0]} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text-body">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={initial?.date}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-text-body">
            Icon
          </label>
          <select id="icon" name="icon" defaultValue={initial?.icon ?? "bars"} className={inputClass}>
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-text-body">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={initial?.tags.join(", ")}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-body">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published ?? true}
          className="h-4 w-4 rounded border-border accent-teal"
        />
        Published
      </label>

      {state.status === "error" && !state.fieldErrors && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-[8px] bg-amber px-5 py-2.5 text-sm font-semibold text-amber-text hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

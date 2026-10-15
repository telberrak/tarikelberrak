"use client";

import { useActionState } from "react";
import type { AdminFormState } from "@/actions/admin-articles";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { PriceFields } from "@/components/admin/price-fields";
import type { CourseSummary } from "@/lib/types";

const LEVELS = ["beginner", "intermediate", "advanced"];

const inputClass =
  "mt-1.5 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal";

export function CourseForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  initial?: CourseSummary & { content?: string };
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
        <label htmlFor="description" className="block text-sm font-medium text-text-body">
          Summary (plain text, shown on course cards)
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={initial?.description}
          className={inputClass}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-text-body">About this course</span>
        <RichTextEditor name="content" initialContent={initial?.content} minHeight={240} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-text-body">
            Level
          </label>
          <select id="level" name="level" defaultValue={initial?.level ?? "beginner"} className={inputClass}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-body">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            placeholder="trading, investing, literacy, crypto…"
            defaultValue={initial?.category}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <PriceFields
          initialIsFree={initial?.isFree ?? true}
          initialPriceCents={initial?.priceCents ?? 0}
          error={state.fieldErrors?.priceCents}
        />
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-text-body">
            Cover image URL (optional)
          </label>
          <input
            id="coverImage"
            name="coverImage"
            type="text"
            defaultValue={initial?.coverImage ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-text-body">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? false}
            className="h-4 w-4 rounded border-border accent-teal"
          />
          Published
        </label>
      </div>

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

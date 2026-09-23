"use client";

import { useState, useTransition } from "react";
import type { AdminLesson, AdminSection } from "@/lib/admin";
import { formatDuration } from "@/lib/utils";

const inputClass =
  "rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-sm text-text-body focus:border-teal";

export function LessonRow({
  lesson,
  sections,
  updateAction,
  deleteAction,
}: {
  lesson: AdminLesson;
  sections: AdminSection[];
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
        className="grid gap-2 rounded-[8px] bg-surface-alt px-3 py-3"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <input name="title" defaultValue={lesson.title} required placeholder="Title" className={inputClass} />
          <input name="slug" defaultValue={lesson.slug} required placeholder="slug" className={inputClass} />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <select name="sectionId" defaultValue={lesson.sectionId ?? ""} className={inputClass}>
            <option value="">No section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <input
            name="position"
            type="number"
            defaultValue={lesson.position}
            placeholder="Position"
            className={inputClass}
          />
          <input
            name="durationSeconds"
            type="number"
            defaultValue={lesson.durationSeconds}
            placeholder="Duration (s)"
            className={inputClass}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <select name="videoProvider" defaultValue={lesson.videoProvider ?? "html5"} className={inputClass}>
            <option value="html5">html5</option>
            <option value="mux">mux</option>
          </select>
          <input
            name="videoAssetId"
            defaultValue={lesson.videoAssetId ?? ""}
            placeholder="Video URL or Mux playback ID"
            className={`${inputClass} sm:col-span-2`}
          />
        </div>
        <textarea
          name="notes"
          defaultValue={lesson.notes ?? ""}
          placeholder="Lesson notes (optional)"
          rows={2}
          className={inputClass}
        />
        <label className="flex items-center gap-2 text-sm text-text-body">
          <input
            type="checkbox"
            name="isPreview"
            defaultChecked={lesson.isPreview}
            className="h-4 w-4 rounded border-border accent-teal"
          />
          Free preview (watchable without buying)
        </label>
        <div className="flex gap-2">
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
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-[8px] px-3 py-2 hover:bg-surface-alt/60">
      <div className="min-w-0">
        <p className="truncate text-sm text-text-body">
          {lesson.title}
          {lesson.isPreview && <span className="ml-2 text-xs text-teal">preview</span>}
        </p>
        <p className="font-mono text-xs text-text-faint">
          /{lesson.slug} · {formatDuration(lesson.durationSeconds)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
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
            if (window.confirm(`Delete lesson "${lesson.title}"?`)) {
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

"use client";

import type { AdminSection } from "@/lib/admin";

const inputClass =
  "rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-sm text-text-body focus:border-teal";

export function AddLessonForm({
  sections,
  action,
}: {
  sections: AdminSection[];
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-2 rounded-[8px] border border-dashed border-border-faint p-3">
      <p className="text-xs font-medium text-text-dim">Add a lesson</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <input name="title" placeholder="Title" required className={inputClass} />
        <input name="slug" placeholder="slug" required className={inputClass} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <select name="sectionId" defaultValue="" className={inputClass}>
          <option value="">No section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <input name="position" type="number" placeholder="Position" defaultValue={0} className={inputClass} />
        <input name="durationSeconds" type="number" placeholder="Duration (s)" defaultValue={0} className={inputClass} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <select name="videoProvider" defaultValue="html5" className={inputClass}>
          <option value="html5">html5</option>
          <option value="mux">mux</option>
        </select>
        <input
          name="videoAssetId"
          placeholder="Video URL or Mux playback ID"
          required
          className={`${inputClass} sm:col-span-2`}
        />
      </div>
      <textarea name="notes" placeholder="Lesson notes (optional)" rows={2} className={inputClass} />
      <label className="flex items-center gap-2 text-sm text-text-body">
        <input type="checkbox" name="isPreview" className="h-4 w-4 rounded border-border accent-teal" />
        Free preview (watchable without buying)
      </label>
      <button
        type="submit"
        className="w-fit rounded-[8px] border border-border px-3 py-1.5 text-xs font-medium text-text-body hover:border-teal"
      >
        Add lesson
      </button>
    </form>
  );
}

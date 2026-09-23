"use client";

const inputClass =
  "rounded-[8px] border border-border bg-surface px-2.5 py-1.5 text-sm text-text-body focus:border-teal";

export function AddSectionForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input name="title" placeholder="New section title" required className={`${inputClass} flex-1`} />
      <input name="position" type="number" placeholder="Position" defaultValue={0} className={`${inputClass} w-24`} />
      <button
        type="submit"
        className="rounded-[8px] border border-border px-3 py-1.5 text-xs font-medium text-text-body hover:border-teal"
      >
        Add section
      </button>
    </form>
  );
}

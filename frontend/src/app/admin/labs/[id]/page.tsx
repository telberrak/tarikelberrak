import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LabForm } from "@/components/admin/lab-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { ArchiveButton } from "@/components/admin/archive-button";
import { updateLab, deleteLab, setLabArchived } from "@/actions/admin-labs";
import { adminGetLab } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit lab · Admin" };

export default async function EditLabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lab = await adminGetLab(id);
  if (!lab) notFound();

  const boundUpdate = updateLab.bind(null, id);
  const boundDelete = deleteLab.bind(null, id);
  const boundArchive = setLabArchived.bind(null, id, !lab.archived, "/admin/labs");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Edit lab</h1>
        <div className="flex gap-2">
          <ArchiveButton
            action={boundArchive}
            archived={lab.archived}
            confirmMessage={
              lab.archived ? undefined : `Archive "${lab.title}"? It will be hidden from the public site.`
            }
          />
          <DeleteButton
            action={boundDelete}
            confirmMessage={`Delete "${lab.title}"? This can't be undone.`}
          />
        </div>
      </div>
      {lab.archived && (
        <p className="mt-4 rounded-[8px] border border-border bg-surface px-4 py-2.5 text-sm text-text-dim">
          This lab is archived and hidden from the public site.
        </p>
      )}
      <div className="mt-6 max-w-4xl">
        <LabForm action={boundUpdate} initial={lab} submitLabel="Save changes" />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LabForm } from "@/components/admin/lab-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { updateLab, deleteLab } from "@/actions/admin-labs";
import { adminGetLab } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit lab · Admin" };

export default async function EditLabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lab = await adminGetLab(id);
  if (!lab) notFound();

  const boundUpdate = updateLab.bind(null, id);
  const boundDelete = deleteLab.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Edit lab</h1>
        <DeleteButton
          action={boundDelete}
          confirmMessage={`Delete "${lab.title}"? This can't be undone.`}
        />
      </div>
      <div className="mt-6 max-w-2xl">
        <LabForm action={boundUpdate} initial={lab} submitLabel="Save changes" />
      </div>
    </div>
  );
}

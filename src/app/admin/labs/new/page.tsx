import type { Metadata } from "next";
import { LabForm } from "@/components/admin/lab-form";
import { createLab } from "@/actions/admin-labs";

export const metadata: Metadata = { title: "New lab · Admin" };

export default function NewLabPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">New lab</h1>
      <div className="mt-6 max-w-2xl">
        <LabForm action={createLab} submitLabel="Create lab" />
      </div>
    </div>
  );
}

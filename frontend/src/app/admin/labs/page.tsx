import Link from "next/link";
import type { Metadata } from "next";
import { Pill } from "@/components/pill";
import { ArchiveButton } from "@/components/admin/archive-button";
import { ViewTabs } from "@/components/admin/view-tabs";
import { setLabArchived } from "@/actions/admin-labs";
import { adminListLabs } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Labs · Admin" };

export default async function AdminLabsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const showArchived = view === "archived";
  const all = await adminListLabs();
  const labs = all.filter((l) => l.archived === showArchived);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Labs</h1>
        <Link
          href="/admin/labs/new"
          className="rounded-[8px] bg-amber px-4 py-2 text-sm font-semibold text-amber-text hover:brightness-105"
        >
          New lab
        </Link>
      </div>

      <ViewTabs
        basePath="/admin/labs"
        showArchived={showArchived}
        activeCount={all.filter((l) => !l.archived).length}
        archivedCount={all.filter((l) => l.archived).length}
      />

      <div className="mt-4 overflow-hidden rounded-[14px] border border-border-faint">
        {labs.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-dim">
            {showArchived ? "No archived labs." : "No labs yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left font-mono text-xs uppercase tracking-wide text-text-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((l) => (
                <tr key={l.id} className="border-t border-border-faint">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/labs/${l.id}`}
                      className="font-medium text-text-body hover:text-teal"
                    >
                      {l.title}
                    </Link>
                    <p className="font-mono text-xs text-text-faint">/{l.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-text-dim">{l.status}</td>
                  <td className="px-5 py-3 text-text-dim">{l.isFree ? "Free" : formatPrice(l.priceCents)}</td>
                  <td className="px-5 py-3">
                    <Pill tone={l.published ? "teal" : "default"}>
                      {l.published ? "Published" : "Draft"}
                    </Pill>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <ArchiveButton
                      variant="link"
                      archived={l.archived}
                      action={setLabArchived.bind(null, l.id, !l.archived, undefined)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

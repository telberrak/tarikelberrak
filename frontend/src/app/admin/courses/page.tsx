import Link from "next/link";
import type { Metadata } from "next";
import { Pill } from "@/components/pill";
import { ArchiveButton } from "@/components/admin/archive-button";
import { ViewTabs } from "@/components/admin/view-tabs";
import { setCourseArchived } from "@/actions/admin-courses";
import { adminListCourses } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Courses · Admin" };

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const showArchived = view === "archived";
  const all = await adminListCourses();
  const courses = all.filter((c) => c.archived === showArchived);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-[8px] bg-amber px-4 py-2 text-sm font-semibold text-amber-text hover:brightness-105"
        >
          New course
        </Link>
      </div>

      <ViewTabs
        basePath="/admin/courses"
        showArchived={showArchived}
        activeCount={all.filter((c) => !c.archived).length}
        archivedCount={all.filter((c) => c.archived).length}
      />

      <div className="mt-4 overflow-hidden rounded-[14px] border border-border-faint">
        {courses.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-dim">
            {showArchived ? "No archived courses." : "No courses yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left font-mono text-xs uppercase tracking-wide text-text-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t border-border-faint">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="font-medium text-text-body hover:text-teal"
                    >
                      {c.title}
                    </Link>
                    <p className="font-mono text-xs text-text-faint">/{c.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-text-dim">{formatPrice(c.priceCents)}</td>
                  <td className="px-5 py-3">
                    <Pill tone={c.published ? "teal" : "default"}>
                      {c.published ? "Published" : "Draft"}
                    </Pill>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <ArchiveButton
                      variant="link"
                      archived={c.archived}
                      action={setCourseArchived.bind(null, c.id, !c.archived, undefined)}
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

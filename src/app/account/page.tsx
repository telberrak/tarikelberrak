import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ProgressBar } from "@/components/progress-bar";
import { Pill } from "@/components/pill";
import { openBillingPortal } from "@/actions/billing";
import { getMyEnrolledCourses } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My Courses" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const rows = await getMyEnrolledCourses();
  const purchases = rows.filter((r) => r.source === "stripe");

  return (
    <div className="section-y">
      <div className="container-page">
        <h1 className="font-display text-3xl font-semibold text-text-primary">My Courses</h1>
        <p className="mt-2 text-sm text-text-dim">Signed in as {user.email}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ course, progressPercent, completedLessons, totalLessons, continueLessonSlug }) => (
            <div
              key={course.id}
              className="flex flex-col rounded-[14px] border border-border-faint bg-surface p-5"
            >
              <Pill tone={course.level === "beginner" ? "teal" : "amber"} className="w-fit capitalize">
                {course.level}
              </Pill>
              <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">
                {course.title}
              </h3>
              <p className="mt-2 font-mono text-xs text-text-faint">
                {completedLessons}/{totalLessons} lessons complete
              </p>
              <ProgressBar percent={progressPercent} className="mt-2" />
              {continueLessonSlug && (
                <Link
                  href={`/learn/${course.slug}/learn/${continueLessonSlug}`}
                  className="mt-4 w-fit rounded-[8px] bg-amber px-4 py-2 text-sm font-semibold text-amber-text hover:brightness-105"
                >
                  {completedLessons === 0 ? "Start course" : "Continue"}
                </Link>
              )}
            </div>
          ))}

          {rows.length === 0 && (
            <div className="col-span-full rounded-[14px] border border-dashed border-border-faint p-10 text-center">
              <p className="text-sm text-text-dim">You haven&apos;t enrolled in any courses yet.</p>
              <Link href="/learn" className="mt-3 inline-block text-sm font-medium text-teal hover:underline">
                Browse courses →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-text-primary">Purchase history</h2>
          {user.hasBillingHistory && (
            <form action={openBillingPortal}>
              <button type="submit" className="text-sm font-medium text-teal hover:underline">
                Manage billing & receipts →
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-[14px] border border-border-faint">
          {purchases.length === 0 ? (
            <p className="px-5 py-6 text-sm text-text-dim">No purchases yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-left font-mono text-xs uppercase tracking-wide text-text-faint">
                <tr>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(({ course, enrolledAt }) => (
                  <tr key={course.id} className="border-t border-border-faint">
                    <td className="px-5 py-3 text-text-body">{course.title}</td>
                    <td className="px-5 py-3 text-text-dim">{formatDate(enrolledAt)}</td>
                    <td className="px-5 py-3 text-text-dim">{formatPrice(course.priceCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

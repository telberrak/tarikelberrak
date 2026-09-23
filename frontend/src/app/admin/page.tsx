import Link from "next/link";
import type { Metadata } from "next";
import { adminListArticles, adminListLabs, adminListCourses } from "@/lib/admin";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminDashboardPage() {
  const [articles, labs, courses] = await Promise.all([
    adminListArticles(),
    adminListLabs(),
    adminListCourses(),
  ]);

  const cards = [
    { href: "/admin/articles", label: "Articles", count: articles.length },
    { href: "/admin/labs", label: "Labs", count: labs.length },
    { href: "/admin/courses", label: "Courses", count: courses.length },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Admin</h1>
      <p className="mt-2 text-sm text-text-dim">Manage articles, labs and courses.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-[14px] border border-border-faint bg-surface p-5 hover:border-border"
          >
            <p className="font-display text-3xl font-semibold text-teal">{c.count}</p>
            <p className="mt-1 text-sm text-text-dim">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

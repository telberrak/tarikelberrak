import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/labs", label: "Labs" },
  { href: "/admin/courses", label: "Courses" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.isAdmin) redirect("/");

  return (
    <div className="container-page section-y">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 lg:w-48">
          <p className="font-mono text-xs uppercase tracking-wide text-text-faint">Admin</p>
          <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="shrink-0 rounded-[8px] px-3 py-2 text-sm text-text-dim hover:bg-surface hover:text-text-primary"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

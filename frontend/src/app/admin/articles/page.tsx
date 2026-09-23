import Link from "next/link";
import type { Metadata } from "next";
import { Pill } from "@/components/pill";
import { adminListArticles } from "@/lib/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Articles · Admin" };

export default async function AdminArticlesPage() {
  const articles = await adminListArticles();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-[8px] bg-amber px-4 py-2 text-sm font-semibold text-amber-text hover:brightness-105"
        >
          New article
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-border-faint">
        {articles.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-dim">No articles yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left font-mono text-xs uppercase tracking-wide text-text-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-t border-border-faint">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="font-medium text-text-body hover:text-teal"
                    >
                      {a.title}
                    </Link>
                    <p className="font-mono text-xs text-text-faint">/{a.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-text-dim">{formatDate(a.date)}</td>
                  <td className="px-5 py-3">
                    <Pill tone={a.published ? "teal" : "default"}>
                      {a.published ? "Published" : "Draft"}
                    </Pill>
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

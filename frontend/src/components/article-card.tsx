import Link from "next/link";
import { Pill } from "@/components/pill";
import { formatDate } from "@/lib/utils";
import type { ArticleFrontmatter } from "@/lib/types";

export function ArticleCard({ article }: { article: ArticleFrontmatter }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block border-b border-border-faint py-6 first:pt-0 last:border-0"
    >
      <p className="font-mono text-xs uppercase tracking-wide text-text-faint">
        {formatDate(article.date)} · {article.readMinutes} min read
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold text-text-primary group-hover:text-teal">
        {article.title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm text-text-dim">{article.excerpt}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {article.tags.map((tag) => (
          <Pill key={tag} tone="teal">
            {tag}
          </Pill>
        ))}
      </div>
    </Link>
  );
}

export function ArticleTeaser({ article }: { article: ArticleFrontmatter }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border-faint py-4 last:border-0 md:flex-row md:items-baseline md:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-text-faint">
          {formatDate(article.date)} · {article.readMinutes} min read
        </p>
        <Link href={`/articles/${article.slug}`} className="block">
          <h3 className="mt-1 font-display text-lg font-semibold text-text-primary hover:text-teal">
            {article.title}
          </h3>
        </Link>
        <p className="mt-1 max-w-xl text-sm text-text-dim">{article.excerpt}</p>
      </div>
      <Link
        href={`/articles/${article.slug}`}
        className="shrink-0 text-sm font-medium text-teal hover:underline"
      >
        Read →
      </Link>
    </div>
  );
}

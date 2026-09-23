import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Pill } from "@/components/pill";
import { CommentThread } from "@/components/comment-thread";
import { articleMdxComponents } from "@/components/mdx-components";
import { getArticleBySlug } from "@/lib/articles";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const user = await getCurrentUser();
  const path = `/articles/${slug}`;

  return (
    <article className="section-y">
      <div className="container-page">
        <div className="prose-article mx-auto">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Pill key={tag} tone="teal">
                {tag}
              </Pill>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt font-mono text-xs text-teal">
              TE
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">{article.author}</p>
              <p className="font-mono text-xs text-text-faint">
                {formatDate(article.date)} · {article.readMinutes} min read
              </p>
            </div>
          </div>

          <hr className="my-8 border-border-faint" />

          <div>
            <MDXRemote source={article.content} components={articleMdxComponents} />
          </div>

          <div className="mt-12 rounded-[14px] border border-border-faint bg-surface p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt font-mono text-xs text-teal">
                TE
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{article.author}</p>
                <p className="mt-0.5 text-sm text-text-dim">
                  Enterprise architect with 20+ years across UBS, HSBC and BNP Paribas, working on
                  cloud, event-driven and AI-enabled platforms for financial services.
                </p>
              </div>
            </div>
          </div>

          <CommentThread
            targetType="article"
            targetSlug={slug}
            revalidate={path}
            isSignedIn={Boolean(user)}
          />
        </div>
      </div>
    </article>
  );
}

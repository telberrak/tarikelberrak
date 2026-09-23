import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ArticleCard } from "@/components/article-card";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description: "Long-form writing on architecture, risk and financial systems.",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <>
      <Hero
        eyebrow="Writing"
        eyebrowTone="amber"
        title="Notes on architecture, risk and building things that hold up."
        description="Longer pieces on the decisions behind resilient financial systems, and what tends to break them."
      />
      <div className="container-page pb-24">
        <div className="max-w-3xl">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}

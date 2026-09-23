import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "@/actions/admin-articles";

export const metadata: Metadata = { title: "New article · Admin" };

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">New article</h1>
      <div className="mt-6 max-w-2xl">
        <ArticleForm action={createArticle} submitLabel="Create article" />
      </div>
    </div>
  );
}

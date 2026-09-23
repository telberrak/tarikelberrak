import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/article-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { updateArticle, deleteArticle } from "@/actions/admin-articles";
import { adminGetArticle } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit article · Admin" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await adminGetArticle(id);
  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, id);
  const boundDelete = deleteArticle.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Edit article</h1>
        <DeleteButton
          action={boundDelete}
          confirmMessage={`Delete "${article.title}"? This can't be undone.`}
        />
      </div>
      <div className="mt-6 max-w-2xl">
        <ArticleForm action={boundUpdate} initial={article} submitLabel="Save changes" />
      </div>
    </div>
  );
}

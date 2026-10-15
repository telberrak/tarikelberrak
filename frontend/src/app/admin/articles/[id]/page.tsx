import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/article-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { ArchiveButton } from "@/components/admin/archive-button";
import { updateArticle, deleteArticle, setArticleArchived } from "@/actions/admin-articles";
import { adminGetArticle } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit article · Admin" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await adminGetArticle(id);
  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, id);
  const boundDelete = deleteArticle.bind(null, id);
  const boundArchive = setArticleArchived.bind(null, id, !article.archived, "/admin/articles");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Edit article</h1>
        <div className="flex gap-2">
          <ArchiveButton
            action={boundArchive}
            archived={article.archived}
            confirmMessage={
              article.archived ? undefined : `Archive "${article.title}"? It will be hidden from the public site.`
            }
          />
          <DeleteButton
            action={boundDelete}
            confirmMessage={`Delete "${article.title}"? This can't be undone.`}
          />
        </div>
      </div>
      {article.archived && (
        <p className="mt-4 rounded-[8px] border border-border bg-surface px-4 py-2.5 text-sm text-text-dim">
          This article is archived and hidden from the public site.
        </p>
      )}
      <div className="mt-6 max-w-4xl">
        <ArticleForm action={boundUpdate} initial={article} submitLabel="Save changes" />
      </div>
    </div>
  );
}

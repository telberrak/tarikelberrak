import "server-only";
import { apiFetchOrNull } from "@/lib/api/client";
import type { ArticleFrontmatter, ArticleWithContent } from "@/lib/types";

export async function getAllArticles(): Promise<ArticleFrontmatter[]> {
  const data = await apiFetchOrNull<ArticleFrontmatter[]>("/api/articles", { auth: false });
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithContent | null> {
  return apiFetchOrNull<ArticleWithContent>(`/api/articles/${slug}`, { auth: false });
}

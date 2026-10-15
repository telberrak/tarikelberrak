import "server-only";
import { apiFetch, apiFetchOrNull } from "@/lib/api/client";
import type { ArticleFrontmatter, ArticleWithContent, LabFrontmatter, LabWithContent, CourseSummary } from "@/lib/types";

export async function adminListArticles(): Promise<ArticleFrontmatter[]> {
  return apiFetch<ArticleFrontmatter[]>("/api/admin/articles");
}

export async function adminGetArticle(id: string): Promise<ArticleWithContent | null> {
  return apiFetchOrNull<ArticleWithContent>(`/api/admin/articles/${id}`);
}

export async function adminListLabs(): Promise<LabFrontmatter[]> {
  return apiFetch<LabFrontmatter[]>("/api/admin/labs");
}

export async function adminGetLab(id: string): Promise<LabWithContent | null> {
  return apiFetchOrNull<LabWithContent>(`/api/admin/labs/${id}`);
}

export async function adminListCourses(): Promise<CourseSummary[]> {
  return apiFetch<CourseSummary[]>("/api/admin/courses");
}

export interface AdminSection {
  id: string;
  title: string;
  position: number;
}

export interface AdminLesson {
  id: string;
  sectionId: string | null;
  slug: string;
  title: string;
  position: number;
  durationSeconds: number;
  isPreview: boolean;
  notes: string | null;
  videoProvider: string | null;
  videoAssetId: string | null;
}

export interface AdminCourseDetail extends CourseSummary {
  content: string;
  sections: AdminSection[];
  lessons: AdminLesson[];
}

export async function adminGetCourse(id: string): Promise<AdminCourseDetail | null> {
  return apiFetchOrNull<AdminCourseDetail>(`/api/admin/courses/${id}`);
}

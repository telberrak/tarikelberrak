import "server-only";
import { apiFetchOrNull } from "@/lib/api/client";
import type { LabFrontmatter, LabWithContent } from "@/lib/types";

export async function getAllLabs(): Promise<LabFrontmatter[]> {
  const data = await apiFetchOrNull<LabFrontmatter[]>("/api/labs", { auth: false });
  return data ?? [];
}

export async function getLabBySlug(slug: string): Promise<LabWithContent | null> {
  return apiFetchOrNull<LabWithContent>(`/api/labs/${slug}`, { auth: false });
}

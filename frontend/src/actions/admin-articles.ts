"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api/client";

export interface AdminFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildPayload(formData: FormData) {
  return {
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    date: formData.get("date") || null,
    readMinutes: Number(formData.get("readMinutes") || 5),
    tags: parseTags(formData.get("tags")),
    author: formData.get("author"),
    icon: formData.get("icon"),
    published: formData.get("published") === "on",
  };
}

export async function createArticle(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  try {
    await apiFetch("/api/admin/articles", {
      method: "POST",
      body: JSON.stringify(buildPayload(formData)),
    });
  } catch (e) {
    if (e instanceof ApiError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors };
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  try {
    await apiFetch(`/api/admin/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(buildPayload(formData)),
    });
  } catch (e) {
    if (e instanceof ApiError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors };
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  try {
    await apiFetch(`/api/admin/articles/${id}`, { method: "DELETE" });
  } catch {
    // Swallow — the list re-fetch will show the article is still there if this failed.
  }
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

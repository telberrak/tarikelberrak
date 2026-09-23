"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch, apiFetchOrNull } from "@/lib/api/client";
import type { CommentTargetType, CommentWithAuthor } from "@/lib/types";

export interface CommentFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

interface CommentApiResponse {
  id: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  author: { id: string; displayName: string; avatarUrl: string | null };
}

export async function postComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const targetType = formData.get("targetType");
  const targetSlug = formData.get("targetSlug");
  const parentId = formData.get("parentId");
  const body = formData.get("body");
  const revalidate = formData.get("revalidate");

  try {
    await apiFetch<CommentApiResponse>("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        targetType,
        targetSlug,
        parentId: parentId || null,
        body,
      }),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      return { status: "error", message: e.status === 401 ? "Sign in to comment." : e.message };
    }
    return { status: "error", message: "Could not post your comment. Please try again." };
  }

  if (typeof revalidate === "string") revalidatePath(revalidate);
  return { status: "success" };
}

export async function getComments(
  targetType: CommentTargetType,
  targetSlug: string,
): Promise<CommentWithAuthor[]> {
  const data = await apiFetchOrNull<CommentApiResponse[]>(
    `/api/comments?targetType=${targetType}&targetSlug=${encodeURIComponent(targetSlug)}`,
    { auth: false },
  );
  return data ?? [];
}

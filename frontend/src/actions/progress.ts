"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api/client";

interface ProgressUpdateResponse {
  ok: boolean;
  completed: boolean;
}

export async function reportLessonProgress(params: {
  lessonId: string;
  watchedSeconds: number;
  durationSeconds: number;
  courseSlug: string;
}) {
  try {
    const result = await apiFetch<ProgressUpdateResponse>("/api/progress", {
      method: "POST",
      body: JSON.stringify({
        lessonId: params.lessonId,
        watchedSeconds: params.watchedSeconds,
        durationSeconds: params.durationSeconds,
      }),
    });
    revalidatePath(`/learn/${params.courseSlug}/learn`);
    return result;
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, completed: false };
    throw e;
  }
}

export async function markLessonComplete(params: { lessonId: string; courseSlug: string }) {
  try {
    const result = await apiFetch<ProgressUpdateResponse>(
      `/api/progress/${params.lessonId}/complete`,
      { method: "POST" },
    );
    revalidatePath(`/learn/${params.courseSlug}/learn`);
    return result;
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, completed: false };
    throw e;
  }
}

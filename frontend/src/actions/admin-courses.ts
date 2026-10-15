"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api/client";
import { dollarsToCents } from "@/lib/price";
import type { AdminFormState } from "@/actions/admin-articles";

function buildCoursePayload(formData: FormData) {
  return {
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content") ?? "",
    level: formData.get("level"),
    category: formData.get("category"),
    priceCents: dollarsToCents(formData.get("priceDollars")),
    isFree: formData.get("isFree") === "on",
    coverImage: formData.get("coverImage") || null,
    published: formData.get("published") === "on",
  };
}

export async function createCourse(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  let courseId: string;
  try {
    const course = await apiFetch<{ id: string }>("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify(buildCoursePayload(formData)),
    });
    courseId = course.id;
  } catch (e) {
    if (e instanceof ApiError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors };
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/learn");
  redirect(`/admin/courses/${courseId}`);
}

export async function updateCourse(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  try {
    await apiFetch(`/api/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(buildCoursePayload(formData)),
    });
  } catch (e) {
    if (e instanceof ApiError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors };
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/learn");
  redirect(`/admin/courses/${id}`);
}

export async function deleteCourse(id: string) {
  try {
    await apiFetch(`/api/admin/courses/${id}`, { method: "DELETE" });
  } catch {
    // Swallow — the list re-fetch will show the course is still there if this failed.
  }
  revalidatePath("/admin/courses");
  revalidatePath("/learn");
  redirect("/admin/courses");
}

export async function createSection(courseId: string, formData: FormData) {
  await apiFetch(`/api/admin/courses/${courseId}/sections`, {
    method: "POST",
    body: JSON.stringify({
      title: formData.get("title"),
      position: Number(formData.get("position") || 0),
    }),
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

export async function updateSection(courseId: string, sectionId: string, formData: FormData) {
  await apiFetch(`/api/admin/courses/sections/${sectionId}`, {
    method: "PUT",
    body: JSON.stringify({
      title: formData.get("title"),
      position: Number(formData.get("position") || 0),
    }),
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

export async function deleteSection(courseId: string, sectionId: string) {
  await apiFetch(`/api/admin/courses/sections/${sectionId}`, { method: "DELETE" });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

function buildLessonPayload(formData: FormData) {
  const sectionId = formData.get("sectionId");
  return {
    sectionId: sectionId && sectionId !== "" ? sectionId : null,
    slug: formData.get("slug"),
    title: formData.get("title"),
    position: Number(formData.get("position") || 0),
    durationSeconds: Number(formData.get("durationSeconds") || 0),
    isPreview: formData.get("isPreview") === "on",
    notes: formData.get("notes") || "",
    videoProvider: formData.get("videoProvider"),
    videoAssetId: formData.get("videoAssetId"),
  };
}

export async function createLesson(courseId: string, formData: FormData) {
  await apiFetch(`/api/admin/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(buildLessonPayload(formData)),
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  await apiFetch(`/api/admin/courses/lessons/${lessonId}`, {
    method: "PUT",
    body: JSON.stringify(buildLessonPayload(formData)),
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await apiFetch(`/api/admin/courses/lessons/${lessonId}`, { method: "DELETE" });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/learn");
}

export async function setCourseArchived(id: string, archived: boolean, redirectTo?: string) {
  await apiFetch(`/api/admin/courses/${id}/${archived ? "archive" : "unarchive"}`, { method: "POST" });
  revalidatePath("/admin/courses");
  revalidatePath("/learn");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
  if (redirectTo) redirect(redirectTo);
}

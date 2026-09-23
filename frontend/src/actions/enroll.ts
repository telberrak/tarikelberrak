"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ApiError, apiFetch, AUTH_COOKIE_NAME } from "@/lib/api/client";

export async function enrollFree(courseSlug: string) {
  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect(`/login?next=/learn/${courseSlug}`);
  }

  try {
    await apiFetch("/api/enrollments/free", {
      method: "POST",
      body: JSON.stringify({ courseSlug }),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      redirect(`/login?next=/learn/${courseSlug}`);
    }
    throw new Error(e instanceof ApiError ? e.message : "Could not enroll you in this course.");
  }

  revalidatePath(`/learn/${courseSlug}`);
  redirect(`/learn/${courseSlug}/learn`);
}

"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ApiError, apiFetch, AUTH_COOKIE_NAME } from "@/lib/api/client";

export async function createCheckoutSession(courseSlug: string) {
  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect(`/login?next=/learn/${courseSlug}`);
  }

  let url: string;
  try {
    const data = await apiFetch<{ url: string }>(`/api/courses/${courseSlug}/checkout`, {
      method: "POST",
    });
    url = data.url;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      redirect(`/login?next=/learn/${courseSlug}`);
    }
    throw new Error(e instanceof ApiError ? e.message : "Could not start checkout.");
  }

  redirect(url);
}

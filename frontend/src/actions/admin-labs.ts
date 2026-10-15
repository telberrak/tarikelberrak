"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api/client";
import { dollarsToCents } from "@/lib/price";
import type { AdminFormState } from "@/actions/admin-articles";

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
    contentFormat: "html",
    isFree: formData.get("isFree") === "on",
    priceCents: dollarsToCents(formData.get("priceDollars")),
    status: formData.get("status"),
    category: formData.get("category"),
    tags: parseTags(formData.get("tags")),
    icon: formData.get("icon"),
    date: formData.get("date") || null,
    published: formData.get("published") === "on",
  };
}

export async function createLab(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  try {
    await apiFetch("/api/admin/labs", {
      method: "POST",
      body: JSON.stringify(buildPayload(formData)),
    });
  } catch (e) {
    if (e instanceof ApiError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors };
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/labs");
  revalidatePath("/labs");
  redirect("/admin/labs");
}

export async function updateLab(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  try {
    await apiFetch(`/api/admin/labs/${id}`, {
      method: "PUT",
      body: JSON.stringify(buildPayload(formData)),
    });
  } catch (e) {
    if (e instanceof ApiError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors };
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/labs");
  revalidatePath("/labs");
  redirect("/admin/labs");
}

export async function deleteLab(id: string) {
  try {
    await apiFetch(`/api/admin/labs/${id}`, { method: "DELETE" });
  } catch {
    // Swallow — the list re-fetch will show the lab is still there if this failed.
  }
  revalidatePath("/admin/labs");
  revalidatePath("/labs");
  redirect("/admin/labs");
}

export async function setLabArchived(id: string, archived: boolean, redirectTo?: string) {
  await apiFetch(`/api/admin/labs/${id}/${archived ? "archive" : "unarchive"}`, { method: "POST" });
  revalidatePath("/admin/labs");
  revalidatePath("/labs");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
  if (redirectTo) redirect(redirectTo);
}

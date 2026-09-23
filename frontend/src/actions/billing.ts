"use server";

import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";

export async function openBillingPortal() {
  let url: string;
  try {
    const data = await apiFetch<{ url: string }>("/api/billing/portal", { method: "POST" });
    url = data.url;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      redirect("/login?next=/account");
    }
    throw new Error(e instanceof ApiError ? e.message : "Could not open the billing portal.");
  }

  redirect(url);
}

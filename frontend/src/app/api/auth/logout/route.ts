import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api/client";
import { clearAuthCookie } from "@/lib/api/auth-cookie";

export async function POST() {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Token already invalid/expired, or the backend is unreachable — either
    // way, still clear the cookie below so the browser forgets it.
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response);
  return response;
}

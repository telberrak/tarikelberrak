import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import { extractClientIp } from "@/lib/client-ip";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
      headers: { "X-Client-IP": extractClientIp(request.headers) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message, fieldErrors: e.fieldErrors }, { status: e.status });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

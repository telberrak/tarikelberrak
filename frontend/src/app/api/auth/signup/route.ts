import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import { setAuthCookie } from "@/lib/api/auth-cookie";
import { extractClientIp } from "@/lib/client-ip";

interface AuthResponse {
  token: string;
  user: { id: string; email: string; displayName: string; avatarUrl: string | null };
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const data = await apiFetch<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
      headers: { "X-Client-IP": extractClientIp(request.headers) },
    });

    const response = NextResponse.json({ user: data.user });
    setAuthCookie(response, data.token);
    return response;
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message, fieldErrors: e.fieldErrors }, { status: e.status });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

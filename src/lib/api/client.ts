import "server-only";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "auth_token";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Calls the Spring Boot backend from server-side Next.js code (Server
 * Components, Server Actions, Route Handlers). Forwards the JWT from the
 * httpOnly cookie as a Bearer token — the browser never talks to the Java
 * API directly.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);
  if (rest.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (body && (body.error as string)) ?? "Something went wrong. Please try again.";
    const fieldErrors = body?.fieldErrors as Record<string, string> | undefined;
    throw new ApiError(response.status, message, fieldErrors);
  }

  return body as T;
}

/** Same as apiFetch, but returns null instead of throwing on 401/403/404 — for optional/public reads. */
export async function apiFetchOrNull<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T | null> {
  try {
    return await apiFetch<T>(path, options);
  } catch (e) {
    if (e instanceof ApiError && [401, 403, 404].includes(e.status)) {
      return null;
    }
    throw e;
  }
}

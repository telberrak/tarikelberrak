import "server-only";
import { apiFetchOrNull } from "@/lib/api/client";

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  hasBillingHistory: boolean;
  isAdmin: boolean;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return apiFetchOrNull<CurrentUser>("/api/auth/me");
}

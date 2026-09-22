import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Server-side Supabase client bound to the request's cookies.
 * Reads run under RLS as the signed-in user (or anonymous).
 * Use in Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — middleware refreshes
            // the session instead, so this can be safely ignored.
          }
        },
      },
    },
  );
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: profile?.display_name ?? user.email?.split("@")[0] ?? "Member",
    avatarUrl: profile?.avatar_url ?? null,
  };
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for the demo capture store.
 *
 * Returns `null` when the project has not been wired to Supabase yet, which
 * lets `src/lib/portal-store.ts` fall back to a local JSON file during
 * development.
 */

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "X-Client-Info": "tagmarkets-clone" } },
  });
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseAdmin() !== null;
}

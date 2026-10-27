import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, getSupabaseAnonKey } from "../env";

/**
 * Membuat Supabase Client untuk lingkungan Browser (Client Components).
 * Mengembalikan null jika kredensial belum dikonfigurasi pada .env.local.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = getSupabaseAnonKey()!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

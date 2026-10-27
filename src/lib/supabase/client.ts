import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "../env";

/**
 * Membuat Supabase Client untuk lingkungan Browser (Client Components).
 * Mengembalikan null jika kredensial belum dikonfigurasi pada .env.local,
 * memastikan aplikasi tidak crash saat fondasi belum terhubung ke database Supabase nyata,
 * dan TIDAK menginjeksi mock data palsu (PRD Bagian 14 Aturan 10).
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

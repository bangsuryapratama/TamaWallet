import { z } from "zod";

/**
 * Skema validasi Environment Variables.
 * Mendukung penamaan standar Supabase:
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (klasik)
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (penamaan baru di Supabase Dashboard)
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

/**
 * Mendapatkan anon key/publishable key dari environment variables.
 */
export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Memeriksa apakah konfigurasi Supabase sudah lengkap.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabaseAnonKey();

  return Boolean(
    url &&
      key &&
      !url.includes("your-project") &&
      !key.includes("your-anon-key")
  );
}

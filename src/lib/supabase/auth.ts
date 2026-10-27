import { createServerSupabaseClient } from "./server";
import { User } from "@supabase/supabase-js";

/**
 * Mendapatkan user yang saat ini sedang login di lingkungan Server.
 * Mengembalikan null jika belum terautentikasi atau Supabase belum dikonfigurasi.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Mendapatkan sesi aktif di lingkungan Server.
 */
export async function getCurrentSession() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) return null;
    return session;
  } catch {
    return null;
  }
}

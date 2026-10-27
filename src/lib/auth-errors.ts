/**
 * Normalisasi pesan error Supabase Auth ke Bahasa Indonesia yang jelas, tenang, dan bersahabat.
 */
export function normalizeAuthError(error: unknown): string {
  if (!error) return "Terjadi kendala tak terduga.";

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : (error as { message?: string })?.message || "";

  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid_credentials") ||
    lower.includes("wrong password")
  ) {
    return "Email atau kata sandi salah. Silakan periksa kembali.";
  }

  if (lower.includes("email not confirmed") || lower.includes("not_confirmed")) {
    return "Alamat email belum dikonfirmasi. Silakan buka tautan di kotak masuk email Anda.";
  }

  if (
    lower.includes("already registered") ||
    lower.includes("user already exists") ||
    lower.includes("email_exists")
  ) {
    return "Email ini sudah terdaftar. Silakan pilih tab 'Masuk'.";
  }

  if (
    lower.includes("password should be at least") ||
    lower.includes("password is too short")
  ) {
    return "Kata sandi terlalu pendek. Gunakan minimal 6 karakter.";
  }

  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("over_email_send_rate_limit")
  ) {
    return "Terlalu banyak percobaan dalam waktu singkat. Mohon tunggu 1 menit lalu coba lagi.";
  }

  if (lower.includes("invalid email") || lower.includes("unable to validate email")) {
    return "Format alamat email tidak valid.";
  }

  if (
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("failed to fetch")
  ) {
    return "Gagal terhubung ke jaringan. Periksa koneksi internet Anda.";
  }

  return message || "Terjadi kesalahan pada sistem autentikasi.";
}

import { User } from "@supabase/supabase-js";

const USER_CACHE_KEY = "tamawallet_user_session";
const BALANCE_VISIBILITY_KEY = "tamawallet_show_balance";

export interface CachedUserSummary {
  id: string;
  email: string | null;
  displayName: string | null;
  cachedAt: number;
}

/**
 * Membaca ringkasan sesi user dari localStorage secara sinkron (0ms latency, anti-flicker).
 */
export function getCachedUser(): CachedUserSummary | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedUserSummary;
    // Cache valid selama 7 hari
    if (Date.now() - parsed.cachedAt > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Menyimpan ringkasan sesi user ke localStorage.
 */
export function setCachedUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_CACHE_KEY);
    return;
  }
  try {
    const summary: CachedUserSummary = {
      id: user.id,
      email: user.email ?? null,
      displayName:
        user.user_metadata?.full_name ||
        user.user_metadata?.display_name ||
        user.email?.split("@")[0] ||
        null,
      cachedAt: Date.now(),
    };
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(summary));
  } catch {
    // Abaikan jika quota storage penuh
  }
}

/**
 * Menghapus cache user saat logout.
 */
export function clearCachedUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // Abaikan
  }
}

/**
 * Membaca preferensi privasi saldo (show/hide).
 */
export function getCachedShowBalance(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(BALANCE_VISIBILITY_KEY);
    return raw !== "false";
  } catch {
    return true;
  }
}

/**
 * Menyimpan preferensi privasi saldo.
 */
export function setCachedShowBalance(show: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BALANCE_VISIBILITY_KEY, show ? "true" : "false");
  } catch {
    // Abaikan
  }
}

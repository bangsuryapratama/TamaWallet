import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, isSupabaseConfigured } from "../env";

/**
 * Middleware untuk memperbarui token sesi Supabase dan memproteksi rute privat.
 * Sesuai PRD Bagian 4.1 & Bagian 11 Modul 1:
 * - Halaman privat (/dashboard, /wallets, /transactions, /goals, /insights) mewajibkan autentikasi.
 * - Halaman login dialihkan ke /dashboard jika user sudah memiliki sesi aktif.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!isSupabaseConfigured()) {
    // Jika Supabase belum dikonfigurasi, izinkan navigasi untuk review fondasi
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = getSupabaseAnonKey()!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  const isRSC =
    request.headers.get("RSC") === "1" ||
    request.headers.has("next-router-prefetch") ||
    request.nextUrl.searchParams.has("_rsc");

  // Untuk navigasi client-side internal (RSC), gunakan getSession() lokal dari cookie (~0.3ms)
  // guna menghindari round-trip HTTPS eksternal ke server Supabase (~300-500ms) pada tiap klik tab.
  let user = null;
  if (isRSC) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user = session?.user ?? null;
  } else {
    // Untuk hard refresh / kunjungan langsung pertama kali, validasi dengan getUser()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/login");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/wallets") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/goals") ||
    pathname.startsWith("/insights") ||
    pathname.startsWith("/profile");

  // Jika user belum login dan mencoba mengakses rute privat
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Jika user sudah login dan mengakses halaman login, alihkan ke dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

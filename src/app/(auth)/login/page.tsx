"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

type AuthMode = "signin" | "signup";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!supabaseReady) {
      setErrorMessage("Kredensial Supabase belum terkonfigurasi di file .env.local.");
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage("Silakan lengkapi email dan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage("Gagal menghubungkan ke Supabase.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrorMessage("Alamat email atau kata sandi tidak cocok.");
          } else if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Email belum diverifikasi. Cek tautan di kotak masuk Anda.");
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split("@")[0],
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setErrorMessage("Email ini sudah terdaftar. Silakan pilih tab Masuk.");
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        if (data.session) {
          router.push(redirectTo);
          router.refresh();
        } else {
          setSuccessMessage(
            "Pendaftaran berhasil! Tautan konfirmasi telah dikirim ke email Anda."
          );
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kendala koneksi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[410px]">
      {/* High-Status Header Branding */}
      <div className="text-center mb-8">
        {/* Obsidian Metal Brand Icon */}
        <Link
          href="/"
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-950 text-white font-black text-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)] border border-zinc-800 hover:scale-[1.03] active:scale-[0.98] transition-all mb-4"
        >
          T
        </Link>

        {/* Financial Freedom Micro-Pill */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Private Wealth Protocol
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-[-0.03em] text-zinc-950">
          Kuasai Posisi Finansial Anda
        </h1>
        <p className="text-xs text-zinc-500 mt-1.5 font-normal leading-relaxed max-w-xs mx-auto">
          Satu tempat privat untuk melacak aset, arus kas bersih, dan melangkah menuju kebebasan finansial penuh.
        </p>
      </div>

      {/* Main Luxury White Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-[0_4px_28px_-6px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] p-6 sm:p-8 relative">
        {/* Subtle Luxury Hairline Highlight */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

        {/* Tactile Segmented Switcher */}
        <div className="flex bg-zinc-100/90 p-1 rounded-xl mb-6 border border-zinc-200/60">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Mulai Bebas Finansial
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-xs text-red-700 leading-relaxed font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3.5 py-2.5 text-xs text-emerald-800 leading-relaxed font-medium">
            {successMessage}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5 animate-in fade-in-50 duration-200">
              <label
                htmlFor="displayName"
                className="block text-xs font-semibold text-zinc-800"
              >
                Nama Pemilik Aset
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Contoh: Surya Pratama"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/30 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all disabled:opacity-50"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-800"
            >
              Email Akun
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
              className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/30 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-zinc-800"
              >
                Kunci Akses (Kata Sandi)
              </label>
              {mode === "signup" && (
                <span className="text-[11px] text-zinc-400 font-mono">Min. 6 digit</span>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full h-11 px-3.5 pr-11 rounded-xl border border-zinc-200 bg-zinc-50/30 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all disabled:opacity-50 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Obsidian Tactile Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !supabaseReady}
            className="w-full h-11 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-black active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-zinc-800"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <span>{mode === "signin" ? "Buka Akses Finansial" : "Daftarkan Akun Pribadi"}</span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
              </>
            )}
          </button>
        </form>

        {/* Wealth & Privacy Guarantee Micro-Footnote */}
        <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Bank-Grade RLS Isolation</span>
          </span>
          <span className="text-zinc-400">•</span>
          <span>100% Bebas Pelacak</span>
        </div>
      </div>

      {/* Aspirational Philosophy Ticker */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-[11px] text-zinc-400 italic">
          &ldquo;Kekayaan sejati adalah kendali penuh atas waktu, arus kas, dan masa depan Anda.&rdquo;
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <span>Pratinjau Dashboard</span>
            <Sparkles className="h-3 w-3 text-emerald-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] flex flex-col justify-center items-center px-4 py-12">
      <React.Suspense
        fallback={
          <div className="text-center text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2 text-zinc-900" />
            <span>Menyiapkan brankas finansial...</span>
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}

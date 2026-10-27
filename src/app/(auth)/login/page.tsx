"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Wallet,
  ShieldCheck,
} from "lucide-react";
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
      setErrorMessage("Konfigurasi Supabase belum terpasang di .env.local.");
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
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
            setErrorMessage("Email atau kata sandi tidak sesuai.");
          } else if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Email belum dikonfirmasi. Periksa kotak masuk Anda.");
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
            setErrorMessage("Email sudah terdaftar. Silakan pilih tab Masuk.");
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
            "Pendaftaran berhasil! Cek email Anda untuk konfirmasi akun."
          );
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kendala saat proses autentikasi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 sm:p-9">
        {/* Top Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white font-extrabold text-lg shadow-sm">
              T
            </div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
              LEDGER v1.0
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-zinc-950">
            {mode === "signin" ? "Masuk ke Akun" : "Buat Akun Pribadi"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-normal leading-relaxed">
            {mode === "signin"
              ? "Buka akses brankas dan kelola seluruh aset finansial Anda."
              : "Mulai lacak kekayaan bersih dan kendalikan arus kas secara mandiri."}
          </p>
        </div>

        {/* Tactile Segmented Pill Switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl mb-6 border border-zinc-200/50">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold tracking-tight rounded-xl transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold tracking-tight rounded-xl transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-600 font-medium leading-relaxed">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 font-medium leading-relaxed">
            {successMessage}
          </div>
        )}

        {/* Inputs */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label
                htmlFor="displayName"
                className="block text-xs font-semibold text-zinc-800"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  id="displayName"
                  type="text"
                  placeholder="Surya Pratama"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-zinc-200 bg-zinc-50/40 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-800"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-zinc-200 bg-zinc-50/40 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-zinc-800"
              >
                Kata Sandi
              </label>
              {mode === "signup" && (
                <span className="text-[11px] text-zinc-400">Min. 6 karakter</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-zinc-200 bg-zinc-50/40 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-0.5"
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

          <button
            type="submit"
            disabled={isLoading || !supabaseReady}
            className="w-full h-11 rounded-xl bg-zinc-950 text-white text-sm font-bold tracking-tight hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <span>{mode === "signin" ? "Buka Akses Finansial" : "Mulai Sekarang"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500">
          {mode === "signin" ? (
            <span>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-zinc-900 hover:underline cursor-pointer"
              >
                Daftar akun baru
              </button>
            </span>
          ) : (
            <span>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-zinc-900 hover:underline cursor-pointer"
              >
                Masuk ke akun
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      {/* Top Simple Bar */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-zinc-200/60 bg-white">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white font-black text-sm">
            T
          </div>
          <span className="font-extrabold tracking-[-0.03em] text-zinc-950 text-lg">
            TamaWallet
          </span>
        </Link>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Pratinjau Dashboard &rarr;
        </Link>
      </header>

      {/* Main Dual Showcase Section (Responsif: 1 kolom di HP, 2 kolom di Desktop) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
        {/* Left Column: Dopamine Financial Freedom Trigger */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-zinc-950 leading-[1.12]">
              Pegang kendali penuh atas setiap rupiah kekayaan Anda.
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed max-w-xl">
              Satu tempat bersih untuk memantau saldo seluruh bank, dompet digital, kas tunai, dan target finansial secara deterministik.
            </p>
          </div>

          {/* Luxury Tactile Financial Card Preview (Memicu kepuasan visual & dopamine) */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] space-y-6 max-w-lg">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-zinc-900" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Total Kekayaan Bersih
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+Arus Kas Positif</span>
              </span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
                Rp 248.500.000
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Akumulasi saldo 4 Rekening Bank • 2 E-Wallet • 1 Dana Darurat
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3">
                <p className="text-[11px] font-medium text-zinc-400">Pemasukan Bulan Ini</p>
                <p className="text-base font-bold text-zinc-900 font-mono mt-0.5">
                  Rp 32.400.000
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3">
                <p className="text-[11px] font-medium text-zinc-400">Pengeluaran Terkendali</p>
                <p className="text-base font-bold text-zinc-900 font-mono mt-0.5">
                  Rp 14.150.000
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
              <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Data terenkripsi & privat</span>
              </span>
              <span className="text-zinc-400 font-mono text-[11px]">100% Milik Anda</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Form */}
        <div className="lg:col-span-5 w-full">
          <React.Suspense
            fallback={
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center text-xs text-zinc-400">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-zinc-900" />
                <span>Memuat formulir...</span>
              </div>
            }
          >
            <LoginForm />
          </React.Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 md:px-12 border-t border-zinc-200/60 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-medium">
        <span>TamaWallet &copy; 2026. Pengelolaan Keuangan Pribadi.</span>
        <span>Akurasi Finansial &bull; Bebas Langganan &bull; Privasi Penuh</span>
      </footer>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
            setErrorMessage("Email atau kata sandi salah.");
          } else if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Email belum dikonfirmasi. Periksa kotak masuk email Anda.");
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
            setErrorMessage("Email sudah terdaftar. Silakan masuk.");
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
            "Pendaftaran berhasil. Silakan periksa email Anda untuk verifikasi."
          );
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px]">
      {/* Brand & Heading */}
      <div className="mb-8">
        <Link href="/" className="inline-block text-lg font-bold tracking-tight text-zinc-900 mb-6">
          TamaWallet
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {mode === "signin" ? "Masuk" : "Daftar"}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {mode === "signin"
            ? "Masukkan akun Anda untuk melanjutkan."
            : "Buat akun untuk mulai mengelola keuangan."}
        </p>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 font-medium">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleAuth} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label
              htmlFor="displayName"
              className="block text-xs font-medium text-zinc-700 mb-1.5"
            >
              Nama
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Nama lengkap"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors disabled:opacity-50"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-zinc-700 mb-1.5"
          >
            Email
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
            className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-700"
            >
              Kata Sandi
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !supabaseReady}
          className="w-full h-10 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
          <span>{mode === "signin" ? "Masuk" : "Daftar"}</span>
        </button>
      </form>

      {/* Switch Mode */}
      <div className="mt-6 pt-6 border-t border-zinc-100 text-center text-xs text-zinc-500">
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
              className="font-medium text-zinc-900 hover:underline"
            >
              Daftar
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
              className="font-medium text-zinc-900 hover:underline"
            >
              Masuk
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12">
      <React.Suspense
        fallback={
          <div className="text-center text-xs text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2 text-zinc-900" />
            <span>Memuat...</span>
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}

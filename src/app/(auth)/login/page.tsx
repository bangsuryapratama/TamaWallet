"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      setErrorMessage("Konfigurasi Supabase belum lengkap di file .env.local.");
      return;
    }

    if (!email || !password) {
      setErrorMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage("Gagal menginisialisasi klien Supabase.");
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
            setErrorMessage("Alamat email atau kata sandi yang Anda masukkan salah.");
          } else if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Email Anda belum diverifikasi. Silakan periksa inbox email Anda.");
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        // Login berhasil
        router.push(redirectTo);
        router.refresh();
      } else {
        // Mode Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim() || splitEmailName(email),
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setErrorMessage("Email ini sudah terdaftar. Silakan gunakan opsi Masuk.");
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        // Jika user otomatis mendapatkan session
        if (data.session) {
          router.push(redirectTo);
          router.refresh();
        } else {
          // Jika konfirmasi email diaktifkan
          setSuccessMessage(
            "Pendaftaran berhasil! Tautan konfirmasi telah dikirim ke email Anda. Silakan verifikasi sebelum masuk."
          );
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan yang tidak terduga."
      );
    } finally {
      setIsLoading(false);
    }
  };

  function splitEmailName(str: string): string {
    return str.split("@")[0] || "User";
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {mode === "signin" ? "Masuk ke Akun Anda" : "Daftar Akun Baru"}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono">
            Modul 1: Auth
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {mode === "signin"
            ? "Masukkan email dan kata sandi Anda untuk mengakses data finansial."
            : "Buat akun pribadi baru untuk mulai mencatat keuangan secara mandiri."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleAuth}>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-md border border-negative/30 bg-negative/10 p-3 text-xs text-negative">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-md border border-positive/30 bg-positive/10 p-3 text-xs text-positive">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Display Name Input (Only on Sign Up) */}
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label
                htmlFor="displayName"
                className="text-xs font-medium text-foreground flex items-center gap-1.5"
              >
                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Nama Tampilan (Opsional)</span>
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder="Contoh: Surya"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Alamat Email</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Kata Sandi</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

          <Button
            type="submit"
            disabled={isLoading || !supabaseReady}
            className="w-full gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : mode === "signin" ? (
              "Masuk"
            ) : (
              "Buat Akun"
            )}
          </Button>
        </CardContent>
      </form>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4">
        <div className="flex items-center justify-center w-full text-xs text-muted-foreground">
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
                className="font-medium text-primary hover:underline"
              >
                Daftar sekarang
              </button>
            </span>
          ) : (
            <span>
              Sudah memiliki akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-medium text-primary hover:underline"
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Terkoneksi langsung ke Supabase Auth dengan isolasi data Row Level Security (RLS).
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative selection:bg-primary/20">
      {/* Return to App Shell link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            TamaWallet
          </h1>
          <p className="text-xs text-muted-foreground">
            Satu sumber kebenaran pengelolaan keuangan personal
          </p>
        </div>

        {/* Suspense boundary for useSearchParams */}
        <React.Suspense
          fallback={
            <Card className="p-8 text-center text-xs text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
              <span>Memuat formulir autentikasi...</span>
            </Card>
          }
        >
          <LoginForm />
        </React.Suspense>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-muted-foreground">
          Sesuai PRD Bagian 4.1: Tidak ada kredensial rahasia yang ditanam di frontend & tidak ada tombol login palsu.
        </p>
      </div>
    </div>
  );
}

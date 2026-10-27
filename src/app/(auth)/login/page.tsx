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
  Shield,
  Layers,
  Sparkles,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            setErrorMessage("Email belum diverifikasi. Silakan periksa inbox email Anda.");
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
            setErrorMessage("Email ini sudah terdaftar. Silakan beralih ke menu Masuk.");
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
            "Akun berhasil didaftarkan! Jika proyek Anda mengaktifkan verifikasi email, silakan periksa inbox Anda."
          );
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kendala tak terduga saat autentikasi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Segmented Auth Switcher */}
      <div className="flex rounded-xl bg-card border border-border/80 p-1 mb-6 shadow-sm">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            mode === "signin"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Masuk ke Akun
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
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buat Akun Baru
        </button>
      </div>

      {/* Main Form Container */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/20">
        <div className="mb-6 space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {mode === "signin" ? "Selamat Datang Kembali" : "Mulai Kelola Keuangan"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {mode === "signin"
              ? "Akses ledger finansial personal Anda dengan aman."
              : "Bebas langganan wajib, transparan, dan terisolasi penuh."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-negative/30 bg-negative/10 p-3 text-xs text-negative animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-positive/30 bg-positive/10 p-3 text-xs text-positive animate-in fade-in-50">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Name Field (Sign Up Only) */}
          {mode === "signup" && (
            <div className="space-y-1.5 animate-in fade-in-50">
              <label
                htmlFor="displayName"
                className="text-xs font-medium text-foreground flex items-center gap-1.5"
              >
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <span>Nama Lengkap / Panggilan</span>
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder="Contoh: Surya Pratama"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
                className="h-10 bg-background/60 text-sm focus:border-primary"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>Alamat Email</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
              className="h-10 bg-background/60 text-sm focus:border-primary"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-foreground flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Kata Sandi</span>
              </label>
              {mode === "signin" && (
                <span className="text-[11px] text-muted-foreground">
                  Minimal 6 karakter
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="h-10 bg-background/60 text-sm pr-10 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            className="w-full h-11 text-sm font-semibold rounded-lg mt-2 transition-all shadow-md hover:shadow-primary/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses autentikasi...</span>
              </span>
            ) : mode === "signin" ? (
              "Masuk ke TamaWallet"
            ) : (
              "Daftar Akun Baru"
            )}
          </Button>
        </form>

        {/* Security Pledge Footer */}
        <div className="mt-6 pt-5 border-t border-border/60 flex items-center gap-2.5 text-[11px] text-muted-foreground">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <span>
            Dilindungi Row Level Security (RLS) PostgreSQL & enkripsi token standar industri.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Subtle Background Accent Glows (Financial Emerald & Deep Slate) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 border-b border-border/40 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              TamaWallet
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-medium">
              Personal Wealth & Cashflow
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard Preview</span>
        </Link>
      </header>

      {/* Main Dual-Column Content */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center max-w-7xl mx-auto w-full px-6 py-8 lg:py-16 gap-12">
        {/* Left Column: Brand Story & Financial Value Proposition */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Satu Sumber Informasi Keuangan Terpercaya</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Ketahui posisi kekayaan Anda dengan{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">
                akurasi presisi
              </span>
              .
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              Bukan sekadar pencatat pengeluaran (*expense tracker*). TamaWallet memetakan
              arus kas, multi-rekening bank, e-wallet, dan portofolio aset tanpa langganan wajib
              serta tanpa halusinasi AI.
            </p>
          </div>

          {/* Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Ledger Deterministik</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kalkulasi mutasi dan saldo berbasis integer Rupiah, bebas pembulatan float yang meleset.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Privasi Tingkat Database</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Row Level Security memastikan tidak ada pihak lain yang bisa membaca catatan finansial Anda.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                <span>Multi-Akun & Goals</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kelola kas, bank, dan target keuangan terpisah tanpa menduplikasi nilai aset aktual.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Bebas Halusinasi AI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI hanya membantu parsing transaksi dengan konfirmasi Anda, bukan mengarang saldo.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Register Form */}
        <div className="lg:col-span-5 w-full">
          <React.Suspense
            fallback={
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
                <span>Menyiapkan formulir masuk...</span>
              </div>
            }
          >
            <LoginForm />
          </React.Suspense>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 px-6 py-6 md:px-12 border-t border-border/40 text-center md:flex md:justify-between items-center text-xs text-muted-foreground">
        <div>
          <span>TamaWallet &copy; 2026. Free-first, Privacy-first, Financial Accuracy.</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 md:mt-0 font-mono text-[11px]">
          <span>PRD v1.0.0</span>
          <span>•</span>
          <span>PWA Ready</span>
          <span>•</span>
          <span>PostgreSQL RLS</span>
        </div>
      </footer>
    </div>
  );
}

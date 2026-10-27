import Link from "next/link";
import { ArrowLeft, Lock, Mail, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isSupabaseConfigured } from "@/lib/env";

export default function LoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative selection:bg-primary/20">
      {/* Return to App Shell */}
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

        {/* Auth Form Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Masuk Akun</CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono">
                Modul 1 Target
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Masukkan email dan kata sandi Anda untuk mengakses data finansial pribadi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
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
                disabled
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Kata Sandi</span>
                </label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled
                autoComplete="current-password"
              />
            </div>

            <Button disabled className="w-full">
              Masuk
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                {supabaseReady
                  ? "Supabase telah terdeteksi. Alur autentikasi aktif akan disambungkan pada Modul 1 (Authentication & Database)."
                  : "Kredensial Supabase belum diatur di .env.local. Alur autentikasi akan diaktifkan secara aman pada Modul 1."}
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-muted-foreground">
          Sesuai PRD Bagian 4.1: Tidak ada kredensial yang ditanam di frontend & data finansial diproteksi oleh RLS.
        </p>
      </div>
    </div>
  );
}

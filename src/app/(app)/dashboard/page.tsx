import Link from "next/link";
import {
  WalletCards,
  Target,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";

export default function DashboardPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <PageHeader
        title="Dashboard"
        description="Ringkasan posisi keuangan, arus kas, dan tujuan finansial personal."
        badge={
          <Badge variant="outline" className="font-mono text-xs">
            Modul 0: Foundation
          </Badge>
        }
      />

      {/* Status Foundation Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Fondasi Proyek TamaWallet Aktif
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                App shell modular, design tokens, konfigurasi TypeScript strict mode,
                dan navigasi responsif telah siap. Mengikuti prinsip PRD: perhitungan
                deterministik, tidak ada mock data keuangan palsu pada alur produksi.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={supabaseReady ? "positive" : "warning"}>
                {supabaseReady ? "Supabase Terkonfigurasi" : "Supabase: Perlu .env.local"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Slot Arsitektur Dashboard sesuai PRD */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Slot 1: Kekayaan Bersih */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <CardDescription className="text-xs uppercase font-medium tracking-wider">
                Total Kekayaan Bersih
              </CardDescription>
              <WalletCards className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl font-bold font-mono tracking-tight text-muted-foreground/60">
              Rp —
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Menunggu aktivasi Ledger (Modul 2)
            </p>
          </CardContent>
        </Card>

        {/* Slot 2: Pemasukan Periode */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <CardDescription className="text-xs uppercase font-medium tracking-wider">
                Pemasukan Bulan Ini
              </CardDescription>
              <span className="text-xs font-semibold text-positive">+</span>
            </div>
            <CardTitle className="text-2xl font-bold font-mono tracking-tight text-muted-foreground/60">
              Rp —
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Menunggu transaksi masuk (Modul 3)
            </p>
          </CardContent>
        </Card>

        {/* Slot 3: Pengeluaran Periode */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <CardDescription className="text-xs uppercase font-medium tracking-wider">
                Pengeluaran Bulan Ini
              </CardDescription>
              <span className="text-xs font-semibold text-negative">-</span>
            </div>
            <CardTitle className="text-2xl font-bold font-mono tracking-tight text-muted-foreground/60">
              Rp —
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Menunggu transaksi keluar (Modul 3)
            </p>
          </CardContent>
        </Card>

        {/* Slot 4: Goals Aktif */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <CardDescription className="text-xs uppercase font-medium tracking-wider">
                Goals Aktif
              </CardDescription>
              <Target className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl font-bold font-mono tracking-tight text-muted-foreground/60">
              0 Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Menunggu alokasi target (Modul 4)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap & Checklist Verifikasi Modul */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle>Rencana Implementasi Modular PRD</CardTitle>
            </div>
            <CardDescription>
              Setiap modul dibangun secara bertahap dan terverifikasi sebelum lanjut.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-md border border-primary/40 bg-primary/5 p-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Modul 0 — Project Foundation (Sedang Aktif)
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  App Router, strict TypeScript, Tailwind design tokens, responsive App Shell, routing 5 halaman utama + login terpisah.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md border border-border p-3 opacity-80">
              <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center text-[10px] text-muted-foreground shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Modul 1 — Authentication & Database
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Supabase Auth, session protection, RLS policies untuk multi-tabel, dan skema PostgreSQL.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md border border-border p-3 opacity-80">
              <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center text-[10px] text-muted-foreground shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Modul 2 — Wallet & Ledger
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  CRUD multi-akun, saldo awal, transfer antarrekening, audit trail, deterministik tanpa floating-point.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md border border-border p-3 opacity-80">
              <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center text-[10px] text-muted-foreground shrink-0 mt-0.5">
                3-7
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Modul 3 (Cashflow), Modul 4 (Goals), Modul 5 (Insight), Modul 6 (AI Copilot), Modul 7 (PWA)
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Implementasi bertahap sesuai spesifikasi PRD.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links / Environment Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Status Lingkungan</CardTitle>
            </div>
            <CardDescription>
              Kesiapan integrasi backend Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-mono font-medium">Next.js 14 App Router</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Type Safety</span>
                <span className="font-mono font-medium">TypeScript Strict</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Styling</span>
                <span className="font-mono font-medium">Tailwind CSS + Tokens</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Supabase URL</span>
                <span className="font-mono text-muted-foreground truncate max-w-[140px]">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || "Belum diisi"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/wallets" className="w-full">
                <Button variant="outline" className="w-full justify-between text-xs">
                  <span>Jelajahi Modul Wallet</span>
                  <WalletCards className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

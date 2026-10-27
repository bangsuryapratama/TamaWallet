"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  WalletCards,
  Target,
  Plus,
  ChevronRight,
  Building2,
  Smartphone,
  Banknote,
  Receipt,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface DashboardViewProps {
  initialUser: User | null;
}

export function DashboardView({ initialUser }: DashboardViewProps) {
  const [showBalance, setShowBalance] = React.useState(true);

  // Greeting dinamis berbasis jam lokal
  const { greeting, periodLabel } = React.useMemo(() => {
    const today = new Date();
    const hour = today.getHours();
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const period = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    let greet = "Malam";
    if (hour >= 5 && hour < 11) greet = "Pagi";
    else if (hour >= 11 && hour < 15) greet = "Siang";
    else if (hour >= 15 && hour < 18) greet = "Sore";

    return { greeting: greet, periodLabel: period };
  }, []);

  const rawName =
    initialUser?.user_metadata?.full_name ||
    initialUser?.email?.split("@")[0] ||
    "Bro";

  // Format nama agar terlihat ramah dan elegan
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const toggleBalance = () => {
    const nextState = !showBalance;
    setShowBalance(nextState);
    if (!nextState) {
      toast("Saldo aman disembunyiin", {
        description: "Biar ga diintip orang pas lagi di tempat umum.",
        duration: 1500,
      });
    } else {
      toast.success("Saldo kelihatan lagi", {
        description: "Total duit kamu siap dipantau.",
        duration: 1500,
      });
    }
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12 max-w-5xl mx-auto">
      {/* 1. Header Gaul & Personal + Streak Dopamine */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Halo, Selamat {greeting}! 👋
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mt-0.5">
            {displayName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Periode Bulan */}
          <div className="px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-800 text-xs font-semibold font-mono shadow-2xs">
            {periodLabel}
          </div>

          {/* Streak Disiplin Gaul (Dopamine Trigger) */}
          <div
            title="Keren! Kamu udah rajin catat pengeluaran 3 hari berturut-turut!"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 text-white border border-zinc-800 shadow-xs select-none active:scale-95 transition-transform cursor-default"
          >
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-xs font-bold font-mono">3 Hari</span>
            <span className="text-[10px] text-zinc-300 font-medium hidden sm:inline">
              Rajin! 🔥
            </span>
          </div>
        </div>
      </div>

      {/* 2. Responsive Multi-Column Layout (Mobile: 1 Kolom, Desktop: 2 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri / Utama (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Kartu Obsidian Titanium: Total Duit Kamu */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] border border-zinc-800/80">
            {/* Subtle Luxury Ambient Mesh */}
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-zinc-700/20 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 space-y-6 sm:space-y-7">
              {/* Top Row: Label Gaul & Toggle Privasi */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
                    Total Duit Kamu Sekarang
                  </span>
                </div>
                <button
                  onClick={toggleBalance}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all py-1 px-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 active:scale-90 cursor-pointer shadow-xs"
                >
                  {showBalance ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-medium">Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[11px] font-medium text-emerald-400 font-bold">
                        Buka Saldo
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Nominal Angka Utama */}
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono text-white tabular-nums">
                  {showBalance ? "Rp 0,00" : "••••••••••"}
                </p>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Gabungan saldo siap pakai di semua rekening & dompet
                </p>
              </div>

              {/* Breakdown Arus Kas Bulan Ini (Cuan vs Jajan) */}
              <div className="pt-4 sm:pt-5 border-t border-zinc-800/80 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      <ArrowDownLeft className="h-2.5 w-2.5" />
                    </span>
                    <span className="truncate">Cuan Masuk Bulan Ini</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold font-mono text-emerald-400 pl-5 tabular-nums">
                    {showBalance ? "+ Rp 0" : "••••••"}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                    <span className="truncate">Jajan Keluar Bulan Ini</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold font-mono text-zinc-200 pl-5 tabular-nums">
                    {showBalance ? "- Rp 0" : "••••••"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Aksi Cepat Finansial (Bahasa Santai & Gaul) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 mt-2">
                Catat Jajan
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Pengeluaran
              </span>
            </Link>

            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 mt-2">
                Catat Cuan
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Pemasukan
              </span>
            </Link>

            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 mt-2">
                Pindah Saldo
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Transfer Akun
              </span>
            </Link>

            <Link
              href="/wallets"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
                <WalletCards className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 mt-2">
                Atur Dompet
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Daftar Akun
              </span>
            </Link>
          </div>

          {/* Catatan Terakhir (Recent Activity) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Catatan Terakhir
                </h2>
                <p className="text-xs text-zinc-500">
                  Riwayat uang masuk & jajan kamu
                </p>
              </div>
              <Link
                href="/transactions"
                prefetch={true}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                <Receipt className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div className="max-w-xs space-y-1">
                <p className="text-sm font-bold text-zinc-900">
                  Belum ada catatan nih!
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Yuk catat jajan kopi atau cuan gajimu hari ini biar keuangan tetap aman dan ga boncos.
                </p>
              </div>
              <Link
                href="/transactions"
                prefetch={true}
                className="mt-1 px-4 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Catat Jajan / Cuan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Kolom Kanan / Sidebar Informasi (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Kesehatan Keuangan (Bahasa Gaul & Menenangkan) */}
          <div className="p-5 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-zinc-950 truncate">
                    Keuanganmu Aman! 🔥
                  </p>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    Skor 95/100
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                  Arus kas aman terkendali, ga ada tanda-tanda boncos bulan ini.
                </p>
              </div>
            </div>
            <Link
              href="/insights"
              prefetch={true}
              title="Lihat Detail Analisis"
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Dompet & Rekening Kamu */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Dompet & Rekening
                </h2>
                <p className="text-xs text-zinc-500">
                  Tempat kamu nyimpen saldo
                </p>
              </div>
              <Link
                href="/wallets"
                prefetch={true}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Atur Akun</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Rekening Bank</p>
                    <p className="text-[10px] text-zinc-400">Tabungan Utama</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-zinc-950 tabular-nums">
                    {showBalance ? "Rp 0" : "••••••"}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Siap Pakai</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Dompet Digital</p>
                    <p className="text-[10px] text-zinc-400">E-Wallet Jajan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-zinc-950 tabular-nums">
                    {showBalance ? "Rp 0" : "••••••"}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Siap Pakai</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Kas Tunai</p>
                    <p className="text-[10px] text-zinc-400">Uang Pegangan Fisik</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-zinc-950 tabular-nums">
                    {showBalance ? "Rp 0" : "••••••"}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-semibold">Di Dompet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Target Tabungan & Impian */}
          <div className="p-5 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    Target Tabungan Kamu 🎯
                  </h3>
                  <p className="text-[11px] text-zinc-500">Biar impianmu cepet kekumpul</p>
                </div>
              </div>
              <Link
                href="/goals"
                prefetch={true}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-0.5"
              >
                <span>Lihat</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900">Dana Darurat Santai</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  0% Kekumpul
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-zinc-200/80 overflow-hidden">
                <div className="h-full bg-zinc-950 rounded-full w-0" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Terkumpul: Rp 0</span>
                <span>Target: Rp 25.000.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

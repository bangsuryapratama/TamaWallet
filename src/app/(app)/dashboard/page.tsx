"use client";

import * as React from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  Target,
  TrendingUp,
  WalletCards,
  PieChart,
  BarChart3,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ChevronRight,
  Clock,
  Plus,
  Settings2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  // Perhitungan tanggal dan greeting dinamis berbasis waktu lokal
  const { currentDay, daysInMonth, greeting, emoji } = React.useMemo(() => {
    const today = new Date();
    const day = today.getDate();
    const totalDays = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    const hour = today.getHours();
    let greet = "Selamat malam";
    let icon = "🌙";
    if (hour >= 5 && hour < 11) {
      greet = "Selamat pagi";
      icon = "☀️";
    } else if (hour >= 11 && hour < 15) {
      greet = "Selamat siang";
      icon = "🌤️";
    } else if (hour >= 15 && hour < 18) {
      greet = "Selamat sore";
      icon = "🌇";
    }

    return {
      currentDay: day,
      daysInMonth: totalDays,
      greeting: greet,
      emoji: icon,
    };
  }, []);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Sandi P.";

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* 1. Header Salutation (Ala Budggt) */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
          Dashboard
        </h1>
        <p className="text-sm font-medium text-zinc-500 mt-0.5 flex items-center gap-1.5">
          <span>
            {greeting}, {displayName}
          </span>
          <span>{emoji}</span>
        </p>
      </div>

      {/* 2. Hero Dark Card: SEKILAS HARI INI (Matte Black ala Budggt) */}
      <div className="relative overflow-hidden rounded-[30px] bg-zinc-950 text-white p-6 sm:p-7 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.18)]">
        {/* Subtle radial light shimmer */}
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-zinc-800/40 blur-2xl pointer-events-none"
        />

        <div className="relative z-10 space-y-5">
          {/* Tagline Sekilas Hari Ini */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-amber-400 text-xs">⚡</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Sekilas Hari Ini
            </span>
          </div>

          {/* Saldo / Budget Harian dengan Tombol Lock/Unlock */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
                {showBalance ? "Rp 0,00" : "••••••••"}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                title={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
                className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-900/80 cursor-pointer"
              >
                {showBalance ? (
                  <Unlock className="h-4 w-4 text-zinc-400" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <span>👆</span>
              <span>budget harian yang tersisa</span>
            </p>
          </div>

          {/* Kolom Pemasukan vs Pengeluaran */}
          <div className="pt-3 grid grid-cols-2 gap-4 border-t border-zinc-800/80">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Pemasukan
              </p>
              <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                {showBalance ? "Rp 0,00" : "••••••"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Pengeluaran
              </p>
              <p className="text-base font-bold font-mono text-rose-400 mt-0.5">
                {showBalance ? "Rp 0,00" : "••••••"}
              </p>
            </div>
          </div>

          {/* Progress bar di bawah card */}
          <div className="pt-1">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-2" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Menu Utama (8 Shortcut Bulat Grid 2x4 ala Budggt) */}
      <div className="rounded-[30px] border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-2xs">
        {/* Header Menu Utama */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-base font-bold text-zinc-950">
            Menu Utama
          </h2>
          <Link
            href="/insights"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Kelola</span>
          </Link>
        </div>

        {/* 8 Menu Icons */}
        <div className="grid grid-cols-4 gap-y-5 gap-x-2 sm:gap-x-4">
          {/* 1. Budget */}
          <Link
            href="/insights"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Budget
            </span>
          </Link>

          {/* 2. Goals */}
          <Link
            href="/goals"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Goals
            </span>
          </Link>

          {/* 3. Aset / Wallet */}
          <Link
            href="/wallets"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <WalletCards className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Aset
            </span>
          </Link>

          {/* 4. Investasi */}
          <Link
            href="/wallets"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Investasi
            </span>
          </Link>

          {/* 5. Catat Pemasukan */}
          <Link
            href="/transactions"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Pemasukan
            </span>
          </Link>

          {/* 6. Catat Pengeluaran */}
          <Link
            href="/transactions"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Pengeluaran
            </span>
          </Link>

          {/* 7. Laporan */}
          <Link
            href="/insights"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Laporan
            </span>
          </Link>

          {/* 8. Pindah Dana / Transfer */}
          <Link
            href="/transactions"
            prefetch={true}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 active:scale-90 transition-all shadow-2xs">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 mt-2 text-center">
              Transfer
            </span>
          </Link>
        </div>
      </div>

      {/* 4. Progres Pengeluaran Bulan Ini (Ala Budggt Bottom Progress Card) */}
      <div className="rounded-[30px] border border-zinc-200/90 bg-white p-5 shadow-2xs flex items-center gap-4">
        {/* Lingkaran Hari Ke- */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 font-extrabold text-sm border border-zinc-200/80 shadow-2xs">
          {currentDay}
        </div>

        {/* Info Hari & Progres */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-zinc-950 truncate">
              Progres Pengeluaran
            </p>
            <span className="text-[11px] font-mono text-zinc-400">
              Hari {currentDay} dari {daysInMonth}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-950 rounded-full"
              style={{
                width: `${Math.min(100, (currentDay / daysInMonth) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 5. Transaksi Terkini */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-zinc-950">
            Transaksi Terkini
          </h2>
          <Link
            href="/transactions"
            prefetch={true}
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-7 rounded-[30px] border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-zinc-900">
            Belum Ada Transaksi
          </p>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            Mulai catat pengeluaran belanja harian atau pemasukan pertama Anda.
          </p>
          <Link
            href="/transactions"
            prefetch={true}
            className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Catat Transaksi Sekarang</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

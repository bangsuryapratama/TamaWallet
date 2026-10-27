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
  CreditCard,
  Sparkles,
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
    <div className="space-y-6 pb-40 md:pb-14 max-w-5xl mx-auto">
      {/* 1. Header Gaul, Bolder & Eye-Catching */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Halo, Selamat {greeting}!
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 mt-1">
            {displayName} 👋
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Periode Bulan */}
          <div className="px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200/90 text-zinc-800 text-xs font-bold font-mono shadow-2xs">
            {periodLabel}
          </div>

          {/* Streak Disiplin Gaul (Dopamine Trigger) */}
          <div
            title="Keren! Kamu udah rajin catat pengeluaran 3 hari berturut-turut!"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950 text-white border border-zinc-800 shadow-md select-none active:scale-95 transition-transform cursor-default"
          >
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="text-xs font-black font-mono">3 Hari</span>
            <span className="text-[11px] text-zinc-300 font-bold hidden sm:inline">
              Rajin! 🔥
            </span>
          </div>
        </div>
      </div>

      {/* 2. Responsive Multi-Column Layout (Mobile: 1 Kolom, Desktop/Tablet: 2 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Kolom Kiri / Utama (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-7">
          {/* Kartu Obsidian Titanium: Total Duit Kamu (Deep Visual Eye-Catcher) */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-7 sm:p-9 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10">
            {/* Ambient Lighting Glows */}
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 space-y-7">
              {/* Top Row: Metallic Titanium Badge & Privacy Eye */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] shrink-0" />
                  <span className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap">
                    TOTAL SALDO
                  </span>
                </div>
                <button
                  onClick={toggleBalance}
                  className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-all py-1 px-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 active:scale-90 cursor-pointer shadow-sm shrink-0"
                >
                  {showBalance ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-[11px] font-bold whitespace-nowrap">Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[11px] font-bold text-emerald-400 whitespace-nowrap">
                        Buka Saldo
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Nominal Angka Responsif ala BCA (Mau 0 Berapapun Ga Bakal Tumpuk) */}
              <div className="min-w-0 overflow-hidden">
                <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {showBalance ? (
                    <>
                      <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-emerald-400/90 select-none shrink-0">
                        Rp
                      </span>
                      <span
                        className="font-black tracking-tight font-mono text-white tabular-nums truncate leading-none"
                        style={{
                          fontSize: "clamp(1.75rem, 7vw, 3.25rem)",
                          lineHeight: 1.1,
                        }}
                      >
                        0,00
                      </span>
                    </>
                  ) : (
                    <span
                      className="font-black tracking-widest font-mono text-zinc-400 select-none leading-none"
                      style={{
                        fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      ••••••••••••
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-medium truncate">
                  Total saldo aman siap pakai di seluruh rekening & dompet kamu
                </p>
              </div>

              {/* Breakdown Arus Kas Bulan Ini (Cuan & Jajan Selalu Ditampilkan Sesuai Permintaan) */}
              <div className="pt-5 border-t border-zinc-800/90 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold truncate">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 font-black shadow-xs">
                      <ArrowDownLeft className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span className="truncate">Cuan Masuk</span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-black font-mono text-emerald-300 truncate tabular-nums">
                    + Rp 0
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-bold truncate">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white font-black shadow-xs">
                      <ArrowUpRight className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span className="truncate">Jajan Keluar</span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-black font-mono text-rose-200 truncate tabular-nums">
                    - Rp 0
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Aksi Cepat Finansial (Color-Coded Eye-Catching Icons) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-2.5 sm:p-3.5 rounded-2xl border border-rose-200/90 bg-gradient-to-b from-rose-50/70 to-white hover:from-rose-100/70 active:scale-90 transition-all text-center shadow-xs cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm shadow-rose-500/25 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2 truncate w-full text-center">
                Jajan
              </span>
              <span className="text-[9px] text-rose-600 font-medium hidden sm:inline-block">
                Keluar
              </span>
            </Link>

            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-2.5 sm:p-3.5 rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/70 to-white hover:from-emerald-100/70 active:scale-90 transition-all text-center shadow-xs cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2 truncate w-full text-center">
                Cuan
              </span>
              <span className="text-[9px] text-emerald-700 font-medium hidden sm:inline-block">
                Masuk
              </span>
            </Link>

            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-2.5 sm:p-3.5 rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/70 to-white hover:from-indigo-100/70 active:scale-90 transition-all text-center shadow-xs cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2 truncate w-full text-center">
                Transfer
              </span>
              <span className="text-[9px] text-indigo-700 font-medium hidden sm:inline-block">
                Pindah
              </span>
            </Link>

            <Link
              href="/wallets"
              prefetch={true}
              className="group flex flex-col items-center p-2.5 sm:p-3.5 rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/70 to-white hover:from-amber-100/70 active:scale-90 transition-all text-center shadow-xs cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <WalletCards className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2 truncate w-full text-center">
                Dompet
              </span>
              <span className="text-[9px] text-amber-700 font-medium hidden sm:inline-block">
                Akun
              </span>
            </Link>
          </div>

          {/* Catatan Terakhir (Recent Activity) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-zinc-950">
                  Catatan Terakhir
                </h2>
                <p className="text-xs text-zinc-500">
                  Riwayat uang masuk & jajan kamu
                </p>
              </div>
              <Link
                href="/transactions"
                prefetch={true}
                className="text-xs font-bold text-zinc-800 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-8 sm:p-9 rounded-[32px] border border-zinc-200/90 bg-white shadow-xs flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-400">
                <Receipt className="h-7 w-7 stroke-[1.8]" />
              </div>
              <div className="max-w-xs space-y-1">
                <p className="text-base font-bold text-zinc-900">
                  Belum ada catatan nih!
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Yuk catat jajan kopi atau cuan gajimu hari ini biar keuangan tetap aman dan ga boncos.
                </p>
              </div>
              <Link
                href="/transactions"
                prefetch={true}
                className="mt-2 px-5 py-3 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>+ Catat Jajan / Cuan Sekarang</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Kolom Kanan / Sidebar Informasi (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Kesehatan Keuangan (Eye-Catching Banner) */}
          <div className="p-5 sm:p-6 rounded-[32px] border border-emerald-200/90 bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-white shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-black text-zinc-950 truncate">
                    Keuanganmu Aman! 🔥
                  </p>
                  <span className="text-[11px] font-black font-mono px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 shrink-0">
                    95/100
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                  Arus kas aman terkendali, belum ada tanda-tanda boncos bulan ini.
                </p>
              </div>
            </div>
            <Link
              href="/insights"
              prefetch={true}
              title="Lihat Detail Analisis"
              className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 shadow-2xs active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Dompet & Rekening Kamu (Real Luxury Card Styling) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-zinc-950">
                  Dompet & Rekening
                </h2>
                <p className="text-xs text-zinc-500">
                  Tempat kamu nyimpen saldo aktif
                </p>
              </div>
              <Link
                href="/wallets"
                prefetch={true}
                className="text-xs font-bold text-zinc-800 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Atur Akun</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {/* Card 1: Rekening Bank Utama (Navy Luxury Card) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-zinc-950 text-white shadow-md border border-blue-900/50 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">Rekening Bank</p>
                      <p className="text-[10px] text-blue-300/80 font-mono">BCA / Mandiri •••• 4821</p>
                    </div>
                  </div>
                  <CreditCard className="h-5 w-5 text-blue-400/80" />
                </div>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Saldo Aktif</p>
                    <p className="text-lg font-black font-mono text-white tabular-nums">
                      Rp 0
                    </p>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    UTAMA
                  </span>
                </div>
              </div>

              {/* Card 2: E-Wallet (Emerald Teal Luxury Card) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-950 via-emerald-950 to-zinc-950 text-white shadow-md border border-emerald-900/50 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">Dompet Digital</p>
                      <p className="text-[10px] text-emerald-300/80 font-mono">ShopeePay / GoPay</p>
                    </div>
                  </div>
                  <Sparkles className="h-4 w-4 text-emerald-400/80" />
                </div>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Saldo Jajan</p>
                    <p className="text-lg font-black font-mono text-white tabular-nums">
                      Rp 0
                    </p>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    HARIAN
                  </span>
                </div>
              </div>

              {/* Card 3: Kas Tunai (Graphite Obsidian Card) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-white shadow-md border border-zinc-700/50 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-700 text-zinc-200">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">Kas Tunai</p>
                      <p className="text-[10px] text-zinc-400 font-mono">Uang Pegangan Fisik</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">CASH</span>
                </div>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Di Dompet</p>
                    <p className="text-lg font-black font-mono text-white tabular-nums">
                      Rp 0
                    </p>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-zinc-700 text-zinc-300">
                    SIAP PAKAI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Tabungan & Impian (Glowing Animated Progress Bar) */}
          <div className="p-6 rounded-[32px] border border-zinc-200/90 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-950">
                    Target Tabungan Kamu 🎯
                  </h3>
                  <p className="text-[11px] text-zinc-500">Biar impianmu cepet kekumpul</p>
                </div>
              </div>
              <Link
                href="/goals"
                prefetch={true}
                className="text-xs font-bold text-zinc-800 hover:text-zinc-950 flex items-center gap-0.5"
              >
                <span>Lihat</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/90 border border-zinc-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-zinc-900">Dana Darurat Santai</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  0% Kekumpul
                </span>
              </div>

              {/* Progress bar bercahaya */}
              <div className="h-3 w-full rounded-full bg-zinc-200 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-0" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono font-medium">
                <span>Terkumpul: Rp 0</span>
                <span>Sasaran: Rp 25.000.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

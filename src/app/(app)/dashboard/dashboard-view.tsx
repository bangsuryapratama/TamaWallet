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

    let greet = "Selamat malam";
    if (hour >= 5 && hour < 11) greet = "Selamat pagi";
    else if (hour >= 11 && hour < 15) greet = "Selamat siang";
    else if (hour >= 15 && hour < 18) greet = "Selamat sore";

    return { greeting: greet, periodLabel: period };
  }, []);

  const rawName =
    initialUser?.user_metadata?.full_name ||
    initialUser?.email?.split("@")[0] ||
    "Pengguna";

  // Format nama agar terlihat rapi dan elegan
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const toggleBalance = () => {
    const nextState = !showBalance;
    setShowBalance(nextState);
    if (!nextState) {
      toast("Saldo disembunyikan", {
        description: "Privasi nominal aktif untuk kenyamanan di tempat umum.",
        duration: 1500,
      });
    } else {
      toast.success("Saldo ditampilkan", {
        description: "Nominal saldo kembali terlihat.",
        duration: 1500,
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* 1. Header Ringkas + Streak Dopamine Badge */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">
            {greeting},
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 mt-0.5">
            {displayName}
          </h1>
        </div>

        {/* Streak Disiplin Catat Arus Kas (Dopamine Trigger) */}
        <div
          title="Streak kedisiplinan mencatat keuangan harian"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950 text-white border border-zinc-800 shadow-xs select-none active:scale-95 transition-transform cursor-default"
        >
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs font-bold font-mono">3 Hari</span>
          <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
            Beruntun
          </span>
        </div>
      </div>

      {/* 2. Kartu Obsidian Luxury Hero: Total Kekayaan Bersih (Dopamine Visual Centerpiece) */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] border border-zinc-800/80">
        {/* Subtle Luxury Ambient Mesh */}
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-zinc-700/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-6">
          {/* Top Row: Metallic Titanium Badge & Privacy Eye */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
                Kekayaan Bersih Likuid
              </span>
            </div>
            <button
              onClick={toggleBalance}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all py-1 px-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 active:scale-90 cursor-pointer shadow-xs"
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
                    Tampilkan
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Nominal Angka Utama */}
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white selection:bg-zinc-800">
              {showBalance ? "Rp 0,00" : "••••••••••"}
            </p>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <span>Dana likuid siap alokasi • {periodLabel}</span>
            </p>
          </div>

          {/* Breakdown Arus Kas Bulan Berjalan */}
          <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  <ArrowDownLeft className="h-2.5 w-2.5" />
                </span>
                <span>Pemasukan Bulan Ini</span>
              </div>
              <p className="text-base font-bold font-mono text-emerald-400 pl-5">
                {showBalance ? "+ Rp 0" : "••••••"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
                <span>Pengeluaran Bulan Ini</span>
              </div>
              <p className="text-base font-bold font-mono text-zinc-200 pl-5">
                {showBalance ? "- Rp 0" : "••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Indikator Skor Kesehatan Finansial (Dopamine Financial Health Meter) */}
      <div className="p-4 sm:p-5 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-zinc-950">
                Kondisi Finansial: Prima
              </p>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Skor 95/100
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Arus kas positif & rasio tabungan bulan ini terkendali sangat baik.
            </p>
          </div>
        </div>
        <Link
          href="/insights"
          prefetch={true}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 4. Menu Aksi Cepat Finansial Tactile */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        <Link
          href="/transactions"
          prefetch={true}
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 mt-2">
            Catat Beban
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
            Pengeluaran
          </span>
        </Link>

        <Link
          href="/transactions"
          prefetch={true}
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 mt-2">
            Catat Masuk
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
            Pemasukan
          </span>
        </Link>

        <Link
          href="/transactions"
          prefetch={true}
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 mt-2">
            Pindah Dana
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
            Antar Akun
          </span>
        </Link>

        <Link
          href="/wallets"
          prefetch={true}
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-950 transition-colors shadow-2xs">
            <WalletCards className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 mt-2">
            Kelola Akun
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
            Daftar Wallet
          </span>
        </Link>
      </div>

      {/* 5. Rekening & Dompet Terdaftar (Kartu Finansial Elegan) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950">
              Rekening & Dompet
            </h2>
            <p className="text-xs text-zinc-500">
              Daftar akun keuangan aktif Anda
            </p>
          </div>
          <Link
            href="/wallets"
            prefetch={true}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <span>Semua Akun</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Rekening Bank</p>
                  <p className="text-[10px] text-zinc-400">Akun Tabungan</p>
                </div>
              </div>
              <CreditCard className="h-4 w-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Saldo Tersedia</p>
              <p className="text-base font-bold font-mono text-zinc-950 mt-0.5">
                {showBalance ? "Rp 0" : "••••••"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Dompet Digital</p>
                  <p className="text-[10px] text-zinc-400">E-Wallet Harian</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Saldo Tersedia</p>
              <p className="text-base font-bold font-mono text-zinc-950 mt-0.5">
                {showBalance ? "Rp 0" : "••••••"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <Banknote className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Kas Tunai</p>
                  <p className="text-[10px] text-zinc-400">Uang Fisik</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Saldo Tersedia</p>
              <p className="text-base font-bold font-mono text-zinc-950 mt-0.5">
                {showBalance ? "Rp 0" : "••••••"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Target Finansial & Sasaran Tabungan (Dopamine Progress Tracker) */}
      <div className="p-5 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">
                Target Finansial & Impian
              </h3>
              <p className="text-[11px] text-zinc-500">Progres akumulasi dana darurat</p>
            </div>
          </div>
          <Link
            href="/goals"
            prefetch={true}
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-0.5"
          >
            <span>Detail</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-900">Dana Darurat 6 Bulan</span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              0% Tercapai
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-zinc-200/80 overflow-hidden">
            <div className="h-full bg-zinc-950 rounded-full w-0" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>Terkumpul: Rp 0</span>
            <span>Sasaran: Rp 25.000.000</span>
          </div>
        </div>
      </div>

      {/* 7. Riwayat Transaksi Terkini */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950">
              Transaksi Terkini
            </h2>
            <p className="text-xs text-zinc-500">
              Aktivitas arus kas paling baru
            </p>
          </div>
          <Link
            href="/transactions"
            prefetch={true}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <span>Semua Transaksi</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-7 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-zinc-900">
            Belum Ada Transaksi
          </p>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            Mulai catat transaksi pertama Anda untuk menikmati kepuasan memantau pertumbuhan finansial secara real-time.
          </p>
          <Link
            href="/transactions"
            prefetch={true}
            className="mt-2 px-4 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Transaksi Baru</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

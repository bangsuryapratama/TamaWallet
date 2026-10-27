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
  TrendingUp,
  Plus,
  ChevronRight,
  Building2,
  Smartphone,
  Banknote,
  Receipt,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

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
    "Pengguna";

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* 1. Header Ringkas & Personal */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">
            {greeting},
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 mt-0.5">
            {displayName}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Periode
          </p>
          <p className="text-xs font-bold font-mono text-zinc-700 mt-0.5">
            {periodLabel}
          </p>
        </div>
      </div>

      {/* 2. Kartu Posisi Finansial Utama (Original TamaWallet Design) */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
        {/* Label & Privacy Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">
              Total Kekayaan Bersih
            </span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-100 cursor-pointer"
          >
            {showBalance ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">Sembunyikan</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">Tampilkan</span>
              </>
            )}
          </button>
        </div>

        {/* Nominal Besar */}
        <div className="mt-3">
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-zinc-950">
            {showBalance ? "Rp 0" : "••••••••"}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Akumulasi saldo likuid dari seluruh rekening aktif
          </p>
        </div>

        {/* Arus Kas Bulan Berjalan */}
        <div className="mt-6 pt-5 border-t border-zinc-100 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ArrowDownLeft className="h-3 w-3" />
              </span>
              <span>Pemasukan Bulan Ini</span>
            </div>
            <p className="text-base font-bold font-mono text-emerald-700 pl-5">
              {showBalance ? "Rp 0" : "••••••"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                <ArrowUpRight className="h-3 w-3" />
              </span>
              <span>Pengeluaran Bulan Ini</span>
            </div>
            <p className="text-base font-bold font-mono text-zinc-900 pl-5">
              {showBalance ? "Rp 0" : "••••••"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Aksi Cepat Finansial (4 Pilar Aksi Fokus) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        <Link
          href="/transactions"
          prefetch={true}
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors shadow-2xs">
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
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors shadow-2xs">
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
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors shadow-2xs">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 mt-2">
            Pindah Dana
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
            Transfer Antar Akun
          </span>
        </Link>

        <Link
          href="/wallets"
          prefetch={true}
          className="group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-2xs cursor-pointer"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors shadow-2xs">
            <WalletCards className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 mt-2">
            Akun & Kas
          </span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
            Kelola Saldo
          </span>
        </Link>
      </div>

      {/* 4. Rekening & Dompet Terdaftar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950">
              Akun Keuangan
            </h2>
            <p className="text-xs text-zinc-500">
              Rekening bank, e-wallet, dan kas tunai
            </p>
          </div>
          <Link
            href="/wallets"
            prefetch={true}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <span>Buka Wallet</span>
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
                  <p className="text-[10px] text-zinc-400">Giro & Tabungan</p>
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

      {/* 5. Dua Kolom: Goals Tabungan & Insight Arus Kas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Goals Finansial */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Target Tabungan
                </h3>
                <p className="text-[11px] text-zinc-500">Sasaran & Dana Impian</p>
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

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900">Dana Darurat</span>
              <span className="font-mono text-zinc-500">0%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
              <div className="h-full bg-zinc-950 rounded-full w-0" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>Rp 0 tercapai</span>
              <span>Target terukur</span>
            </div>
          </div>
        </div>

        {/* Insight Finansial */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Kesehatan Arus Kas
                </h3>
                <p className="text-[11px] text-zinc-500">Evaluasi Rasio Keuangan</p>
              </div>
            </div>
            <Link
              href="/insights"
              prefetch={true}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-0.5"
            >
              <span>Laporan</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Net Cashflow
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Surplus atau defisit arus kas bulan ini.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-800">
              Rp 0
            </span>
          </div>
        </div>
      </div>

      {/* 6. Transaksi Terkini */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950">
              Transaksi Terkini
            </h2>
            <p className="text-xs text-zinc-500">
              Entri arus kas paling baru
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

        <div className="p-7 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-zinc-900">
            Belum Ada Transaksi
          </p>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            Catat pemasukan atau pengeluaran pertama Anda untuk mulai memantau arus kas secara real-time.
          </p>
          <Link
            href="/transactions"
            prefetch={true}
            className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Transaksi Baru</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

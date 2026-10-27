"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Wallet,
  Target,
  Plus,
  ChevronRight,
  Landmark,
  Smartphone,
  Banknote,
  ReceiptText,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getCachedShowBalance,
  setCachedShowBalance,
} from "@/lib/auth-cache";

interface DashboardViewProps {
  initialUser: User | null;
}

type BalanceMode = "spendable" | "savings" | "total";

export function DashboardView({ initialUser }: DashboardViewProps) {
  // Inisialisasi privasi saldo dari local storage cache
  const [showBalance, setShowBalance] = React.useState<boolean>(() => {
    return getCachedShowBalance();
  });

  // 3 Mode Saldo: Siap Pakai, Tabungan & Kantong Khusus, Total Aset
  const [balanceMode, setBalanceMode] = React.useState<BalanceMode>("spendable");

  const balanceData = React.useMemo(() => {
    return {
      spendable: {
        label: "Duit Siap Pakai",
        amount: "0,00",
        short: "Rp 0",
        desc: "Aman dijajanin tanpa ganggu tabungan ☕",
      },
      savings: {
        label: "Tabungan & Terkunci",
        amount: "0,00",
        short: "Rp 0",
        desc: "Dana darurat & pos impian masa depan 🎯",
      },
      total: {
        label: "Keseluruhan Aset",
        amount: "0,00",
        short: "Rp 0",
        desc: "Akumulasi seluruh kantong & aset kamu 💎",
      },
    };
  }, []);

  const activeBalance = balanceData[balanceMode];

  // Greeting dinamis berbasis jam lokal
  const greeting = React.useMemo(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 5 && hour < 11) return "Pagi";
    if (hour >= 11 && hour < 15) return "Siang";
    if (hour >= 15 && hour < 18) return "Sore";
    return "Malam";
  }, []);

  const rawName =
    initialUser?.user_metadata?.full_name ||
    initialUser?.email?.split("@")[0] ||
    "Pengguna";

  // Format nama agar rapi
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const toggleBalance = () => {
    const nextState = !showBalance;
    setShowBalance(nextState);
    setCachedShowBalance(nextState);
    if (!nextState) {
      toast("Saldo disembunyikan", { duration: 1500 });
    } else {
      toast.success("Saldo ditampilkan", { duration: 1500 });
    }
  };

  return (
    <div className="space-y-6 pb-40 md:pb-16 max-w-4xl mx-auto">
      {/* 1. Header Bersih & Santai */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">
            Selamat {greeting},
          </p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 mt-0.5">
            {displayName} ✨
          </h1>
        </div>
      </div>

      {/* 2. Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Utama (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Kartu Hero Saldo Utama 3-in-1 (Clean, Mewah, Bebas Badge) */}
          <div className="rounded-3xl bg-zinc-950 text-white p-5 sm:p-7 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.3)] space-y-5">
            {/* Baris 1: Segmented Switch 3 Mode Saldo & Ikon Mata */}
            <div className="flex items-center justify-between gap-2">
              <div className="grid grid-cols-3 p-1 rounded-2xl bg-zinc-900 border border-zinc-800/80 text-[11px] font-semibold w-full max-w-[310px]">
                <button
                  type="button"
                  onClick={() => setBalanceMode("spendable")}
                  className={cn(
                    "py-1.5 px-1.5 rounded-xl transition-all text-center cursor-pointer active:scale-95",
                    balanceMode === "spendable"
                      ? "bg-zinc-800 text-white shadow-2xs font-bold"
                      : "text-zinc-400 hover:text-zinc-200 font-medium"
                  )}
                >
                  Siap Pakai
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceMode("savings")}
                  className={cn(
                    "py-1.5 px-1.5 rounded-xl transition-all text-center cursor-pointer active:scale-95",
                    balanceMode === "savings"
                      ? "bg-zinc-800 text-white shadow-2xs font-bold"
                      : "text-zinc-400 hover:text-zinc-200 font-medium"
                  )}
                >
                  Tabungan
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceMode("total")}
                  className={cn(
                    "py-1.5 px-1.5 rounded-xl transition-all text-center cursor-pointer active:scale-95",
                    balanceMode === "total"
                      ? "bg-zinc-800 text-white shadow-2xs font-bold"
                      : "text-zinc-400 hover:text-zinc-200 font-medium"
                  )}
                >
                  Total Aset
                </button>
              </div>

              <button
                type="button"
                onClick={toggleBalance}
                title={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-zinc-900 active:scale-90 cursor-pointer shrink-0"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4 stroke-[1.8]" />
                ) : (
                  <Eye className="h-4 w-4 text-emerald-400 stroke-[1.8]" />
                )}
              </button>
            </div>

            {/* Baris 2: Angka Saldo Utama Sesuai Mode Aktif (Responsive BCA-Style Sans-Serif) */}
            <div className="pt-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {activeBalance.label}
              </p>
              <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden mt-1.5">
                {showBalance ? (
                  <>
                    <span className="text-lg sm:text-xl font-bold text-zinc-400 select-none shrink-0">
                      Rp
                    </span>
                    <span
                      className="font-black tracking-tight text-white tabular-nums leading-none"
                      style={{
                        fontSize: "clamp(2rem, 7vw, 3rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      {activeBalance.amount}
                    </span>
                  </>
                ) : (
                  <span
                    className="font-black tracking-widest text-zinc-500 select-none leading-none"
                    style={{
                      fontSize: "clamp(1.5rem, 6vw, 2.25rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    ••••••••••••
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-2 font-medium">
                {activeBalance.desc}
              </p>
            </div>

            {/* Baris 3: 3-Box Ringkasan Cepat Seluruh Duit (1-Tap Switch) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setBalanceMode("spendable")}
                className={cn(
                  "p-2.5 rounded-xl text-left transition-all cursor-pointer active:scale-95",
                  balanceMode === "spendable"
                    ? "bg-zinc-900 border border-zinc-800 shadow-2xs"
                    : "hover:bg-zinc-900/60 border border-transparent"
                )}
              >
                <p className="text-[10px] text-zinc-400 font-medium">1. Siap Pakai</p>
                <p className="text-xs font-bold text-zinc-100 mt-0.5 tabular-nums truncate">
                  {showBalance ? balanceData.spendable.short : "••••"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBalanceMode("savings")}
                className={cn(
                  "p-2.5 rounded-xl text-left transition-all cursor-pointer active:scale-95",
                  balanceMode === "savings"
                    ? "bg-zinc-900 border border-zinc-800 shadow-2xs"
                    : "hover:bg-zinc-900/60 border border-transparent"
                )}
              >
                <p className="text-[10px] text-zinc-400 font-medium">2. Tabungan</p>
                <p className="text-xs font-bold text-zinc-100 mt-0.5 tabular-nums truncate">
                  {showBalance ? balanceData.savings.short : "••••"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBalanceMode("total")}
                className={cn(
                  "p-2.5 rounded-xl text-left transition-all cursor-pointer active:scale-95",
                  balanceMode === "total"
                    ? "bg-zinc-900 border border-zinc-800 shadow-2xs"
                    : "hover:bg-zinc-900/60 border border-transparent"
                )}
              >
                <p className="text-[10px] text-zinc-400 font-medium">3. Total Aset</p>
                <p className="text-xs font-bold text-zinc-100 mt-0.5 tabular-nums truncate">
                  {showBalance ? balanceData.total.short : "••••"}
                </p>
              </button>
            </div>

            {/* Baris 4: Arus Kas: Cuan Masuk & Jajan Keluar (Selalu Terbuka) */}
            <div className="pt-3 border-t border-zinc-900 grid grid-cols-2 gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    <ArrowDownLeft className="h-2.5 w-2.5 stroke-[2.5]" />
                  </span>
                  <span>Cuan Masuk</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-emerald-400 pl-5.5 tabular-nums">
                  + Rp 0
                </p>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-950 text-rose-400 border border-rose-800/40">
                    <ArrowUpRight className="h-2.5 w-2.5 stroke-[2.5]" />
                  </span>
                  <span>Jajan Keluar</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-zinc-200 pl-5.5 tabular-nums">
                  - Rp 0
                </p>
              </div>
            </div>
          </div>

          {/* 4 Menu Aksi Cepat Finansial (Bersih, Responsif, Tanpa Badge) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            <Link
              href="/transactions"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors">
                <ArrowUpRight className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">
                Jajan
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
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors">
                <ArrowDownLeft className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">
                Cuan
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
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors">
                <ArrowLeftRight className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">
                Transfer
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Oper Duit
              </span>
            </Link>

            <Link
              href="/wallets"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors">
                <Wallet className="h-5 w-5 stroke-[1.8]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">
                Kantong
              </span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Atur Akun
              </span>
            </Link>
          </div>

          {/* Aktivitas Terakhir */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Aktivitas Baru
                </h2>
                <p className="text-xs text-zinc-500">
                  Pantau jajan biar ga boncos
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

            <div className="p-7 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                <ReceiptText className="h-5 w-5 stroke-[1.8]" />
              </div>
              <div className="max-w-xs space-y-1">
                <p className="text-sm font-bold text-zinc-900">
                  Dompet masih anteng nih 👀
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Belum ada catatan hari ini. Habis jajan kopi atau baru dapat transferan? Yuk catat!
                </p>
              </div>
              <Link
                href="/transactions"
                prefetch={true}
                className="mt-1 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Catat Sekarang</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Kolom Samping (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Kantong Duit (Bersih, Rapi, Bebas Badge) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Kantong Duit
                </h2>
                <p className="text-xs text-zinc-500">
                  Biar ga kecampur jajan & tabungan
                </p>
              </div>
              <Link
                href="/wallets"
                prefetch={true}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Atur</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Landmark className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Bank Utama</p>
                    <p className="text-[10px] text-zinc-400">Tabungan & Payroll</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-zinc-950 tabular-nums">
                  Rp 0
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Smartphone className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">E-Wallet Jajan</p>
                    <p className="text-[10px] text-zinc-400">GoPay, Shopee & Dana</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-zinc-950 tabular-nums">
                  Rp 0
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Banknote className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Duit Cash</p>
                    <p className="text-[10px] text-zinc-400">Uang Fisik di Dompet</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-zinc-950 tabular-nums">
                  Rp 0
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist & Nabung (Bersih Tanpa Badge) */}
          <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950">
                  <Target className="h-4 w-4 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    Wishlist & Nabung 🎯
                  </h3>
                  <p className="text-[11px] text-zinc-500">Biar impianmu cepet kebeli</p>
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

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">Dana Darurat Santai</span>
                <span className="font-semibold text-zinc-500">0%</span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                <div className="h-full bg-zinc-950 rounded-full w-0" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
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

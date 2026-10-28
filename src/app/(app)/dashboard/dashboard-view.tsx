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
  ReceiptText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getCachedShowBalance,
  setCachedShowBalance,
} from "@/lib/auth-cache";
import {
  getStoredTransactions,
  formatRupiah,
  PrototypeTransaction,
} from "@/lib/transactions-store";
import {
  MiniWallet,
  getStoredWallets,
} from "@/components/modals/quick-transaction-modal";
import { getStoredGoals, FinancialGoal } from "@/lib/goals-store";

interface DashboardViewProps {
  initialUser: User | null;
}

type BalanceMode = "spendable" | "savings" | "total";

export function DashboardView({ initialUser }: DashboardViewProps) {
  // Privasi saldo
  const [showBalance, setShowBalance] = React.useState<boolean>(() => {
    return getCachedShowBalance();
  });

  // State data live
  const [wallets, setWallets] = React.useState<MiniWallet[]>(() => getStoredWallets());
  const [transactions, setTransactions] = React.useState<PrototypeTransaction[]>(() =>
    getStoredTransactions()
  );
  const [goals, setGoals] = React.useState<FinancialGoal[]>(() => getStoredGoals());

  // 3 Mode Saldo: Siap Pakai, Tabungan, Total Aset
  const [balanceMode, setBalanceMode] = React.useState<BalanceMode>("spendable");

  // Listen to Global Sync Events
  React.useEffect(() => {
    const handleSync = () => {
      setWallets(getStoredWallets());
      setTransactions(getStoredTransactions());
      setGoals(getStoredGoals());
    };
    const handleVis = () => {
      setShowBalance(getCachedShowBalance());
    };

    window.addEventListener("tamawallet:tx-updated", handleSync);
    window.addEventListener("tamawallet:goals-updated", handleSync);
    window.addEventListener("tamawallet:balance-visibility", handleVis);
    return () => {
      window.removeEventListener("tamawallet:tx-updated", handleSync);
      window.removeEventListener("tamawallet:goals-updated", handleSync);
      window.removeEventListener("tamawallet:balance-visibility", handleVis);
    };
  }, []);

  // Hitung Saldo Dinamis Sesuai Kategori Kantong
  const balances = React.useMemo(() => {
    let spendable = 0;
    let savings = 0;
    let total = 0;

    wallets.forEach((w) => {
      const bal = w.balance || 0;
      total += bal;
      // Anggap Jago atau yang bernama Dana Darurat sebagai Tabungan
      if (
        w.provider === "jago" ||
        w.name.toLowerCase().includes("tabungan") ||
        w.name.toLowerCase().includes("darurat")
      ) {
        savings += bal;
      } else {
        spendable += bal;
      }
    });

    return { spendable, savings, total };
  }, [wallets]);

  // Hitung Arus Kas Cuan Masuk & Jajan Keluar
  const cashflow = React.useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") income += tx.amount;
      if (tx.type === "expense") expense += tx.amount;
    });

    return { income, expense };
  }, [transactions]);

  // Transaksi Terakhir (3 item paling baru)
  const recentTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);
  }, [transactions]);

  // Top Goal Aktif
  const topGoal = goals[0] || null;

  const balanceData = {
    spendable: {
      label: "Duit Siap Pakai",
      amount: balances.spendable,
      desc: "Aman dijajanin tanpa ganggu tabungan ☕",
    },
    savings: {
      label: "Tabungan & Terkunci",
      amount: balances.savings,
      desc: "Dana darurat & pos impian masa depan 🎯",
    },
    total: {
      label: "Keseluruhan Aset",
      amount: balances.total,
      desc: "Akumulasi seluruh kantong & rekening kamu 💎",
    },
  };

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
    typeof window !== "undefined" && localStorage.getItem("tamawallet_user_display_name")
      ? localStorage.getItem("tamawallet_user_display_name")!
      : initialUser?.user_metadata?.full_name ||
        initialUser?.email?.split("@")[0] ||
        "Surya";

  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const toggleBalance = () => {
    const nextState = !showBalance;
    setShowBalance(nextState);
    setCachedShowBalance(nextState);
    window.dispatchEvent(new CustomEvent("tamawallet:balance-visibility"));
    if (!nextState) {
      toast("Saldo disembunyikan", { duration: 1500 });
    } else {
      toast.success("Saldo ditampilkan", { duration: 1500 });
    }
  };

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-4xl mx-auto animate-page-enter">
      {/* 1. Header Top Gaul & Santai */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-zinc-500">
              Selamat {greeting},
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Financially Healthy</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 mt-1">
            {displayName} ✨
          </h1>
        </div>

        {/* Shortcut Insights */}
        <Link
          href="/insights"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold transition-all active:scale-95 shadow-2xs"
        >
          <TrendingUp className="h-3.5 w-3.5 text-zinc-700" />
          <span>Analisis Kas</span>
        </Link>
      </div>

      {/* 2. Responsive Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Utama (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Bento Hero Saldo Utama: Obsidian Dark Luxury */}
          <div className="relative rounded-[28px] bg-gradient-to-br from-[#18181B] via-[#0E0E11] to-[#050507] text-white p-5 sm:p-7 border border-zinc-800 shadow-xl overflow-hidden card-tactile">
            {/* Glow Ambient Sheen */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10 space-y-5">
              {/* Baris 1: Segmented Switch 3 Mode Saldo & Ikon Sensor */}
              <div className="flex items-center justify-between gap-2">
                <div className="grid grid-cols-3 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 text-[11px] font-semibold w-full max-w-[310px]">
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

              {/* Baris 2: Angka Saldo Utama Sesuai Mode Aktif */}
              <div className="pt-1">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {activeBalance.label}
                </p>
                <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden mt-1.5">
                  {showBalance ? (
                    <span
                      className="font-black tracking-tight text-white tabular-nums leading-none"
                      style={{
                        fontSize: "clamp(2rem, 7vw, 2.85rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      {formatRupiah(activeBalance.amount)}
                    </span>
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

              {/* Arus Kas: Cuan Masuk & Jajan Keluar (Terhitung Dinamis dari Riwayat) */}
              <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                    <ArrowDownLeft className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Cuan Masuk</span>
                  </div>
                  <p className="text-sm sm:text-base font-black text-emerald-400 tabular-nums">
                    +{formatRupiah(cashflow.income)}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold">
                    <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Jajan Keluar</span>
                  </div>
                  <p className="text-sm sm:text-base font-black text-rose-300 tabular-nums">
                    -{formatRupiah(cashflow.expense)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Menu Aksi Cepat Finansial Gen Z */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("tamawallet:open-quick-tx"));
              }}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer card-tactile"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <ArrowUpRight className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">Jajan 💸</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Pengeluaran
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("tamawallet:open-quick-tx"));
              }}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer card-tactile"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ArrowDownLeft className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">Cuan 💰</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Pemasukan
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("tamawallet:open-quick-tx"));
              }}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer card-tactile"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <ArrowLeftRight className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">Pindah ⇄</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                Oper Duit
              </span>
            </button>

            <Link
              href="/wallets"
              prefetch={true}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 active:scale-90 transition-all text-center shadow-2xs cursor-pointer card-tactile"
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 transition-colors">
                <Wallet className="h-5 w-5 stroke-[1.8]" />
              </div>
              <span className="text-xs font-bold text-zinc-900 mt-2">Kantong</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline-block">
                {wallets.length} Akun
              </span>
            </Link>
          </div>

          {/* Aktivitas Terakhir (Live Stream Transaksi) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Aktivitas Baru ⚡
                </h2>
                <p className="text-xs text-zinc-500">
                  Catatan ledger keuangan real-time
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

            {recentTransactions.length > 0 ? (
              <div className="rounded-[24px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
                {recentTransactions.map((tx) => (
                  <Link
                    key={tx.id}
                    href="/transactions"
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-zinc-50/80 transition-colors active:scale-99"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xl shadow-2xs">
                        <span>{tx.categoryEmoji || "💸"}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                          {tx.description || tx.category}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                          {tx.walletName} • {new Date(tx.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-black tabular-nums tracking-tight",
                          tx.type === "income"
                            ? "text-emerald-600"
                            : tx.type === "expense"
                            ? "text-zinc-900"
                            : "text-cyan-700"
                        )}
                      >
                        {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "⇄ "}
                        {formatRupiah(tx.amount)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-7 rounded-[24px] border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                  <ReceiptText className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div className="max-w-xs space-y-1">
                  <p className="text-sm font-bold text-zinc-900">
                    Dompet masih anteng nih 👀
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Belum ada catatan hari ini. Habis jajan kopi atau baru dapat cuan? Yuk catat!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("tamawallet:open-quick-tx"));
                  }}
                  className="mt-1 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Catat Cepat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Samping (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Kantong Duit (Live Kantong Terhubung) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Kantong Duit ({wallets.length})
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
                <span>Kelola</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {wallets.slice(0, 4).map((wallet) => (
                <Link
                  key={wallet.id}
                  href="/wallets"
                  className="p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center justify-between hover:bg-zinc-50/80 transition-all card-tactile cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xl">
                      <span>{wallet.emoji || "💳"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        {wallet.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                        {wallet.provider}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-950 tabular-nums shrink-0">
                    {showBalance ? formatRupiah(wallet.balance) : "••••••••"}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Wishlist & Goals Teaser (Live dari Goals Store) */}
          <div className="p-5 rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs space-y-4 card-tactile">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  <Target className="h-4.5 w-4.5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    Target Nabung 🎯
                  </h3>
                  <p className="text-[11px] text-zinc-500">Impian masa depan kamu</p>
                </div>
              </div>
              <Link
                href="/goals"
                prefetch={true}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-0.5"
              >
                <span>Semua</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {topGoal && (
              <div className="p-4 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 truncate">
                    <span>{topGoal.emoji}</span>
                    <span className="truncate">{topGoal.title}</span>
                  </div>
                  <span className="font-bold text-emerald-600 shrink-0">
                    {Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100)}%
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100)
                      )}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                  <span>Terkumpul: {formatRupiah(topGoal.currentAmount)}</span>
                  <span>Target: {formatRupiah(topGoal.targetAmount)}</span>
                </div>
              </div>
            )}

            <Link
              href="/goals"
              className="w-full py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Buka Financial Goals Cockpit</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
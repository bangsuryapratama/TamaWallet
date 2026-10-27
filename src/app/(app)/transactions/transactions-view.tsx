"use client";

import * as React from "react";
import { User } from "@supabase/supabase-js";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Plus,
  Search,
  X,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  PrototypeTransaction,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getStoredTransactions,
  saveStoredTransactions,
  formatRupiah,
  WALLETS_STORAGE_KEY,
} from "@/lib/transactions-store";

interface TransactionsViewProps {
  initialUser?: User | null;
}

interface MiniWallet {
  id: string;
  name: string;
  provider: string;
  balance: number;
  emoji: string;
}

const DEFAULT_MINI_WALLETS: MiniWallet[] = [
  { id: "wallet-bca-1", name: "BCA Tahapan Prioritas", provider: "bca", balance: 8750000, emoji: "💳" },
  { id: "wallet-jago-1", name: "Jago Dana Darurat Santai", provider: "jago", balance: 15000000, emoji: "🎯" },
  { id: "wallet-gopay-1", name: "GoPay Jajan & Kopi", provider: "gopay", balance: 450000, emoji: "☕" },
  { id: "wallet-cash-1", name: "Kas Tunai di Dompet", provider: "cash", balance: 300000, emoji: "💵" },
];

export function TransactionsView({ initialUser: _initialUser }: TransactionsViewProps) {
  // Transaksi State
  const [transactions, setTransactions] = React.useState<PrototypeTransaction[]>(() => {
    return getStoredTransactions();
  });

  // Kantong Dompet State
  const [wallets, setWallets] = React.useState<MiniWallet[]>(() => {
    if (typeof window === "undefined") return DEFAULT_MINI_WALLETS;
    try {
      const raw = localStorage.getItem(WALLETS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MINI_WALLETS;
  });

  // Filter State
  const [typeFilter, setTypeFilter] = React.useState<"all" | "expense" | "income" | "transfer">("all");
  const [walletFilter, setWalletFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [selectedTx, setSelectedTx] = React.useState<PrototypeTransaction | null>(null);

  // Form State untuk Tambah Transaksi
  const [formType, setFormType] = React.useState<"expense" | "income" | "transfer">("expense");
  const [formAmount, setFormAmount] = React.useState<string>("");
  const [formWalletId, setFormWalletId] = React.useState<string>(wallets[0]?.id || "wallet-bca-1");
  const [formTargetWalletId, setFormTargetWalletId] = React.useState<string>(wallets[1]?.id || "wallet-jago-1");
  const [formCategory, setFormCategory] = React.useState<string>(EXPENSE_CATEGORIES[0].name);
  const [formCategoryEmoji, setFormCategoryEmoji] = React.useState<string>(EXPENSE_CATEGORIES[0].emoji);
  const [formDescription, setFormDescription] = React.useState<string>("");

  // Simpan wallets ke localStorage
  const updateWallets = (newWallets: MiniWallet[]) => {
    setWallets(newWallets);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(newWallets));
      } catch {
        // storage quota
      }
    }
  };

  // Simpan transaksi
  const updateTransactions = (newTxs: PrototypeTransaction[]) => {
    setTransactions(newTxs);
    saveStoredTransactions(newTxs);
  };

  // Hitung Arus Kas
  const summary = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    let transfer = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") income += tx.amount;
      else if (tx.type === "expense") expense += tx.amount;
      else if (tx.type === "transfer") transfer += tx.amount;
    });

    const net = income - expense;
    return { income, expense, transfer, net };
  }, [transactions]);

  // Handler Submit Tambah Transaksi
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = parseInt(formAmount.replace(/\D/g, "") || "0", 10);
    if (rawNumber <= 0) {
      toast.error("Nominal transaksi harus lebih dari Rp 0");
      return;
    }

    const sourceWallet = wallets.find((w) => w.id === formWalletId);
    if (!sourceWallet) {
      toast.error("Kantong sumber tidak ditemukan");
      return;
    }

    if (formType === "expense" && sourceWallet.balance < rawNumber) {
      toast.error(`Saldo ${sourceWallet.name} tidak cukup (${formatRupiah(sourceWallet.balance)})`);
      return;
    }

    if (formType === "transfer" && formWalletId === formTargetWalletId) {
      toast.error("Kantong sumber dan tujuan tidak boleh sama");
      return;
    }

    const targetWallet = formType === "transfer" ? wallets.find((w) => w.id === formTargetWalletId) : null;
    if (formType === "transfer" && !targetWallet) {
      toast.error("Kantong tujuan tidak ditemukan");
      return;
    }

    // Buat objek transaksi baru
    const newTx: PrototypeTransaction = {
      id: `tx-${Date.now()}`,
      type: formType,
      amount: rawNumber,
      walletId: sourceWallet.id,
      walletName: sourceWallet.name,
      walletProvider: sourceWallet.provider,
      targetWalletId: targetWallet?.id,
      targetWalletName: targetWallet?.name,
      category: formType === "transfer" ? "Pindah Saldo" : formCategory,
      categoryEmoji: formType === "transfer" ? "⇄" : formCategoryEmoji,
      description: formDescription.trim() || (formType === "transfer" ? `Pindah ke ${targetWallet?.name}` : formCategory),
      date: new Date().toISOString(),
      createdAt: Date.now(),
    };

    // Update Saldo Kantong (Double-Entry Ledger)
    const updatedWallets = wallets.map((w) => {
      if (w.id === sourceWallet.id) {
        return {
          ...w,
          balance: formType === "income" ? w.balance + rawNumber : w.balance - rawNumber,
        };
      }
      if (formType === "transfer" && targetWallet && w.id === targetWallet.id) {
        return {
          ...w,
          balance: w.balance + rawNumber,
        };
      }
      return w;
    });

    updateWallets(updatedWallets);
    updateTransactions([newTx, ...transactions]);

    toast.success(
      formType === "income"
        ? `Uang masuk dicatat! + ${formatRupiah(rawNumber)} 💰`
        : formType === "expense"
        ? `Pengeluaran dicatat! - ${formatRupiah(rawNumber)} 💸`
        : `Pindah saldo berhasil! ⇄ ${formatRupiah(rawNumber)} ⚡`
    );

    // Reset Form
    setFormAmount("");
    setFormDescription("");
    setIsAddModalOpen(false);
  };

  // Handler Hapus Transaksi (Reversal Ledger)
  const handleDeleteTransaction = (tx: PrototypeTransaction) => {
    // Reverse saldo kantong
    const updatedWallets = wallets.map((w) => {
      if (w.id === tx.walletId) {
        return {
          ...w,
          balance: tx.type === "income" ? w.balance - tx.amount : w.balance + tx.amount,
        };
      }
      if (tx.type === "transfer" && tx.targetWalletId && w.id === tx.targetWalletId) {
        return {
          ...w,
          balance: w.balance - tx.amount,
        };
      }
      return w;
    });

    const updatedTxs = transactions.filter((t) => t.id !== tx.id);
    updateWallets(updatedWallets);
    updateTransactions(updatedTxs);
    setSelectedTx(null);
    toast.success("Transaksi dihapus & saldo kantong dikembalikan 🔄");
  };

  // Filter Transaksi
  const filteredTransactions = transactions.filter((tx) => {
    // Filter Type
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    // Filter Wallet
    if (walletFilter !== "all" && tx.walletId !== walletFilter && tx.targetWalletId !== walletFilter) return false;
    // Filter Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.category.toLowerCase().includes(q);
      const matchWallet = tx.walletName.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      if (!matchDesc && !matchCat && !matchWallet && !matchAmount) return false;
    }
    return true;
  });

  // Group Transaksi berdasarkan Tanggal
  const groupedTransactions = React.useMemo(() => {
    const groups: { [key: string]: PrototypeTransaction[] } = {};

    filteredTransactions.forEach((tx) => {
      const txDate = new Date(tx.createdAt);
      const today = new Date();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      let groupKey = txDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (txDate.toDateString() === today.toDateString()) {
        groupKey = "HARI INI";
      } else if (txDate.toDateString() === yesterday.toDateString()) {
        groupKey = "KEMARIN";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    return groups;
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-4xl mx-auto">
      {/* 1. Header Arus Kas & Transaksi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
            Arus Kas & Transaksi ⚡
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Setiap rupiah yang masuk, keluar, dan mutasi saldo tercatat rapi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormType("expense");
            setFormCategory(EXPENSE_CATEGORIES[0].name);
            setFormCategoryEmoji(EXPENSE_CATEGORIES[0].emoji);
            setIsAddModalOpen(true);
          }}
          className="self-start sm:self-auto h-10 px-4.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Catat Transaksi</span>
        </button>
      </div>

      {/* 2. Cockpit Arus Kas Bulan Ini (Pemasukan, Pengeluaran, Net Cash Flow) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Pemasukan / Uang Masuk */}
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Total Masuk (Cuan)
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-700">
              <ArrowDownLeft className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight tabular-nums">
              +{formatRupiah(summary.income)}
            </p>
            <p className="text-[10px] text-emerald-700/80 font-medium mt-0.5">
              Gaji, freelance & cuan aktif
            </p>
          </div>
        </div>

        {/* Pengeluaran / Uang Keluar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Keluar (Jajan)
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-rose-400">
              <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">
              -{formatRupiah(summary.expense)}
            </p>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
              Konsumsi, ngopi & tagihan
            </p>
          </div>
        </div>

        {/* Arus Kas Bersih (Net Cash Flow) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Arus Kas Bersih
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <ArrowLeftRight className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`text-xl sm:text-2xl font-black tracking-tight tabular-nums ${
                summary.net >= 0 ? "text-zinc-950" : "text-rose-600"
              }`}
            >
              {summary.net >= 0 ? `+${formatRupiah(summary.net)}` : formatRupiah(summary.net)}
            </p>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {summary.net >= 0 ? "Surplus tabungan bertambah 🚀" : "Defisit pengeluaran berlebih ⚠️"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar: Tipe, Kantong, & Search */}
      <div className="space-y-3 pt-1">
        {/* Tipe Selector & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tipe Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80 text-xs font-bold w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                typeFilter === "all" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("expense")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                typeFilter === "expense" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Keluar 💸
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("income")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                typeFilter === "income" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Masuk 💰
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("transfer")}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                typeFilter === "transfer" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Pindah ⇄
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari transaksi / merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-8 pr-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
          </div>
        </div>

        {/* Filter per Kantong / Dompet */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mr-1 shrink-0">
            Kantong:
          </span>
          <button
            type="button"
            onClick={() => setWalletFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              walletFilter === "all"
                ? "bg-zinc-950 text-white shadow-2xs"
                : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
            }`}
          >
            Semua Kantong
          </button>
          {wallets.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWalletFilter(w.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 flex items-center gap-1.5 ${
                walletFilter === w.id
                  ? "bg-zinc-950 text-white shadow-2xs"
                  : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
              }`}
            >
              <span>{w.emoji}</span>
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Timeline Daftar Transaksi (Grouped by Date) */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="p-12 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 text-xl">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900">Tidak Ada Transaksi</h3>
              <p className="text-xs text-zinc-500 max-w-xs">
                Tidak ada riwayat transaksi yang cocok dengan filter atau kata kunci pencarian kamu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTypeFilter("all");
                setWalletFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([dateGroup, items]) => {
            // Hitung subtotal harian
            let dailyExpense = 0;
            let dailyIncome = 0;
            items.forEach((it) => {
              if (it.type === "expense") dailyExpense += it.amount;
              if (it.type === "income") dailyIncome += it.amount;
            });

            return (
              <div key={dateGroup} className="space-y-2">
                {/* Header Tanggal */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black tracking-wider text-zinc-400 uppercase">
                    {dateGroup}
                  </span>
                  <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-2">
                    {dailyExpense > 0 && <span className="text-rose-500">Keluar: -{formatRupiah(dailyExpense)}</span>}
                    {dailyIncome > 0 && <span className="text-emerald-600">Masuk: +{formatRupiah(dailyIncome)}</span>}
                  </div>
                </div>

                {/* List Kartu Transaksi */}
                <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
                  {items.map((tx) => {
                    const isExpense = tx.type === "expense";
                    const isIncome = tx.type === "income";
                    const isTransfer = tx.type === "transfer";

                    const timeStr = new Date(tx.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-zinc-50/80 active:bg-zinc-100/70 transition-colors cursor-pointer group"
                      >
                        {/* Kiri: Emoji Kategori & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-lg border border-zinc-200/60 select-none group-hover:scale-105 transition-transform">
                            {tx.categoryEmoji}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-950 truncate">
                              {tx.description}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-500 font-medium">
                              <span className="font-semibold text-zinc-700">
                                {isTransfer
                                  ? `${tx.walletName} ➔ ${tx.targetWalletName}`
                                  : tx.walletName}
                              </span>
                              <span>•</span>
                              <span>{timeStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Kanan: Nominal Transaksi */}
                        <div className="text-right shrink-0">
                          <p
                            className={`text-xs sm:text-sm font-black tracking-tight tabular-nums ${
                              isIncome
                                ? "text-emerald-600"
                                : isExpense
                                ? "text-zinc-950"
                                : "text-zinc-600"
                            }`}
                          >
                            {isIncome
                              ? `+${formatRupiah(tx.amount)}`
                              : isExpense
                              ? `-${formatRupiah(tx.amount)}`
                              : `⇄ ${formatRupiah(tx.amount)}`}
                          </p>
                          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                            {isIncome ? "Pemasukan" : isExpense ? "Pengeluaran" : "Pindah Saldo"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. MODAL: CATAT TRANSAKSI BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black text-zinc-950">Catat Transaksi Baru ⚡</h3>
                <p className="text-xs text-zinc-500">
                  Pilih tipe transaksi dan masukkan nominal keuangan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center cursor-pointer active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              {/* Tipe Selector Tab */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setFormType("expense");
                    setFormCategory(EXPENSE_CATEGORIES[0].name);
                    setFormCategoryEmoji(EXPENSE_CATEGORIES[0].emoji);
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    formType === "expense" ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  💸 Keluar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType("income");
                    setFormCategory(INCOME_CATEGORIES[0].name);
                    setFormCategoryEmoji(INCOME_CATEGORIES[0].emoji);
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    formType === "income" ? "bg-emerald-600 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  💰 Masuk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType("transfer");
                    setFormCategory("Pindah Saldo");
                    setFormCategoryEmoji("⇄");
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    formType === "transfer" ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  ⇄ Pindah
                </button>
              </div>

              {/* Nominal Input Besar */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Nominal {formType === "expense" ? "Pengeluaran" : formType === "income" ? "Pemasukan" : "Transfer"}
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-black text-zinc-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="0"
                    value={formAmount}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, "");
                      if (num) {
                        setFormAmount(parseInt(num, 10).toLocaleString("id-ID"));
                      } else {
                        setFormAmount("");
                      }
                    }}
                    className="h-11 w-full pl-8 pr-3 bg-transparent text-2xl font-black text-zinc-950 placeholder:text-zinc-300 focus:outline-none tabular-nums"
                  />
                </div>

                {/* Quick Chips Nominal */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
                  {[20000, 50000, 100000, 250000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormAmount(amt.toLocaleString("id-ID"))}
                      className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-[11px] font-bold text-zinc-800 transition-transform active:scale-95 whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      +{amt >= 1000000 ? `${amt / 1000000}jt` : `${amt / 1000}rb`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Kantong Sumber */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  {formType === "transfer" ? "Dari Kantong Sumber" : "Kantong Pembayaran"}
                </label>
                <select
                  value={formWalletId}
                  onChange={(e) => setFormWalletId(e.target.value)}
                  className="h-11 w-full px-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 bg-white"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.emoji} {w.name} — Sisa: {formatRupiah(w.balance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilihan Kantong Tujuan (Khusus Transfer) */}
              {formType === "transfer" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Ke Kantong Tujuan
                  </label>
                  <select
                    value={formTargetWalletId}
                    onChange={(e) => setFormTargetWalletId(e.target.value)}
                    className="h-11 w-full px-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 bg-white"
                  >
                    {wallets
                      .filter((w) => w.id !== formWalletId)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.emoji} {w.name} — Sisa: {formatRupiah(w.balance)}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Pilihan Kategori (Jika bukan transfer) */}
              {formType !== "transfer" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Kategori Transaksi
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(formType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => {
                      const isSelected = formCategory === cat.name;
                      return (
                        <button
                          key={cat.code}
                          type="button"
                          onClick={() => {
                            setFormCategory(cat.name);
                            setFormCategoryEmoji(cat.emoji);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                              : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                          }`}
                        >
                          <span className="text-base">{cat.emoji}</span>
                          <span className="text-[11px] font-bold truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Catatan / Merchant */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Catatan / Keterangan
                </label>
                <input
                  type="text"
                  placeholder={
                    formType === "expense"
                      ? "Contoh: Kopi Kenangan, Beli Kemeja, Nasi Goreng"
                      : formType === "income"
                      ? "Contoh: Gaji Kantor, Bonus Tahunan, Jual Desain"
                      : "Contoh: Alokasi Tabungan Bulanan"
                  }
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Simpan Transaksi Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: DETAIL & HAPUS TRANSAKSI */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 shadow-2xl">
            {/* Header Detail */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-xl border border-zinc-200/80">
                  {selectedTx.categoryEmoji}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">{selectedTx.category}</h3>
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    {selectedTx.type === "income"
                      ? "Pemasukan"
                      : selectedTx.type === "expense"
                      ? "Pengeluaran"
                      : "Pindah Saldo"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center cursor-pointer active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nominal Besar */}
            <div className="text-center py-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Nominal Transaksi
              </span>
              <p
                className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums mt-0.5 ${
                  selectedTx.type === "income"
                    ? "text-emerald-600"
                    : selectedTx.type === "expense"
                    ? "text-zinc-950"
                    : "text-zinc-700"
                }`}
              >
                {selectedTx.type === "income"
                  ? `+${formatRupiah(selectedTx.amount)}`
                  : selectedTx.type === "expense"
                  ? `-${formatRupiah(selectedTx.amount)}`
                  : `⇄ ${formatRupiah(selectedTx.amount)}`}
              </p>
            </div>

            {/* Rincian Transaksi */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Keterangan:</span>
                <span className="font-bold text-zinc-900 text-right">{selectedTx.description}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Kantong:</span>
                <span className="font-bold text-zinc-900 text-right">
                  {selectedTx.type === "transfer"
                    ? `${selectedTx.walletName} ➔ ${selectedTx.targetWalletName}`
                    : selectedTx.walletName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Waktu Transaksi:</span>
                <span className="font-bold text-zinc-900 text-right">
                  {new Date(selectedTx.createdAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Action Hapus */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleDeleteTransaction(selectedTx)}
                className="w-full h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus & Kembalikan Saldo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

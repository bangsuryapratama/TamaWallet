"use client";

import * as React from "react";
import {
  Plus,
  Eye,
  EyeOff,
  ArrowLeftRight,
  Sparkles,
  Lock,
  X,
  Banknote,
  Search,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BankBrandLogo } from "@/components/ui/bank-logos";
import { getCachedShowBalance, setCachedShowBalance } from "@/lib/auth-cache";

interface WalletsViewProps {
  initialUser: User | null;
}

export interface PocketWallet {
  id: string;
  name: string;
  provider: string; // 'bca' | 'mandiri' | 'jago' | 'bri' | 'bni' | 'gopay' | 'ovo' | 'dana' | 'shopeepay' | 'cash'
  category: "spendable" | "savings" | "investment";
  emoji: string;
  balance: number;
  accountNumber?: string | undefined;
  theme: "zinc" | "blue" | "amber" | "cyan" | "emerald" | "purple";
  createdAt: number;
}

const DEFAULT_WALLETS: PocketWallet[] = [
  {
    id: "wallet-bca-1",
    name: "BCA Utama Jajan",
    provider: "bca",
    category: "spendable",
    emoji: "💳",
    balance: 5450000,
    accountNumber: "•••• 8912",
    theme: "blue",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: "wallet-jago-1",
    name: "Jago Dana Darurat",
    provider: "jago",
    category: "savings",
    emoji: "🎯",
    balance: 12000000,
    accountNumber: "•••• 1029",
    theme: "amber",
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    id: "wallet-gopay-1",
    name: "GoPay Kopi & Mart",
    provider: "gopay",
    category: "spendable",
    emoji: "☕",
    balance: 320000,
    accountNumber: "0812 •••• 992",
    theme: "cyan",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    id: "wallet-cash-1",
    name: "Kas Tunai Saku",
    provider: "cash",
    category: "spendable",
    emoji: "💵",
    balance: 150000,
    accountNumber: "Uang Fisik",
    theme: "zinc",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
];

const STORAGE_KEY = "tamawallet_prototype_wallets_v1";

const BANK_PROVIDERS = [
  { code: "bca", name: "BCA", type: "Bank" },
  { code: "mandiri", name: "Mandiri", type: "Bank" },
  { code: "jago", name: "Bank Jago", type: "Bank Digital" },
  { code: "bri", name: "BRI", type: "Bank" },
  { code: "bni", name: "BNI", type: "Bank" },
  { code: "gopay", name: "GoPay", type: "E-Wallet" },
  { code: "ovo", name: "OVO", type: "E-Wallet" },
  { code: "dana", name: "DANA", type: "E-Wallet" },
  { code: "shopeepay", name: "ShopeePay", type: "E-Wallet" },
  { code: "cash", name: "Kas Tunai", type: "Uang Fisik" },
];

const EMOJI_OPTIONS = ["💳", "☕", "🎯", "🛵", "🍕", "✈️", "🏠", "💻", "🎁", "💎", "🍿", "🍣", "👕", "🚗"];

export function WalletsView({ initialUser: _initialUser }: WalletsViewProps) {
  const [wallets, setWallets] = React.useState<PocketWallet[]>(() => {
    if (typeof window === "undefined") return DEFAULT_WALLETS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WALLETS));
        return DEFAULT_WALLETS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_WALLETS;
    } catch {
      return DEFAULT_WALLETS;
    }
  });

  const [activeTab, setActiveTab] = React.useState<"all" | "spendable" | "savings" | "investment">("all");
  const [showBalance, setShowBalance] = React.useState<boolean>(() => getCachedShowBalance());
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [selectedWalletForTransfer, setSelectedWalletForTransfer] = React.useState<PocketWallet | null>(null);

  // Form State for New Wallet
  const [newName, setNewName] = React.useState("");
  const [newProvider, setNewProvider] = React.useState("bca");
  const [newCategory, setNewCategory] = React.useState<"spendable" | "savings" | "investment">("spendable");
  const [newEmoji, setNewEmoji] = React.useState("💳");
  const [newBalance, setNewBalance] = React.useState("");
  const [newAccountNum, setNewAccountNum] = React.useState("");
  const [newTheme, setNewTheme] = React.useState<PocketWallet["theme"]>("zinc");

  // Form State for Transfer
  const [targetWalletId, setTargetWalletId] = React.useState<string>("");
  const [transferAmount, setTransferAmount] = React.useState<string>("");

  const saveWallets = (updated: PocketWallet[]) => {
    setWallets(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage quota
      }
    }
  };

  const toggleBalance = () => {
    const next = !showBalance;
    setShowBalance(next);
    setCachedShowBalance(next);
    if (!next) {
      toast("Saldo disembunyikan", { duration: 1500 });
    } else {
      toast.success("Saldo ditampilkan", { duration: 1500 });
    }
  };

  // Calculations
  const totals = React.useMemo(() => {
    let totalAll = 0;
    let spendable = 0;
    let savings = 0;
    let investment = 0;

    wallets.forEach((w) => {
      totalAll += w.balance;
      if (w.category === "spendable") spendable += w.balance;
      else if (w.category === "savings") savings += w.balance;
      else if (w.category === "investment") investment += w.balance;
    });

    return { totalAll, spendable, savings, investment };
  }, [wallets]);

  // Filtered Wallets
  const filteredWallets = React.useMemo(() => {
    return wallets.filter((w) => {
      const matchTab =
        activeTab === "all" ? true : w.category === activeTab;
      const matchSearch =
        searchQuery.trim() === "" ||
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [wallets, activeTab, searchQuery]);

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Nama kantong wajib diisi");
      return;
    }

    const cleanAmount = parseInt(newBalance.replace(/\D/g, "") || "0", 10);

    const created: PocketWallet = {
      id: "wallet-" + Date.now(),
      name: newName.trim(),
      provider: newProvider,
      category: newCategory,
      emoji: newEmoji,
      balance: cleanAmount,
      accountNumber: newAccountNum.trim() || undefined,
      theme: newTheme,
      createdAt: Date.now(),
    };

    const nextList = [created, ...wallets];
    saveWallets(nextList);

    toast.success(`Kantong "${created.name}" berhasil dibuat! ✨`, {
      description: `Saldo awal: Rp ${cleanAmount.toLocaleString("id-ID")}`,
    });

    // Reset form
    setNewName("");
    setNewBalance("");
    setNewAccountNum("");
    setIsAddModalOpen(false);
  };

  const handleQuickTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWalletForTransfer) return;
    if (!targetWalletId) {
      toast.error("Pilih kantong tujuan transfer");
      return;
    }
    if (targetWalletId === selectedWalletForTransfer.id) {
      toast.error("Kantong tujuan tidak boleh sama dengan sumber");
      return;
    }

    const amount = parseInt(transferAmount.replace(/\D/g, "") || "0", 10);
    if (amount <= 0) {
      toast.error("Nominal transfer harus lebih dari Rp 0");
      return;
    }
    if (amount > selectedWalletForTransfer.balance) {
      toast.error("Saldo kantong sumber tidak mencukupi!");
      return;
    }

    const updated = wallets.map((w) => {
      if (w.id === selectedWalletForTransfer.id) {
        return { ...w, balance: w.balance - amount };
      }
      if (w.id === targetWalletId) {
        return { ...w, balance: w.balance + amount };
      }
      return w;
    });

    saveWallets(updated);
    const targetWallet = wallets.find((w) => w.id === targetWalletId);

    toast.success(`Berhasil pindah dana Rp ${amount.toLocaleString("id-ID")}! ⚡`, {
      description: `Dari ${selectedWalletForTransfer.name} ke ${targetWallet?.name}`,
    });

    setIsTransferModalOpen(false);
    setSelectedWalletForTransfer(null);
    setTransferAmount("");
  };

  const openTransferFor = (wallet: PocketWallet) => {
    setSelectedWalletForTransfer(wallet);
    const other = wallets.find((w) => w.id !== wallet.id);
    setTargetWalletId(other ? other.id : "");
    setIsTransferModalOpen(true);
  };

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6 pb-40 md:pb-16 max-w-4xl mx-auto">
      {/* 1. Header Kantong Duit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
              Kantong Duit ✨
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Pisahin uang jajan, tabungan, dan dana darurat biar ga kecampur.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto h-10 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Bikin Kantong Baru</span>
        </button>
      </div>

      {/* 2. Cockpit Kartu Total Seluruh Kantong */}
      <div className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-7 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.3)] space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Total Seluruh Kantong
          </span>
          <button
            type="button"
            onClick={toggleBalance}
            title={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-zinc-900 active:scale-90 cursor-pointer"
          >
            {showBalance ? (
              <EyeOff className="h-4 w-4 stroke-[1.8]" />
            ) : (
              <Eye className="h-4 w-4 text-emerald-400 stroke-[1.8]" />
            )}
          </button>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden">
            {showBalance ? (
              <>
                <span className="text-lg sm:text-xl font-bold text-zinc-400 select-none shrink-0">
                  Rp
                </span>
                <span
                  className="font-black tracking-tight text-white tabular-nums leading-none"
                  style={{ fontSize: "clamp(2rem, 6.5vw, 3rem)", lineHeight: 1.1 }}
                >
                  {totals.totalAll.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span
                className="font-black tracking-widest text-zinc-500 select-none leading-none"
                style={{ fontSize: "clamp(1.5rem, 5.5vw, 2.25rem)", lineHeight: 1.1 }}
              >
                ••••••••••••
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-2 font-medium">
            Terbagi di {wallets.length} kantong aktif ⚡
          </p>
        </div>

        {/* Alokasi Cepat: Siap Pakai vs Tabungan */}
        <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
              <span>☕</span>
              <span>Siap Pakai</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-emerald-400 tabular-nums truncate">
              {showBalance ? formatRupiah(totals.spendable) : "••••"}
            </p>
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
              <span>🎯</span>
              <span>Tabungan</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-zinc-200 tabular-nums truncate">
              {showBalance ? formatRupiah(totals.savings) : "••••"}
            </p>
          </div>

          <div className="space-y-0.5 min-w-0 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
              <span>📈</span>
              <span>Investasi</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-zinc-400 tabular-nums truncate">
              {showBalance ? formatRupiah(totals.investment) : "••••"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filter Kategori & Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* iOS Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95",
              activeTab === "all"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 font-medium"
            )}
          >
            Semua ({wallets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("spendable")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95",
              activeTab === "spendable"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 font-medium"
            )}
          >
            Siap Pakai ☕
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("savings")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95",
              activeTab === "savings"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 font-medium"
            )}
          >
            Tabungan 🎯
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("investment")}
            className={cn(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95",
              activeTab === "investment"
                ? "bg-white text-zinc-950 font-bold shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 font-medium"
            )}
          >
            Investasi 📈
          </button>
        </div>

        {/* Search Bar Minimalis */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari kantong..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full sm:w-48 pl-8 pr-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950"
          />
        </div>
      </div>

      {/* 4. Grid Kartu Kantong (Fintech Style ala Apple Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredWallets.map((wallet) => {
          const isBca = wallet.provider === "bca";
          const isSavings = wallet.category === "savings";

          return (
            <div
              key={wallet.id}
              className={cn(
                "group relative p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md",
                wallet.theme === "blue" || isBca
                  ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#002D54] text-white border-zinc-800"
                  : wallet.theme === "amber"
                  ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#3D2500] text-white border-zinc-800"
                  : wallet.theme === "cyan"
                  ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#003847] text-white border-zinc-800"
                  : "bg-zinc-950 text-white border-zinc-800"
              )}
            >
              {/* Header Kartu: Emoji + Nama + Logo Resmi Bank */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-lg select-none">
                    {wallet.emoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1">
                      {wallet.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      {wallet.category === "spendable"
                        ? "Siap Pakai"
                        : wallet.category === "savings"
                        ? "Tabungan Terkunci"
                        : "Investasi"}
                    </p>
                  </div>
                </div>

                {/* Logo Resmi Bank / Provider */}
                <div className="flex items-center h-7 px-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                  {wallet.provider === "cash" ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-200">
                      <Banknote className="h-3.5 w-3.5" />
                      <span>TUNAI</span>
                    </div>
                  ) : (
                    <BankBrandLogo
                      code={wallet.provider}
                      className="h-4 w-auto text-white"
                      monochrome={false}
                    />
                  )}
                </div>
              </div>

              {/* Saldo Kartu */}
              <div className="my-5">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Saldo Kantong
                </p>
                <p
                  className="font-extrabold text-white tracking-tight tabular-nums mt-0.5"
                  style={{ fontSize: "clamp(1.4rem, 4vw, 1.85rem)" }}
                >
                  {showBalance ? formatRupiah(wallet.balance) : "••••••••••••"}
                </p>
              </div>

              {/* Footer Kartu: Nomor Akun & Quick Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono">
                  {wallet.accountNumber || "Kantong Digital"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openTransferFor(wallet)}
                    title="Pindah saldo ke kantong lain"
                    className="h-7 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-90 text-[11px] font-bold text-white flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                    <span>Pindah</span>
                  </button>
                </div>
              </div>

              {/* Visual Decorative Chip Indicator */}
              {isSavings && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5 text-amber-400/80" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredWallets.length === 0 && (
        <div className="p-10 rounded-3xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 text-xl">
            👀
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-zinc-900">
              Ga nemu kantong yang dicari
            </p>
            <p className="text-xs text-zinc-500">
              Coba ganti kata kunci atau pilih kategori lain.
            </p>
          </div>
        </div>
      )}

      {/* 5. MODAL PROTOTYPE: BIKIN KANTONG BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black text-zinc-950">
                  Bikin Kantong Baru 🚀
                </h3>
                <p className="text-xs text-zinc-500">
                  Pisahin pos keuanganmu biar disiplin dan rapi.
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

            <form onSubmit={handleCreateWallet} className="space-y-4">
              {/* 1. Pilih Bank / Provider Resmi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Pilih Bank / Dompet Resmi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BANK_PROVIDERS.map((provider) => {
                    const isSelected = newProvider === provider.code;
                    return (
                      <button
                        key={provider.code}
                        type="button"
                        onClick={() => {
                          setNewProvider(provider.code);
                          if (provider.code === "bca") setNewTheme("blue");
                          else if (provider.code === "jago") setNewTheme("amber");
                          else if (provider.code === "gopay") setNewTheme("cyan");
                        }}
                        className={cn(
                          "p-2.5 rounded-2xl border text-left flex flex-col justify-between h-18 transition-all cursor-pointer active:scale-95",
                          isSelected
                            ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                            : "border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-800"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {provider.type}
                          </span>
                        </div>
                        <div className="pt-1">
                          {provider.code === "cash" ? (
                            <span className="text-xs font-bold">💵 Kas Fisik</span>
                          ) : (
                            <BankBrandLogo
                              code={provider.code}
                              className="h-4 w-auto"
                              monochrome={isSelected}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Nama Kantong */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Nama Kantong
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: BCA Jajan Kopi, Tabungan Liburan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              {/* 3. Kategori Duit (Gen Z Functional Division) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Fungsi Duit
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory("spendable")}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95",
                      newCategory === "spendable"
                        ? "border-zinc-950 bg-zinc-950 text-white font-bold"
                        : "border-zinc-200 bg-white text-zinc-700 font-medium"
                    )}
                  >
                    <p className="text-sm">☕</p>
                    <p className="text-[11px] mt-0.5">Siap Pakai</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCategory("savings")}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95",
                      newCategory === "savings"
                        ? "border-zinc-950 bg-zinc-950 text-white font-bold"
                        : "border-zinc-200 bg-white text-zinc-700 font-medium"
                    )}
                  >
                    <p className="text-sm">🎯</p>
                    <p className="text-[11px] mt-0.5">Tabungan</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCategory("investment")}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95",
                      newCategory === "investment"
                        ? "border-zinc-950 bg-zinc-950 text-white font-bold"
                        : "border-zinc-200 bg-white text-zinc-700 font-medium"
                    )}
                  >
                    <p className="text-sm">📈</p>
                    <p className="text-[11px] mt-0.5">Investasi</p>
                  </button>
                </div>
              </div>

              {/* 4. Pilih Emoji iOS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Pilih Emoji Kantong
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewEmoji(emoji)}
                      className={cn(
                        "h-9 w-9 shrink-0 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer active:scale-90",
                        newEmoji === emoji
                          ? "bg-zinc-950 text-white scale-105 shadow-2xs"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Saldo Awal & Nomor Rekening Opsional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Saldo Awal (Rp)
                  </label>
                  <input
                    type="text"
                    placeholder="Rp 0"
                    value={newBalance}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      if (!digits) setNewBalance("");
                      else setNewBalance(parseInt(digits, 10).toLocaleString("id-ID"));
                    }}
                    className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Nomor Akun / Kartu (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: •••• 1234"
                    value={newAccountNum}
                    onChange={(e) => setNewAccountNum(e.target.value)}
                    className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Simpan Kantong Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL PROTOTYPE: OPER DUIT / PINDAH SALDO ANTAR KANTONG */}
      {isTransferModalOpen && selectedWalletForTransfer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black text-zinc-950">
                  Oper Duit Antar Kantong ⚡
                </h3>
                <p className="text-xs text-zinc-500">
                  Pindah saldo tanpa biaya admin internal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center cursor-pointer active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleQuickTransfer} className="space-y-4">
              {/* Sumber Duit */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Dari Kantong Sumber
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{selectedWalletForTransfer.emoji}</span>
                    <span className="text-xs font-bold text-zinc-950">
                      {selectedWalletForTransfer.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-600">
                    Sisa: {formatRupiah(selectedWalletForTransfer.balance)}
                  </span>
                </div>
              </div>

              {/* Tujuan Duit */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Ke Kantong Tujuan
                </label>
                <select
                  value={targetWalletId}
                  onChange={(e) => setTargetWalletId(e.target.value)}
                  className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 bg-white"
                >
                  <option value="" disabled>
                    Pilih kantong tujuan...
                  </option>
                  {wallets
                    .filter((w) => w.id !== selectedWalletForTransfer.id)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.emoji} {w.name} ({formatRupiah(w.balance)})
                      </option>
                    ))}
                </select>
              </div>

              {/* Nominal Transfer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Nominal Duit yang Dipindah (Rp)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rp 0"
                  value={transferAmount}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (!digits) setTransferAmount("");
                    else setTransferAmount(parseInt(digits, 10).toLocaleString("id-ID"));
                  }}
                  className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              {/* Submit Transfer */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>Kirim Pindah Saldo Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

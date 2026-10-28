"use client";

import * as React from "react";
import {
  Plus,
  Eye,
  EyeOff,
  ArrowLeftRight,
  Sparkles,
  Lock,
  Unlock,
  X,
  Search,
  Wifi,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BankBrandLogo, BankCardBadge } from "@/components/ui/bank-logos";
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
  holderName?: string | undefined;
  isLocked?: boolean | undefined;
  createdAt: number;
}

export const DEFAULT_WALLETS: PocketWallet[] = [
  {
    id: "wallet-bca-1",
    name: "BCA Tahapan Prioritas",
    provider: "bca",
    category: "spendable",
    emoji: "💳",
    balance: 8750000,
    accountNumber: "5241 •••• •••• 8912",
    holderName: "SURYA PRATAMA",
    isLocked: false,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: "wallet-jago-1",
    name: "Jago Dana Darurat Santai",
    provider: "jago",
    category: "savings",
    emoji: "🎯",
    balance: 15000000,
    accountNumber: "1029 •••• •••• 4410",
    holderName: "SURYA PRATAMA",
    isLocked: true,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    id: "wallet-gopay-1",
    name: "GoPay Jajan & Kopi",
    provider: "gopay",
    category: "spendable",
    emoji: "☕",
    balance: 450000,
    accountNumber: "0812 •••• 8992",
    holderName: "SURYA PRATAMA",
    isLocked: false,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    id: "wallet-cash-1",
    name: "Kas Tunai di Dompet",
    provider: "cash",
    category: "spendable",
    emoji: "💵",
    balance: 300000,
    accountNumber: "Uang Fisik Saku",
    holderName: "SURYA PRATAMA",
    isLocked: false,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
];

const STORAGE_KEY = "tamawallet_prototype_wallets_v2";

const BANK_PROVIDERS = [
  { code: "bca", name: "BCA", label: "Bank BCA" },
  { code: "mandiri", name: "Mandiri", label: "Bank Mandiri" },
  { code: "jago", name: "Bank Jago", label: "Bank Jago" },
  { code: "bri", name: "BRI", label: "Bank BRI" },
  { code: "bni", name: "BNI", label: "Bank BNI" },
  { code: "gopay", name: "GoPay", label: "GoPay" },
  { code: "ovo", name: "OVO", label: "OVO" },
  { code: "dana", name: "DANA", label: "DANA" },
  { code: "shopeepay", name: "ShopeePay", label: "ShopeePay" },
  { code: "cash", name: "Kas Tunai", label: "Kas Tunai" },
];

const EMOJI_OPTIONS = ["💳", "☕", "🎯", "🛵", "🍕", "✈️", "🏠", "💻", "🎁", "💎", "🍿", "🍣", "👕", "🚗"];

export function WalletsView({ initialUser }: WalletsViewProps) {
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

  React.useEffect(() => {
    const handleVis = () => {
      setShowBalance(getCachedShowBalance());
    };
    window.addEventListener("tamawallet:balance-visibility", handleVis);
    return () => window.removeEventListener("tamawallet:balance-visibility", handleVis);
  }, []);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = React.useState(false);
  const [selectedWallet, setSelectedWallet] = React.useState<PocketWallet | null>(null);

  // Form State for New Wallet
  const [newName, setNewName] = React.useState("");
  const [newProvider, setNewProvider] = React.useState("bca");
  const [newCategory, setNewCategory] = React.useState<"spendable" | "savings" | "investment">("spendable");
  const [newEmoji, setNewEmoji] = React.useState("💳");
  const [newBalance, setNewBalance] = React.useState("");
  const [newAccountNum, setNewAccountNum] = React.useState("");

  // Form State for Transfer
  const [targetWalletId, setTargetWalletId] = React.useState<string>("");
  const [transferAmount, setTransferAmount] = React.useState<string>("");

  // Form State for Top Up
  const [topUpAmount, setTopUpAmount] = React.useState<string>("");

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
    window.dispatchEvent(new CustomEvent("tamawallet:balance-visibility"));
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

  const defaultHolder =
    initialUser?.user_metadata?.full_name?.toUpperCase() ||
    initialUser?.email?.split("@")[0]?.toUpperCase() ||
    "SURYA PRATAMA";

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
      accountNumber: newAccountNum.trim() || `${Math.floor(1000 + Math.random() * 9000)} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      holderName: defaultHolder,
      isLocked: newCategory === "savings",
      createdAt: Date.now(),
    };

    const nextList = [created, ...wallets];
    saveWallets(nextList);

    toast.success(`Kartu "${created.name}" resmi dibuat! 🎉`, {
      description: `Saldo awal: Rp ${cleanAmount.toLocaleString("id-ID")}`,
    });

    setNewName("");
    setNewBalance("");
    setNewAccountNum("");
    setIsAddModalOpen(false);
  };

  const handleQuickTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    if (!targetWalletId) {
      toast.error("Pilih kantong tujuan transfer");
      return;
    }
    if (targetWalletId === selectedWallet.id) {
      toast.error("Kantong tujuan tidak boleh sama dengan sumber");
      return;
    }

    const amount = parseInt(transferAmount.replace(/\D/g, "") || "0", 10);
    if (amount <= 0) {
      toast.error("Nominal transfer harus lebih dari Rp 0");
      return;
    }
    if (amount > selectedWallet.balance) {
      toast.error("Saldo kantong sumber tidak mencukupi!");
      return;
    }

    const updated = wallets.map((w) => {
      if (w.id === selectedWallet.id) {
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
      description: `Dari ${selectedWallet.name} ke ${targetWallet?.name}`,
    });

    setIsTransferModalOpen(false);
    setSelectedWallet(null);
    setTransferAmount("");
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;

    const amount = parseInt(topUpAmount.replace(/\D/g, "") || "0", 10);
    if (amount <= 0) {
      toast.error("Nominal isi saldo harus lebih dari Rp 0");
      return;
    }

    const updated = wallets.map((w) => {
      if (w.id === selectedWallet.id) {
        return { ...w, balance: w.balance + amount };
      }
      return w;
    });

    saveWallets(updated);

    toast.success(`Isi saldo berhasil! + Rp ${amount.toLocaleString("id-ID")} 🎉`, {
      description: `Saldo ${selectedWallet.name} sekarang: Rp ${(selectedWallet.balance + amount).toLocaleString("id-ID")}`,
    });

    setIsTopUpModalOpen(false);
    setSelectedWallet(null);
    setTopUpAmount("");
  };

  const toggleLockWallet = (walletId: string, currentLocked: boolean | undefined) => {
    const updated = wallets.map((w) => {
      if (w.id === walletId) {
        return { ...w, isLocked: !currentLocked };
      }
      return w;
    });
    saveWallets(updated);
    if (!currentLocked) {
      toast("Kantong dikunci 🔒", {
        description: "Saldo aman terkunci, tidak bisa ditarik jajan sembarangan.",
      });
    } else {
      toast.success("Kantong dibuka 🔓", {
        description: "Saldo siap digunakan kembali.",
      });
    }
  };

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-4xl mx-auto animate-page-enter">
      {/* 1. Header Kantong Duit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
            Kantong Duit 💰
          </h1>
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

      {/* 2. Cockpit Kartu Total Seluruh Kantong + Dopamine Allocation Bar */}
      <div className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] space-y-5 card-tactile">
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
            Terbagi rapi di {wallets.length} pos keuangan aktif ⚡
          </p>
        </div>

        {/* Visual Dopamine Allocation Progress Bar */}
        {totals.totalAll > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 w-full rounded-full bg-zinc-900 overflow-hidden flex shadow-inner">
              {wallets.map((w, idx) => {
                const pct = (w.balance / totals.totalAll) * 100;
                if (pct <= 0) return null;
                const colors = [
                  "bg-blue-500",
                  "bg-amber-400",
                  "bg-cyan-400",
                  "bg-emerald-400",
                  "bg-purple-400",
                ];
                const barColor =
                  w.provider === "bca"
                    ? "bg-[#0060AF]"
                    : w.provider === "jago"
                    ? "bg-[#FF9E00]"
                    : w.provider === "gopay"
                    ? "bg-[#00AED6]"
                    : colors[idx % colors.length];

                return (
                  <div
                    key={w.id}
                    title={`${w.name}: ${pct.toFixed(1)}%`}
                    style={{ width: `${pct}%` }}
                    className={`${barColor} h-full transition-all duration-500`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium pt-1">
              <span>Siap Pakai: {formatRupiah(totals.spendable)}</span>
              <span>Tabungan: {formatRupiah(totals.savings)}</span>
            </div>
          </div>
        )}
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

        {/* Search Bar */}
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

      {/* 4. Grid Kartu Fisik Mewah ala Apple Card & Bank Jago (KLIMAKS, Rapi & Lega) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {filteredWallets.map((wallet) => {
          const isBca = wallet.provider === "bca";
          const isJago = wallet.provider === "jago";
          const isGopay = wallet.provider === "gopay";
          const isMandiri = wallet.provider === "mandiri";
          const isCash = wallet.provider === "cash";

          // Skema visual kartu super klimaks
          let cardBg =
            "bg-gradient-to-br from-[#18181B] via-[#0F0F12] to-[#09090B] border-zinc-800 text-white shadow-xl";

          if (isBca) {
            // BCA Royal Sapphire Metallic
            cardBg =
              "bg-gradient-to-br from-[#003B73] via-[#002244] to-[#001428] border-[#004B87]/50 text-white shadow-[0_18px_40px_-10px_rgba(0,60,175,0.4)]";
          } else if (isJago) {
            // Jago Sunny Amber Metallic
            cardBg =
              "bg-gradient-to-br from-[#4A2600] via-[#261300] to-[#120900] border-amber-500/40 text-white shadow-[0_18px_40px_-10px_rgba(255,158,0,0.3)]";
          } else if (isGopay) {
            // GoPay Cyber Cyan Metallic
            cardBg =
              "bg-gradient-to-br from-[#003847] via-[#001E26] to-[#000E12] border-cyan-500/40 text-white shadow-[0_18px_40px_-10px_rgba(0,174,214,0.3)]";
          } else if (isMandiri) {
            // Mandiri Deep Blue Navy
            cardBg =
              "bg-gradient-to-br from-[#002D54] via-[#00172D] to-[#000A14] border-amber-400/40 text-white shadow-[0_18px_40px_-10px_rgba(253,184,19,0.25)]";
          } else if (isCash) {
            // Kas Tunai Deep Emerald
            cardBg =
              "bg-gradient-to-br from-[#05331C] via-[#031C0F] to-[#010D07] border-emerald-500/40 text-white shadow-[0_18px_40px_-10px_rgba(16,185,129,0.25)]";
          }

          return (
            <div
              key={wallet.id}
              className={cn(
                "group relative p-5 sm:p-6 rounded-[28px] border flex flex-col justify-between overflow-hidden shadow-md transform-gpu will-change-transform",
                cardBg
              )}
            >
              {/* Iridescent Light Sheen Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-70" />

              {/* Baris 1: Header Kartu (Logo & Judul) */}
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl select-none shadow-xs border border-white/15">
                    {wallet.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold tracking-tight text-white leading-snug break-normal">
                      {wallet.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span className="text-[10px] text-zinc-300 font-semibold uppercase tracking-wider whitespace-nowrap">
                        {isBca ? "PASSPORT BCA" : isJago ? "KARTU JAGO" : isGopay ? "GOPAY PLUS" : "DEBIT CARD"}
                      </span>
                      {wallet.isLocked && (
                        <span className="text-[10px] font-bold text-amber-300 shrink-0 flex items-center gap-0.5 whitespace-nowrap">
                          • Kunci 🔒
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* LOGO RESMI BANK (100% Terlihat Jelas di Platter Putih) */}
                <div className="shrink-0 pt-0.5">
                  <BankCardBadge provider={wallet.provider} />
                </div>
              </div>

              {/* Baris 2: EMV Chip + NFC Contactless */}
              <div className="relative z-10 flex items-center gap-3 my-3">
                <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-300 via-amber-100 to-amber-400 border border-amber-400/80 shadow-xs relative overflow-hidden flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 border border-amber-600/30 m-0.5 rounded-xs" />
                  <div className="h-full w-[1px] bg-amber-600/40" />
                  <div className="w-full h-[1px] bg-amber-600/40 absolute" />
                </div>
                <Wifi className="h-4 w-4 text-white/60 rotate-90 shrink-0" />
              </div>

              {/* Baris 3: Saldo Aktif */}
              <div className="relative z-10 my-1">
                <p className="text-[10px] text-zinc-300 uppercase tracking-widest font-semibold">
                  Saldo Aktif
                </p>
                <p
                  className="font-black text-white tracking-tight tabular-nums mt-0.5 leading-none truncate"
                  style={{ fontSize: "clamp(1.5rem, 5vw, 1.85rem)" }}
                >
                  {showBalance ? formatRupiah(wallet.balance) : "••••••••••••"}
                </p>
              </div>

              {/* Baris 4: Nomor Kartu & Pemilik (FULL WIDTH - Rapi & Anti-Wrap) */}
              <div className="relative z-10 pt-3 mt-1 border-t border-white/15 flex items-center justify-between gap-2">
                <span className="font-mono tracking-widest text-zinc-200 text-xs sm:text-sm whitespace-nowrap">
                  {wallet.accountNumber || "5241 •••• •••• 8912"}
                </span>
                <span className="text-[10px] tracking-wider text-zinc-300 uppercase font-bold truncate">
                  {wallet.holderName || defaultHolder}
                </span>
              </div>

              {/* Baris 5: Action Buttons (DEDICATED 3-COLUMN ROW - PAS DI HP & TIDAK CRUSH NOMOR) */}
              <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWallet(wallet);
                    setIsTopUpModalOpen(true);
                  }}
                  className="h-8.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-transform duration-100 cursor-pointer border border-white/10"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Top Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedWallet(wallet);
                    const other = wallets.find((w) => w.id !== wallet.id);
                    setTargetWalletId(other ? other.id : "");
                    setIsTransferModalOpen(true);
                  }}
                  className="h-8.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-transform duration-100 cursor-pointer border border-white/10"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Pindah</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLockWallet(wallet.id, wallet.isLocked)}
                  className="h-8.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-transform duration-100 cursor-pointer border border-white/10"
                >
                  {wallet.isLocked ? (
                    <>
                      <Lock className="h-3.5 w-3.5 text-amber-300" />
                      <span className="text-amber-200">Kunci</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3.5 w-3.5 text-zinc-300" />
                      <span>Buka</span>
                    </>
                  )}
                </button>
              </div>
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
                  Pilih bank atau dompet digital resmi untuk kantong baru.
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
              {/* 1. Pilih Bank / Provider Resmi dengan Logo Asli */}
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
                        onClick={() => setNewProvider(provider.code)}
                        className={cn(
                          "p-3 rounded-2xl border text-left flex flex-col justify-between h-19 transition-all cursor-pointer active:scale-95",
                          isSelected
                            ? "border-zinc-950 bg-zinc-950 text-white shadow-md ring-2 ring-zinc-950 ring-offset-1"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800"
                        )}
                      >
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          {provider.label}
                        </span>
                        <div className="pt-1">
                          {provider.code === "cash" ? (
                            <span className="text-xs font-black">💵 Kas Fisik</span>
                          ) : (
                            <BankBrandLogo
                              code={provider.code}
                              className="h-4.5 w-auto"
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
                  className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-medium"
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
      {isTransferModalOpen && selectedWallet && (
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
                    <span className="text-base">{selectedWallet.emoji}</span>
                    <span className="text-xs font-bold text-zinc-950">
                      {selectedWallet.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-600">
                    Sisa: {formatRupiah(selectedWallet.balance)}
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
                    .filter((w) => w.id !== selectedWallet.id)
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

      {/* 7. MODAL PROTOTYPE: TOP UP / ISI SALDO */}
      {isTopUpModalOpen && selectedWallet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-black text-zinc-950">
                  Isi Saldo Kantong 💵
                </h3>
                <p className="text-xs text-zinc-500">
                  Simulasi deposit saldo ke {selectedWallet.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center cursor-pointer active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Tujuan Pengisian
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{selectedWallet.emoji}</span>
                    <span className="text-xs font-bold text-zinc-950">
                      {selectedWallet.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-600">
                    Saldo Saat Ini: {formatRupiah(selectedWallet.balance)}
                  </span>
                </div>
              </div>

              {/* Nominal Top Up */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Nominal Tambah Saldo (Rp)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rp 0"
                  value={topUpAmount}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (!digits) setTopUpAmount("");
                    else setTopUpAmount(parseInt(digits, 10).toLocaleString("id-ID"));
                  }}
                  className="h-10 w-full px-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              {/* Quick Nominal Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[100000, 250000, 500000, 1000000, 2000000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setTopUpAmount(quick.toLocaleString("id-ID"))}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[11px] font-bold text-zinc-800 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    +Rp {(quick / 1000).toLocaleString("id-ID")}rb
                  </button>
                ))}
              </div>

              {/* Submit Top Up */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Tambahkan ke Saldo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

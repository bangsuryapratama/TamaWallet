"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ShieldCheck,
  Banknote,
  Mail,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Pencil,
  Coins,
  Hash,
  X,
  AlertTriangle,
  Wallet as WalletIcon,
  ArrowLeftRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  getCachedShowBalance,
  setCachedShowBalance,
  clearCachedUser,
} from "@/lib/auth-cache";
import {
  getStoredTransactions,
  formatRupiah,
  resetPrototypeData,
  PrototypeTransaction,
} from "@/lib/transactions-store";
import {
  MiniWallet,
  getStoredWallets,
} from "@/components/modals/quick-transaction-modal";

const AVATAR_OPTIONS = [
  "⚡",
  "🕶️",
  "👑",
  "🚀",
  "🐱",
  "💎",
  "☕",
  "🔥",
  "💸",
  "🎧",
  "🦁",
  "🎮",
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Privasi Saldo State
  const [showBalance, setShowBalance] = React.useState<boolean>(() =>
    getCachedShowBalance()
  );

  // Live Micro-Stats State
  const [wallets, setWallets] = React.useState<MiniWallet[]>(() =>
    getStoredWallets()
  );
  const [transactions, setTransactions] = React.useState<PrototypeTransaction[]>(
    () => getStoredTransactions()
  );

  // Custom User Profile State (Local Customization)
  const [displayName, setDisplayName] = React.useState<string>("Surya Pratama");
  const [avatarEmoji, setAvatarEmoji] = React.useState<string>("⚡");
  const [copiedId, setCopiedId] = React.useState(false);

  // Modals State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = React.useState(false);
  const [tempName, setTempName] = React.useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);

  // Initialize Auth & Custom Local Data
  React.useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser(user);
          const savedName = localStorage.getItem("tamawallet_user_display_name");
          if (savedName) {
            setDisplayName(savedName);
          } else {
            const fallbackName =
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Surya Pratama";
            setDisplayName(
              fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1)
            );
          }
        }
      });
    }

    if (typeof window !== "undefined") {
      const savedEmoji = localStorage.getItem("tamawallet_user_avatar");
      if (savedEmoji) setAvatarEmoji(savedEmoji);
      const savedName = localStorage.getItem("tamawallet_user_display_name");
      if (savedName) setDisplayName(savedName);
    }
  }, []);

  // Listen to Global Sync Events
  React.useEffect(() => {
    const handleSync = () => {
      setWallets(getStoredWallets());
      setTransactions(getStoredTransactions());
    };
    const handleVis = () => {
      setShowBalance(getCachedShowBalance());
    };

    window.addEventListener("tamawallet:tx-updated", handleSync);
    window.addEventListener("tamawallet:balance-visibility", handleVis);
    return () => {
      window.removeEventListener("tamawallet:tx-updated", handleSync);
      window.removeEventListener("tamawallet:balance-visibility", handleVis);
    };
  }, []);

  // Calculate Total Net Assets
  const totalBalance = React.useMemo(() => {
    return wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  }, [wallets]);

  // UID Generator
  const userIdDisplay = React.useMemo(() => {
    if (user?.id) {
      return `usr_${user.id.replace(/-/g, "").slice(0, 10)}`;
    }
    return "usr_tamawallet_id";
  }, [user]);

  // Handler Copy User ID
  const handleCopyId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(userIdDisplay);
      setCopiedId(true);
      toast.success("User ID disalin ke clipboard! 📋");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Handler Toggle Privacy
  const handleTogglePrivacy = () => {
    const next = !showBalance;
    setShowBalance(next);
    setCachedShowBalance(next);
    window.dispatchEvent(new CustomEvent("tamawallet:balance-visibility"));
    if (next) {
      toast.success("Mode privasi dinonaktifkan (Saldo terlihat)", {
        duration: 1500,
      });
    } else {
      toast("Mode privasi aktif (Saldo disensor) 🔒", {
        duration: 1500,
      });
    }
  };

  // Handler Select Avatar
  const handleSelectAvatar = (emoji: string) => {
    setAvatarEmoji(emoji);
    if (typeof window !== "undefined") {
      localStorage.setItem("tamawallet_user_avatar", emoji);
    }
    setIsAvatarModalOpen(false);
    toast.success("Avatar berhasil diperbarui! ✨");
  };

  // Handler Save Name
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    const clean = tempName.trim();
    setDisplayName(clean);
    if (typeof window !== "undefined") {
      localStorage.setItem("tamawallet_user_display_name", clean);
    }
    setIsNameModalOpen(false);
    toast.success("Nama profil berhasil disimpan! 👍");
  };

  // Handler Export JSON
  const handleExportJSON = () => {
    const exportData = {
      app: "TamaWallet",
      version: "1.0.4",
      exportedAt: new Date().toISOString(),
      user: {
        id: userIdDisplay,
        displayName,
        email: user?.email || "guest@tamawallet.id",
      },
      wallets,
      transactions,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `tamawallet-backup-${today}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File cadangan .json berhasil diunduh! 📦");
  };

  // Handler Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Tanggal",
      "Tipe",
      "Kategori",
      "Dompet Sumber",
      "Dompet Tujuan",
      "Keterangan",
      "Nominal (IDR)",
    ];

    const rows = transactions.map((tx) => [
      `"${tx.id}"`,
      `"${new Date(tx.createdAt).toLocaleString("id-ID")}"`,
      `"${tx.type.toUpperCase()}"`,
      `"${tx.category}"`,
      `"${tx.walletName}"`,
      `"${tx.targetWalletName || "-"}"`,
      `"${(tx.description || "").replace(/"/g, '""')}"`,
      tx.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tamawallet-transaksi-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("File mutasi transaksi .csv berhasil diunduh! 📊");
  };

  // Handler Reset Demo Data
  const handleConfirmReset = () => {
    resetPrototypeData();
    setWallets(getStoredWallets());
    setTransactions(getStoredTransactions());
    setIsResetConfirmOpen(false);
    toast.success("Data prototype berhasil dikembalikan ke setelan awal pabrik! 🔄");
  };

  // Handler Sign Out
  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      clearCachedUser();
      toast.success("Sesi berakhir", {
        description: "Anda telah berhasil keluar dari akun.",
      });
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar", {
        description: "Terjadi kesalahan saat mengakhiri sesi.",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-2xl mx-auto animate-page-enter">
      {/* 1. Header Top Bersih */}
      <div className="pt-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
          Profil & Preferensi
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Kelola identitas, privasi tampilan, dan utilitas data akun
        </p>
      </div>

      {/* 2. Hero Bento Profile Card: Obsidian Dark Luxury (Apple ID style) */}
      <div className="relative p-6 sm:p-7 rounded-[30px] bg-gradient-to-br from-[#18181B] via-[#0E0E11] to-[#050507] text-white border border-zinc-800 shadow-xl overflow-hidden transform-gpu will-change-transform card-tactile">
        {/* Glow Sheen */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 space-y-5">
          {/* Identity Row */}
          <div className="flex items-center gap-4">
            {/* Tactile Squircle Avatar */}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Ganti Avatar"
              className="relative group flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-md text-3xl transition-transform active:scale-90 cursor-pointer hover:border-zinc-500"
            >
              <span>{avatarEmoji}</span>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-700">
                <Pencil className="h-2.5 w-2.5" />
              </div>
            </button>

            {/* User Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                  {displayName}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(displayName);
                    setIsNameModalOpen(true);
                  }}
                  title="Ubah Nama Tampilan"
                  className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate">
                {user?.email || "surya@tamawallet.id"}
              </p>

              {/* UID Pill with Copy */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
                >
                  <span>{userIdDisplay}</span>
                  {copiedId ? (
                    <Check className="h-2.5 w-2.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-2.5 w-2.5 text-zinc-400" />
                  )}
                </button>

                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sesi Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Stats Bar: Real Financial Metrics (NO CHEESY BADGES) */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-zinc-800/80">
            {/* Total Aset */}
            <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">
                <Coins className="h-3 w-3 text-emerald-400" />
                <span className="truncate">Total Aset</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white tabular-nums mt-1 truncate">
                {showBalance ? formatRupiah(totalBalance) : "••••••••"}
              </p>
            </div>

            {/* Kantong Terhubung */}
            <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">
                <WalletIcon className="h-3 w-3 text-cyan-400" />
                <span className="truncate">Kantong</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white tabular-nums mt-1 truncate">
                {wallets.length} Akun Aktif
              </p>
            </div>

            {/* Riwayat Mutasi */}
            <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">
                <ArrowLeftRight className="h-3 w-3 text-amber-400" />
                <span className="truncate">Riwayat</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white tabular-nums mt-1 truncate">
                {transactions.length} Catatan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grup Preferensi: Tampilan & Privasi Akun (Tactile Bento List) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Tampilan & Privasi Akun
        </h3>

        <div className="rounded-[24px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
          {/* Sensor Saldo (Privacy Toggle) */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  !showBalance
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {!showBalance ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Mode Privasi (Sensor Saldo)
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  {!showBalance
                    ? "Nominal saldo disensor menjadi titik (••••) di semua tab"
                    : "Nominal saldo ditampilkan secara terbuka"}
                </p>
              </div>
            </div>

            {/* Tactile iOS Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={!showBalance}
              onClick={handleTogglePrivacy}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                !showBalance ? "bg-zinc-950" : "bg-zinc-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  !showBalance ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Mata Uang Utama */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Banknote className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Mata Uang Acuan
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Basis kalkulasi buku kas & ringkasan surplus
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200/80">
              IDR (Rp)
            </span>
          </div>

          {/* Format Lokalisasi Angka */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Hash className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Pemisah Ribuan & Desimal
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Standar notasi finansial Indonesia
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700">
              Rp 1.000.000
            </span>
          </div>
        </div>
      </div>

      {/* 4. Grup Cadangan & Manajemen Data (Useful Utilities) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Cadangan & Manajemen Data
        </h3>

        <div className="rounded-[24px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
          {/* Ekspor JSON */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Download className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Ekspor Cadangan (.json)
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Unduh arsip lengkap kantong & seluruh mutasi
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh</span>
            </button>
          </div>

          {/* Ekspor CSV */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Laporan Arus Kas (.csv)
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Kompatibel Microsoft Excel & Google Sheets
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Unduh</span>
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Pulihkan Setelan Demo Awal
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Kembalikan saldo kantong & mutasi ke data pabrik
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Grup Keamanan & Sesi Server */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Keamanan & Sesi SSR
        </h3>

        <div className="rounded-[24px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
          {/* Supabase SSR Auth */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Otentikasi Supabase SSR
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Enkripsi token sesi dengan proteksi CSRF
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
              Aktif & Terlindungi
            </span>
          </div>

          {/* Email Terdaftar */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Email Akun Terdaftar
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">
                  {user?.email || "surya@tamawallet.id"}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">
              Terkonfirmasi
            </span>
          </div>
        </div>
      </div>

      {/* 6. Tombol Keluar & Versi Aplikasi */}
      <div className="pt-2 space-y-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="w-full p-4 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/90 text-rose-700 text-sm font-bold flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer disabled:opacity-50 shadow-2xs"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Mengakhiri sesi..." : "Keluar dari Akun (Sign Out)"}</span>
        </button>

        {/* Info Versi Aplikasi */}
        <p className="text-center text-[11px] text-zinc-400 font-mono">
          TamaWallet v1.0.4 • Turbo Next.js 14 • Gen Z Edition
        </p>
      </div>

      {/* MODAL 1: Ganti Avatar Emoji */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl border border-zinc-100 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Pilih Avatar Emoji
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Ekspresikan kepribadian profil Anda
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelectAvatar(emoji)}
                  className={`h-16 rounded-2xl text-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                    avatarEmoji === emoji
                      ? "bg-zinc-950 border-2 border-zinc-950 shadow-md scale-105"
                      : "bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80"
                  }`}
                >
                  <span>{emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ubah Nama Tampilan */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveName}
            className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl border border-zinc-100 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Ubah Nama Tampilan
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Nama yang muncul di sapaan dasbor
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNameModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Masukkan nama Anda..."
              autoFocus
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsNameModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Konfirmasi Reset Data Prototype */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  Reset Data Prototype?
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Kembalikan kantong dan mutasi demo
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-2xl border border-zinc-200/70">
              Aksi ini akan mengembalikan seluruh saldo kantong ke nilai default awal
              (BCA: Rp 8.750.000, Jago: Rp 15.000.000, dst) serta memulihkan riwayat
              transaksi dummy.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
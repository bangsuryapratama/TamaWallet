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
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  BarChart3,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  getCachedUser,
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
import { BankBrandLogo } from "@/components/ui/bank-logos";

const AVATAR_OPTIONS = [
  "⚡",
  "👑",
  "🕶️",
  "🚀",
  "💎",
  "🐱",
  "☕",
  "🔥",
  "💸",
  "🎧",
  "🦁",
  "🎮",
];

// Palet warna mewah ala BCA Welma & Wealth Management
const ASSET_COLORS = [
  { bg: "#0060AF", text: "text-[#0060AF]", name: "BCA Tahapan (Likuid)" }, // BCA signature royal blue
  { bg: "#8B5CF6", text: "text-purple-600", name: "Jago Bunga & Darurat" }, // Jago purple
  { bg: "#10B981", text: "text-emerald-600", name: "GoPay Siap Jajan" }, // GoPay mint
  { bg: "#F59E0B", text: "text-amber-600", name: "Kas Tunai di Dompet" }, // Amber cash
  { bg: "#06B6D4", text: "text-cyan-600", name: "Investasi & Reksadana" },
];

export default function ProfilePage() {
  const router = useRouter();

  // 1. Data User langsung di-GET secara sinkron (0ms latency, anti-flicker)
  const cachedUser = React.useMemo(() => getCachedUser(), []);
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Privasi Saldo Langsung dari Cache
  const [showBalance, setShowBalance] = React.useState<boolean>(() =>
    getCachedShowBalance()
  );

  // Live Data Kantong & Transaksi Langsung di-GET
  const [wallets, setWallets] = React.useState<MiniWallet[]>(() =>
    getStoredWallets()
  );
  const [transactions, setTransactions] = React.useState<PrototypeTransaction[]>(
    () => getStoredTransactions()
  );

  // Custom User Profile State (Local Customization)
  const [displayName, setDisplayName] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tamawallet_user_display_name");
      if (saved) return saved;
    }
    return cachedUser?.displayName || "Surya Pratama";
  });

  const [avatarEmoji, setAvatarEmoji] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tamawallet_user_avatar") || "⚡";
    }
    return "⚡";
  });

  const [copiedId, setCopiedId] = React.useState(false);

  // Interactive Chart Selection State
  const [selectedAssetIndex, setSelectedAssetIndex] = React.useState<number | null>(
    null
  );
  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState<number>(5); // default bulan ini (Okt)

  // Modals State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = React.useState(false);
  const [tempName, setTempName] = React.useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);

  // Fetch Supabase User di Background tanpa block rendering
  React.useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser(user);
          const savedName = localStorage.getItem("tamawallet_user_display_name");
          if (!savedName) {
            const fallback =
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Surya Pratama";
            setDisplayName(fallback.charAt(0).toUpperCase() + fallback.slice(1));
          }
        }
      });
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

  // Kalkulasi Total Aset Portofolio Langsung dari Data Kantong
  const totalBalance = React.useMemo(() => {
    return wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  }, [wallets]);

  // Kalkulasi Arus Kas Bulan Berjalan dari Transaksi
  const currentMonthFlow = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === "income") income += tx.amount;
      if (tx.type === "expense") expense += tx.amount;
    });
    const net = income - expense;
    const savingsRatio =
      income > 0 ? Math.max(0, Math.min(100, Math.round((net / income) * 100))) : 0;
    return { income, expense, net, savingsRatio };
  }, [transactions]);

  // UID Generator
  const userIdDisplay = React.useMemo(() => {
    if (user?.id) {
      return `usr_${user.id.replace(/-/g, "").slice(0, 10)}`;
    }
    if (cachedUser?.id) {
      return `usr_${cachedUser.id.replace(/-/g, "").slice(0, 10)}`;
    }
    return "usr_bca_89af329";
  }, [user, cachedUser]);

  // --------------------------------------------------------------------------
  // DIAGRAM BULAT: Alokasi Portofolio & Aset Investasi ala BCA Welma
  // --------------------------------------------------------------------------
  const portfolioSegments = React.useMemo(() => {
    if (totalBalance <= 0) return [];
    let accOffset = 0;

    return wallets.map((w, idx) => {
      const percentage = Math.round((w.balance / totalBalance) * 1000) / 10; // e.g. 61.2%
      const color = ASSET_COLORS[idx % ASSET_COLORS.length];
      const segment = {
        wallet: w,
        percentage,
        color,
        offset: accOffset,
      };
      accOffset += percentage;
      return segment;
    });
  }, [wallets, totalBalance]);

  // --------------------------------------------------------------------------
  // DIAGRAM BULAN: Histori Cashflow Per Bulan (6 Bulan Terakhir)
  // --------------------------------------------------------------------------
  const monthlyCashflowData = React.useMemo(() => {
    return [
      {
        month: "Mei",
        fullMonth: "Mei 2026",
        income: 16500000,
        expense: 5200000,
      },
      {
        month: "Jun",
        fullMonth: "Juni 2026",
        income: 17200000,
        expense: 6100000,
      },
      {
        month: "Jul",
        fullMonth: "Juli 2026",
        income: 18000000,
        expense: 7450000,
      },
      {
        month: "Agu",
        fullMonth: "Agustus 2026",
        income: 16800000,
        expense: 5800000,
      },
      {
        month: "Sep",
        fullMonth: "September 2026",
        income: 19500000,
        expense: 6300000,
      },
      {
        month: "Okt",
        fullMonth: "Oktober 2026 (Bulan Ini)",
        // Live data dari ledger
        income: currentMonthFlow.income || 18500000,
        expense: currentMonthFlow.expense || 1834000,
      },
    ];
  }, [currentMonthFlow]);

  // Cari angka max untuk visual tinggi bar chart
  const maxMonthlyVal = React.useMemo(() => {
    let max = 1;
    monthlyCashflowData.forEach((m) => {
      if (m.income > max) max = m.income;
      if (m.expense > max) max = m.expense;
    });
    return max * 1.15; // padding top
  }, [monthlyCashflowData]);

  const activeMonth = monthlyCashflowData[selectedMonthIndex] || monthlyCashflowData[5];
  const activeMonthNet = activeMonth.income - activeMonth.expense;
  const activeMonthSavingsRate =
    activeMonth.income > 0
      ? Math.round((activeMonthNet / activeMonth.income) * 100)
      : 0;

  // Handlers
  const handleCopyId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(userIdDisplay);
      setCopiedId(true);
      toast.success("User ID disalin ke clipboard! 📋");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleTogglePrivacy = () => {
    const next = !showBalance;
    setShowBalance(next);
    setCachedShowBalance(next);
    window.dispatchEvent(new CustomEvent("tamawallet:balance-visibility"));
    if (next) {
      toast.success("Mode privasi dinonaktifkan (Saldo terlihat)");
    } else {
      toast("Mode privasi aktif (Saldo disensor) 🔒");
    }
  };

  const handleSelectAvatar = (emoji: string) => {
    setAvatarEmoji(emoji);
    if (typeof window !== "undefined") {
      localStorage.setItem("tamawallet_user_avatar", emoji);
    }
    setIsAvatarModalOpen(false);
    toast.success("Avatar profil diperbarui! ✨");
  };

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

  const handleExportJSON = () => {
    const exportData = {
      app: "TamaWallet",
      version: "1.0.4",
      exportedAt: new Date().toISOString(),
      user: {
        id: userIdDisplay,
        displayName,
        email: user?.email || cachedUser?.email || "surya@tamawallet.id",
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

  const handleConfirmReset = () => {
    resetPrototypeData();
    setWallets(getStoredWallets());
    setTransactions(getStoredTransactions());
    setIsResetConfirmOpen(false);
    toast.success("Data prototype berhasil dikembalikan ke setelan awal pabrik! 🔄");
  };

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

  // Lingkaran SVG Donut Parameters (Radius = 70, Circumference = 439.82)
  const CIRCUMFERENCE = 439.82;

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-3xl mx-auto animate-page-enter">
      {/* 1. Header Top Mewah */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
              Profil & Portofolio Finansial
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ringkasan kekayaan aset, alokasi instrumen perbankan, dan cashflow bulanan
          </p>
        </div>

        {/* Quick Privacy Toggle Button */}
        <button
          type="button"
          onClick={handleTogglePrivacy}
          title={showBalance ? "Sensor Saldo" : "Tampilkan Saldo"}
          className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-all active:scale-90 shadow-2xs cursor-pointer"
        >
          {showBalance ? (
            <Eye className="h-4 w-4 text-emerald-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-zinc-400" />
          )}
        </button>
      </div>

      {/* 2. Hero Bento Card: Obsidian Dark Luxury (Apple ID & BCA Prioritas Style) */}
      <div className="relative p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#18181B] via-[#0E0E11] to-[#050507] text-white border border-zinc-800 shadow-2xl overflow-hidden card-tactile">
        {/* Glow Sheen */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: VIP Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold tracking-wide">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>BCA Prioritas Wealth Tier</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sesi SSR Aktif</span>
            </div>
          </div>

          {/* Identity Row */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Tactile Squircle Avatar */}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Ganti Avatar Emoji"
              className="relative group flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-zinc-900 border border-zinc-700/80 shadow-lg text-3xl sm:text-4xl transition-transform active:scale-90 cursor-pointer hover:border-zinc-500"
            >
              <span>{avatarEmoji}</span>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-700 shadow-sm">
                <Pencil className="h-3 w-3" />
              </div>
            </button>

            {/* User Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
                  {displayName}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(displayName);
                    setIsNameModalOpen(true);
                  }}
                  title="Ubah Nama Tampilan"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate">
                {user?.email || cachedUser?.email || "surya@tamawallet.id"}
              </p>

              {/* UID Pill with 1-Click Copy */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span>{userIdDisplay}</span>
                  {copiedId ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-zinc-400" />
                  )}
                </button>

                <span className="text-[10px] font-medium text-zinc-400 hidden sm:inline-block">
                  • 0ms Sync
                </span>
              </div>
            </div>
          </div>

          {/* Micro-Stats Bar: Real Financial Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80">
            {/* Total Portofolio Aset */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                <Coins className="h-3 w-3 text-emerald-400" />
                <span className="truncate">Total Portofolio</span>
              </div>
              <p className="text-sm sm:text-base font-black text-white tabular-nums tracking-tight truncate">
                {showBalance ? formatRupiah(totalBalance) : "••••••••••••"}
              </p>
            </div>

            {/* Kantong Rekening Terhubung */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                <WalletIcon className="h-3 w-3 text-blue-400" />
                <span className="truncate">Rekening</span>
              </div>
              <p className="text-sm sm:text-base font-black text-white tabular-nums tracking-tight truncate">
                {wallets.length} Akun Aktif
              </p>
            </div>

            {/* Surplus Rasio */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                <TrendingUp className="h-3 w-3 text-purple-400" />
                <span className="truncate">Rasio Surplus</span>
              </div>
              <p className="text-sm sm:text-base font-black text-emerald-400 tabular-nums tracking-tight truncate">
                {currentMonthFlow.savingsRatio}% Tersimpan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DIAGRAM BULAT: Alokasi Portofolio & Aset Investasi ala BCA Welma */}
      <div className="p-6 sm:p-7 rounded-[32px] border border-zinc-200/90 bg-white shadow-2xs space-y-5 card-tactile">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0060AF]">
              <PieChart className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">
                Alokasi Portofolio & Aset Investasi 🎯
              </h3>
              <p className="text-xs text-zinc-500">
                Distribusi saldo rekening & kantong tabungan ala BCA Welma
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#0060AF] border border-blue-200/60 self-start sm:self-auto">
            BCA Welma View
          </span>
        </div>

        {/* Layout Donut + Rincian Samping */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          {/* Donut Chart SVG (md:col-span-5) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 transform-gpu">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#F4F4F5"
                  strokeWidth="18"
                />

                {/* Slices */}
                {portfolioSegments.map((seg, idx) => {
                  const dash = (seg.percentage / 100) * CIRCUMFERENCE;
                  const offset = -(seg.offset / 100) * CIRCUMFERENCE;
                  const isSelected = selectedAssetIndex === idx;

                  return (
                    <circle
                      key={seg.wallet.id}
                      cx="80"
                      cy="80"
                      r="70"
                      fill="transparent"
                      stroke={seg.color.bg}
                      strokeWidth={isSelected ? 22 : 18}
                      strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      onClick={() =>
                        setSelectedAssetIndex(isSelected ? null : idx)
                      }
                    />
                  );
                })}
              </svg>

              {/* Center Hole: Total Nilai Aset */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  {selectedAssetIndex !== null && portfolioSegments[selectedAssetIndex]
                    ? portfolioSegments[selectedAssetIndex].wallet.name
                    : "Total Portofolio"}
                </span>
                <span className="text-sm sm:text-base font-black text-zinc-950 tabular-nums tracking-tight mt-0.5">
                  {showBalance
                    ? selectedAssetIndex !== null && portfolioSegments[selectedAssetIndex]
                      ? formatRupiah(portfolioSegments[selectedAssetIndex].wallet.balance)
                      : formatRupiah(totalBalance)
                    : "••••••••"}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 mt-0.5">
                  {selectedAssetIndex !== null && portfolioSegments[selectedAssetIndex]
                    ? `${portfolioSegments[selectedAssetIndex].percentage}% Aset`
                    : "100% Terpetakan"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 mt-2 text-center">
              Ketuk segmen lingkaran untuk melihat rincian akun
            </p>
          </div>

          {/* Daftar Segmen & Saldo Akun (md:col-span-7) */}
          <div className="md:col-span-7 space-y-2.5">
            {portfolioSegments.map((seg, idx) => {
              const isSelected = selectedAssetIndex === idx;
              return (
                <div
                  key={seg.wallet.id}
                  onClick={() =>
                    setSelectedAssetIndex(isSelected ? null : idx)
                  }
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-zinc-950 bg-zinc-50 shadow-xs"
                      : "border-zinc-200/80 bg-white hover:bg-zinc-50/70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Color Dot & Bank Logo */}
                    <div
                      className="h-3.5 w-3.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: seg.color.bg }}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                          {seg.wallet.name}
                        </p>
                        {seg.wallet.provider !== "cash" && (
                          <div className="h-5 px-1.5 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                            <BankBrandLogo
                              code={seg.wallet.provider}
                              className="h-3 max-h-3 w-auto max-w-[50px]"
                              size={12}
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                        {seg.wallet.provider} • {seg.percentage}% dari portofolio
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-black text-zinc-950 tabular-nums">
                      {showBalance ? formatRupiah(seg.wallet.balance) : "••••••••"}
                    </p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5"
                      style={{
                        backgroundColor: `${seg.color.bg}15`,
                        color: seg.color.bg,
                      }}
                    >
                      {seg.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. DIAGRAM BULAN: Histori Cashflow Per Bulan (BCA Multi-Month View) */}
      <div className="p-6 sm:p-7 rounded-[32px] border border-zinc-200/90 bg-white shadow-2xs space-y-5 card-tactile">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <BarChart3 className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">
                Histori Arus Kas Per Bulan 📊
              </h3>
              <p className="text-xs text-zinc-500">
                Perbandingan cuan masuk vs jajan keluar 6 bulan terakhir
              </p>
            </div>
          </div>

          {/* Indikator Legend */}
          <div className="flex items-center gap-3 text-xs font-semibold pt-1 sm:pt-0">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-zinc-600">Masuk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-zinc-600">Keluar</span>
            </div>
          </div>
        </div>

        {/* Selected Month Detail Banner */}
        <div className="p-4 rounded-2xl bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                Bulan Terpilih:
              </span>
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700">
                {activeMonth.fullMonth}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base sm:text-lg font-black text-white tabular-nums">
                Surplus: {formatRupiah(activeMonthNet)}
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                ({activeMonthSavingsRate}% Tersimpan)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                <ArrowDownLeft className="h-3 w-3 text-emerald-400 stroke-[2.5]" />
                <span>Masuk (Cuan)</span>
              </span>
              <span className="font-bold text-emerald-400 tabular-nums">
                +{formatRupiah(activeMonth.income)}
              </span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-rose-400 stroke-[2.5]" />
                <span>Keluar (Jajan)</span>
              </span>
              <span className="font-bold text-rose-300 tabular-nums">
                -{formatRupiah(activeMonth.expense)}
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart 6 Bulan */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 h-48 sm:h-52 items-end pt-4 pb-2 border-b border-zinc-100">
            {monthlyCashflowData.map((data, idx) => {
              const isSelected = selectedMonthIndex === idx;
              const incomeHeight = Math.max(8, (data.income / maxMonthlyVal) * 100);
              const expenseHeight = Math.max(8, (data.expense / maxMonthlyVal) * 100);

              return (
                <div
                  key={data.month}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className={`flex flex-col items-center h-full justify-end group cursor-pointer transition-all p-1.5 rounded-2xl ${
                    isSelected ? "bg-zinc-100/90" : "hover:bg-zinc-50"
                  }`}
                >
                  {/* Dual Bars side by side */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                    {/* Bar Cuan Masuk */}
                    <div
                      className={`w-3.5 sm:w-5 rounded-t-xl transition-all duration-700 ease-out ${
                        isSelected
                          ? "bg-emerald-500 shadow-sm"
                          : "bg-emerald-400/80 group-hover:bg-emerald-500"
                      }`}
                      style={{ height: `${incomeHeight}%` }}
                    />

                    {/* Bar Jajan Keluar */}
                    <div
                      className={`w-3.5 sm:w-5 rounded-t-xl transition-all duration-700 ease-out ${
                        isSelected
                          ? "bg-rose-500 shadow-sm"
                          : "bg-rose-400/80 group-hover:bg-rose-500"
                      }`}
                      style={{ height: `${expenseHeight}%` }}
                    />
                  </div>

                  {/* Label Bulan */}
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-2 truncate ${
                      isSelected
                        ? "text-zinc-950 font-black scale-105"
                        : "text-zinc-400 group-hover:text-zinc-700"
                    }`}
                  >
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-zinc-400 text-center pt-1">
            Ketuk pada batang bulan untuk memeriksa detail pemasukan dan pengeluaran
          </p>
        </div>
      </div>

      {/* 5. Grup Preferensi & Privasi Akun (Tactile Bento List) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Pengaturan Privasi & Lokalisasi
        </h3>

        <div className="rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
          {/* Mode Privasi Saldo */}
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
                  Basis kalkulasi buku kas & pembukuan akun
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
                  Format Nominal Rupiah
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Standar notasi finansial Bank Indonesia
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700">
              Rp 1.000.000
            </span>
          </div>
        </div>
      </div>

      {/* 6. Grup Cadangan & Manajemen Data */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Cadangan & Manajemen Data
        </h3>

        <div className="rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
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
                  Unduh arsip lengkap kantong & seluruh mutasi aktif
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
                  Pulihkan Setelan Demo Pabrik
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Kembalikan saldo kantong & mutasi ke kondisi awal
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

      {/* 7. Grup Keamanan & Sesi Server */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Keamanan & Sesi SSR
        </h3>

        <div className="rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
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
                  {user?.email || cachedUser?.email || "surya@tamawallet.id"}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">
              Terkonfirmasi
            </span>
          </div>
        </div>
      </div>

      {/* 8. Tombol Keluar & Versi Aplikasi */}
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
          TamaWallet v1.0.4 • Turbo Next.js 14 • BCA Wealth Portfolio Edition
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
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
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
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
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

"use client";

import * as React from "react";
import {
  Plus,
  Sparkles,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/transactions-store";
import {
  FinancialGoal,
  getStoredGoals,
  saveStoredGoals,
  addQuickFundsToGoal,
} from "@/lib/goals-store";

const GOAL_EMOJIS = [
  "✈️",
  "💻",
  "🏠",
  "🚗",
  "🛡️",
  "👟",
  "💍",
  "🎸",
  "🛵",
  "📱",
  "☕",
  "🎮",
];

export function GoalsView() {
  const [goals, setGoals] = React.useState<FinancialGoal[]>(() => getStoredGoals());
  const [activeTab, setActiveTab] = React.useState<string>("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newTarget, setNewTarget] = React.useState("");
  const [newInitial, setNewInitial] = React.useState("");
  const [newEmoji, setNewEmoji] = React.useState("🎯");
  const [newDeadline, setNewDeadline] = React.useState("Desember 2026");
  const [newCategory, setNewCategory] = React.useState("Wishlist");

  // Listen to Global Goals Updates
  React.useEffect(() => {
    const handleSync = () => {
      setGoals(getStoredGoals());
    };
    window.addEventListener("tamawallet:goals-updated", handleSync);
    return () => window.removeEventListener("tamawallet:goals-updated", handleSync);
  }, []);

  // Aggregated Stats
  const stats = React.useMemo(() => {
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalCurrent = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const overallRatio =
      totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 0;
    const remaining = Math.max(0, totalTarget - totalCurrent);

    return { totalTarget, totalCurrent, overallRatio, remaining };
  }, [goals]);

  // Handler Nabung Cepat
  const handleQuickAdd = (goal: FinancialGoal, amount: number) => {
    const success = addQuickFundsToGoal(goal.id, amount);
    if (success) {
      setGoals(getStoredGoals());
      toast.success(
        `+ ${formatRupiah(amount)} dialokasikan ke ${goal.emoji} ${goal.title}! 🚀`
      );
    }
  };

  // Handler Hapus Goal
  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    saveStoredGoals(updated);
    setGoals(updated);
    toast.success("Target berhasil dihapus 🗑️");
  };

  // Handler Simpan Goal Baru
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const rawTarget = parseInt(newTarget.replace(/\D/g, ""), 10);
    const rawInitial = parseInt(newInitial.replace(/\D/g, ""), 10) || 0;

    if (!newTitle.trim() || isNaN(rawTarget) || rawTarget <= 0) {
      toast.error("Mohon isi judul dan target nominal dengan benar.");
      return;
    }

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      emoji: newEmoji,
      targetAmount: rawTarget,
      currentAmount: rawInitial,
      deadlineDate: newDeadline.trim() || "Akhir Tahun",
      createdAt: Date.now(),
    };

    const updated = [newGoal, ...goals];
    saveStoredGoals(updated);
    setGoals(updated);
    setIsAddModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewTarget("");
    setNewInitial("");
    setNewEmoji("🎯");

    toast.success("Target impian berhasil dibuat! ✨");
  };

  // Filtered Goals
  const filteredGoals = React.useMemo(() => {
    if (activeTab === "all") return goals;
    return goals.filter((g) => {
      if (activeTab === "savings")
        return (
          g.category.toLowerCase().includes("tabungan") ||
          g.category.toLowerCase().includes("kunci") ||
          g.title.toLowerCase().includes("darurat")
        );
      if (activeTab === "travel")
        return (
          g.category.toLowerCase().includes("travel") ||
          g.category.toLowerCase().includes("liburan")
        );
      if (activeTab === "gadget")
        return (
          g.category.toLowerCase().includes("gadget") ||
          g.category.toLowerCase().includes("setup") ||
          g.title.toLowerCase().includes("macbook")
        );
      return true;
    });
  }, [goals, activeTab]);

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-4xl mx-auto animate-page-enter">
      {/* 1. Header Top Gaul */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
              Financial Goals & Wishlist 🎯
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Wujudkan impian tanpa ngutang, alokasikan tabungan dengan presisi
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all active:scale-95 shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Buat Target</span>
        </button>
      </div>

      {/* 2. Hero Bento Card: Goals Financial Cockpit (Obsidian Dark Luxury) */}
      <div className="relative p-6 sm:p-7 rounded-[28px] bg-gradient-to-br from-[#18181B] via-[#0E0E11] to-[#050507] text-white border border-zinc-800 shadow-xl overflow-hidden card-tactile">
        {/* Glow Sheen */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 space-y-5">
          {/* Top Row: Meta Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Akumulasi Seluruh Target
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/25 text-[10px] font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>{stats.overallRatio}% Terpenuhi</span>
            </div>
          </div>

          {/* Metric Besar: Total Terkumpul */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Dana Impian Terkumpul
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="font-black tracking-tight text-white tabular-nums leading-none"
                style={{ fontSize: "clamp(2rem, 7vw, 2.85rem)", lineHeight: 1.1 }}
              >
                {formatRupiah(stats.totalCurrent)}
              </span>
              <span className="text-xs sm:text-sm text-zinc-400 font-semibold tabular-nums">
                / {formatRupiah(stats.totalTarget)}
              </span>
            </div>
          </div>

          {/* Visual Mini Progress Bar Cockpit */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full rounded-full bg-zinc-800/80 overflow-hidden p-0.5 border border-zinc-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                style={{ width: `${stats.overallRatio}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium pt-0.5">
              <span>Sisa kebutuhan: {formatRupiah(stats.remaining)}</span>
              <span>{goals.length} Target Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95",
            activeTab === "all"
              ? "bg-zinc-950 text-white shadow-2xs"
              : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
          )}
        >
          Semua ({goals.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gadget")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95",
            activeTab === "gadget"
              ? "bg-zinc-950 text-white shadow-2xs"
              : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
          )}
        >
          💻 Gadget & Setup
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("travel")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95",
            activeTab === "travel"
              ? "bg-zinc-950 text-white shadow-2xs"
              : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
          )}
        >
          ✈️ Travel & Liburan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("savings")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95",
            activeTab === "savings"
              ? "bg-zinc-950 text-white shadow-2xs"
              : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
          )}
        >
          🛡️ Safety Net
        </button>
      </div>

      {/* 4. Grid Kartu Goals Impian (Interactive Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const ratio = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );
          const isComplete = ratio >= 100;

          return (
            <div
              key={goal.id}
              className="p-5 sm:p-6 rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs hover:shadow-md transition-all space-y-4 card-tactile flex flex-col justify-between"
            >
              {/* Top Row: Emoji & Meta Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-2xl shadow-2xs">
                      <span>{goal.emoji}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-950 truncate leading-snug">
                        {goal.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                        {goal.category} • Tenggat {goal.deadlineDate}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Hapus Target"
                    className="p-1.5 rounded-lg text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress Bar & Persentase */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {formatRupiah(goal.currentAmount)}
                    </span>
                    <span
                      className={cn(
                        "font-black tabular-nums",
                        isComplete ? "text-emerald-600" : "text-zinc-600"
                      )}
                    >
                      {ratio}%
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        isComplete
                          ? "bg-emerald-500"
                          : ratio > 60
                          ? "bg-cyan-500"
                          : "bg-zinc-950"
                      )}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                    <span>Target: {formatRupiah(goal.targetAmount)}</span>
                    <span>
                      {isComplete
                        ? "🎉 Target Tercapai!"
                        : `Sisa ${formatRupiah(goal.targetAmount - goal.currentAmount)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Nabung Action Chips (Gen Z Tactile Dopamine) */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline-block">
                  Nabung Cepat:
                </span>

                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(goal, 100000)}
                    disabled={isComplete}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[11px] font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  >
                    +100rb
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(goal, 500000)}
                    disabled={isComplete}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[11px] font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  >
                    +500rb
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(goal, 1000000)}
                    disabled={isComplete}
                    className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-40 shadow-2xs"
                  >
                    +1 Jt ⚡
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Tambah Target Finansial Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateGoal}
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl border border-zinc-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Buat Target Finansial 🎯
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Tentukan barang impian atau pos tabungan masa depan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Pilih Emoji */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600">
                Pilih Emoji Icon
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {GOAL_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewEmoji(emoji)}
                    className={cn(
                      "h-10 w-10 rounded-xl text-lg flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90",
                      newEmoji === emoji
                        ? "bg-zinc-950 border-2 border-zinc-950 scale-105"
                        : "bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80"
                    )}
                  >
                    <span>{emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Judul Impian */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600">
                Nama Target / Impian
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Tiket Konser Coldplay, DP Mobil..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {/* Kategori Goal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600">
                Kategori Target
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              >
                <option value="Gadget & Setup">Gadget & Setup</option>
                <option value="Travel & Liburan">Travel & Liburan</option>
                <option value="Tabungan Kunci">Tabungan Kunci / Safety Net</option>
                <option value="Lifestyle">Lifestyle & Fashion</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Target Nominal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-600">
                Target Nominal (Rp)
              </label>
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Contoh: 15000000"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {/* Dana Awal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600">
                  Dana Awal (Opsional)
                </label>
                <input
                  type="number"
                  value={newInitial}
                  onChange={(e) => setNewInitial(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600">
                  Target Waktu
                </label>
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="Des 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Simpan Target ✨
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

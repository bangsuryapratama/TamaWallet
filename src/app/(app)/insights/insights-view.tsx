"use client";

import * as React from "react";
import {
  Sparkles,
  PieChart,
  Zap,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  getStoredTransactions,
  formatRupiah,
  PrototypeTransaction,
} from "@/lib/transactions-store";
import {
  MiniWallet,
  getStoredWallets,
} from "@/components/modals/quick-transaction-modal";

export function InsightsView() {
  const [transactions, setTransactions] = React.useState<PrototypeTransaction[]>(
    () => getStoredTransactions()
  );
  const [_wallets, setWallets] = React.useState<MiniWallet[]>(() =>
    getStoredWallets()
  );

  React.useEffect(() => {
    const handleSync = () => {
      setTransactions(getStoredTransactions());
      setWallets(getStoredWallets());
    };
    window.addEventListener("tamawallet:tx-updated", handleSync);
    return () => window.removeEventListener("tamawallet:tx-updated", handleSync);
  }, []);

  // Analisis Arus Kas
  const analysis = React.useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: { [cat: string]: { amount: number; emoji: string } } = {};
    const dayMap: { [day: string]: number } = {
      Minggu: 0,
      Senin: 0,
      Selasa: 0,
      Rabu: 0,
      Kamis: 0,
      Jumat: 0,
      Sabtu: 0,
    };
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    transactions.forEach((tx) => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else if (tx.type === "expense") {
        totalExpense += tx.amount;
        if (!categoryMap[tx.category]) {
          categoryMap[tx.category] = { amount: 0, emoji: tx.categoryEmoji || "📦" };
        }
        categoryMap[tx.category].amount += tx.amount;

        const d = new Date(tx.createdAt);
        const dayName = dayNames[d.getDay()];
        dayMap[dayName] = (dayMap[dayName] || 0) + tx.amount;
      }
    });

    const netSurplus = totalIncome - totalExpense;
    const savingsRatio =
      totalIncome > 0
        ? Math.max(0, Math.min(100, Math.round((netSurplus / totalIncome) * 100)))
        : 0;

    // Financial Score: Formula dari rasio tabungan + diversifikasi kantong
    let healthScore = 50;
    if (savingsRatio >= 50) healthScore = 85 + Math.min(15, Math.round(savingsRatio / 10));
    else if (savingsRatio >= 20) healthScore = 70 + Math.round((savingsRatio - 20) / 2);
    else if (savingsRatio > 0) healthScore = 55 + Math.round(savingsRatio / 2);
    else healthScore = 38;

    // Kategori Teratas
    const sortedCategories = Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        emoji: data.emoji,
        percentage:
          totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Hari Terboros
    let highestDay = "Jumat";
    let highestDayAmount = 0;
    Object.entries(dayMap).forEach(([day, amt]) => {
      if (amt > highestDayAmount) {
        highestDayAmount = amt;
        highestDay = day;
      }
    });

    return {
      totalIncome,
      totalExpense,
      netSurplus,
      savingsRatio,
      healthScore,
      sortedCategories,
      highestDay,
      highestDayAmount,
    };
  }, [transactions]);

  return (
    <div className="space-y-6 pb-52 md:pb-24 max-w-4xl mx-auto animate-page-enter">
      {/* 1. Header Top */}
      <div className="pt-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
          Financial Intelligence & Insight 📊
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Analisis deterministik pola pengeluaran, rasio tabungan, dan skor kesehatan kas
        </p>
      </div>

      {/* 2. Hero Bento Card: Financial Health Cockpit (Obsidian Dark Luxury) */}
      <div className="relative p-6 sm:p-7 rounded-[28px] bg-gradient-to-br from-[#18181B] via-[#0E0E11] to-[#050507] text-white border border-zinc-800 shadow-xl overflow-hidden card-tactile">
        {/* Glow Sheen */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative z-10 space-y-5">
          {/* Top Row: Meta Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Skor Ketahanan Finansial
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span>Sultan Aman ⚡</span>
            </div>
          </div>

          {/* Metric Besar: Skor & Surplus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Indeks Kesehatan Kas
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className="font-black tracking-tight text-white tabular-nums leading-none"
                  style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", lineHeight: 1.05 }}
                >
                  {analysis.healthScore}
                </span>
                <span className="text-base text-zinc-400 font-bold">/ 100</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-2">
                Rasio tabungan {analysis.savingsRatio}% • Cashflow surplus positif
              </p>
            </div>

            {/* Split Info Masuk vs Keluar */}
            <div className="space-y-2.5 sm:border-l sm:border-zinc-800 sm:pl-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Pemasukan</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  +{formatRupiah(analysis.totalIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Pengeluaran</span>
                <span className="font-bold text-rose-300 tabular-nums">
                  -{formatRupiah(analysis.totalExpense)}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-semibold">Surplus Bersih</span>
                <span className="font-black text-white tabular-nums">
                  {formatRupiah(analysis.netSurplus)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar Cockpit */}
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 w-full rounded-full bg-zinc-800/80 overflow-hidden p-0.5 border border-zinc-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                style={{ width: `${analysis.healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dua Kolom Analisis: Kategori Terboros & Aturan 50/30/20 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kategori Pengeluaran Terbanyak */}
        <div className="p-5 sm:p-6 rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs space-y-4 card-tactile">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <PieChart className="h-4.5 w-4.5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Pos Jajan Terbesar 🍔
                </h3>
                <p className="text-[11px] text-zinc-500">Breakdown kemana larinya duitmu</p>
              </div>
            </div>
          </div>

          {analysis.sortedCategories.length > 0 ? (
            <div className="space-y-3 pt-1">
              {analysis.sortedCategories.slice(0, 4).map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-zinc-900 truncate">
                      <span>{cat.emoji}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-zinc-500 text-[11px]">
                        {cat.percentage}%
                      </span>
                      <span className="font-bold text-zinc-900 tabular-nums">
                        {formatRupiah(cat.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full bg-zinc-950 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-6 text-center">
              Belum ada data pengeluaran yang tercatat.
            </p>
          )}
        </div>

        {/* Evaluasi Aturan 50/30/20 Gen Z */}
        <div className="p-5 sm:p-6 rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs space-y-4 card-tactile">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <ShieldCheck className="h-4.5 w-4.5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Rasio Ideal 50 / 30 / 20 🎯
                </h3>
                <p className="text-[11px] text-zinc-500">Benchmark kesehatan finansial</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Needs */}
            <div className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">1. Kebutuhan Pokok (Needs)</span>
                <span className="font-bold text-zinc-900 font-mono">Target: 50%</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Makan wajib, tagihan listrik, tempat tinggal, dan transport harian.
              </p>
            </div>

            {/* Wants */}
            <div className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">2. Keinginan & Jajan (Wants)</span>
                <span className="font-bold text-zinc-900 font-mono">Target: 30%</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Kopi nongkrong, langganan Netflix, sneakers, dan self-reward.
              </p>
            </div>

            {/* Savings */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800">3. Tabungan & Investasi</span>
                <span className="font-bold text-emerald-700 font-mono">
                  Aktual: {analysis.savingsRatio}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Kamu menyisihkan {analysis.savingsRatio}% dari cuan. Ini sangat bagus di atas target minimum!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Smart Gen Z Money Tips */}
      <div className="p-5 sm:p-6 rounded-[28px] border border-zinc-200/90 bg-white shadow-2xs space-y-3 card-tactile">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb className="h-4.5 w-4.5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-950">
              Insight & Rekomendasi Cerdas 💡
            </h3>
            <p className="text-[11px] text-zinc-500">Tips deterministik berbasis data transaksimu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-zinc-900">Arus Kas Aman Terkendali</p>
              <p className="text-zinc-500 mt-0.5 leading-relaxed">
                Surplus bersihmu tercatat {formatRupiah(analysis.netSurplus)}. Jangan lupa alokasikan surplus ke Target Impian.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-zinc-900">Pola Belanja Mingguan</p>
              <p className="text-zinc-500 mt-0.5 leading-relaxed">
                Hari {analysis.highestDay} cenderung memiliki volume jajan tertinggi ({formatRupiah(analysis.highestDayAmount)}). Waspada boncos di akhir pekan!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

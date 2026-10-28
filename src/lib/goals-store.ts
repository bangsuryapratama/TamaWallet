/**
/**
 * Store & helper untuk Goals / Target Finansial TamaWallet (Gen Z Financial Wishlist)
 * Mendukung persistensi localStorage dan sinkronisasi event antar komponen.
 */

export interface FinancialGoal {
  id: string;
  title: string;
  category: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  deadlineDate: string; // e.g. "2026-12-31"
  walletId?: string; // kantong alokasi
  colorTheme?: "emerald" | "cyan" | "violet" | "amber" | "rose";
  createdAt: number;
}

export const GOALS_STORAGE_KEY = "tamawallet_prototype_goals_v1";

export const DEFAULT_GOALS: FinancialGoal[] = [
  {
    id: "goal-1",
    title: "Liburan ke Tokyo & Kyoto",
    category: "Travel & Liburan",
    emoji: "✈️",
    targetAmount: 20000000,
    currentAmount: 13500000,
    deadlineDate: "Desember 2026",
    colorTheme: "cyan",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: "goal-2",
    title: "MacBook Pro M3 Max",
    category: "Gadget & Setup",
    emoji: "💻",
    targetAmount: 32000000,
    currentAmount: 24000000,
    deadlineDate: "November 2026",
    colorTheme: "violet",
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
  },
  {
    id: "goal-3",
    title: "Safety Net Dana Darurat 6 Bulan",
    category: "Tabungan Kunci",
    emoji: "🛡️",
    targetAmount: 30000000,
    currentAmount: 15000000,
    deadlineDate: "Berkelanjutan",
    colorTheme: "emerald",
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
  },
  {
    id: "goal-4",
    title: "Sneakers Limited & Self Reward",
    category: "Lifestyle",
    emoji: "👟",
    targetAmount: 2500000,
    currentAmount: 1900000,
    deadlineDate: "Bulan Depan",
    colorTheme: "amber",
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
];

export function getStoredGoals(): FinancialGoal[] {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(DEFAULT_GOALS));
      return DEFAULT_GOALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}

export function saveStoredGoals(goals: FinancialGoal[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    window.dispatchEvent(new CustomEvent("tamawallet:goals-updated"));
  } catch {
    // quota limit
  }
}

export function addQuickFundsToGoal(goalId: string, amount: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getStoredGoals();
    const updated = current.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: Math.min(g.targetAmount, g.currentAmount + amount),
        };
      }
      return g;
    });
    saveStoredGoals(updated);
    return true;
  } catch {
    return false;
  }
}

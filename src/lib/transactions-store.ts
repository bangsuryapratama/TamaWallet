/**
 * Store & helper untuk Arus Kas & Transaksi TamaWallet (Modul 2 & 3)
 * Mendukung double-entry ledger simulasi dengan update saldo kantong real-time.
 */

export interface PrototypeTransaction {
  id: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  walletId: string;
  targetWalletId?: string | undefined;
  walletName: string;
  targetWalletName?: string | undefined;
  walletProvider: string;
  category: string;
  categoryEmoji: string;
  description: string;
  date: string; // ISO string e.g. "2026-10-27T14:30:00.000Z"
  createdAt: number;
}

export const TRANSACTIONS_STORAGE_KEY = "tamawallet_prototype_transactions_v2";
export const WALLETS_STORAGE_KEY = "tamawallet_prototype_wallets_v2";

export const EXPENSE_CATEGORIES = [
  { code: "kopi", name: "Kopi & Nongkrong", emoji: "☕" },
  { code: "makan", name: "Makan & Jajan", emoji: "🍔" },
  { code: "transport", name: "Transport & Ojol", emoji: "🚗" },
  { code: "belanja", name: "Belanja & Fashion", emoji: "🛍️" },
  { code: "hiburan", name: "Hiburan & Streaming", emoji: "🎬" },
  { code: "tagihan", name: "Tagihan & Pulsa", emoji: "⚡" },
  { code: "kesehatan", name: "Kesehatan & Skincare", emoji: "💊" },
  { code: "lainnya", name: "Lainnya", emoji: "📦" },
];

export const INCOME_CATEGORIES = [
  { code: "gaji", name: "Gaji Pokok", emoji: "💼" },
  { code: "freelance", name: "Freelance & Side Hustle", emoji: "💻" },
  { code: "cuan", name: "Bonus & Hadiah", emoji: "🎁" },
  { code: "investasi", name: "Dividen & Investasi", emoji: "📈" },
  { code: "refund", name: "Refund & Pengembalian", emoji: "🔄" },
  { code: "lainnya_masuk", name: "Lainnya", emoji: "💰" },
];

const NOW = Date.now();
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const DEFAULT_TRANSACTIONS: PrototypeTransaction[] = [
  {
    id: "tx-1",
    type: "expense",
    amount: 38000,
    walletId: "wallet-gopay-1",
    walletName: "GoPay Jajan & Kopi",
    walletProvider: "gopay",
    category: "Kopi & Nongkrong",
    categoryEmoji: "☕",
    description: "Kopi Kenangan Mantan Large",
    date: new Date(NOW - 2 * ONE_HOUR).toISOString(),
    createdAt: NOW - 2 * ONE_HOUR,
  },
  {
    id: "tx-2",
    type: "expense",
    amount: 65000,
    walletId: "wallet-bca-1",
    walletName: "BCA Tahapan Prioritas",
    walletProvider: "bca",
    category: "Makan & Jajan",
    categoryEmoji: "🍔",
    description: "Makan Siang Ramen Seirock-Ya",
    date: new Date(NOW - 5 * ONE_HOUR).toISOString(),
    createdAt: NOW - 5 * ONE_HOUR,
  },
  {
    id: "tx-3",
    type: "transfer",
    amount: 1500000,
    walletId: "wallet-bca-1",
    targetWalletId: "wallet-jago-1",
    walletName: "BCA Tahapan Prioritas",
    targetWalletName: "Jago Dana Darurat Santai",
    walletProvider: "bca",
    category: "Pindah Saldo",
    categoryEmoji: "⇄",
    description: "Alokasi Nabung Dana Darurat",
    date: new Date(NOW - ONE_DAY - 3 * ONE_HOUR).toISOString(),
    createdAt: NOW - ONE_DAY - 3 * ONE_HOUR,
  },
  {
    id: "tx-4",
    type: "expense",
    amount: 186000,
    walletId: "wallet-bca-1",
    walletName: "BCA Tahapan Prioritas",
    walletProvider: "bca",
    category: "Hiburan & Streaming",
    categoryEmoji: "🎬",
    description: "Langganan Netflix Premium Family",
    date: new Date(NOW - ONE_DAY - 6 * ONE_HOUR).toISOString(),
    createdAt: NOW - ONE_DAY - 6 * ONE_HOUR,
  },
  {
    id: "tx-5",
    type: "income",
    amount: 15000000,
    walletId: "wallet-bca-1",
    walletName: "BCA Tahapan Prioritas",
    walletProvider: "bca",
    category: "Gaji Pokok",
    categoryEmoji: "💼",
    description: "Payroll Gaji Bulanan PT Tech Nusantara",
    date: new Date(NOW - 2 * ONE_DAY - 4 * ONE_HOUR).toISOString(),
    createdAt: NOW - 2 * ONE_DAY - 4 * ONE_HOUR,
  },
  {
    id: "tx-6",
    type: "income",
    amount: 3500000,
    walletId: "wallet-jago-1",
    walletName: "Jago Dana Darurat Santai",
    walletProvider: "jago",
    category: "Freelance & Side Hustle",
    categoryEmoji: "💻",
    description: "Project UI/UX Redesign Client Luar",
    date: new Date(NOW - 3 * ONE_DAY - 8 * ONE_HOUR).toISOString(),
    createdAt: NOW - 3 * ONE_DAY - 8 * ONE_HOUR,
  },
  {
    id: "tx-7",
    type: "expense",
    amount: 45000,
    walletId: "wallet-cash-1",
    walletName: "Kas Tunai di Dompet",
    walletProvider: "cash",
    category: "Makan & Jajan",
    categoryEmoji: "🍔",
    description: "Nasi Padang Garuda Spesial",
    date: new Date(NOW - 4 * ONE_DAY - 2 * ONE_HOUR).toISOString(),
    createdAt: NOW - 4 * ONE_DAY - 2 * ONE_HOUR,
  },
];

export function getStoredTransactions(): PrototypeTransaction[] {
  if (typeof window === "undefined") return DEFAULT_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(DEFAULT_TRANSACTIONS)
      );
      return DEFAULT_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_TRANSACTIONS;
  } catch {
    return DEFAULT_TRANSACTIONS;
  }
}

export function saveStoredTransactions(txs: PrototypeTransaction[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(txs));
    } catch {
      // storage limit
    }
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const DEFAULT_WALLETS_SEED = [
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

export function resetPrototypeData() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(DEFAULT_WALLETS_SEED));
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
    window.dispatchEvent(new CustomEvent("tamawallet:tx-updated"));
  } catch {
    // ignore
  }
}

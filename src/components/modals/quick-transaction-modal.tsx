"use client";

import * as React from "react";
import { X, CheckCircle2 } from "lucide-react";
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

export interface MiniWallet {
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

export function getStoredWallets(): MiniWallet[] {
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
}

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickTransactionModalProps) {
  const [wallets, setWallets] = React.useState<MiniWallet[]>(() => getStoredWallets());

  // Form State
  const [formType, setFormType] = React.useState<"expense" | "income" | "transfer">("expense");
  const [formAmount, setFormAmount] = React.useState<string>("");
  const [formWalletId, setFormWalletId] = React.useState<string>(wallets[0]?.id || "wallet-bca-1");
  const [formTargetWalletId, setFormTargetWalletId] = React.useState<string>(wallets[1]?.id || "wallet-jago-1");
  const [formCategory, setFormCategory] = React.useState<string>(EXPENSE_CATEGORIES[0].name);
  const [formCategoryEmoji, setFormCategoryEmoji] = React.useState<string>(EXPENSE_CATEGORIES[0].emoji);
  const [formDescription, setFormDescription] = React.useState<string>("");

  // Sync wallets whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      const latest = getStoredWallets();
      setWallets(latest);
      if (latest.length > 0) {
        setFormWalletId(latest[0].id);
        const second = latest.find((w) => w.id !== latest[0].id);
        if (second) setFormTargetWalletId(second.id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = parseInt(formAmount.replace(/\D/g, "") || "0", 10);
    if (rawNumber <= 0) {
      toast.error("Nominal transaksi harus lebih dari Rp 0");
      return;
    }

    const currentWallets = getStoredWallets();
    const sourceWallet = currentWallets.find((w) => w.id === formWalletId);
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

    const targetWallet = formType === "transfer" ? currentWallets.find((w) => w.id === formTargetWalletId) : null;
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
    const updatedWallets = currentWallets.map((w) => {
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

    // Simpan ke localStorage
    try {
      localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(updatedWallets));
    } catch {
      // quota
    }

    const existingTxs = getStoredTransactions();
    saveStoredTransactions([newTx, ...existingTxs]);

    // Dispatch global event agar halaman yang sedang aktif (Dashboard, Wallets, Transactions) auto-update
    window.dispatchEvent(new CustomEvent("tamawallet:tx-updated", { detail: { newTx } }));

    toast.success(
      formType === "income"
        ? `Uang masuk dicatat! + ${formatRupiah(rawNumber)} 💰`
        : formType === "expense"
        ? `Pengeluaran dicatat! - ${formatRupiah(rawNumber)} 💸`
        : `Pindah saldo berhasil! ⇄ ${formatRupiah(rawNumber)} ⚡`
    );

    // Reset Form & Tutup
    setFormAmount("");
    setFormDescription("");
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-black text-zinc-950 flex items-center gap-1.5">
              <span>Catat Arus Kas</span>
              <span className="text-zinc-400 font-normal text-xs">• Cepat & Rapi</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Pilih tipe, masukkan nominal, dan pilih kantong.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
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
                formType === "expense"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
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
                formType === "income"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
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
                formType === "transfer"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
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
              {formType === "transfer" ? "Dari Kantong Sumber" : "Kantong Pembayaran / Tujuan"}
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
  );
}

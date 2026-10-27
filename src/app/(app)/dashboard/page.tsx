import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Ringkasan posisi keuangan, arus kas, dan tujuan finansial.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <p className="text-xs font-medium text-zinc-500">Total Kekayaan Bersih</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            Rp 0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Saldo seluruh akun</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <p className="text-xs font-medium text-zinc-500">Pemasukan Bulan Ini</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            Rp 0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Arus kas masuk</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <p className="text-xs font-medium text-zinc-500">Pengeluaran Bulan Ini</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            Rp 0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Arus kas keluar</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white">
          <p className="text-xs font-medium text-zinc-500">Goals Aktif</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Target finansial</p>
        </div>
      </div>

      {/* Quick Action / Information Box */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Mulai Mencatat di Wallet
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Tambahkan rekening bank, e-wallet, atau kas tunai untuk memulai pencatatan keuangan.
          </p>
        </div>
        <Link
          href="/wallets"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shrink-0"
        >
          <span>Buka Wallet</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

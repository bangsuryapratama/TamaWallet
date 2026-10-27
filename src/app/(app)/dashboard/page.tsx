import Link from "next/link";
import {
  ArrowRight,
  WalletCards,
  ArrowLeftRight,
  Target,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
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
        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs">
          <p className="text-xs font-medium text-zinc-500">Total Kekayaan Bersih</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            Rp 0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Saldo seluruh akun aktif</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs">
          <p className="text-xs font-medium text-zinc-500">Pemasukan Bulan Ini</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            Rp 0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Total arus kas masuk</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs">
          <p className="text-xs font-medium text-zinc-500">Pengeluaran Bulan Ini</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            Rp 0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Total pengeluaran tercatat</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs">
          <p className="text-xs font-medium text-zinc-500">Goals Finansial</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2 font-mono">
            0
          </p>
          <p className="text-xs text-zinc-400 mt-2">Target aktif saat ini</p>
        </div>
      </div>

      {/* Fitur Terintegrasi: Goals & Insight Finansial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Widget Goals Finansial */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Goals Finansial
                  </h2>
                  <p className="text-[11px] text-zinc-500">Target & Dana Impian</p>
                </div>
              </div>
              <Link
                href="/goals"
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Buka</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
              Belum ada target tabungan yang berjalan. Buat target dana darurat,
              pembelian aset, atau liburan untuk melacak progres secara otomatis.
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">0 Target Aktif</span>
            <Link
              href="/goals"
              prefetch={true}
              className="px-3.5 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all active:scale-95 shadow-2xs"
            >
              Kelola Goals
            </Link>
          </div>
        </div>

        {/* Widget Insight & Analitik */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Insight Finansial
                  </h2>
                  <p className="text-[11px] text-zinc-500">Analisis & Pola Cashflow</p>
                </div>
              </div>
              <Link
                href="/insights"
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 transition-colors"
              >
                <span>Buka</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
              Analisis perbandingan pengeluaran bulan ini, rasio tabungan, dan
              distribusi kategori akan dihitung otomatis saat data transaksi tercatat.
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Kondisi Sehat</span>
            <Link
              href="/insights"
              prefetch={true}
              className="px-3.5 py-1.5 rounded-full border border-zinc-200/90 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
            >
              Lihat Analisis
            </Link>
          </div>
        </div>
      </div>

      {/* Akses Cepat Transaksi & Wallet */}
      <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Mulai Pengelolaan Keuangan
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Daftarkan rekening bank, e-wallet, atau catat transaksi pertama Anda.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/transactions"
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200/90 bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-50 transition-all active:scale-95 shadow-2xs"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Transaksi</span>
          </Link>
          <Link
            href="/wallets"
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all active:scale-95 shadow-2xs"
          >
            <WalletCards className="h-3.5 w-3.5" />
            <span>Buka Wallet</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

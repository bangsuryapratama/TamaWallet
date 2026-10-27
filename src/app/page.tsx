import Link from "next/link";
import { ArrowRight, Wallet, Shield, CheckCircle } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      {/* Simple Clean Navigation Header */}
      <header className="border-b border-zinc-100 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
              <LogoIcon size={16} className="text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-zinc-950">
              Tama<span className="font-normal text-zinc-400">Wallet</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-3 py-2 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-zinc-950 leading-[1.15]">
            Satu tempat bersih untuk seluruh keuangan pribadi Anda.
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 font-normal leading-relaxed max-w-xl mx-auto">
            Pantau saldo rekening bank, e-wallet, uang tunai, dan target finansial secara deterministik, tanpa langganan wajib dan tanpa data palsu.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 active:scale-[0.99] transition-all shadow-sm"
            >
              <span>Mulai Kelola Keuangan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 3 Simple Pillars (Clean, grounded, informative) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-20 text-left">
          <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-3">
              <Wallet className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Multi-Akun & Dompet</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Catat rekening bank, e-wallet, uang tunai, dan tabungan dalam satu ringkasan yang jelas.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-3">
              <CheckCircle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Perhitungan Deterministik</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Semua angka saldo dan mutasi dihitung akurat berbasis ledger, bukan estimasi mengambang.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-3">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Privasi Mandiri</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Data finansial Anda terisolasi aman dengan proteksi Row Level Security tingkat basis data.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900">TamaWallet</span>
            <span>&copy; 2026. Hak cipta dilindungi.</span>
          </div>
          <Link
            href="/login"
            className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors"
          >
            Masuk ke Akun &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}

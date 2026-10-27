"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, Banknote, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
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

  const initial = (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="space-y-6 pb-20 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Profil & Akun
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Informasi akun pribadi dan pengaturan preferensi sistem.
        </p>
      </div>

      {/* Kartu Profil Pengguna */}
      <div className="p-6 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white font-bold text-xl shadow-xs">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-zinc-900 truncate">
            {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Pengguna TamaWallet"}
          </p>
          <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">
            {user?.email || "Tidak ada email"}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Akun Aktif & Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Preferensi Sistem */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-2xs divide-y divide-zinc-100 overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
              <Banknote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Mata Uang Utama</p>
              <p className="text-xs text-zinc-500">Mata uang dasar pencatatan transaksi</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800">
            IDR (Rp)
          </span>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Email Login</p>
              <p className="text-xs text-zinc-500 font-mono truncate max-w-[200px] sm:max-w-none">
                {user?.email || "-"}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-zinc-400">Terkonfirmasi</span>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Keamanan Sesi</p>
              <p className="text-xs text-zinc-500">Enkripsi token via Supabase SSR</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-700">Aktif</span>
        </div>
      </div>

      {/* Tombol Keluar Akun */}
      <div className="pt-2">
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Mengakhiri sesi..." : "Keluar dari Akun"}</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  WalletCards,
  Plus,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 4 Tab Utama di Bottom Bar:
// 1. Dashboard (Overview)
// 2. Transaksi (Aksi cepat dengan logo '+')
// 3. Wallet (Daftar Akun & Saldo)
// 4. Profil (Pengaturan Akun di samping Wallet)
const mobileNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", href: "/transactions", icon: Plus, isAction: true },
  { name: "Wallet", href: "/wallets", icon: WalletCards },
  { name: "Profil", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Tentukan indeks aktual berdasarkan URL rute saat ini
  const currentRouteIndex = React.useMemo(() => {
    const idx = mobileNavItems.findIndex(
      (item) =>
        pathname === item.href ||
        (item.href !== "/dashboard" && pathname.startsWith(item.href))
    );
    return idx === -1 ? 0 : idx;
  }, [pathname]);

  // State optimistic untuk perpindahan visual instan (0ms latency saat disentuh/diklik)
  const [optimisticIndex, setOptimisticIndex] = React.useState<number | null>(null);

  // Reset optimistic state ketika rute URL Next.js resmi selesai dimuat
  React.useEffect(() => {
    setOptimisticIndex(null);
  }, [pathname]);

  // Prefetch seluruh tab utama sekaligus saat komponen di-mount
  React.useEffect(() => {
    mobileNavItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  // Tentukan indeks aktif: utamakan respons instan optimisticIndex jika ada
  const activeIndex = optimisticIndex !== null ? optimisticIndex : currentRouteIndex;

  return (
    <nav className="md:hidden fixed bottom-5 inset-x-3 max-w-[360px] mx-auto z-40 touch-manipulation">
      <div className="relative bg-white/90 backdrop-blur-2xl border border-zinc-200/90 rounded-[28px] shadow-[0_14px_38px_-6px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] px-1.5 py-1.5 h-[66px] overflow-hidden">
        {/* Sliding Tactile Black Pill Indicator (Hardware Accelerated GPU Motion) */}
        <div
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 left-1.5 pointer-events-none transition-transform duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
          style={{
            width: "calc((100% - 12px) / 4)",
            transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
          }}
        >
          <div className="w-11 h-7 rounded-full bg-zinc-950 shadow-sm mx-auto mt-0.5" />
        </div>

        {/* 4 Tab Navigation Items */}
        <div className="relative z-10 grid grid-cols-4 h-full items-center">
          {mobileNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onPointerDown={() => {
                  // Berikan feedback visual 0ms instan tepat saat jari menekan layar
                  setOptimisticIndex(index);
                }}
                onMouseEnter={() => {
                  router.prefetch(item.href);
                }}
                className="flex flex-col items-center justify-center gap-1 py-1 rounded-2xl select-none active:scale-90 transition-transform duration-100 cursor-pointer touch-manipulation"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-7 transition-colors duration-150",
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      item.isAction ? "stroke-[2.5]" : "stroke-2"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-tight leading-none transition-colors duration-150 font-medium",
                    isActive
                      ? "text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

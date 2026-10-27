"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  WalletCards,
  ArrowLeftRight,
  User,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  const currentPath = optimisticPath || pathname;

  // 5 Kolom: 2 Tab Kiri, 1 Tombol Tengah Elevated, 2 Tab Kanan
  const navTabs = [
    { name: "Home", href: "/dashboard", icon: LayoutGrid, isCenter: false },
    { name: "Wallet", href: "/wallets", icon: WalletCards, isCenter: false },
    { name: "Catat", href: "/transactions", icon: Plus, isCenter: true },
    { name: "Riwayat", href: "/transactions", icon: ArrowLeftRight, isCenter: false },
    { name: "Profil", href: "/profile", icon: User, isCenter: false },
  ];

  // Prefetch seluruh rute sekaligus saat mount
  React.useEffect(() => {
    ["/dashboard", "/wallets", "/transactions", "/profile"].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-zinc-200/90 rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.06)] pb-[max(1rem,env(safe-area-inset-bottom))] pt-2.5 px-3 touch-manipulation">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center relative">
        {navTabs.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(item.href));

          // Tombol Tengah Elevated '+' (Pusat Aksi Cepat Catat Transaksi ala Budggt)
          if (item.isCenter) {
            return (
              <div key="center-plus" className="flex justify-center relative -top-6">
                <Link
                  href="/transactions"
                  prefetch={true}
                  onPointerDown={() => setOptimisticPath("/transactions")}
                  title="Catat Jajan / Cuan Baru"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_12px_26px_rgba(0,0,0,0.35)] border-[4px] border-white active:scale-90 transition-transform duration-150 cursor-pointer touch-manipulation select-none"
                >
                  <Plus className="h-7 w-7 stroke-[2.8]" />
                </Link>
              </div>
            );
          }

          // Tab Standar (Home, Wallet, Riwayat, Profil)
          return (
            <Link
              key={item.name + index}
              href={item.href}
              prefetch={true}
              onPointerDown={() => setOptimisticPath(item.href)}
              onMouseEnter={() => router.prefetch(item.href)}
              className={cn(
                "flex flex-col items-center justify-center py-1 transition-all active:scale-90 select-none cursor-pointer touch-manipulation",
                isActive
                  ? "text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-zinc-700 font-medium"
              )}
            >
              {/* Icon Container Terpisah (Tidak Akan Menabrak Teks) */}
              <div
                className={cn(
                  "flex items-center justify-center w-11 h-8 rounded-full transition-colors",
                  isActive
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "stroke-[2.2]" : "stroke-[1.8]"
                  )}
                />
              </div>

              {/* Teks Label di Bawah Ikon dengan Jarak Aman */}
              <span
                className={cn(
                  "text-[10px] tracking-tight mt-1 leading-none transition-colors",
                  isActive ? "text-zinc-950 font-bold" : "text-zinc-400"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

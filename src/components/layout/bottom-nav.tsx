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

  // Optimistic index untuk respons instan 0ms saat jari menekan tab
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  // 4 Tab Samping (2 di kiri, 2 di kanan tombol elevated '+')
  const leftItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Wallet", href: "/wallets", icon: WalletCards },
  ];

  const rightItems = [
    { name: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
    { name: "Profil", href: "/profile", icon: User },
  ];

  // Prefetch seluruh rute sekaligus saat mount
  React.useEffect(() => {
    ["/dashboard", "/wallets", "/transactions", "/profile"].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  const currentPath = optimisticPath || pathname;

  return (
    <nav className="md:hidden fixed bottom-6 inset-x-3 max-w-[365px] mx-auto z-40 touch-manipulation">
      {/* iPhone Deep Frosted Glass Dock Container */}
      <div className="relative bg-white/65 backdrop-blur-3xl saturate-180 border border-white/90 rounded-[38px] shadow-[0_20px_50px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] px-3.5 py-2 h-[70px] flex items-center justify-between">
        {/* 2 Tab Kiri: Dashboard & Wallet */}
        <div className="flex items-center gap-1.5">
          {leftItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.href ||
              (item.href !== "/dashboard" && currentPath.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onPointerDown={() => setOptimisticPath(item.href)}
                onMouseEnter={() => router.prefetch(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-13 rounded-[22px] active:scale-85 transition-all duration-150 cursor-pointer touch-manipulation select-none",
                  isActive
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.2]" : "stroke-[1.8]")} />
              </Link>
            );
          })}
        </div>

        {/* Tombol Tengah Elevated '+' (Pusat Aksi Transaksi Cepat iPhone Style) */}
        <div className="relative -mt-7">
          <Link
            href="/transactions"
            prefetch={true}
            onPointerDown={() => setOptimisticPath("/transactions")}
            title="Catat Jajan / Cuan Baru"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_12px_28px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.2)] active:scale-85 transition-transform duration-150 border-[4px] border-white cursor-pointer touch-manipulation select-none"
          >
            <Plus className="h-6 w-6 stroke-[2.6]" />
          </Link>
        </div>

        {/* 2 Tab Kanan: Transaksi & Profil */}
        <div className="flex items-center gap-1.5">
          {rightItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.href ||
              (item.href !== "/dashboard" && currentPath.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onPointerDown={() => setOptimisticPath(item.href)}
                onMouseEnter={() => router.prefetch(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-13 rounded-[22px] active:scale-85 transition-all duration-150 cursor-pointer touch-manipulation select-none",
                  isActive
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.2]" : "stroke-[1.8]")} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

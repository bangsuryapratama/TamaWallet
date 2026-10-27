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
    { name: "Home", href: "/dashboard", icon: LayoutGrid },
    { name: "Wallet", href: "/wallets", icon: WalletCards },
  ];

  const rightItems = [
    { name: "Riwayat", href: "/transactions", icon: ArrowLeftRight },
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
    <nav className="md:hidden fixed bottom-6 inset-x-3 max-w-[395px] mx-auto z-40 touch-manipulation">
      {/* iPhone Deep Frosted Glass Dock Container */}
      <div className="relative bg-white/70 backdrop-blur-3xl saturate-200 border border-white/95 rounded-[42px] shadow-[0_24px_60px_rgba(0,0,0,0.16),0_6px_16px_rgba(0,0,0,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)] px-4 py-2.5 h-[80px] flex items-center justify-between">
        {/* 2 Tab Kiri: Home & Wallet */}
        <div className="flex items-center gap-2">
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
                  "flex flex-col items-center justify-center w-15 h-15 rounded-[24px] active:scale-85 transition-all duration-150 cursor-pointer touch-manipulation select-none gap-0.5",
                  isActive
                    ? "bg-zinc-950 text-white shadow-md font-bold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.4]" : "stroke-[2]")} />
                <span className="text-[10px] tracking-tight leading-none font-semibold">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Tombol Tengah Elevated '+' (Pusat Aksi Transaksi Cepat iPhone Style) */}
        <div className="relative -mt-9">
          <Link
            href="/transactions"
            prefetch={true}
            onPointerDown={() => setOptimisticPath("/transactions")}
            title="Catat Jajan / Cuan Baru"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_16px_36px_-4px_rgba(0,0,0,0.5),0_6px_14px_rgba(0,0,0,0.25)] active:scale-85 transition-transform duration-150 border-[5px] border-white cursor-pointer touch-manipulation select-none"
          >
            <Plus className="h-7 w-7 stroke-[2.8]" />
          </Link>
        </div>

        {/* 2 Tab Kanan: Riwayat & Profil */}
        <div className="flex items-center gap-2">
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
                  "flex flex-col items-center justify-center w-15 h-15 rounded-[24px] active:scale-85 transition-all duration-150 cursor-pointer touch-manipulation select-none gap-0.5",
                  isActive
                    ? "bg-zinc-950 text-white shadow-md font-bold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.4]" : "stroke-[2]")} />
                <span className="text-[10px] tracking-tight leading-none font-semibold">
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

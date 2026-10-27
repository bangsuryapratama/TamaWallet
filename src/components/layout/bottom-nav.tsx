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

  // Optimistic path untuk respons instan 0ms saat jari menekan tab
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  // 4 Tab Samping: Pure icon dock ala iOS (2 kiri, 2 kanan tombol '+')
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
    <nav className="md:hidden fixed bottom-5 inset-x-0 mx-auto w-fit z-40 touch-manipulation pointer-events-none">
      {/* iPhone Floating Glass Dock (Pure Icon Dock) */}
      <div className="pointer-events-auto relative bg-white/80 backdrop-blur-2xl border border-white/80 rounded-full shadow-[0_16px_38px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] px-3 py-1.5 h-[64px] flex items-center gap-1">
        {/* 2 Tab Kiri: Home & Wallet */}
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
              title={item.name}
              onPointerDown={() => setOptimisticPath(item.href)}
              onMouseEnter={() => router.prefetch(item.href)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full active:scale-85 transition-all duration-150 cursor-pointer touch-manipulation select-none",
                isActive
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-800 hover:bg-black/5"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.2]" : "stroke-[1.9]")} />
            </Link>
          );
        })}

        {/* Tombol Tengah Elevated '+' (Pusat Aksi Transaksi Cepat) */}
        <div className="relative mx-1">
          <Link
            href="/transactions"
            prefetch={true}
            onPointerDown={() => setOptimisticPath("/transactions")}
            title="Catat Transaksi Baru"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] active:scale-85 transition-transform duration-150 border-[3.5px] border-white cursor-pointer touch-manipulation select-none -mt-4"
          >
            <Plus className="h-6 w-6 stroke-[2.8]" />
          </Link>
        </div>

        {/* 2 Tab Kanan: Riwayat & Profil */}
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
              title={item.name}
              onPointerDown={() => setOptimisticPath(item.href)}
              onMouseEnter={() => router.prefetch(item.href)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full active:scale-85 transition-all duration-150 cursor-pointer touch-manipulation select-none",
                isActive
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-800 hover:bg-black/5"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.2]" : "stroke-[1.9]")} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

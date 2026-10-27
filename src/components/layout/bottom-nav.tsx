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

  // 4 Tab Samping (2 di kiri, 2 di kanan tombol '+')
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

  return (
    <nav className="md:hidden fixed bottom-5 inset-x-3 max-w-[370px] mx-auto z-40 touch-manipulation">
      <div className="relative bg-white/90 backdrop-blur-2xl border border-zinc-200/90 rounded-[32px] shadow-[0_16px_40px_-6px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.04)] px-3 py-2 h-[68px] flex items-center justify-between">
        {/* 2 Tab Kiri: Dashboard & Wallet */}
        <div className="flex items-center gap-1">
          {leftItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-2xl active:scale-90 transition-all duration-150 cursor-pointer touch-manipulation",
                  isActive
                    ? "bg-zinc-100 text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>

        {/* Tombol Tengah elevated '+' (Aksi Cepat Transaksi ala Budggt) */}
        <div className="relative -mt-6">
          <Link
            href="/transactions"
            prefetch={true}
            title="Catat Transaksi Baru"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_10px_24px_-4px_rgba(0,0,0,0.38)] active:scale-90 transition-transform duration-150 border-4 border-white cursor-pointer touch-manipulation"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </Link>
        </div>

        {/* 2 Tab Kanan: Transaksi & Profil */}
        <div className="flex items-center gap-1">
          {rightItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-2xl active:scale-90 transition-all duration-150 cursor-pointer touch-manipulation",
                  isActive
                    ? "bg-zinc-100 text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

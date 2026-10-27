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

  const leftItems = [
    { name: "Home", href: "/dashboard", icon: LayoutGrid },
    { name: "Wallet", href: "/wallets", icon: WalletCards },
  ];

  const rightItems = [
    { name: "Riwayat", href: "/transactions", icon: ArrowLeftRight },
    { name: "Profil", href: "/profile", icon: User },
  ];

  React.useEffect(() => {
    ["/dashboard", "/wallets", "/transactions", "/profile"].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  return (
    <nav className="md:hidden fixed bottom-6 inset-x-4 max-w-[340px] mx-auto z-40 touch-manipulation pointer-events-none">
      {/* Floating Island Dock (Benar-benar Mengambang di Udara) */}
      <div className="pointer-events-auto relative bg-white/85 backdrop-blur-2xl border border-white/90 rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.04)] px-3 py-1.5 h-[66px] flex items-center justify-between">
        {/* 2 Tab Kiri: Home & Wallet */}
        <div className="flex items-center gap-1">
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
                  "flex flex-col items-center justify-center w-12 py-1 rounded-2xl active:scale-85 transition-all select-none cursor-pointer touch-manipulation",
                  isActive
                    ? "text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-700"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                    isActive ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-400"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5", isActive ? "stroke-[2.4]" : "stroke-[1.8]")} />
                </div>
                <span
                  className={cn(
                    "text-[9px] tracking-tight mt-0.5 leading-none transition-colors",
                    isActive ? "text-zinc-950 font-bold" : "text-zinc-400 font-medium"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Tombol Tengah Elevated '+' (Melayang Menonjol di Tengah) */}
        <div className="relative -mt-6 mx-1">
          <Link
            href="/transactions"
            prefetch={true}
            onPointerDown={() => setOptimisticPath("/transactions")}
            title="Catat Transaksi Baru"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)] border-[3.5px] border-white active:scale-85 transition-transform duration-150 cursor-pointer touch-manipulation select-none"
          >
            <Plus className="h-6 w-6 stroke-[2.8]" />
          </Link>
        </div>

        {/* 2 Tab Kanan: Riwayat & Profil */}
        <div className="flex items-center gap-1">
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
                  "flex flex-col items-center justify-center w-12 py-1 rounded-2xl active:scale-85 transition-all select-none cursor-pointer touch-manipulation",
                  isActive
                    ? "text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-700"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                    isActive ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-400"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5", isActive ? "stroke-[2.4]" : "stroke-[1.8]")} />
                </div>
                <span
                  className={cn(
                    "text-[9px] tracking-tight mt-0.5 leading-none transition-colors",
                    isActive ? "text-zinc-950 font-bold" : "text-zinc-400 font-medium"
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

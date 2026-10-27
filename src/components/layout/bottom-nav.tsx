"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Wallet,
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

  const tabs = [
    { name: "Home", href: "/dashboard", icon: Home, isCenter: false },
    { name: "Kantong", href: "/wallets", icon: Wallet, isCenter: false },
    { name: "Catat", href: "/transactions", icon: Plus, isCenter: true },
    { name: "Riwayat", href: "/transactions", icon: ArrowLeftRight, isCenter: false },
    { name: "Profil", href: "/profile", icon: User, isCenter: false },
  ];

  React.useEffect(() => {
    ["/dashboard", "/wallets", "/transactions", "/profile"].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  return (
    <nav className="md:hidden fixed bottom-6 inset-x-0 mx-auto w-[335px] z-40 touch-manipulation pointer-events-none select-none">
      {/* Symmetrical Tactile Floating Glass Dock */}
      <div className="pointer-events-auto relative bg-white/85 backdrop-blur-3xl saturate-180 border border-zinc-200/80 rounded-[30px] shadow-[0_16px_45px_-6px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.05)] px-2 h-[68px] grid grid-cols-5 items-center">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive =
            currentPath === tab.href ||
            (tab.href !== "/dashboard" && currentPath.startsWith(tab.href));

          // Tombol Tengah '+' (Pusat Aksi Cepat dengan Spring Bounce & Glow)
          if (tab.isCenter) {
            return (
              <div key="center-action" className="flex items-center justify-center">
                <Link
                  href="/transactions"
                  prefetch={true}
                  onPointerDown={() => setOptimisticPath("/transactions")}
                  title="Catat Cuan / Jajan"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-[0_8px_20px_-2px_rgba(0,0,0,0.4)] active:scale-75 transition-all duration-150 cursor-pointer touch-manipulation hover:bg-zinc-800"
                >
                  <Plus className="h-6 w-6 stroke-[2.8]" />
                </Link>
              </div>
            );
          }

          // 4 Tab Navigasi Presisi ala iOS SF Symbols
          return (
            <Link
              key={tab.name + idx}
              href={tab.href}
              prefetch={true}
              onPointerDown={() => setOptimisticPath(tab.href)}
              onMouseEnter={() => router.prefetch(tab.href)}
              className="flex flex-col items-center justify-center h-12 rounded-2xl active:scale-75 transition-all duration-150 cursor-pointer touch-manipulation gap-0.5"
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive
                    ? "stroke-[2.3] text-zinc-950 scale-105"
                    : "stroke-[1.8] text-zinc-400 hover:text-zinc-700"
                )}
              />
              <span
                className={cn(
                  "text-[9px] tracking-tight leading-none transition-colors",
                  isActive ? "text-zinc-950 font-bold" : "text-zinc-400 font-medium"
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

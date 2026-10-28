"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Wallet,
  ArrowLeftRight,
  Target,
  TrendingUp,
  User,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickTransactionModal } from "@/components/modals/quick-transaction-modal";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);
  const [isQuickModalOpen, setIsQuickModalOpen] = React.useState(false);

  React.useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  React.useEffect(() => {
    const handleOpen = () => setIsQuickModalOpen(true);
    window.addEventListener("tamawallet:open-quick-tx", handleOpen);
    return () => window.removeEventListener("tamawallet:open-quick-tx", handleOpen);
  }, []);

  const currentPath = optimisticPath || pathname;

  // 6 Tab Navigasi Lengkap (100% Selaras dengan Desktop Sidebar)
  const tabs = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Kantong", href: "/wallets", icon: Wallet },
    { name: "Riwayat", href: "/transactions", icon: ArrowLeftRight },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Insight", href: "/insights", icon: TrendingUp },
    { name: "Profil", href: "/profile", icon: User },
  ];

  React.useEffect(() => {
    ["/dashboard", "/wallets", "/transactions", "/goals", "/insights", "/profile"].forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  return (
    <>
      {/* Mobile Floating Action Button (FAB) Catat Transaksi Cepat */}
      <div className="md:hidden fixed bottom-24 right-4 z-40 touch-manipulation pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsQuickModalOpen(true)}
          title="Catat Cepat Cuan / Jajan"
          className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-[0_10px_24px_-4px_rgba(0,0,0,0.4)] border border-zinc-700/60 active:scale-75 transition-all duration-150 cursor-pointer touch-manipulation hover:bg-zinc-800"
        >
          <Plus className="h-6 w-6 stroke-[2.8] transition-transform duration-200 group-active:rotate-90" />
          <span className="sr-only">Catat Cepat</span>
        </button>
      </div>

      {/* Symmetrical Tactile Floating Glass Dock (6 Tabs Lengkap) */}
      <nav className="md:hidden fixed bottom-5 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-[390px] z-40 touch-manipulation pointer-events-none select-none transform-gpu will-change-transform">
        <div className="pointer-events-auto relative transform-gpu bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-[28px] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12)] px-1 h-[62px] grid grid-cols-6 items-center">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive =
              currentPath === tab.href ||
              (tab.href !== "/dashboard" && currentPath.startsWith(tab.href));

            return (
              <Link
                key={tab.name + idx}
                href={tab.href}
                prefetch={true}
                onPointerDown={() => setOptimisticPath(tab.href)}
                onMouseEnter={() => router.prefetch(tab.href)}
                className="flex flex-col items-center justify-center h-12 rounded-xl active:scale-75 transition-all duration-150 cursor-pointer touch-manipulation gap-0.5"
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 transition-transform",
                    isActive
                      ? "stroke-[2.4] text-zinc-950 scale-110"
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

      {/* Global Quick Transaction Modal */}
      <QuickTransactionModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
      />
    </>
  );
}

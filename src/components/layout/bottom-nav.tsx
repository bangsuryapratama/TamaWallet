"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wallet", href: "/wallets", icon: WalletCards },
  { name: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Insight", href: "/insights", icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-5 inset-x-3 max-w-[400px] mx-auto z-40">
      <div className="bg-white/90 backdrop-blur-2xl border border-zinc-200/90 rounded-[26px] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] px-1.5 py-1.5 grid grid-cols-5 h-[64px] items-center">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 rounded-2xl transition-all select-none active:scale-95",
                isActive
                  ? "text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-zinc-600 font-medium"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-7 rounded-full transition-all",
                  isActive
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-400"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] tracking-tight leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white">
      <div className="grid grid-cols-5 h-14">
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
                "inline-flex flex-col items-center justify-center gap-1 transition-colors py-1",
                isActive
                  ? "text-zinc-900 font-semibold"
                  : "text-zinc-400 hover:text-zinc-700"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

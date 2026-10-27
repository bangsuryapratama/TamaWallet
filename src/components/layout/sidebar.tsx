"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  Target,
  TrendingUp,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogoIcon } from "@/components/ui/logo";
import { toast } from "sonner";

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Wallet", href: "/wallets", icon: WalletCards },
  { name: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Insight", href: "/insights", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [optimisticHref, setOptimisticHref] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOptimisticHref(null);
  }, [pathname]);

  React.useEffect(() => {
    navigationItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success("Sesi berakhir", {
        description: "Anda telah berhasil keluar dari akun.",
      });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-zinc-200 bg-white">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-sm">
            <LogoIcon size={16} className="text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-zinc-950">
            Tama<span className="font-normal text-zinc-400">Wallet</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const currentActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isActive =
            optimisticHref !== null ? optimisticHref === item.href : currentActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onPointerDown={() => setOptimisticHref(item.href)}
              onMouseEnter={() => router.prefetch(item.href)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]",
                isActive
                  ? "bg-zinc-100 text-zinc-950 font-bold shadow-xs"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-zinc-100 p-3">
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-50 transition-colors">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-medium text-zinc-900 truncate">
                {user.user_metadata?.display_name || user.email?.split("@")[0]}
              </span>
              <span className="text-[11px] text-zinc-400 truncate">
                {user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title="Keluar"
              className="text-zinc-400 hover:text-zinc-900 p-1 rounded"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

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
  LogOut,
  User as UserIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogoIcon } from "@/components/ui/logo";
import { toast } from "sonner";
import {
  getCachedUser,
  setCachedUser,
  clearCachedUser,
  CachedUserSummary,
} from "@/lib/auth-cache";

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { name: "Kantong", href: "/wallets", icon: Wallet },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Insight", href: "/insights", icon: TrendingUp },
  { name: "Profil", href: "/profile", icon: UserIcon },
];

interface SidebarProps {
  initialUser?: User | null;
}

export function Sidebar({ initialUser = null }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(initialUser);
  const [cachedSummary] = React.useState<CachedUserSummary | null>(() => {
    if (initialUser) {
      setCachedUser(initialUser);
      return null;
    }
    return getCachedUser();
  });
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
    if (initialUser) {
      setUser(initialUser);
      setCachedUser(initialUser);
    }

    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (currentUser) {
        setUser(currentUser);
        setCachedUser(currentUser);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setCachedUser(u);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser]);

  const handleSignOut = async () => {
    const supabase = createClient();
    clearCachedUser();
    setIsLoggingOut(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      toast.success("Sesi berakhir", {
        description: "Anda telah berhasil keluar dari akun.",
      });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayEmail =
    user?.email || cachedSummary?.email || "";
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    cachedSummary?.displayName ||
    displayEmail.split("@")[0] ||
    "User";

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

      {/* Quick Action Button for Desktop */}
      <div className="px-3 pt-4 pb-1">
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("tamawallet:open-quick-tx"));
          }}
          className="w-full h-9 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Catat Transaksi</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
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
              <Icon className="h-4 w-4 stroke-[1.8]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section (No "Masuk" flash) */}
      <div className="border-t border-zinc-100 p-3">
        {displayEmail || user ? (
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-colors">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-semibold text-zinc-900 truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-zinc-400 truncate">
                {displayEmail}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title="Keluar"
              className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 active:scale-90 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4 stroke-[1.8]" />
            </button>
          </div>
        ) : (
          <div className="h-10 rounded-xl bg-zinc-100 animate-pulse" />
        )}
      </div>
    </aside>
  );
}

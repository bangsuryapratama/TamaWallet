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
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Ringkasan kondisi finansial",
  },
  {
    name: "Wallet",
    href: "/wallets",
    icon: WalletCards,
    description: "Multi-akun dan aset",
  },
  {
    name: "Transaksi",
    href: "/transactions",
    icon: ArrowLeftRight,
    description: "Pemasukan, pengeluaran & transfer",
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
    description: "Tujuan finansial & alokasi dana",
  },
  {
    name: "Insight",
    href: "/insights",
    icon: TrendingUp,
    description: "Analisis dan evaluasi finansial",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

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
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-border bg-card">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              TamaWallet
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Personal Finance
            </span>
          </div>
        </Link>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
          MVP
        </Badge>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigasi Utama
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Section / Auth Status */}
      <div className="border-t border-border p-4 space-y-3 bg-card/60">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
                {user.user_metadata?.display_name
                  ? user.user_metadata.display_name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-foreground truncate">
                  {user.user_metadata?.display_name || user.email?.split("@")[0]}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-between rounded-md border border-border/80 bg-background/50 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-negative hover:border-negative/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5" />
                <span>{isLoggingOut ? "Keluar..." : "Keluar Sesi"}</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span>Sesi Tamu</span>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk Akun</span>
              </span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

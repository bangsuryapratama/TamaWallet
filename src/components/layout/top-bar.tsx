"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { navigationItems } from "./sidebar";
import { isSupabaseConfigured } from "@/lib/env";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

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

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const currentItem = navigationItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  const supabaseReady = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-8">
      {/* Mobile brand / Desktop breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex md:hidden items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs shadow-sm">
            T
          </div>
          <span className="font-bold tracking-tight text-foreground text-sm">
            TamaWallet
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {currentItem?.name || "TamaWallet"}
          </span>
          {currentItem?.description && (
            <>
              <span className="text-border">/</span>
              <span className="text-xs text-muted-foreground">
                {currentItem.description}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Top right actions: Environment badge & Auth status */}
      <div className="flex items-center gap-3">
        {supabaseReady ? (
          <Badge variant="positive" className="hidden sm:inline-flex text-[11px]">
            Supabase Connected
          </Badge>
        ) : (
          <Badge variant="warning" className="text-[11px]">
            Supabase: Need Config
          </Badge>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs">
              <UserIcon className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground max-w-[120px] truncate">
                {user.user_metadata?.display_name || user.email?.split("@")[0]}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              title="Keluar Sesi"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-negative hover:border-negative/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            <LogIn className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}

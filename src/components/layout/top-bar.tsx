"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { navigationItems } from "./sidebar";
import { isSupabaseConfigured } from "@/lib/env";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const pathname = usePathname();
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

      {/* Top right actions: Environment badge & Login link */}
      <div className="flex items-center gap-3">
        {supabaseReady ? (
          <Badge variant="positive" className="hidden sm:inline-flex text-[11px]">
            Supabase Connected
          </Badge>
        ) : (
          <Badge variant="warning" className="text-[11px]">
            Supabase: Need Config (.env.local)
          </Badge>
        )}

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
        >
          <LogIn className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Login</span>
        </Link>
      </div>
    </header>
  );
}

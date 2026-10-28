"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { navigationItems } from "./sidebar";
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

interface TopBarProps {
  initialUser?: User | null;
}

export function TopBar({ initialUser = null }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Inisialisasi instan dari SSR atau local cache (0ms delay, anti-flicker 'Masuk')
  const [user, setUser] = React.useState<User | null>(initialUser);
  const [cachedSummary] = React.useState<CachedUserSummary | null>(() => {
    if (initialUser) {
      setCachedUser(initialUser);
      return null;
    }
    return getCachedUser();
  });

  React.useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setCachedUser(initialUser);
    }

    const supabase = createClient();
    if (!supabase) return;

    // Background validation
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
    if (supabase) {
      await supabase.auth.signOut();
    }
    toast.success("Sesi berakhir", {
      description: "Anda telah berhasil keluar dari akun.",
    });
    router.push("/login");
    router.refresh();
  };

  const currentItem = navigationItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  const displayEmail =
    user?.email || cachedSummary?.email || "";
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    cachedSummary?.displayName ||
    displayEmail.split("@")[0] ||
    "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-100 bg-white/95 backdrop-blur-md px-4 md:px-8 transform-gpu will-change-transform">
      {/* Mobile Title & Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 active:scale-95 transition-transform"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xs">
            <LogoIcon size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-950">
            Tama<span className="font-normal text-zinc-400">Wallet</span>
          </span>
        </Link>
        <span className="hidden md:inline-block text-zinc-300 font-light text-sm">
          /
        </span>
        <span className="hidden md:inline-block text-sm font-bold text-zinc-900">
          {currentItem?.name || "Dashboard"}
        </span>
      </div>

      {/* Profil & Auth Action (iPhone-style minimalist) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {displayEmail || user ? (
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Apple SF Avatar Icon (Clickable to /profile) */}
            <Link
              href="/profile"
              title={`Buka profil ${displayName}`}
              className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-900 font-bold text-xs select-none group-hover:border-zinc-400 group-hover:bg-zinc-200 transition-colors"
              >
                {initial || <UserIcon className="h-3.5 w-3.5 stroke-[1.8]" />}
              </div>

              <span className="text-xs text-zinc-600 hidden sm:inline-block max-w-[140px] truncate font-medium group-hover:text-zinc-950 transition-colors">
                {displayName}
              </span>
            </Link>

            <button
              onClick={handleSignOut}
              title="Keluar dari akun"
              className="h-8 px-3 rounded-full border border-zinc-200/90 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-90 cursor-pointer shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5 text-zinc-500 stroke-[1.8]" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        ) : (
          /* Subtle skeleton placeholder selagi sync (TIDAK PERNAH render 'Masuk') */
          <div className="h-8 w-20 rounded-full bg-zinc-100 animate-pulse" />
        )}
      </div>
    </header>
  );
}

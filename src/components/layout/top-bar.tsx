"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { navigationItems } from "./sidebar";
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

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-8">
      {/* Mobile Title & Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden font-bold text-sm text-zinc-900">
          TamaWallet
        </Link>
        <span className="hidden md:inline-block text-sm font-medium text-zinc-900">
          {currentItem?.name || "Dashboard"}
        </span>
      </div>

      {/* Auth action */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600 hidden sm:inline">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-700 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Masuk</span>
          </Link>
        )}
      </div>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { navigationItems } from "./sidebar";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogoIcon } from "@/components/ui/logo";
import { toast } from "sonner";

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

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-xl px-4 md:px-8">
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

      {/* Auth action */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-zinc-500 hidden sm:inline-block max-w-[160px] truncate font-semibold">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="h-8.5 px-3.5 rounded-full border border-zinc-200/90 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5 text-zinc-500" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="h-8.5 px-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Masuk</span>
          </Link>
        )}
      </div>
    </header>
  );
}

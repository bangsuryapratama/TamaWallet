import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  let user = null;

  if (supabase) {
    const { data } = await supabase.auth.getSession();
    user = data.session?.user ?? null;
  }

  return <AppShell initialUser={user}>{children}</AppShell>;
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardView } from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  let user = null;

  if (supabase) {
    const { data } = await supabase.auth.getSession();
    user = data.session?.user ?? null;
  }

  return <DashboardView initialUser={user} />;
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardView } from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  let user = null;

  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return <DashboardView initialUser={user} />;
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WalletsView } from "./wallets-view";

export const dynamic = "force-dynamic";

export default async function WalletsPage() {
  const supabase = createServerSupabaseClient();
  let user = null;

  if (supabase) {
    const { data } = await supabase.auth.getSession();
    user = data.session?.user ?? null;
  }

  return <WalletsView initialUser={user} />;
}

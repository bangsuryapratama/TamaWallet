import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TransactionsView } from "./transactions-view";

export default async function TransactionsPage() {
  const supabase = createServerSupabaseClient();
  let user = null;

  if (supabase) {
    const { data } = await supabase.auth.getSession();
    user = data.session?.user ?? null;
  }

  return <TransactionsView initialUser={user} />;
}

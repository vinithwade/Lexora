import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell";

// Shared layout for all logged-in pages. Renders the top bar + bottom dock
// once and keeps them mounted across client-side navigations — so the dock
// no longer animates in every time the user clicks a tab.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, onboarded")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarded) redirect("/onboarding");

  return (
    <AppShell user={{ name: profile.full_name || "", email: profile.email || "" }}>
      {children}
    </AppShell>
  );
}

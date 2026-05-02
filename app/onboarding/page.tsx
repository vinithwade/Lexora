import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("morning_time, evening_time, timezone, onboarded, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.onboarded) redirect("/dashboard");

  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <OnboardingWizard
        defaultMorning={profile?.morning_time ?? "09:00"}
        defaultEvening={profile?.evening_time ?? "19:00"}
        defaultTimezone={profile?.timezone ?? "UTC"}
        defaultName={profile?.full_name ?? ""}
        email={profile?.email ?? user.email ?? ""}
      />
    </main>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer, PageHeader } from "@/components/AppShell";
import ScheduleForm from "./ScheduleForm";
import NotificationsForm from "./NotificationsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("morning_time, evening_time, timezone, notif_email, email")
    .eq("id", user.id).single();

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Tune your daily meet times, timezone, and reminders." />
      <div className="space-y-6">
        <ScheduleForm
          morning={String(profile?.morning_time ?? "09:00").slice(0, 5)}
          evening={String(profile?.evening_time ?? "19:00").slice(0, 5)}
          timezone={profile?.timezone ?? "UTC"}
        />
        <NotificationsForm notifEmail={!!profile?.notif_email} email={profile?.email || ""} />
      </div>
    </PageContainer>
  );
}

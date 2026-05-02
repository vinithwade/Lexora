import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MeetingRoom from "./MeetingRoom";

export const dynamic = "force-dynamic";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: meeting } = await supabase
    .from("meetings").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!meeting) notFound();
  if (meeting.status === "completed") redirect("/dashboard");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  return (
    <MeetingRoom
      meetingId={meeting.id}
      type={meeting.type}
      userName={profile?.full_name || "You"}
    />
  );
}

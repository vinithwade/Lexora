import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageContainer, PageHeader } from "@/components/AppShell";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("full_name, email").eq("id", user.id).single();

  return (
    <PageContainer>
      <PageHeader title="Profile" description="Your account, name, and avatar." />
      <ProfileForm
        name={profile?.full_name || ""}
        email={profile?.email || user.email || ""}
      />
    </PageContainer>
  );
}

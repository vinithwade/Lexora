import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { userLocalDate } from "@/lib/time";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const type: "morning" | "evening" = body?.type === "evening" ? "evening" : "morning";

  const { data: profile } = await supabase
    .from("profiles").select("timezone").eq("id", user.id).single();
  const tz = profile?.timezone || "UTC";
  const today = userLocalDate(tz);

  // If a meeting of this type for today already exists & is in_progress, reuse it.
  const { data: existing } = await supabase
    .from("meetings")
    .select("id, status")
    .eq("user_id", user.id).eq("meeting_date", today).eq("type", type)
    .maybeSingle();

  if (existing?.status === "completed") {
    return NextResponse.json({ error: "already_completed" }, { status: 400 });
  }
  if (existing) return NextResponse.json({ id: existing.id });

  const { data: created, error } = await supabase
    .from("meetings")
    .insert({ user_id: user.id, type, meeting_date: today })
    .select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: created.id });
}

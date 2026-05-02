import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Marks a meeting complete. Optionally accepts the final transcript.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { meeting_id, transcript, status } = await request.json();
  if (!meeting_id) return NextResponse.json({ error: "meeting_id required" }, { status: 400 });

  const { data: meeting } = await supabase
    .from("meetings").select("id, user_id").eq("id", meeting_id).eq("user_id", user.id).single();
  if (!meeting) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { error } = await supabase.from("meetings").update({
    status: status === "abandoned" ? "abandoned" : "completed",
    ended_at: new Date().toISOString(),
    transcript: transcript || null,
  }).eq("id", meeting_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

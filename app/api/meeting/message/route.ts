import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Persist a turn of conversation. Called by the meeting room as the AI
// and user finish each turn (so the transcript survives if the page reloads).
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { meeting_id, role, content } = await request.json();
  if (!meeting_id || !role || !content) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (!["user", "assistant", "system"].includes(role)) {
    return NextResponse.json({ error: "bad role" }, { status: 400 });
  }

  const { data: meeting } = await supabase
    .from("meetings").select("id").eq("id", meeting_id).eq("user_id", user.id).single();
  if (!meeting) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { error } = await supabase.from("messages").insert({
    meeting_id, role, content: String(content).slice(0, 4000),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

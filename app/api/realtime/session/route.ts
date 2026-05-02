import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  MORNING_INSTRUCTIONS, EVENING_INSTRUCTIONS,
  MORNING_TOOLS, EVENING_TOOLS,
} from "@/lib/prompts";

// Mints an ephemeral OpenAI Realtime API key tied to a specific meeting.
// The browser then uses this key to open a WebRTC peer connection to
// `https://api.openai.com/v1/realtime` directly (audio never touches us).
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { meeting_id } = await request.json();
  if (!meeting_id) return NextResponse.json({ error: "meeting_id required" }, { status: 400 });

  const { data: meeting } = await supabase
    .from("meetings").select("*").eq("id", meeting_id).eq("user_id", user.id).single();
  if (!meeting) return NextResponse.json({ error: "not_found" }, { status: 404 });

  let instructions = "";
  let tools: any[] = [];

  if (meeting.type === "morning") {
    instructions = MORNING_INSTRUCTIONS;
    tools = MORNING_TOOLS;
  } else {
    // Pull today's tasks from the morning meet for context.
    const { data: tasks } = await supabase
      .from("tasks").select("id, title")
      .eq("user_id", user.id).eq("task_date", meeting.meeting_date).order("created_at");

    const taskList = (tasks || []).map((t, i) => `${i + 1}. [id=${t.id}] ${t.title}`).join("\n")
                  || "(No tasks were saved this morning.)";
    instructions = EVENING_INSTRUCTIONS(taskList);
    tools = EVENING_TOOLS;
  }

  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-realtime",
      voice: "marin",
      modalities: ["audio", "text"],
      instructions,
      tools,
      tool_choice: "auto",
      input_audio_transcription: { model: "whisper-1" },
      turn_detection: { type: "server_vad", threshold: 0.5, silence_duration_ms: 600 },
    }),
  });

  if (!r.ok) {
    const errText = await r.text();
    return NextResponse.json({ error: "openai_session_failed", detail: errText }, { status: 500 });
  }
  const session = await r.json();
  return NextResponse.json(session);
}

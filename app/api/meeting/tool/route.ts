import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { userLocalDate } from "@/lib/time";

// Executes a tool call requested by the AI during a meeting.
// The browser captures the tool_call event from the OpenAI Realtime data
// channel and forwards it here so we can persist results in our DB.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { meeting_id, name, args } = await request.json();
  if (!meeting_id || !name) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { data: meeting } = await supabase
    .from("meetings").select("*").eq("id", meeting_id).eq("user_id", user.id).single();
  if (!meeting) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (name === "create_tasks") {
    const tasks = (args?.tasks || []) as { title: string; notes?: string }[];
    if (!tasks.length) return NextResponse.json({ result: "no tasks" });

    const rows = tasks.map(t => ({
      user_id: user.id,
      meeting_id,
      task_date: meeting.meeting_date,
      title: String(t.title).slice(0, 120),
      notes: t.notes ? String(t.notes).slice(0, 500) : null,
      status: "pending",
    }));
    const { error } = await supabase.from("tasks").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ result: `saved ${rows.length} tasks` });
  }

  if (name === "finish_meeting") {
    const results = (args?.results || []) as { task_id: string; status: "done" | "skipped" }[];
    const reflection = String(args?.reflection || "").slice(0, 500);

    let doneCount = 0;
    for (const r of results) {
      const status = r.status === "done" ? "done" : "skipped";
      if (status === "done") doneCount++;
      await supabase.from("tasks").update({
        status,
        completed_at: status === "done" ? new Date().toISOString() : null,
      }).eq("id", r.task_id).eq("user_id", user.id);
    }

    const hadTasks = results.length > 0;
    const pct = hadTasks ? Math.round((doneCount / results.length) * 100) : 0;

    await supabase.from("meetings").update({
      summary: reflection,
      completion_pct: hadTasks ? pct : null,
    }).eq("id", meeting_id);

    // Streak math:
    // - If the user had no tasks today (missed morning), the evening meet
    //   doesn't move the streak in either direction. Showing up still counts
    //   as engagement, just not as a "good day".
    // - If they had tasks and ≥70% done, streak +1 (or starts at 1).
    // - If they had tasks and <70% done, streak resets to 0.
    if (hadTasks) {
      const { data: streak } = await supabase
        .from("streaks").select("*").eq("user_id", user.id).single();
      const today = meeting.meeting_date as string;
      const yesterday = new Date(new Date(today).getTime() - 86400000)
        .toISOString().slice(0, 10);

      if (streak) {
        let current = streak.current_streak;
        if (pct >= 70) {
          current = streak.last_completed_date === yesterday ? current + 1
                 : streak.last_completed_date === today      ? current
                 : 1;
        } else {
          current = 0;
        }
        const longest = Math.max(streak.longest_streak, current);
        await supabase.from("streaks").update({
          current_streak: current,
          longest_streak: longest,
          last_completed_date: pct >= 70 ? today : streak.last_completed_date,
          updated_at: new Date().toISOString(),
        }).eq("user_id", user.id);
      }
    }

    return NextResponse.json({
      result: hadTasks ? `completion ${pct}%` : "no tasks today",
      completion_pct: hadTasks ? pct : null,
    });
  }

  return NextResponse.json({ error: "unknown tool" }, { status: 400 });
}

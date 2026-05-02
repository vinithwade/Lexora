import { redirect } from "next/navigation";
import { BarChart3, Flame, Trophy, ListChecks, Video, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { userLocalDate } from "@/lib/time";
import { PageContainer, PageHeader } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("timezone").eq("id", user.id).single();
  const tz = profile?.timezone || "UTC";
  const today = userLocalDate(tz);
  const weekStart = isoSubtract(today, 6);

  const [{ data: streak }, { count: totalMeetings }, { data: tasks }, { data: weekMeetings }] = await Promise.all([
    supabase.from("streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("meetings").select("*", { count: "exact", head: true })
      .eq("user_id", user.id).eq("status", "completed"),
    supabase.from("tasks").select("status").eq("user_id", user.id),
    supabase.from("meetings")
      .select("meeting_date, type, status, completion_pct")
      .eq("user_id", user.id)
      .gte("meeting_date", weekStart),
  ]);

  const tasksDone = (tasks || []).filter(t => t.status === "done").length;
  const tasksTotal = (tasks || []).length;
  const tasksPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  // Weekly chart data (last 7 days)
  const days: { date: string; pct: number; hadEvening: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = isoSubtract(today, i);
    const evening = (weekMeetings || []).find(m => m.meeting_date === d && m.type === "evening" && m.status === "completed");
    days.push({
      date: d,
      pct: evening?.completion_pct ?? 0,
      hadEvening: !!evening,
    });
  }
  const weekAvg = days.filter(d => d.hadEvening).length
    ? Math.round(days.filter(d => d.hadEvening).reduce((s, d) => s + d.pct, 0) / days.filter(d => d.hadEvening).length)
    : 0;

  return (
    <PageContainer>
        <PageHeader
          title="Insights"
          description="How consistently you're showing up — and finishing what you set."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatTile
            icon={<Flame size={12} className="text-amber-400" />}
            label="Current streak"
            value={streak?.current_streak ?? 0}
            sublabel={`days · longest ${streak?.longest_streak ?? 0}`}
            accent={(streak?.current_streak ?? 0) > 0}
          />
          <StatTile
            icon={<Trophy size={12} className="text-amber-400" />}
            label="Longest streak"
            value={streak?.longest_streak ?? 0}
            sublabel="days"
          />
          <StatTile
            icon={<Video size={12} />}
            label="Meetings completed"
            value={totalMeetings ?? 0}
            sublabel="all time"
          />
          <StatTile
            icon={<ListChecks size={12} />}
            label="Tasks completed"
            value={tasksDone}
            sublabel={`of ${tasksTotal} (${tasksPct}%)`}
          />
        </div>

        {/* Weekly bar chart */}
        <Card className="mb-6">
          <CardHeader
            title="Last 7 days"
            description="Evening completion % for each day."
            action={<span className="text-sm text-fgMuted">Avg <span className="text-fg font-medium">{weekAvg}%</span></span>}
          />
          {days.every(d => !d.hadEvening) ? (
            <EmptyState
              icon={<BarChart3 size={20} />}
              title="No evening meets this week"
              description="Complete an evening meet and we'll plot your daily completion rate here."
            />
          ) : (
            <BarChart days={days} />
          )}
        </Card>

        {/* Tip card */}
        <Card>
          <CardHeader
            title="Tip"
            action={<Target size={16} className="text-accent" />}
          />
          <p className="text-sm text-fgMuted leading-relaxed">
            The streak grows when you finish at least <span className="text-fg font-medium">70%</span> of the tasks you committed to that morning.
            Aim for 3-5 small, finishable tasks rather than 10 ambitious ones.
          </p>
        </Card>
      </PageContainer>
  );
}

function BarChart({ days }: { days: { date: string; pct: number; hadEvening: boolean }[] }) {
  const max = 100;
  return (
    <div className="flex items-end gap-3 h-48 mt-2">
      {days.map(d => {
        const h = d.hadEvening ? Math.max(4, (d.pct / max) * 100) : 4;
        const isToday = d === days[days.length - 1];
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end">
              <div
                className={`w-full rounded-t transition-all ${
                  d.hadEvening
                    ? d.pct >= 70 ? "bg-gradient-to-t from-time to-timeDim shadow-glow" : "bg-fgSubtle/40"
                    : "bg-border"
                }`}
                style={{ height: `${h}%` }}
                title={`${shortDate(d.date)} — ${d.hadEvening ? d.pct + "%" : "no evening meet"}`}
              />
            </div>
            <div className={`text-xs ${isToday ? "text-fg font-medium" : "text-fgSubtle"}`}>
              {shortDow(d.date)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function isoSubtract(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
function shortDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function shortDow(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
}

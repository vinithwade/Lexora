import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { userLocalDate } from "@/lib/time";
import { PageContainer, PageHeader } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

const DAYS_BACK = 30;

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("timezone").eq("id", user.id).single();
  const tz = profile?.timezone || "UTC";
  const today = userLocalDate(tz);
  const startDate = isoSubtract(today, DAYS_BACK - 1);

  const [{ data: meetings }, { data: tasks }] = await Promise.all([
    supabase.from("meetings")
      .select("meeting_date, type, status, completion_pct, summary")
      .eq("user_id", user.id)
      .gte("meeting_date", startDate)
      .order("meeting_date", { ascending: false }),
    supabase.from("tasks")
      .select("task_date, status")
      .eq("user_id", user.id)
      .gte("task_date", startDate),
  ]);

  // Build a per-day index
  type Day = {
    date: string;
    morningDone: boolean;
    eveningDone: boolean;
    completionPct: number | null;
    totalTasks: number;
    doneTasks: number;
    summary: string | null;
  };
  const byDate = new Map<string, Day>();
  for (let i = 0; i < DAYS_BACK; i++) {
    const d = isoSubtract(today, i);
    byDate.set(d, {
      date: d, morningDone: false, eveningDone: false,
      completionPct: null, totalTasks: 0, doneTasks: 0, summary: null,
    });
  }
  for (const m of meetings || []) {
    const d = byDate.get(m.meeting_date as string);
    if (!d) continue;
    if (m.type === "morning" && m.status === "completed") d.morningDone = true;
    if (m.type === "evening" && m.status === "completed") {
      d.eveningDone = true;
      d.completionPct = m.completion_pct ?? null;
      d.summary = (m.summary as string) ?? null;
    }
  }
  for (const t of tasks || []) {
    const d = byDate.get(t.task_date as string);
    if (!d) continue;
    d.totalTasks++;
    if (t.status === "done") d.doneTasks++;
  }

  const daysArr = Array.from(byDate.values());
  const hasAny = daysArr.some(d => d.totalTasks > 0 || d.morningDone || d.eveningDone);

  return (
    <PageContainer>
        <PageHeader
          title="History"
          description={`Last ${DAYS_BACK} days of your meetings and tasks.`}
        />

        {/* Heatmap */}
        <Card className="mb-6">
          <CardHeader title="Activity heatmap" description="Each square is a day. Brighter = more tasks completed." />
          <Heatmap days={daysArr} />
          <div className="mt-4 flex items-center gap-3 text-xs text-fgSubtle">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(n => (
              <span key={n} className="h-3 w-3 rounded" style={{ background: heatColor(n / 4) }} />
            ))}
            <span>More</span>
          </div>
        </Card>

        {/* Day-by-day list */}
        <Card>
          <CardHeader title="Day by day" />
          {!hasAny ? (
            <EmptyState
              icon={<CalendarDays size={20} />}
              title="No history yet"
              description="Once you start completing meetings, your daily activity will appear here."
            />
          ) : (
            <ul className="divide-y divide-border -mx-1">
              {daysArr.filter(d => d.totalTasks > 0 || d.morningDone || d.eveningDone).map(d => (
                <li key={d.date} className="py-3 px-1 flex items-start gap-4">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-sm font-medium">{shortDate(d.date)}</div>
                    <div className="text-xs text-fgSubtle">{relativeDay(d.date, today)}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <Badge tone={d.morningDone ? "success" : "neutral"} dot={d.morningDone}>
                        Morning {d.morningDone ? "✓" : "—"}
                      </Badge>
                      <Badge tone={d.eveningDone ? "success" : "neutral"} dot={d.eveningDone}>
                        Evening {d.eveningDone ? "✓" : "—"}
                      </Badge>
                      {d.totalTasks > 0 && (
                        <Badge tone={d.doneTasks === d.totalTasks ? "success" : d.doneTasks * 10 >= d.totalTasks * 7 ? "accent" : "neutral"}>
                          {d.doneTasks}/{d.totalTasks} tasks
                        </Badge>
                      )}
                    </div>
                    {d.summary && (
                      <p className="text-sm text-fgMuted leading-relaxed">{d.summary}</p>
                    )}
                  </div>

                  <div className="text-right text-sm text-fgMuted tabular-nums w-12 flex-shrink-0">
                    {d.completionPct !== null ? `${d.completionPct}%` : "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </PageContainer>
  );
}

function Heatmap({ days }: { days: { date: string; doneTasks: number; totalTasks: number }[] }) {
  // Newest on the right, 6 rows × 5 cols (oldest day in top-left when reversed)
  const ordered = [...days].reverse(); // oldest → newest
  const cols = Math.ceil(ordered.length / 6);
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-6 gap-1.5 w-max" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {ordered.map(d => {
          const ratio = d.totalTasks > 0 ? d.doneTasks / d.totalTasks : 0;
          const intensity = d.totalTasks === 0 ? 0 : Math.max(0.15, ratio);
          return (
            <div
              key={d.date}
              title={`${d.date} — ${d.doneTasks}/${d.totalTasks} tasks`}
              className="h-4 w-4 rounded transition-transform hover:scale-125"
              style={{ background: heatColor(intensity) }}
            />
          );
        })}
      </div>
    </div>
  );
}

function heatColor(t: number): string {
  // Light theme: 0 → very light grey, 1 → full time-accent.
  // Uses the runtime CSS variable so it shifts with the time-of-day band.
  if (t === 0) return "#E5E5EA";
  return `rgb(var(--time-accent) / ${0.15 + t * 0.85})`;
}

function isoSubtract(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
function shortDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}
function relativeDay(iso: string, today: string) {
  if (iso === today) return "Today";
  const d1 = new Date(iso + "T00:00:00").getTime();
  const d2 = new Date(today + "T00:00:00").getTime();
  const diff = Math.round((d2 - d1) / 86400000);
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

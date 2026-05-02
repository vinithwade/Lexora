import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userLocalDate, userLocalHM, fmtTime12, nowMeetingType } from "@/lib/time";
import { PageContainer, PageHeader } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatTile } from "@/components/ui/StatTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { Flame, Trophy, ListTodo, Sunrise, Moon, CheckCircle2, Circle, MinusCircle } from "lucide-react";
import MeetCountdown from "@/components/MeetCountdown";
import JoinMeetingButton from "@/components/JoinMeetingButton";
import TimezoneSyncer from "@/components/TimezoneSyncer";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Layout already verified auth + onboarded; trust it.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, timezone, morning_time, evening_time")
    .eq("id", user.id).single();
  if (!profile) redirect("/onboarding");

  const tz = profile.timezone || "UTC";
  const today = userLocalDate(tz);
  const nowHM = userLocalHM(tz);
  const morning = String(profile.morning_time).slice(0, 5);
  const evening = String(profile.evening_time).slice(0, 5);
  const activeMeet = nowMeetingType(morning, evening, nowHM);

  const [{ data: tasks }, { data: streak }, { data: meetings }] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", user.id).eq("task_date", today).order("created_at"),
    supabase.from("streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("meetings").select("*").eq("user_id", user.id).eq("meeting_date", today),
  ]);

  const morningDone = meetings?.some(m => m.type === "morning" && m.status === "completed") ?? false;
  const eveningDone = meetings?.some(m => m.type === "evening" && m.status === "completed") ?? false;
  const completedTasks = tasks?.filter(t => t.status === "done").length ?? 0;
  const totalTasks = tasks?.length ?? 0;
  const pct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const greeting = greetByHM(nowHM, profile.full_name);
  const dateLabel = humanDate(today);

  return (
    <>
      <TimezoneSyncer storedTz={tz} />
      <PageContainer>
        <PageHeader
          title={greeting}
          description={dateLabel}
          action={
            <Badge tone="time" dot>
              {streak?.current_streak ?? 0} day{streak?.current_streak === 1 ? "" : "s"} streak
            </Badge>
          }
        />

        {/* Top row: streak + progress + stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="flex items-center gap-4">
            <ProgressRing
              value={streak?.current_streak ?? 0}
              max={Math.max(7, streak?.longest_streak ?? 7)}
              size={92} strokeWidth={9}
              label={String(streak?.current_streak ?? 0)}
              sublabel="days"
              color="#f59e0b"
            />
            <div>
              <div className="text-xs uppercase tracking-wide text-fgMuted flex items-center gap-1.5">
                <Flame size={12} className="text-amber-500" /> Streak
              </div>
              <div className="text-sm text-fgMuted mt-2">Longest <span className="text-fg font-medium">{streak?.longest_streak ?? 0}</span></div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <ProgressRing
              value={pct} max={100} size={92} strokeWidth={9}
              label={`${pct}%`} sublabel="today"
            />
            <div>
              <div className="text-xs uppercase tracking-wide text-fgMuted flex items-center gap-1.5">
                <ListTodo size={12} className="text-time" /> Today
              </div>
              <div className="text-sm text-fgMuted mt-2">
                <span className="text-fg font-medium">{completedTasks}</span> of <span className="text-fg font-medium">{totalTasks}</span> done
              </div>
            </div>
          </Card>

          <StatTile
            icon={<Trophy size={12} />}
            label="Longest streak"
            value={streak?.longest_streak ?? 0}
            sublabel={(streak?.longest_streak ?? 0) > 0 ? "days" : "no streak yet"}
          />

          <StatTile
            icon={<CheckCircle2 size={12} />}
            label="Meetings today"
            value={`${(morningDone ? 1 : 0) + (eveningDone ? 1 : 0)} / 2`}
            sublabel={morningDone && eveningDone ? "Day complete" : morningDone ? "Evening to go" : "Start with morning"}
          />
        </div>

        {/* Meet cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <MeetCard
            type="morning"
            title="Morning meet"
            timeStr={fmtTime12(morning)}
            meetTime={morning}
            timezone={tz}
            done={morningDone}
            active={activeMeet === "morning" && !morningDone}
          />
          <MeetCard
            type="evening"
            title="Evening meet"
            timeStr={fmtTime12(evening)}
            meetTime={evening}
            timezone={tz}
            done={eveningDone}
            active={activeMeet === "evening" && !eveningDone}
            hint={!morningDone ? "No morning meet today — that's ok" : undefined}
          />
        </div>

        {/* Tasks */}
        <Card>
          <CardHeader
            title="Today's tasks"
            description="Set in your morning meet."
            action={totalTasks > 0 ? (
              <Badge tone={pct === 100 ? "success" : pct >= 70 ? "accent" : "neutral"}>
                {pct}% complete
              </Badge>
            ) : null}
          />
          {tasks && tasks.length > 0 ? (
            <ul className="divide-y divide-border -mx-1">
              {tasks.map(t => (
                <li key={t.id} className="py-3 px-1 flex items-center gap-3 group">
                  <TaskStatusIcon status={t.status} />
                  <span className={`flex-1 text-sm ${t.status === "done" ? "line-through text-fgSubtle" : "text-fg"}`}>
                    {t.title}
                  </span>
                  <Badge tone={t.status === "done" ? "success" : "neutral"}>
                    {t.status === "done" ? "Done" : t.status === "skipped" ? "Skipped" : "Pending"}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<ListTodo size={20} />}
              title="No tasks yet"
              description="Your morning meeting with Lexora will set today's task list."
            />
          )}
        </Card>
      </PageContainer>
    </>
  );
}

function MeetCard({
  type, title, timeStr, meetTime, timezone, done, active, hint,
}: {
  type: "morning" | "evening";
  title: string; timeStr: string; meetTime: string; timezone: string;
  done: boolean; active: boolean; hint?: string;
}) {
  const Icon = type === "morning" ? Sunrise : Moon;
  return (
    <Card
      className={`relative overflow-hidden ${active ? "border-time/40 shadow-glow" : ""}`}
      hover
    >
      {active && (
        <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 bg-time/15 rounded-full blur-3xl pointer-events-none" />
      )}
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg grid place-items-center ${
              done ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : active ? "bg-timeSoft text-time border border-time/30"
                  : "bg-panel2 text-fgMuted border border-border"
            }`}>
              <Icon size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-fg">{title}</div>
              <div className="text-xl font-semibold tabular-nums">{timeStr}</div>
            </div>
          </div>
          {done && <Badge tone="success" dot>Done</Badge>}
          {active && !done && <Badge tone="time" dot>Live now</Badge>}
        </div>

        {hint && <div className="text-xs text-fgSubtle mt-3">{hint}</div>}

        <div className="mt-4">
          {done ? (
            <span className="text-xs text-fgMuted">Completed today ✓</span>
          ) : active ? (
            <JoinMeetingButton type={type} />
          ) : (
            <MeetCountdown meetTime={meetTime} timezone={timezone} />
          )}
        </div>
      </div>
    </Card>
  );
}

function TaskStatusIcon({ status }: { status: string }) {
  if (status === "done")    return <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />;
  if (status === "skipped") return <MinusCircle  size={18} className="text-fgSubtle flex-shrink-0" />;
  return <Circle size={18} className="text-fgSubtle flex-shrink-0" />;
}

function greetByHM(hm: string, name: string | null) {
  const h = parseInt(hm.slice(0, 2));
  const first = (name || "there").split(/\s+/)[0];
  if (h < 5)  return `Up late, ${first}`;
  if (h < 12) return `Good morning, ${first}`;
  if (h < 17) return `Good afternoon, ${first}`;
  if (h < 22) return `Good evening, ${first}`;
  return `Good night, ${first}`;
}

function humanDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
  } catch { return iso; }
}

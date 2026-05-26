import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userLocalDate, userLocalHM, fmtTime12, nowMeetingType } from "@/lib/time";
import { PageContainer, PageHeader } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Flame, Trophy, ListTodo, Sunrise, Moon, CheckCircle2, Circle, MinusCircle, CalendarCheck } from "lucide-react";
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

        {/* Main content + glance sidebar */}
        <div className="grid gap-5 lg:grid-cols-12 items-start">
          {/* ── Main column ───────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-5">
            {/* Meet cards */}
            <div className="grid gap-5 sm:grid-cols-2">
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
                  icon={<ListTodo size={22} />}
                  title="No tasks yet"
                  description="Your morning meeting with Lexora will set today's task list."
                />
              )}
            </Card>
          </div>

          {/* ── Glance sidebar ────────────────────────────────────── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20">
            <Card padded={false} className="overflow-hidden">
              {/* glossy gradient header */}
              <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-timeSoft via-transparent to-transparent">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <div className="text-xs uppercase tracking-wide text-fgMuted font-medium">Today at a glance</div>
              </div>

              {/* twin rings */}
              <div className="px-5 pb-5 grid grid-cols-2 gap-2 place-items-center">
                <div className="flex flex-col items-center gap-2">
                  <ProgressRing
                    value={pct} max={100} size={96} strokeWidth={9}
                    label={`${pct}%`} sublabel="done"
                  />
                  <span className="text-xs text-fgMuted flex items-center gap-1.5">
                    <ListTodo size={12} className="text-time" />
                    {completedTasks}/{totalTasks} tasks
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ProgressRing
                    value={streak?.current_streak ?? 0}
                    max={Math.max(7, streak?.longest_streak ?? 7)}
                    size={96} strokeWidth={9}
                    label={String(streak?.current_streak ?? 0)}
                    sublabel="streak"
                    color="#f59e0b"
                  />
                  <span className="text-xs text-fgMuted flex items-center gap-1.5">
                    <Flame size={12} className="text-amber-500" />
                    {streak?.current_streak ?? 0} day{streak?.current_streak === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              {/* mini stats */}
              <div className="border-t border-border grid grid-cols-2 divide-x divide-border">
                <GlanceStat
                  icon={<Trophy size={14} className="text-amber-500" />}
                  label="Longest"
                  value={`${streak?.longest_streak ?? 0}`}
                  sub={(streak?.longest_streak ?? 0) > 0 ? "days" : "—"}
                />
                <GlanceStat
                  icon={<CalendarCheck size={14} className="text-time" />}
                  label="Meetings"
                  value={`${(morningDone ? 1 : 0) + (eveningDone ? 1 : 0)}/2`}
                  sub={morningDone && eveningDone ? "complete" : morningDone ? "evening to go" : "today"}
                />
              </div>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </>
  );
}

function GlanceStat({
  icon, label, value, sub,
}: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-fgMuted">
        {icon}{label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums text-fg leading-none">{value}</div>
      <div className="text-xs text-fgSubtle mt-1">{sub}</div>
    </div>
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
      padded={false}
      className={`relative overflow-hidden flex flex-col ${active ? "ring-1 ring-time/40 shadow-glow" : ""}`}
      hover
    >
      {/* glossy accent wash — stronger when the meet is live */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl ${
          active ? "bg-time/25" : done ? "bg-emerald-400/10" : "bg-time/[0.06]"
        }`}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div className="relative p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl grid place-items-center shadow-glossy ${
              done ? "bg-emerald-50 text-emerald-700"
                  : active ? "bg-gradient-to-br from-time to-timeDim text-white"
                  : "bg-panel2 text-fgMuted"
            }`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-fgMuted">{title}</div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight text-fg">{timeStr}</div>
            </div>
          </div>
          {done && <Badge tone="success" dot>Done</Badge>}
          {active && !done && <Badge tone="time" dot>Live now</Badge>}
        </div>

        {hint && <div className="text-xs text-fgSubtle mt-3">{hint}</div>}

        <div className="mt-5">
          {done ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} /> Completed today
            </span>
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

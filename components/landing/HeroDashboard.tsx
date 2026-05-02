// Tilted Lexora dashboard mockup for the hero. Pure CSS — recreates the
// real dashboard's vibe (sidebar + greeting + stat row + tasks) at a tilt
// so it looks like a 3D screen captured from above.
import { Sparkles, LayoutDashboard, History, BarChart3, Settings, User, Flame, ListTodo, CheckCircle2, Sunrise, Moon } from "lucide-react";

export function HeroDashboard() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        className="rounded-2xl bg-white border border-zinc-200 shadow-[0_40px_80px_-30px_rgba(15,15,20,0.30),0_20px_40px_-20px_rgba(15,15,20,0.20)] overflow-hidden"
        style={{
          transform: "perspective(2400px) rotateX(8deg)",
          transformOrigin: "50% 0",
        }}
      >
        {/* Top window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <div className="ml-3 px-2 py-0.5 rounded text-[10px] text-fgSubtle bg-white border border-zinc-200">
            lexora.app/dashboard
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] min-h-[460px]">
          {/* Sidebar mock */}
          <aside className="border-r border-zinc-100 p-3 bg-zinc-50/40">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center">
                <Sparkles size={11} className="text-white" />
              </div>
              <span className="text-sm font-semibold">Lexora</span>
            </div>
            <SideItem icon={<LayoutDashboard size={14} />} label="Today" active />
            <SideItem icon={<History size={14} />} label="History" />
            <SideItem icon={<BarChart3 size={14} />} label="Insights" />
            <SideItem icon={<Settings size={14} />} label="Settings" />
            <SideItem icon={<User size={14} />} label="Profile" />
          </aside>

          {/* Main content mock */}
          <main className="p-5">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h3 className="text-xl font-semibold">Good morning, Vinith</h3>
                <p className="text-xs text-fgMuted">Saturday, May 2</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full bg-timeSoft border border-time/30 text-time">
                <span className="h-1.5 w-1.5 rounded-full bg-time" /> 12 day streak
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              <Stat icon={<Flame size={11} className="text-amber-500" />} label="Streak"   value="12" />
              <Stat icon={<ListTodo size={11} className="text-time" />}     label="Today"    value="80%" />
              <Stat icon={<CheckCircle2 size={11} />}                       label="Meets"    value="2/2" />
              <Stat icon={<Flame size={11} className="text-amber-500" />}   label="Longest"  value="14" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <MeetCard icon={<Sunrise size={13} />} title="Morning meet" time="9:00 AM" status="Done" />
              <MeetCard icon={<Moon size={13} />}    title="Evening meet" time="7:00 PM" status="Live in 4h 12m" />
            </div>

            <div className="rounded-lg border border-zinc-200 p-3">
              <div className="text-xs font-semibold text-fg mb-2">Today's tasks</div>
              <ul className="space-y-1.5">
                {[
                  { t: "Ship the auth refactor PR",    done: true },
                  { t: "Write demo script for Friday",  done: true },
                  { t: "Send invoices to last 3 clients", done: false },
                ].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span className={`h-3.5 w-3.5 rounded-full grid place-items-center ${t.done ? "bg-emerald-500 text-white" : "border border-zinc-300"}`}>
                      {t.done && <CheckCircle2 size={9} />}
                    </span>
                    <span className={t.done ? "line-through text-fgSubtle" : "text-fg"}>{t.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SideItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs mb-0.5 ${active ? "bg-time/10 text-fg font-medium" : "text-fgMuted"}`}>
      <span className={active ? "text-time" : ""}>{icon}</span>
      {label}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wide text-fgMuted flex items-center gap-1">
        {icon} {label}
      </div>
      <div className="text-base font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function MeetCard({ icon, title, time, status }: { icon: React.ReactNode; title: string; time: string; status: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="h-6 w-6 rounded-md bg-timeSoft text-time grid place-items-center">{icon}</span>
        <span className="font-medium">{title}</span>
      </div>
      <div className="mt-1 text-base font-semibold tabular-nums">{time}</div>
      <div className="mt-1 text-[11px] text-fgMuted">{status}</div>
    </div>
  );
}

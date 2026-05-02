// Inline mocks used by the alternating feature sections. Pure CSS — no
// screenshots. They live inside the gradient-bordered card from FeatureSection.

import { Sunrise, Moon, Flame, CheckCircle2, MinusCircle, Circle, Search, Filter } from "lucide-react";

export function MorningMock() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold">Morning meet · today</div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={10} /> Done
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Search size={12} className="text-zinc-400" />
          <input className="text-xs flex-1 outline-none placeholder:text-zinc-400" placeholder="Find a task…" />
          <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 text-[10px] text-zinc-600">
            <Filter size={10} /> Filter
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200 text-[11px] uppercase tracking-wide text-zinc-500 grid grid-cols-[1fr_70px_70px] gap-2">
          <span>Task</span><span>Priority</span><span>Status</span>
        </div>
        {[
          { t: "Ship the auth refactor PR",     p: "High",   pColor: "bg-emerald-100 text-emerald-700", s: "done" as const },
          { t: "Write demo script for Friday",  p: "Medium", pColor: "bg-amber-100 text-amber-700",     s: "done" as const },
          { t: "Send invoices to last 3 clients", p: "Low",  pColor: "bg-rose-100 text-rose-700",       s: "skipped" as const },
          { t: "Review Q2 OKRs with team",      p: "Medium", pColor: "bg-amber-100 text-amber-700",     s: "pending" as const },
        ].map((r,i)=>(
          <div key={i} className="px-3 py-2.5 border-b border-zinc-100 last:border-0 grid grid-cols-[1fr_70px_70px] gap-2 items-center text-xs">
            <span className={r.s === "done" ? "line-through text-zinc-400" : "text-zinc-800"}>{r.t}</span>
            <span className={`inline-flex w-fit px-1.5 py-0.5 rounded text-[10px] font-medium ${r.pColor}`}>{r.p}</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
              {r.s === "done" ? <CheckCircle2 size={11} className="text-emerald-600" /> : r.s === "skipped" ? <MinusCircle size={11} /> : <Circle size={11} />}
              {r.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EveningMock() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold">Evening review</div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          75% complete
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <KPI icon={<Flame size={14} className="text-amber-500" />} label="Streak" value="12 days" sub="Longest 14" />
        <KPI icon={<CheckCircle2 size={14} className="text-emerald-600" />} label="Tasks done" value="3 / 4" sub="≥70% threshold met" />
      </div>

      <div className="rounded-xl border border-zinc-200 p-3 mb-3">
        <div className="text-[11px] font-semibold mb-2">This week</div>
        <div className="flex items-end gap-2 h-20">
          {[60, 80, 100, 40, 75, 90, 75].map((h,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t bg-gradient-to-t from-time to-timeDim" style={{ height: `${h}%` }}/>
              <div className="text-[9px] text-zinc-400">{["M","T","W","T","F","S","S"][i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 p-3 flex items-start gap-2.5">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center flex-shrink-0">
          <span className="text-white text-[11px] font-semibold">L</span>
        </div>
        <div className="text-[11px] text-zinc-700 leading-relaxed">
          <span className="font-semibold text-time">Lexora's reflection:</span>{" "}
          "Strong day. The auth refactor was the win — invoices can wait until Monday."
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-500">
        {icon} {label}
      </div>
      <div className="text-lg font-semibold mt-1 tabular-nums">{value}</div>
      <div className="text-[10px] text-zinc-500">{sub}</div>
    </div>
  );
}

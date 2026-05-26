"use client";

import { useState } from "react";
import { Smartphone, Monitor, Sparkles } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

export function DeviceSync() {
  const [tab, setTab] = useState<"web" | "mobile">("web");
  return (
    <section id="how" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Seamless across devices"
            title={<>Meet from anywhere,<br/>stay in rhythm</>}
            sub="Lexora runs in your browser. Open the tab, click join, and you're in a face-to-face AI standup. No app store, no calendar invite, no setup."
          />
        </FadeIn>

        <FadeIn delay={120} className="mt-14">
          <div className="relative mx-auto rounded-3xl overflow-hidden border border-zinc-200 shadow-[0_30px_60px_-30px_rgba(15,15,20,0.20)]">
            {/* Photographic-feeling backdrop made from CSS — no real photo */}
            <div className="relative h-[420px] sm:h-[560px] bg-gradient-to-br from-stone-100 via-stone-50 to-rose-50">
              {/* Subtle vignette */}
              <div className="absolute inset-0" style={{
                background: "radial-gradient(closest-side at 50% 60%, rgba(255,255,255,0.6), transparent)",
              }}/>

              {/* Floating device card */}
              <div className="absolute inset-0 grid place-items-center">
                <DeviceCard tab={tab} />
              </div>

              {/* Tab toggle */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <div className="inline-flex p-1 rounded-full bg-zinc-900/85 backdrop-blur shadow-cardHover">
                  <Tab active={tab === "mobile"} onClick={() => setTab("mobile")} icon={<Smartphone size={13} />} label="Mobile" />
                  <Tab active={tab === "web"}    onClick={() => setTab("web")}    icon={<Monitor size={13} />}    label="Web" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function DeviceCard({ tab }: { tab: "web" | "mobile" }) {
  if (tab === "mobile") {
    return (
      <div className="w-[260px] h-[440px] rounded-[36px] bg-zinc-900 p-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
        <div className="w-full h-full rounded-[28px] bg-white overflow-hidden relative">
          {/* notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-zinc-900" />
          <div className="pt-9 px-4">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center">
                <Sparkles size={9} className="text-white" />
              </div>
              <span className="text-xs font-semibold">Lexora</span>
            </div>
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider text-fgSubtle">Today</div>
              <div className="text-lg font-semibold mt-0.5">Good morning</div>
            </div>
            <div className="mt-3 rounded-xl border border-zinc-200 p-3">
              <div className="text-[10px] text-fgSubtle">Morning meet</div>
              <div className="text-base font-semibold mt-0.5">9:00 AM</div>
              <button className="mt-2 w-full rounded-full bg-zinc-900 text-white text-[10px] font-medium py-1.5">Join</button>
            </div>
            <div className="mt-3 rounded-xl border border-zinc-200 p-3">
              <div className="text-[10px] text-fgSubtle">Today's tasks</div>
              <ul className="mt-1.5 space-y-1">
                {["Ship the PR","Demo script","Invoices"].map((t,i)=>(
                  <li key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className="h-2.5 w-2.5 rounded-full border border-zinc-300" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[88%] max-w-[820px] rounded-xl bg-white border border-zinc-200 shadow-cardHover overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-100 bg-zinc-50">
        <span className="h-2 w-2 rounded-full bg-zinc-300" />
        <span className="h-2 w-2 rounded-full bg-zinc-300" />
        <span className="h-2 w-2 rounded-full bg-zinc-300" />
      </div>
      <div className="grid grid-cols-2 gap-2 p-2 bg-stage min-h-[280px]">
        <div className="rounded-lg bg-stagePanel grid place-items-center relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-time to-timeDim shadow-glowLg animate-orb-idle" />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] text-white">Lexora</div>
        </div>
        <div className="rounded-lg bg-zinc-800 grid place-items-center relative">
          <img src="/images/avatars/you.jpg" alt="You" className="h-16 w-16 rounded-full object-cover" loading="lazy" />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] text-white">You</div>
        </div>
      </div>
      <div className="px-3 py-2 border-t border-zinc-100 text-[11px]">
        <span className="font-semibold text-time">Lexora:</span>{" "}
        <span className="text-zinc-700">What's the most important thing you're shipping today?</span>
      </div>
    </div>
  );
}

function Tab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all",
        active ? "bg-white text-zinc-900" : "text-zinc-300 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

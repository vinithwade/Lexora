"use client";

import { Mic, Cable, MessagesSquare, Globe, LayoutGrid, Palette } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Features"
            title={<>Built for shippers,<br/>powered by simplicity</>}
          />
        </FadeIn>

        {/* Two large cards */}
        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          <FadeIn>
            <BigCard
              title="Smart, flexible, and built around your daily rhythm"
              body={<><strong className="text-zinc-900">Pick your hours.</strong> Lexora wakes up when you do. Set morning and evening times in your timezone — they shift with travel, daylight saving, and life.</>}
              visual={<ThemeSwatchVisual />}
            />
          </FadeIn>
          <FadeIn delay={80}>
            <BigCard
              title="Plays well with the tools you already use"
              body={<><strong className="text-zinc-900">Seamless integrations.</strong> Plug Lexora into Calendar, Slack, Notion, and Linear. Pull today's meetings in, push your wins out.</>}
              visual={<ToolGridVisual />}
            />
          </FadeIn>
        </div>

        {/* Three smaller cards */}
        <div className="mt-5 grid md:grid-cols-3 gap-5">
          <FadeIn>
            <SmallCard
              icon={<MessagesSquare size={18} />}
              title="Voice-first conversations"
              body="Real-time WebRTC voice. Speak naturally, the AI listens, asks back, keeps it tight."
            />
          </FadeIn>
          <FadeIn delay={60}>
            <SmallCard
              icon={<Globe size={18} />}
              title="Speaks your timezone"
              body="Set your local language, time and date preferences. Your morning is your morning."
            />
          </FadeIn>
          <FadeIn delay={120}>
            <SmallCard
              icon={<LayoutGrid size={18} />}
              title="See data your way"
              body="Heatmap, weekly chart, daily breakdown. The story of your week, ready to share."
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function BigCard({
  title, body, visual,
}: { title: string; body: React.ReactNode; visual: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-stone-50 border border-stone-200 p-7 sm:p-9 h-full flex flex-col">
      <h3 className="text-2xl sm:text-[1.625rem] font-semibold tracking-[-0.02em] text-zinc-900 leading-[1.15]">
        {title}
      </h3>
      <div className="my-7 flex-1 grid place-items-center min-h-[180px]">
        {visual}
      </div>
      <p className="text-sm text-zinc-600 leading-relaxed">{body}</p>
    </div>
  );
}

function SmallCard({
  icon, title, body,
}: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-stone-50 border border-stone-200 p-7 h-full">
      <div className="h-10 w-10 rounded-full bg-white border border-stone-200 grid place-items-center text-zinc-700 shadow-sm">
        {icon}
      </div>
      <h3 className="mt-12 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{body}</p>
    </div>
  );
}

function ThemeSwatchVisual() {
  const swatches = ["#7C5CFF","#52525B","#F5A623","#F97316","#10B981","#3B82F6"];
  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl bg-white border border-stone-200 px-5 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {swatches.map((c, i) => (
            <button
              key={c}
              className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-white transition"
              style={{ backgroundColor: c, ringColor: i === 0 ? c : "transparent" } as any}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Light</span>
          <Palette size={14} />
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-white border border-stone-200 px-5 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-5 w-9 rounded-full bg-emerald-500 relative">
            <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
          </div>
          <span className="text-sm">Time-aware accent</span>
        </div>
      </div>
    </div>
  );
}

function ToolGridVisual() {
  const tools = ["Calendar", "Slack", "Notion", "Linear", "GitHub"];
  return (
    <div className="grid grid-cols-5 gap-3 w-full max-w-md">
      {tools.map((t, i) => (
        <div key={t} className="aspect-square rounded-xl bg-white border border-stone-200 grid place-items-center shadow-sm text-xs font-medium text-zinc-700">
          {t.slice(0, 2)}
        </div>
      ))}
      {tools.map((t, i) => (
        <div key={t + "b"} className="aspect-square rounded-xl bg-white border border-stone-200 grid place-items-center shadow-sm text-xs font-medium text-zinc-400">
          {t.slice(0, 2)}
        </div>
      ))}
    </div>
  );
}

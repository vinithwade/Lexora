"use client";

import { FadeIn } from "./FadeIn";
import { Avatar } from "@/components/ui/Avatar";

const SMALL = [
  {
    quote: "I used to lose my mornings to indecision. Lexora locks in the day in 90 seconds — best habit I've added in years.",
    name: "Leah Daniel",
    role: "Design Ops Lead, Teamwork",
  },
  {
    quote: "The evening review hits different. The AI doesn't let me wave off skipped tasks. Streak does the rest.",
    name: "Sergio Walker",
    role: "Agency owner",
  },
  {
    quote: "We used to duct-tape stand-ups across Slack. Now my whole team runs the same morning cadence with Lexora.",
    name: "Jane Yamamoto",
    role: "Engineering Manager, Mercury",
  },
];

export function Testimonial() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 text-center">
        <FadeIn>
          <blockquote className="text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.025em] text-zinc-900 leading-[1.08]">
            &ldquo;Lexora is the best productivity tool I've used in a decade&rdquo;
          </blockquote>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="mt-8 inline-flex flex-col items-center">
            <Avatar name="Aanya Sharma" size={56} />
            <div className="mt-3 font-semibold text-zinc-900">Aanya Sharma</div>
            <div className="text-sm text-zinc-500">Founder &amp; CEO, Northwind Labs</div>
          </div>
        </FadeIn>

        <div className="mt-16 grid md:grid-cols-3 gap-5 text-left">
          {SMALL.map((t, i) => (
            <FadeIn key={t.name} delay={i * 80}>
              <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-card h-full flex flex-col">
                <p className="text-sm text-zinc-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar name={t.name} size={36} />
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

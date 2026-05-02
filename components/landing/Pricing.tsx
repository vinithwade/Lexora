"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

const TIERS = [
  {
    name: "Lexora Basic",
    blurb: "For trying the daily rhythm.",
    price: { monthly: 0, annual: 0 },
    features: [
      "1 AI meet per day",
      "Daily streak tracking",
      "7-day history",
      "Email reminders",
      "Web app",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Lexora Premium",
    blurb: "For serious daily shippers.",
    price: { monthly: 19, annual: 15 },
    features: [
      "Everything in Basic",
      "Both daily AI meets",
      "Unlimited history & insights",
      "Voice transcripts + summaries",
      "Calendar / Slack integrations",
    ],
    cta: "Get started",
    highlight: true,
  },
  {
    name: "Lexora Enterprise",
    blurb: "For founders & operators in a squad.",
    price: null,
    features: [
      "Everything in Premium",
      "Team streak leaderboard",
      "Shared task visibility",
      "Admin & SSO controls",
      "Onboarding & migration",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-sky-50 to-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Pricing"
            title={<>Simple plans<br/>for serious work</>}
          />
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {TIERS.map((t, i) => (
            <FadeIn
              key={t.name}
              delay={i * 80}
              className={cn(
                "relative rounded-3xl border bg-white p-7 flex flex-col",
                t.highlight
                  ? "border-sky-300 ring-1 ring-sky-200 bg-gradient-to-b from-sky-100/80 via-white to-stone-50 shadow-cardHover scale-[1.02]"
                  : "border-zinc-200 shadow-card"
              )}
            >
              {t.highlight && (
                <div className="flex justify-center mb-4">
                  <PricingToggle annual={annual} setAnnual={setAnnual} />
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-zinc-700">{t.name}</h3>
                {t.highlight && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                {t.price ? (
                  <>
                    <span className="text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                      ${annual ? t.price.annual : t.price.monthly}
                    </span>
                    <span className="text-zinc-500 text-sm">/mo</span>
                  </>
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-zinc-900">Flexible</span>
                )}
              </div>

              <p className="text-sm text-zinc-500 mt-3">{t.blurb}</p>

              <ul className="mt-7 space-y-3 flex-1">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check size={15} className="text-zinc-900 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block mt-7">
                <button className={cn(
                  "w-full inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-medium transition-colors",
                  t.highlight
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50"
                )}>
                  {t.cta}
                </button>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingToggle({ annual, setAnnual }: { annual: boolean; setAnnual: (v: boolean) => void }) {
  return (
    <div className="inline-flex p-1 rounded-full bg-white border border-zinc-200 shadow-sm">
      <button
        onClick={() => setAnnual(true)}
        className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition", annual ? "bg-zinc-900 text-white" : "text-zinc-600")}
      >
        Annually
      </button>
      <button
        onClick={() => setAnnual(false)}
        className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition", !annual ? "bg-zinc-900 text-white" : "text-zinc-600")}
      >
        Monthly
      </button>
    </div>
  );
}

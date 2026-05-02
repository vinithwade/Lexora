"use client";

import Link from "next/link";
import { FadeIn } from "./FadeIn";
import { cn } from "@/lib/cn";

interface FeatureSectionProps {
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  pills: string[];          // small feature chips below the CTA
  visual: React.ReactNode;
  reverse?: boolean;
}

export function FeatureSection({
  eyebrow, title, body, pills, visual, reverse,
}: FeatureSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className={cn(
          "grid lg:grid-cols-2 gap-10 lg:gap-16 items-center",
          reverse && "lg:[direction:rtl]"
        )}>
          {/* Visual */}
          <FadeIn className="lg:[direction:ltr]">
            <div className="relative rounded-3xl bg-gradient-to-br from-sky-200/70 via-stone-100 to-rose-100/70 p-3 sm:p-5 shadow-[0_20px_60px_-30px_rgba(15,15,20,0.20)]">
              {visual}
            </div>
          </FadeIn>

          {/* Copy */}
          <FadeIn delay={120} className="lg:[direction:ltr]">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-[-0.025em] text-zinc-900 leading-[1.05]">
              {title}
            </h2>
            <p className="mt-6 text-base sm:text-lg text-zinc-600 leading-relaxed">
              {body}
            </p>

            <div className="mt-8">
              <Link href="/signup">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_10px_30px_-10px_rgba(15,15,20,0.4)]">
                  Try Lexora free
                </button>
              </Link>
            </div>

            {pills.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
                {pills.map(p => (
                  <div
                    key={p}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-zinc-200 text-sm text-zinc-700 shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-time" />
                    {p}
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

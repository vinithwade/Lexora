"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "./FadeIn";
import { SkyBackground } from "./SkyBackground";
import { HeroDashboard } from "./HeroDashboard";

export function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 overflow-hidden">
      <SkyBackground />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 text-center">
        <FadeIn>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide text-zinc-700 mb-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-accent to-accentDim px-2 py-0.5 text-[10px] font-bold text-white shadow-button">
              MVP
            </span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Early build — live now, shaping fast
          </span>
        </FadeIn>

        <FadeIn>
          <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-semibold tracking-[-0.03em] leading-[0.95] text-zinc-900 max-w-5xl mx-auto">
            Run your day{" "}
            <span className="italic font-medium">like a pro</span>
          </h1>
        </FadeIn>

        <FadeIn delay={120}>
          <p className="mt-7 text-lg sm:text-xl text-zinc-700 max-w-2xl mx-auto leading-relaxed">
            An AI accountability coach that meets with you twice a day. Plan
            your priorities in the morning, walk your wins in the evening, and
            let the streak hold you to it.
          </p>
        </FadeIn>

        <FadeIn delay={220}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <button className="sheen inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-base font-medium bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_34px_-10px_rgba(15,15,20,0.55)] hover:brightness-110 transition-all duration-200">
                Try Lexora free
              </button>
            </Link>
            <a
              href="#features"
              className="glass inline-flex items-center gap-1.5 px-7 py-3.5 rounded-full text-zinc-900 text-base font-medium hover:bg-white transition-colors"
            >
              See features
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={400} className="mt-20 sm:mt-24">
          <HeroDashboard />
        </FadeIn>
      </div>
    </section>
  );
}

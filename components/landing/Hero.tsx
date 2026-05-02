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
              <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 text-white text-base font-medium hover:bg-zinc-800 transition-colors shadow-[0_10px_30px_-10px_rgba(15,15,20,0.5)]">
                Try Lexora free
              </button>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-full bg-white/80 backdrop-blur text-zinc-900 text-base font-medium border border-zinc-200 hover:bg-white transition-colors"
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

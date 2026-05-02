"use client";

import Link from "next/link";
import { FadeIn } from "./FadeIn";
import { SkyBackground } from "./SkyBackground";

export function CTASection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <SkyBackground />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-5xl sm:text-7xl font-semibold tracking-[-0.025em] text-zinc-900 leading-[1.05]">
            Ready to get started
          </h2>
          <p className="mt-5 text-lg text-zinc-700">
            Sign up free. No credit card required.
          </p>
          <div className="mt-9">
            <Link href="/signup">
              <button className="inline-flex items-center px-8 py-4 rounded-full bg-zinc-900 text-white text-base font-medium hover:bg-zinc-800 transition-colors shadow-[0_15px_40px_-15px_rgba(15,15,20,0.6)]">
                Try Lexora free
              </button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

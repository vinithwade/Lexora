"use client";

import { FadeIn } from "./FadeIn";

// Trust strip with placeholder "company" wordmarks. Replace with real
// customer logos when you have them.
const LOGOS = [
  { name: "NORTHWIND",  className: "font-black tracking-[0.15em]" },
  { name: "Vellum",     className: "font-serif italic text-2xl" },
  { name: "lumen",      className: "font-light tracking-tight text-2xl" },
  { name: "ATLAS",      className: "font-semibold tracking-[0.2em]" },
  { name: "kindred",    className: "font-medium italic" },
  { name: "MERIDIAN",   className: "font-bold tracking-wider" },
];

export function TrustBar() {
  return (
    <section className="py-14 sm:py-20 border-y border-zinc-200 bg-white/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <FadeIn className="text-center">
          <p className="text-sm text-zinc-500 mb-8">
            Trusted by 7,000+ founders, operators &amp; teams who actually ship
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-zinc-400">
            {LOGOS.map(l => (
              <span
                key={l.name}
                className={`text-lg sm:text-xl uppercase opacity-70 hover:opacity-100 transition-opacity ${l.className}`}
              >
                {l.name}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

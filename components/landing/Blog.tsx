"use client";

import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

const FEATURED = {
  badge: "MUST READ",
  title: "How daily standups built a $100k/mo solo business",
  excerpt: "What changed when one operator made AI standups a non-negotiable part of his day. The numbers, the rituals, and the failures along the way.",
  author: "Liam Chen",
  role: "Head of Operations",
  bg: "from-amber-200 via-stone-200 to-rose-200",
};

const POSTS = [
  {
    title: "The 3-task rule: why fewer priorities ship more code",
    badge: "TOOLS",
    badgeColor: "bg-blue-600",
    bg: "from-blue-100 to-sky-200",
  },
  {
    title: "A complete guide to weekly reviews in 2026",
    badge: "INSIGHT",
    badgeColor: "bg-amber-500",
    bg: "from-stone-200 to-amber-100",
  },
  {
    title: "What an AI accountability coach actually feels like",
    badge: "MANAGEMENT",
    badgeColor: "bg-emerald-600",
    bg: "from-emerald-100 to-stone-100",
  },
];

export function Blog() {
  return (
    <section id="blog" className="py-24 sm:py-32 bg-gradient-to-b from-sky-50/50 to-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Blog"
            title={<>Ideas to level-up<br/>your shipping game</>}
          />
        </FadeIn>

        {/* Featured */}
        <FadeIn delay={120} className="mt-12">
          <article className="rounded-3xl overflow-hidden bg-white border border-zinc-200 shadow-card grid md:grid-cols-2 cursor-pointer group">
            <div className={`relative aspect-[1.4/1] md:aspect-auto bg-gradient-to-br ${FEATURED.bg}`}>
              {/* Vignette */}
              <div className="absolute inset-0" style={{
                background: "radial-gradient(closest-side at 30% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(closest-side at 70% 70%, rgba(0,0,0,0.10), transparent)",
              }}/>
              <span className="absolute top-5 left-5 inline-flex items-center px-3 py-1 rounded-full bg-stone-700 text-white text-[11px] font-semibold tracking-wider">
                {FEATURED.badge}
              </span>
            </div>

            <div className="p-7 sm:p-10 flex flex-col">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-zinc-900 leading-snug group-hover:text-zinc-700 transition-colors">
                {FEATURED.title}
              </h3>
              <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                {FEATURED.excerpt}
              </p>

              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-stone-300 to-stone-500" />
                  <div className="text-sm">
                    <div className="font-semibold text-zinc-900">{FEATURED.author}</div>
                    <div className="text-zinc-500 text-xs">{FEATURED.role}</div>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-semibold tracking-wider">
                  FEATURED
                </span>
              </div>
            </div>
          </article>
        </FadeIn>

        {/* Three smaller */}
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {POSTS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 60}>
              <article className="group cursor-pointer">
                <div className={`relative aspect-[1.6/1] rounded-2xl bg-gradient-to-br ${p.bg} overflow-hidden`}>
                  <div className="absolute inset-0" style={{
                    background: "radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.4), transparent)",
                  }}/>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-900 leading-snug group-hover:text-zinc-700 transition-colors">
                    {p.title}
                  </h3>
                  <span className={cn("inline-flex flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider", p.badgeColor)}>
                    {p.badge}
                  </span>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

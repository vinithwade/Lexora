"use client";

import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

const FEATURED = {
  badge: "MUST READ",
  title: "How twice-daily check-ins took a solo SaaS from $0 to $14k MRR",
  excerpt: "For 11 months, Marcus shipped nothing that stuck. Then he committed to a 7-minute morning plan and a 5-minute evening review — every single day. Here's the unedited log of what broke, what compounded, and the week the streak almost died.",
  author: "Marcus Whitfield",
  role: "Founder, Polaris Analytics",
  date: "May 21, 2026",
  readTime: "9 min read",
  img: "/images/blog/featured.jpg",
  bg: "from-amber-200 via-stone-200 to-rose-200",
};

const POSTS = [
  {
    title: "The 3-task rule: why capping your day ships more, not less",
    excerpt: "We analyzed 4,200 morning meets. The users who completed the most work planned the fewest tasks.",
    badge: "PRODUCTIVITY",
    badgeColor: "bg-blue-600",
    author: "Priya Nair",
    date: "May 18, 2026",
    readTime: "6 min read",
    img: "/images/blog/three-task.jpg",
    bg: "from-blue-100 to-sky-200",
  },
  {
    title: "Running a weekly review that actually changes next week",
    excerpt: "A 20-minute Friday ritual that turns seven days of noise into one decision for Monday.",
    badge: "GUIDE",
    badgeColor: "bg-amber-500",
    author: "Daniel Osei",
    date: "May 12, 2026",
    readTime: "8 min read",
    img: "/images/blog/weekly-review.jpg",
    bg: "from-stone-200 to-amber-100",
  },
  {
    title: "What talking to an AI accountability coach actually feels like",
    excerpt: "It's not a chatbot and it's not a manager. We sat in on 30 first sessions to find out what it is.",
    badge: "PRODUCT",
    badgeColor: "bg-emerald-600",
    author: "Sofia Reyes",
    date: "May 6, 2026",
    readTime: "5 min read",
    img: "/images/blog/ai-coach.jpg",
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
          <article className="surface surface-hover rounded-3xl overflow-hidden grid md:grid-cols-2 cursor-pointer group">
            <div className={`relative aspect-[1.4/1] md:aspect-auto bg-gradient-to-br ${FEATURED.bg} overflow-hidden`}>
              <img
                src={FEATURED.img}
                alt={FEATURED.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              {/* Vignette for badge legibility */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
              <span className="absolute top-5 left-5 inline-flex items-center px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur text-white text-[11px] font-semibold tracking-wider">
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
                  <img
                    src="/images/avatars/marcus.jpg"
                    alt={FEATURED.author}
                    className="h-9 w-9 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="text-sm">
                    <div className="font-semibold text-zinc-900">{FEATURED.author}</div>
                    <div className="text-zinc-500 text-xs">
                      {FEATURED.role} · {FEATURED.date} · {FEATURED.readTime}
                    </div>
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
                  <img
                    src={p.img}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-900 leading-snug group-hover:text-zinc-700 transition-colors">
                    {p.title}
                  </h3>
                  <span className={cn("inline-flex flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider", p.badgeColor)}>
                    {p.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {p.excerpt}
                </p>
                <div className="mt-3 text-xs text-zinc-500">
                  {p.author} · {p.date} · {p.readTime}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

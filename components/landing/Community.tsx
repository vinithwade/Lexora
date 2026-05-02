"use client";

import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";

export function Community() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-sky-50/50 to-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Community"
            title="Stay in the loop"
          />
        </FadeIn>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          <FadeIn>
            <SocialCard
              brand="X / Twitter"
              metric="15.2K followers"
              body="Daily threads on shipping, accountability, and the psychology of habits. New features ship live in our feed."
              cta="Follow us"
              href="https://x.com/"
              logo={<XLogo />}
              logoBg="bg-zinc-900"
            />
          </FadeIn>
          <FadeIn delay={80}>
            <SocialCard
              brand="YouTube"
              metric="32K subscribers"
              body="Founder interviews, deep tutorials, and the design process behind every Lexora release."
              cta="Subscribe"
              href="https://youtube.com/"
              logo={<YTLogo />}
              logoBg="bg-white"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function SocialCard({
  brand, metric, body, cta, href, logo, logoBg,
}: {
  brand: string; metric: string; body: string; cta: string; href: string;
  logo: React.ReactNode; logoBg: string;
}) {
  return (
    <a
      href={href}
      target="_blank" rel="noopener noreferrer"
      className="group block rounded-3xl bg-white border border-zinc-200 p-7 shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`h-14 w-14 rounded-2xl ${logoBg} grid place-items-center shadow-sm`}>
          {logo}
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{metric}</span>
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-zinc-900">{brand}</h3>
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{body}</p>

      <div className="mt-7">
        <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-900 group-hover:bg-zinc-50 transition-colors">
          {cta}
        </span>
      </div>
    </a>
  );
}

function XLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  );
}
function YTLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  );
}

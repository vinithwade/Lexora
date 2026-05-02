import Link from "next/link";
import { Sparkles, Sunrise, Moon, Flame } from "lucide-react";

// Split-screen auth layout: hero panel on the left, form on the right.
// Stacks to single-column under lg. The hero uses the time-of-day accent
// gradient + a pulsing orb so the app's personality is felt before signup.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      <HeroPanel />

      <section className="flex items-center justify-center px-5 sm:px-8 py-10 lg:py-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile-only brand (desktop sees brand on hero panel) */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center shadow-glow">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-semibold text-lg">Lexora</span>
          </Link>
          {children}
        </div>
      </section>
    </div>
  );
}

function HeroPanel() {
  return (
    <aside
      className="
        hidden lg:flex relative overflow-hidden flex-col justify-between
        border-r border-border
        bg-gradient-to-br from-timeSoft via-transparent to-transparent
      "
    >
      {/* Soft radial wash in the time accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 30% 30%, rgb(var(--time-accent) / 0.18), transparent 60%), radial-gradient(700px 500px at 70% 90%, rgb(var(--time-accent) / 0.10), transparent 60%)",
        }}
      />
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,15,20,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top: brand */}
      <div className="relative px-10 pt-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center shadow-glow">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-semibold text-lg text-fg">Lexora</span>
        </Link>
      </div>

      {/* Center: orb + tagline */}
      <div className="relative px-10 flex flex-col items-center text-center">
        <div
          className="h-48 w-48 rounded-full bg-gradient-to-br from-time to-timeDim shadow-glowLg animate-orb-idle mb-10"
        />
        <h2 className="text-3xl xl:text-4xl font-semibold tracking-tight leading-[1.1] text-fg max-w-md">
          Your AI accountability coach,<br />
          <span className="text-time">on call twice a day.</span>
        </h2>
        <p className="text-fgMuted mt-4 max-w-md leading-relaxed">
          Plan in the morning. Review in the evening. Lexora keeps your day on
          track and your streak alive.
        </p>
      </div>

      {/* Bottom: feature highlights */}
      <div className="relative px-10 pb-10">
        <div className="grid grid-cols-3 gap-3">
          <Feature icon={<Sunrise size={14} />} label="Morning plan" />
          <Feature icon={<Moon size={14} />} label="Evening review" />
          <Feature icon={<Flame size={14} />} label="Daily streak" />
        </div>
        <p className="text-xs text-fgSubtle mt-6">
          © Lexora · built for founders & operators who actually ship
        </p>
      </div>
    </aside>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-lg bg-white/70 backdrop-blur border border-border px-3 py-2.5 flex items-center gap-2 shadow-card">
      <span className="text-time">{icon}</span>
      <span className="text-xs font-medium text-fg">{label}</span>
    </div>
  );
}

// Reusable building blocks for both login + signup
export function AuthHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">{title}</h1>
      <p className="text-fgMuted text-[15px] mt-2">{sub}</p>
    </div>
  );
}

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-fgSubtle">
      <div className="h-px flex-1 bg-border" />
      <span className="px-1">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AuthFooter({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-fgMuted mt-6 text-center">{children}</p>;
}

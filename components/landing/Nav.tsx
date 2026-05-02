"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how",      label: "How it works" },
  { href: "#pricing",  label: "Pricing" },
  { href: "#blog",     label: "Blog" },
];

// Centered floating pill nav. Logo-left, links in the middle, CTA on the
// right — all inside one rounded container that floats over the page.
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto inline-flex items-center gap-1 rounded-full transition-all duration-300",
          "px-1.5 py-1.5 max-w-[min(960px,calc(100%-2rem))]",
          scrolled
            ? "bg-white/85 backdrop-blur-xl border border-zinc-200/80 shadow-[0_10px_30px_-10px_rgba(15,15,20,0.18)]"
            : "bg-white/70 backdrop-blur border border-zinc-200/60 shadow-[0_6px_20px_-8px_rgba(15,15,20,0.12)]"
        )}
      >
        <Link href="/" className="flex items-center gap-2 pl-3 pr-2 py-1">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center shadow-glow">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-semibold tracking-tight text-fg">Lexora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-full text-sm text-fgMuted hover:text-fg hover:bg-zinc-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-1">
          <Link href="/login" className="hidden sm:inline-block">
            <span className="px-3 py-2 rounded-full text-sm text-fgMuted hover:text-fg hover:bg-zinc-100 transition-colors">
              Log in
            </span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_4px_12px_-4px_rgba(15,15,20,0.4)]"
          >
            Try Lexora free
          </Link>
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-full hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute top-full mt-2 inset-x-4 pointer-events-auto rounded-2xl bg-white border border-border shadow-cardHover overflow-hidden animate-slide-up">
          <div className="p-2 flex flex-col">
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm text-fg hover:bg-zinc-100"
              >
                {l.label}
              </a>
            ))}
            <Link href="/login" className="px-3 py-2.5 rounded-md text-sm text-fg hover:bg-zinc-100" onClick={() => setOpen(false)}>
              Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

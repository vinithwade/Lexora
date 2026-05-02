import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-5 sm:px-6 pb-8">
      <div className="max-w-6xl mx-auto rounded-3xl bg-sky-50/80 border border-sky-100 p-8 sm:p-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center shadow-glow">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="font-semibold tracking-tight text-zinc-900 text-lg">Lexora</span>
            </Link>
            <p className="mt-4 text-sm text-zinc-600 leading-relaxed max-w-sm">
              Your daily AI accountability coach. Built for founders and
              operators who want to ship every day.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <SocialBtn label="X"><XLogo /></SocialBtn>
              <SocialBtn label="LinkedIn"><LinkedInLogo /></SocialBtn>
            </div>
          </div>

          <FooterCol title="Pages" links={[
            { label: "Home",        href: "#" },
            { label: "Features",    href: "#features" },
            { label: "Pricing",     href: "#pricing" },
            { label: "Blog",        href: "#blog" },
          ]} />
          <FooterCol title="Information" links={[
            { label: "Contact",       href: "#" },
            { label: "Privacy",       href: "#" },
            { label: "Terms of use",  href: "#" },
            { label: "Security",      href: "#" },
          ]} />
        </div>

        <div className="mt-12 pt-6 border-t border-sky-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Lexora · Built with care</span>
          <span>For shippers, by shippers</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title, links,
}: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map(l => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="#" aria-label={label}
      className="h-9 w-9 rounded-full bg-zinc-900 grid place-items-center text-white hover:bg-zinc-700 transition-colors"
    >
      {children}
    </a>
  );
}
function XLogo() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function LinkedInLogo() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
}

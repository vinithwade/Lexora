"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, History, BarChart3, User, Settings,
  LogOut, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", label: "Today",    icon: LayoutDashboard },
  { href: "/history",   label: "History",  icon: History },
  { href: "/insights",  label: "Insights", icon: BarChart3 },
  { href: "/settings",  label: "Settings", icon: Settings },
  { href: "/profile",   label: "Profile",  icon: User },
];

export function AppShell({
  children, user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; avatarUrl?: string | null };
}) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar user={user} onLogout={logout} />
      {/* extra bottom padding so the floating dock never overlaps content */}
      <main className="flex-1 pb-32">{children}</main>
      <Dock />
    </div>
  );
}

function TopBar({
  user, onLogout,
}: {
  user: { name: string; email: string; avatarUrl?: string | null };
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-bg/70 backdrop-blur border-b border-border/60">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center shadow-glow">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-semibold tracking-tight text-fg">Lexora</span>
      </Link>

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-panel2 transition-colors border border-transparent hover:border-border"
          aria-label="Open user menu"
        >
          <Avatar name={user.name} src={user.avatarUrl} size={28} />
          <span className="text-sm font-medium text-fg hidden sm:inline">
            {(user.name || "").split(" ")[0] || "Me"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-panel border border-border shadow-cardHover p-1 animate-slide-up origin-top-right z-30">
            <div className="px-3 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} src={user.avatarUrl} size={36} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-fg truncate">{user.name || "You"}</div>
                  <div className="text-xs text-fgSubtle truncate">{user.email}</div>
                </div>
              </div>
            </div>
            <div className="p-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-fg hover:bg-panel2"
              >
                <User size={14} className="text-fgMuted" /> Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-fg hover:bg-panel2"
              >
                <Settings size={14} className="text-fgMuted" /> Settings
              </Link>
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-fg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Floating dock — clean white pill that fits the light theme. Active item
// gets a soft tinted pill in the time-of-day accent + a thin underline.
// Layered soft shadow gives genuine "floating" depth without going dark.
function Dock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30"
    >
      <div
        className="
          relative flex items-end gap-1
          rounded-2xl p-1.5
          bg-white
          ring-1 ring-zinc-200/70
          shadow-[
            0_1px_2px_rgba(15,15,20,0.04),
            0_8px_24px_-6px_rgba(15,15,20,0.10),
            0_24px_48px_-16px_rgba(15,15,20,0.12)
          ]
        "
      >
        {/* Subtle top edge highlight — like a polished surface catching light */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-px h-px
                     bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
        />

        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return <DockItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={active} />;
        })}
      </div>
    </nav>
  );
}

function DockItem({
  href, label, icon: Icon, active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative z-10 flex flex-col items-center justify-end",
        "rounded-xl transition-colors duration-200 ease-out",
        "h-14 px-4 min-w-[62px]",
        active
          ? "bg-time/10"
          : "hover:bg-zinc-100"
      )}
      style={active ? { backgroundColor: "rgb(var(--time-accent) / 0.10)" } : undefined}
    >
      <Icon
        size={20}
        className={cn(
          "relative transition-colors",
          active
            ? "text-time"
            : "text-zinc-500 group-hover:text-zinc-800"
        )}
      />
      <span className={cn(
        "relative text-[11px] mt-1 transition-colors",
        active
          ? "text-fg font-semibold"
          : "text-zinc-500 group-hover:text-zinc-700"
      )}>
        {label}
      </span>

      {/* Thin underline in the time-of-day accent — colored signature for active */}
      {active && (
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full"
          style={{
            backgroundColor: "rgb(var(--time-accent))",
            boxShadow: "0 0 8px rgb(var(--time-accent) / 0.5)",
          }}
        />
      )}
    </Link>
  );
}

export function PageHeader({
  title, description, action,
}: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
        {description && <p className="text-sm text-fgMuted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8", className)}>{children}</div>;
}

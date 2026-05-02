import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent" | "time";

const tones: Record<Tone, string> = {
  neutral: "bg-panel2 text-fgMuted border-border",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50  text-amber-800  border-amber-200",
  danger:  "bg-red-50    text-red-700    border-red-200",
  info:    "bg-blue-50   text-blue-700   border-blue-200",
  accent:  "bg-accentSoft text-accentDim border-accent/20",
  time:    "bg-timeSoft text-timeDim border-time/30",
};

const dots: Record<Tone, string> = {
  neutral: "bg-fgMuted",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
  info:    "bg-blue-500",
  accent:  "bg-accent",
  time:    "bg-time",
};

export function Badge({
  children, tone = "neutral", className, dot,
}: { children: React.ReactNode; tone?: Tone; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}

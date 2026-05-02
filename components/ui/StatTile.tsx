import { cn } from "@/lib/cn";

export function StatTile({
  icon, label, value, sublabel, accent, className,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(
      "rounded-xl bg-panel border border-border p-4 shadow-card",
      accent && "border-accent/40",
      className
    )}>
      <div className="flex items-center gap-2 text-fgMuted text-xs uppercase tracking-wide">
        {icon && <span className={accent ? "text-accent" : ""}>{icon}</span>}
        {label}
      </div>
      <div className="text-2xl font-semibold mt-2 tabular-nums">{value}</div>
      {sublabel && <div className="text-xs text-fgSubtle mt-1">{sublabel}</div>}
    </div>
  );
}

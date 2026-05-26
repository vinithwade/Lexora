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
      "surface surface-hover rounded-2xl p-4",
      accent && "ring-1 ring-accent/30",
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

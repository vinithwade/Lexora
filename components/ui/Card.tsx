import { cn } from "@/lib/cn";

export function Card({
  className, children, padded = true, hover = false, ...props
}: React.HTMLAttributes<HTMLDivElement> & { padded?: boolean; hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-panel border border-border shadow-card",
        padded && "p-5",
        hover && "transition-colors hover:border-border2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title, description, action, className,
}: { title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div>
        <h2 className="text-base font-semibold text-fg">{title}</h2>
        {description && <p className="text-sm text-fgMuted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

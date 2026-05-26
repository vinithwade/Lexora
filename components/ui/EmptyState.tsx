import { cn } from "@/lib/cn";

export function EmptyState({
  icon, title, description, action, className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
      <div className="h-14 w-14 rounded-2xl glass grid place-items-center text-time mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description && <p className="text-sm text-fgMuted mt-1.5 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

import { cn } from "@/lib/cn";

export function Avatar({
  name = "", src, size = 32, className,
}: { name?: string; src?: string | null; size?: number; className?: string }) {
  const initials = name
    .split(/\s+/).map(s => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
    || "?";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-accentDim text-white font-medium overflow-hidden flex-shrink-0",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
}

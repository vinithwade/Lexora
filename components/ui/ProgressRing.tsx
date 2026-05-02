// Animated SVG ring used for "today's progress" + streak displays.
// `color` defaults to the time-aware accent (CSS var) so it shifts with hour.
export function ProgressRing({
  value, max = 100, size = 120, strokeWidth = 10,
  label, sublabel, color, track = "#E5E5EA",
}: {
  value: number; max?: number; size?: number; strokeWidth?: number;
  label?: string; sublabel?: string; color?: string; track?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / Math.max(1, max)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;
  const stroke = color ?? "rgb(var(--time-accent))";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={track} strokeWidth={strokeWidth} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={stroke} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: "stroke-dasharray 600ms ease-out, stroke 400ms ease" }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            {label && <div className="text-2xl font-semibold tabular-nums text-fg">{label}</div>}
            {sublabel && <div className="text-xs text-fgMuted">{sublabel}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

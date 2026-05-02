"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface TimePickerProps {
  value: string;                 // "HH:MM" (24-hour)
  onChange: (next: string) => void;
  leftIcon?: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

const MINUTE_STEPS = Array.from({ length: 12 }, (_, i) => i * 5); // 0..55 step 5
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12

export function TimePicker({
  value, onChange, leftIcon, className, id, ariaLabel,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { hour12, minute, period } = parse24(value);

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function commit(h12: number, m: number, p: "AM" | "PM") {
    onChange(format24(h12, m, p));
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel || "Select time"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full h-10 rounded-lg bg-panel border border-border shadow-card text-left",
          "flex items-center gap-2 px-3 text-sm text-fg transition-colors",
          "hover:border-border2 focus:outline-none focus-visible:ring-2 focus-visible:ring-time focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          open && "border-time"
        )}
      >
        {leftIcon ? (
          <span className="text-fgSubtle flex-shrink-0">{leftIcon}</span>
        ) : (
          <Clock size={15} className="text-fgSubtle flex-shrink-0" />
        )}
        <span className="font-medium tabular-nums">
          {String(hour12).padStart(2, "0")}:{String(minute).padStart(2, "0")} {period}
        </span>
        <ChevronDown
          size={15}
          className={cn(
            "ml-auto text-fgSubtle transition-transform",
            open && "rotate-180 text-time"
          )}
        />
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl bg-panel border border-border shadow-cardHover p-3 animate-slide-up origin-top"
        >
          <div className="grid grid-cols-3 gap-3">
            {/* Hours */}
            <Column label="Hour">
              {HOURS.map(h => (
                <Cell
                  key={h}
                  active={h === hour12}
                  onClick={() => commit(h, minute, period)}
                >
                  {String(h).padStart(2, "0")}
                </Cell>
              ))}
            </Column>

            {/* Minutes */}
            <Column label="Min">
              {MINUTE_STEPS.map(m => (
                <Cell
                  key={m}
                  active={m === roundToStep(minute, 5)}
                  onClick={() => commit(hour12, m, period)}
                >
                  {String(m).padStart(2, "0")}
                </Cell>
              ))}
            </Column>

            {/* AM/PM */}
            <Column label="Period">
              {(["AM", "PM"] as const).map(p => (
                <Cell
                  key={p}
                  active={p === period}
                  onClick={() => commit(hour12, minute, p)}
                  size="lg"
                >
                  {p}
                </Cell>
              ))}
            </Column>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-fgSubtle">
              Selected: <span className="text-fg font-medium tabular-nums">
                {String(hour12).padStart(2, "0")}:{String(minute).padStart(2, "0")} {period}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-time hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="text-[10px] uppercase tracking-wider text-fgSubtle mb-1.5 px-1">{label}</div>
      <div className="max-h-44 overflow-y-auto rounded-md bg-panel2 border border-border p-1 flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
}

function Cell({
  active, onClick, children, size = "md",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md text-sm font-medium tabular-nums transition-colors text-center",
        size === "lg" ? "py-3" : "py-1.5",
        active
          ? "bg-time text-white shadow-card"
          : "text-fg hover:bg-panel"
      )}
    >
      {children}
    </button>
  );
}

// ---------- helpers ----------

function parse24(hhmm: string): { hour12: number; minute: number; period: "AM" | "PM" } {
  const [hStr = "0", mStr = "0"] = (hhmm || "00:00").split(":");
  let h = parseInt(hStr); if (isNaN(h)) h = 0;
  let m = parseInt(mStr); if (isNaN(m)) m = 0;
  const period: "AM" | "PM" = h < 12 ? "AM" : "PM";
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return { hour12: h12, minute: m, period };
}

function format24(h12: number, m: number, period: "AM" | "PM"): string {
  let h = h12 % 12; // 12 → 0
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function roundToStep(m: number, step: number) {
  return Math.round(m / step) * step % 60;
}

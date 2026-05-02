"use client";

import { useEffect, useState } from "react";
import { userLocalSecondsOfDay, hmToSeconds } from "@/lib/time";

// Counts down to the scheduled meet time itself. The button is not live
// before that — see nowMeetingType in lib/time.ts.
//
// Visual: digits live in an "action orange" pill that gently pulses. Color
// + motion exploit involuntary attention (peripheral vision detects motion;
// warm orange triggers action without alarm — same psychology used by
// Amazon "Buy now", Booking "limited", food-delivery live trackers).
// As the countdown approaches zero the pulse speeds up.
export default function MeetCountdown({
  meetTime, timezone,
}: { meetTime: string; timezone: string }) {
  const [secsLeft, setSecsLeft] = useState<number | null>(null);

  useEffect(() => {
    const browserTz = (() => {
      try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
      catch { return timezone; }
    })();

    function tick() {
      const meetSecs = hmToSeconds(meetTime);
      const nowSecs = userLocalSecondsOfDay(browserTz);
      let diff = (meetSecs - nowSecs + 86400) % 86400;
      if (diff < 1) diff = 0;
      setSecsLeft(diff);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [meetTime, timezone]);

  if (secsLeft === null) return <span className="text-sm text-fgMuted">…</span>;

  if (secsLeft === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Starting now
      </span>
    );
  }

  // Urgency tier — the closer to zero, the brighter and faster.
  const urgent  = secsLeft <= 60;          // < 1 min → bright, fast pulse
  const soon    = secsLeft <= 5 * 60;      // < 5 min → orange, medium pulse
  const default_ = !urgent && !soon;       // > 5 min → orange, slow pulse

  const pulseSpeed = urgent ? "1s" : soon ? "1.6s" : "2.4s";

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-fgMuted">Starts in</span>
      <span
        className="
          inline-flex items-center
          rounded-md px-2 py-1
          font-bold tabular-nums tracking-tight
          text-orange-700 bg-orange-50 border border-orange-200
          shadow-[0_0_0_3px_rgba(249,115,22,0.10)]
          animate-[countdownPulse_var(--pulse,2.4s)_ease-in-out_infinite]
        "
        style={{
          // CSS custom property drives the keyframe duration
          ["--pulse" as any]: pulseSpeed,
          color: urgent ? "#C2410C" : undefined,
          background: urgent ? "#FFF7ED" : undefined,
        }}
      >
        {format(secsLeft)}
      </span>

      {/* Inline keyframes — Tailwind's safelist of arbitrary animations is
          flaky, so define here once. */}
      <style>{`
        @keyframes countdownPulse {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(249,115,22,0.10), 0 0 0 0 rgba(249,115,22,0.0);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(249,115,22,0.18), 0 0 16px 2px rgba(249,115,22,0.30);
          }
        }
      `}</style>
    </span>
  );
}

function format(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  // Always show seconds — that's the ticking element that draws the eye.
  if (h > 0) return `${h}h ${pad(m)}m ${pad(sec)}s`;
  if (m > 0) return `${m}m ${pad(sec)}s`;
  return `${sec}s`;
}
function pad(n: number) { return n.toString().padStart(2, "0"); }

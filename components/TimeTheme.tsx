"use client";

import { useEffect } from "react";

// Sets a `data-time-band` attribute on <html> based on the user's current
// local hour. CSS variables (--time-accent / --time-accent-dim) defined in
// globals.css then drive the ambient accent color across the app.
//
// Bands (chronobiology research summary):
//   morning  5–12  → warm amber  (cortisol rising, alertness)
//   day      12–17 → focus indigo (peak focus, low stimulation)
//   evening  17–22 → sunset coral (warm wind-down, reflection)
//   night    22–5  → twilight indigo (calm, melatonin prep)
export function TimeTheme() {
  useEffect(() => {
    function apply() {
      const h = new Date().getHours();
      const band =
        h >= 5  && h < 12 ? "morning"
      : h >= 12 && h < 17 ? "day"
      : h >= 17 && h < 22 ? "evening"
      : "night";
      document.documentElement.setAttribute("data-time-band", band);
    }
    apply();
    // Re-evaluate hourly in case the tab is left open across boundaries.
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, []);
  return null;
}

// Server-side helper if you ever want to render the band into HTML
// (avoids a flash). Use sparingly — server doesn't know user's TZ.
export function timeBandFromHour(hour: number): "morning" | "day" | "evening" | "night" {
  if (hour >= 5 && hour < 12)  return "morning";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

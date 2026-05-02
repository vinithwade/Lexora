// Helpers for working in the user's local timezone.

export function userLocalDate(timezone: string, when = new Date()): string {
  // YYYY-MM-DD in the user's TZ
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  return fmt.format(when);
}

export function userLocalHM(timezone: string, when = new Date()): string {
  // HH:MM (24h) in the user's TZ
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  return fmt.format(when);
}

export function userLocalSecondsOfDay(timezone: string, when = new Date()): number {
  // Seconds since local midnight in the user's TZ (0..86399)
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const [h, m, s] = fmt.format(when).split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

export function hmToSeconds(t: string): number {
  // Accepts "HH:MM" or "HH:MM:SS"
  const [h = 0, m = 0, s = 0] = t.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

// Diff in minutes between two HH:MM strings (b - a). Wraps around 24h.
export function minutesBetween(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  const av = ah * 60 + am;
  const bv = bh * 60 + bm;
  return bv - av;
}

// How many minutes the button stays live AFTER the scheduled start time.
// The button does NOT go live before the scheduled time.
export const MEETING_GRACE_MIN = 30;

export function nowMeetingType(
  morning: string,
  evening: string,
  current: string
): "morning" | "evening" | null {
  // Returns the meet whose scheduled time was JUST passed (within the grace
  // window). If both meets are inside their grace windows, return the one
  // that started more recently. Handles midnight wraparound.
  const aM = minutesAfter(morning, current);
  const aE = minutesAfter(evening, current);
  const inM = aM <= MEETING_GRACE_MIN;
  const inE = aE <= MEETING_GRACE_MIN;
  if (inM && inE) return aM <= aE ? "morning" : "evening";
  if (inM) return "morning";
  if (inE) return "evening";
  return null;
}

// Minutes elapsed since `meet` time, going forward only (wraps 24h).
// E.g. meet=23:50, current=00:10 → 20 (not -1420).
//      meet=01:40, current=01:37 → 1437 (i.e. 23h 57m — meet hasn't arrived yet today).
function minutesAfter(meet: string, current: string): number {
  const m = hmToSeconds(meet) / 60;
  const c = hmToSeconds(current) / 60;
  return ((c - m) % 1440 + 1440) % 1440;
}

export function fmtTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const hh = ((h + 11) % 12) + 1;
  const ap = h < 12 ? "AM" : "PM";
  return `${hh}:${m.toString().padStart(2, "0")} ${ap}`;
}

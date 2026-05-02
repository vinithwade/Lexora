"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// One-shot: if the timezone stored in the user's profile differs from the
// browser's detected timezone, silently update Supabase and refresh the
// page. This keeps the server-side "is the meet active right now?" logic
// in sync with what the user actually sees on their clock.
//
// Common scenario: the user signed up via Google → the trigger created a
// profile with timezone=UTC → onboarding errored → they never saved the
// real TZ. Without this, the dashboard runs every calculation in UTC.
export default function TimezoneSyncer({ storedTz }: { storedTz: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let browserTz: string | null = null;
      try { browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}
      if (!browserTz || browserTz === storedTz) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { error } = await supabase
        .from("profiles")
        .update({ timezone: browserTz })
        .eq("id", user.id);

      if (!error && !cancelled) {
        // Force a server re-render so the meet windows recompute with the
        // correct TZ. Without this, button availability stays wrong until
        // the user manually reloads.
        router.refresh();
      }
    })();
    return () => { cancelled = true; };
  }, [storedTz, router]);

  return null;
}

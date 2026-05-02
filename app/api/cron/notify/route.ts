import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { userLocalHM, minutesBetween } from "@/lib/time";

// Vercel Cron hits this every minute. We find any user whose morning or
// evening meet is due in 5 minutes and send a reminder email.
//
// Auth: cron requests must include `Authorization: Bearer ${CRON_SECRET}`.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, email, full_name, timezone, morning_time, evening_time, notif_email, onboarded");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sendable = (profiles || []).filter(p => p.onboarded && p.notif_email && p.email);
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Lexora <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let queued = 0;
  for (const p of sendable) {
    const tz = p.timezone || "UTC";
    let nowHM: string;
    try { nowHM = userLocalHM(tz); } catch { continue; }

    const morning = String(p.morning_time).slice(0, 5);
    const evening = String(p.evening_time).slice(0, 5);
    const morningDelta = minutesBetween(nowHM, morning);
    const eveningDelta = minutesBetween(nowHM, evening);

    let dueType: "morning" | "evening" | null = null;
    if (morningDelta === 5) dueType = "morning";
    else if (eveningDelta === 5) dueType = "evening";
    if (!dueType) continue;

    if (resend) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: p.email!,
          subject: `Lexora · your ${dueType} meet starts in 5 min`,
          html: `<p>Hi ${p.full_name?.split(" ")[0] || "there"},</p>
                 <p>Your <b>${dueType}</b> meeting with Lexora starts in 5 minutes.</p>
                 <p><a href="${appUrl}/dashboard" style="background:#7c5cff;color:white;padding:10px 16px;border-radius:8px;text-decoration:none">Open Lexora</a></p>`,
        });
        queued++;
      } catch (e) {
        console.error("notify email failed", e);
      }
    }
  }

  return NextResponse.json({ ok: true, queued });
}

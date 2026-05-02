"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export default function NotificationsForm({
  notifEmail: init, email,
}: { notifEmail: boolean; email: string }) {
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();
  const [notifEmail, setNotifEmail] = useState(init);
  const [busy, setBusy] = useState(false);

  async function toggle(next: boolean) {
    setBusy(true);
    setNotifEmail(next);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { error } = await supabase.from("profiles").update({ notif_email: next }).eq("id", user.id);
    setBusy(false);
    if (error) { toast.error("Couldn't save", error.message); setNotifEmail(!next); return; }
    toast.success(next ? "Email reminders on" : "Email reminders off");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader
        title="Notifications"
        description="We'll email you 5 minutes before each meeting."
        action={<Bell size={16} className="text-fgMuted" />}
      />
      <div className="flex items-center justify-between gap-4 py-3">
        <div>
          <div className="text-sm font-medium">Email reminders</div>
          <div className="text-xs text-fgMuted mt-0.5">Sent to {email}</div>
        </div>
        <Toggle checked={notifEmail} onChange={toggle} disabled={busy} />
      </div>

      <div className="flex items-center justify-between gap-4 py-3 border-t border-border">
        <div>
          <div className="text-sm font-medium text-fgMuted">Push notifications</div>
          <div className="text-xs text-fgSubtle mt-0.5">Coming soon — browser push reminders.</div>
        </div>
        <Toggle checked={false} onChange={() => {}} disabled />
      </div>
    </Card>
  );
}

function Toggle({
  checked, onChange, disabled,
}: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0",
        checked ? "bg-accent" : "bg-border",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

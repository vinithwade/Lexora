"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Sunrise, Moon, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Label, FormHint } from "@/components/ui/Input";
import { TimePicker } from "@/components/ui/TimePicker";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ScheduleForm({
  morning: initMorning, evening: initEvening, timezone: initTz,
}: { morning: string; evening: string; timezone: string }) {
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();
  const [morning, setMorning] = useState(initMorning);
  const [evening, setEvening] = useState(initEvening);
  const [tz, setTz] = useState(initTz);
  const [busy, setBusy] = useState(false);

  const sameTime = morning && evening && morning === evening;

  async function save() {
    if (sameTime) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { error } = await supabase.from("profiles").update({
      morning_time: morning + ":00",
      evening_time: evening + ":00",
      timezone: tz,
    }).eq("id", user.id);
    setBusy(false);
    if (error) { toast.error("Couldn't save", error.message); return; }
    toast.success("Schedule updated");
    router.refresh();
  }

  function detectTz() {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTz(detected);
      toast.info("Detected", detected);
    } catch {
      toast.error("Couldn't detect timezone");
    }
  }

  return (
    <Card>
      <CardHeader
        title="Schedule"
        description="When Lexora calls you each day."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Morning meet</Label>
          <TimePicker value={morning} onChange={setMorning} leftIcon={<Sunrise size={15} />} />
        </div>
        <div>
          <Label>Evening meet</Label>
          <TimePicker value={evening} onChange={setEvening} leftIcon={<Moon size={15} />} />
        </div>
      </div>
      {sameTime && <FormHint error>Morning and evening must be different.</FormHint>}

      <div className="mt-4">
        <Label>Timezone</Label>
        <div className="flex gap-2">
          <Input value={tz} onChange={e => setTz(e.target.value)} leftIcon={<Globe size={15} />} />
          <Button variant="secondary" onClick={detectTz}>Detect</Button>
        </div>
        <FormHint>IANA timezone (e.g. Asia/Calcutta, America/New_York).</FormHint>
      </div>

      <div className="mt-5">
        <Button onClick={save} loading={busy} disabled={!!sameTime} leftIcon={<Save size={14} />}>
          Save changes
        </Button>
      </div>
    </Card>
  );
}

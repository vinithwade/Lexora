"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function JoinMeetingButton({ type }: { type: "morning" | "evening" }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    const r = await fetch("/api/meeting/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { toast.error("Couldn't start meeting", j.error || "Unknown error"); return; }
    router.push(`/meeting/${j.id}`);
  }

  return (
    <Button onClick={start} loading={busy} size="md" leftIcon={<Video size={14} />}>
      Join meeting
    </Button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, ArrowRight, Sunrise, Moon, Globe, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormHint } from "@/components/ui/Input";
import { TimePicker } from "@/components/ui/TimePicker";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type Step = 0 | 1 | 2;

export default function OnboardingWizard(props: {
  defaultMorning: string;
  defaultEvening: string;
  defaultTimezone: string;
  defaultName: string;
  email: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState(props.defaultName);
  const [morning, setMorning] = useState(toHM(props.defaultMorning));
  const [evening, setEvening] = useState(toHM(props.defaultEvening));
  const [tz, setTz] = useState(props.defaultTimezone);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (props.defaultTimezone === "UTC") {
      try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch {}
    }
  }, [props.defaultTimezone]);

  const canNext =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && morning && evening && morning !== evening) ||
    (step === 2 && tz.trim().length > 0);

  async function finish() {
    setBusy(true); setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { error } = await supabase.from("profiles").update({
      full_name: name,
      morning_time: morning + ":00",
      evening_time: evening + ":00",
      timezone: tz,
      onboarded: true,
    }).eq("id", user.id);
    setBusy(false);
    if (error) { setErr(error.message); toast.error("Couldn't save", error.message); return; }
    toast.success("You're all set", "Let's go.");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-xl animate-slide-up">
      {/* Brand */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accentDim grid place-items-center shadow-glow">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="font-semibold text-lg">Lexora</span>
      </div>

      {/* Progress */}
      <div className="mb-5 flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            i <= step ? "bg-accent" : "bg-border"
          )} />
        ))}
      </div>
      <div className="text-xs text-fgSubtle mb-4">Step {step + 1} of 3</div>

      <Card padded={false}>
        <div className="p-6 sm:p-8">
          {step === 0 && (
            <StepOne name={name} setName={setName} email={props.email} />
          )}
          {step === 1 && (
            <StepTwo morning={morning} setMorning={setMorning} evening={evening} setEvening={setEvening} />
          )}
          {step === 2 && (
            <StepThree tz={tz} setTz={setTz} />
          )}
          {err && <FormHint error>{err}</FormHint>}
        </div>

        <div className="border-t border-border px-6 sm:px-8 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={step === 0 || busy}
            onClick={() => setStep(s => Math.max(0, (s - 1) as Step) as Step)}
            leftIcon={<ArrowLeft size={14} />}
          >
            Back
          </Button>
          {step < 2 ? (
            <Button
              disabled={!canNext}
              onClick={() => setStep(s => Math.min(2, (s + 1) as Step) as Step)}
              rightIcon={<ArrowRight size={14} />}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={finish} loading={busy} disabled={!canNext} rightIcon={<Check size={14} />}>
              Finish setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function StepOne({ name, setName, email }: { name: string; setName: (s: string) => void; email: string }) {
  return (
    <>
      <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center mb-4">
        <Sparkles size={18} className="text-accent" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome to Lexora</h1>
      <p className="text-fgMuted text-sm mt-1.5">First — what should we call you?</p>
      <div className="mt-6">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" required value={name} onChange={e => setName(e.target.value)} placeholder="Vinith" autoFocus />
        <FormHint>Logged in as <span className="text-fgMuted">{email}</span></FormHint>
      </div>
    </>
  );
}

function StepTwo({
  morning, setMorning, evening, setEvening,
}: { morning: string; setMorning: (s: string) => void; evening: string; setEvening: (s: string) => void }) {
  return (
    <>
      <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center mb-4">
        <Sunrise size={18} className="text-accent" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Pick your meeting times</h1>
      <p className="text-fgMuted text-sm mt-1.5">
        You'll meet Lexora twice a day. Both can be changed anytime.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <Label>Morning meet</Label>
          <TimePicker value={morning} onChange={setMorning} leftIcon={<Sunrise size={15} />} />
        </div>
        <div>
          <Label>Evening meet</Label>
          <TimePicker value={evening} onChange={setEvening} leftIcon={<Moon size={15} />} />
        </div>
      </div>
      {morning && evening && morning === evening && (
        <FormHint error>Morning and evening must be different times.</FormHint>
      )}
    </>
  );
}

function StepThree({ tz, setTz }: { tz: string; setTz: (s: string) => void }) {
  return (
    <>
      <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 grid place-items-center mb-4">
        <Globe size={18} className="text-accent" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Confirm your timezone</h1>
      <p className="text-fgMuted text-sm mt-1.5">
        We'll use this to figure out when "morning" and "evening" are for you.
      </p>
      <div className="mt-6">
        <Label>Timezone</Label>
        <Input required value={tz} onChange={e => setTz(e.target.value)}
               leftIcon={<Globe size={15} />} />
        <FormHint>Auto-detected from your browser. Change only if it's wrong.</FormHint>
      </div>
    </>
  );
}

function toHM(t: string) { return t?.length >= 5 ? t.slice(0, 5) : t; }

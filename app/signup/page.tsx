"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormHint } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToast } from "@/components/ui/Toast";
import { AuthShell, AuthHeading, AuthDivider, AuthFooter } from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setInfo(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: name } },
    });
    setBusy(false);
    if (error) { setErr(error.message); toast.error("Sign up failed", error.message); return; }
    if (data.session) {
      toast.success("Account created", "Let's set up your day.");
      router.replace("/onboarding");
      router.refresh();
    } else {
      setInfo("Check your email to confirm your account, then log in.");
    }
  }

  // Password strength indicator (visual only — server is the real validator)
  const strength = passwordStrength(password);

  return (
    <AuthShell>
      <AuthHeading title="Create your account" sub="Two AI meetings a day. Build the streak." />

      <GoogleButton label="Sign up with Google" />

      <AuthDivider>or sign up with email</AuthDivider>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name" required autoComplete="name"
            placeholder="Vinith Wade"
            leftIcon={<User size={15} />}
            value={name} onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email" type="email" required autoComplete="email"
            placeholder="you@company.com"
            leftIcon={<Mail size={15} />}
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password" required minLength={6} autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < strength.score ? strength.color : "bg-border"
                  }`}
                />
              ))}
              <span className={`text-[11px] font-medium ml-1 ${strength.textColor}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {err && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}
        {info && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 flex items-start gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        <Button
          type="submit" loading={busy} fullWidth size="lg"
          rightIcon={!busy ? <ArrowRight size={16} /> : undefined}
        >
          Create account
        </Button>

        <p className="text-[11px] text-fgSubtle text-center leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="/" className="text-fgMuted hover:text-fg underline-offset-2 hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/" className="text-fgMuted hover:text-fg underline-offset-2 hover:underline">Privacy Policy</Link>.
        </p>
      </form>

      <AuthFooter>
        Already have one?{" "}
        <Link href="/login" className="text-accent hover:underline font-medium">
          Log in
        </Link>
      </AuthFooter>
    </AuthShell>
  );
}

function passwordStrength(p: string) {
  let score = 0;
  if (p.length >= 6)  score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score++;

  if (score <= 1) return { score, label: "Weak",       color: "bg-red-400",     textColor: "text-red-600" };
  if (score <= 2) return { score, label: "Fair",       color: "bg-amber-400",   textColor: "text-amber-700" };
  if (score <= 3) return { score, label: "Good",       color: "bg-blue-400",    textColor: "text-blue-700" };
  return            { score, label: "Strong",     color: "bg-emerald-500", textColor: "text-emerald-700" };
}

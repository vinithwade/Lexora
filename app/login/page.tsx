"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormHint } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToast } from "@/components/ui/Toast";
import { AuthShell, AuthHeading, AuthDivider, AuthFooter } from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("error");
    if (e) setErr(decodeURIComponent(e));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setErr(error.message); toast.error("Login failed", error.message); return; }
    toast.success("Welcome back");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell>
      <AuthHeading title="Welcome back" sub="Log in to start today's meeting." />

      <GoogleButton label="Continue with Google" />

      <AuthDivider>or continue with email</AuthDivider>

      <form onSubmit={onSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link href="/login" className="text-xs text-accent hover:underline">
              Forgot?
            </Link>
          </div>
          <PasswordInput
            id="password" required minLength={6} autoComplete="current-password"
            placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
          />
        </div>

        {err && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <Button
          type="submit" loading={busy} fullWidth size="lg"
          rightIcon={!busy ? <ArrowRight size={16} /> : undefined}
        >
          Log in
        </Button>
      </form>

      <AuthFooter>
        New here?{" "}
        <Link href="/signup" className="text-accent hover:underline font-medium">
          Create an account
        </Link>
      </AuthFooter>
    </AuthShell>
  );
}

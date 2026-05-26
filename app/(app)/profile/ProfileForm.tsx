"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormHint } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function ProfileForm({ name: initialName, email, avatarUrl }: { name: string; email: string; avatarUrl?: string | null }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setBusy(false);
    if (error) { toast.error("Couldn't save", error.message); return; }
    toast.success("Profile updated");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Account" description="How you appear inside Lexora." />
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={name || "User"} src={avatarUrl} size={64} />
          <div>
            <div className="text-base font-medium">{name || "Unnamed"}</div>
            <div className="text-sm text-fgMuted">{email}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
            <FormHint>Email is set by your sign-in method and can't be changed here.</FormHint>
          </div>
        </div>
        <div className="mt-5">
          <Button onClick={save} loading={busy} leftIcon={<Save size={14} />}>Save changes</Button>
        </div>
      </Card>

      <Card className="border-danger/40">
        <CardHeader
          title="Danger zone"
          description="These actions can't be undone."
          action={<AlertTriangle size={16} className="text-danger" />}
        />
        <p className="text-sm text-fgMuted mb-4 leading-relaxed">
          To delete your account, contact support. This will permanently remove your meetings,
          tasks, and streak history. (Coming soon: self-serve delete.)
        </p>
        <Button variant="danger" disabled>Delete account</Button>
      </Card>
    </div>
  );
}

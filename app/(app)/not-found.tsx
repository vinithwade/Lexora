import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="max-w-md w-full text-center rounded-xl bg-panel border border-border shadow-card p-8">
        <div className="h-12 w-12 rounded-full bg-panel2 border border-border grid place-items-center mx-auto mb-4">
          <Compass size={20} className="text-fgMuted" />
        </div>
        <h1 className="text-lg font-semibold text-fg">Page not found</h1>
        <p className="text-sm text-fgMuted mt-1.5">That route doesn't exist.</p>
        <div className="mt-5">
          <Link href="/dashboard"><Button>Back to today</Button></Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AppError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[Lexora] page error:", error); }, [error]);

  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="max-w-md w-full text-center rounded-xl bg-panel border border-border shadow-card p-8">
        <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-200 grid place-items-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-amber-600" />
        </div>
        <h1 className="text-lg font-semibold text-fg">Something went wrong</h1>
        <p className="text-sm text-fgMuted mt-1.5 leading-relaxed">
          {error?.message || "An unexpected error happened on this page."}
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <Button onClick={reset} leftIcon={<RotateCw size={14} />}>Try again</Button>
        </div>
        {error?.digest && (
          <p className="text-[10px] text-fgSubtle mt-4 font-mono">ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

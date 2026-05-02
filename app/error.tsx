"use client";

import { useEffect } from "react";

// Minimal root-level error boundary. Used for routes outside the (app) group
// (landing, login, signup, onboarding). Logged-in pages have their own
// styled error boundary in app/(app)/error.tsx.
export default function GlobalError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[Lexora] root error:", error); }, [error]);

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-sm text-fgMuted mb-5">{error?.message || "Unexpected error."}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accentDim"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

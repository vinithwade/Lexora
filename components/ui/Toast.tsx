"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "error" | "info";
interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface Ctx {
  toast: (t: Omit<Toast, "id"> | string) => void;
  success: (title: string, description?: string) => void;
  error:   (title: string, description?: string) => void;
  info:    (title: string, description?: string) => void;
}

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, "id"> | string) => {
    const next: Toast = typeof t === "string"
      ? { id: crypto.randomUUID(), tone: "info", title: t }
      : { id: crypto.randomUUID(), ...t };
    setToasts(prev => [...prev, next]);
    setTimeout(() => remove(next.id), 4500);
  }, [remove]);

  const ctx: Ctx = {
    toast,
    success: (title, description) => toast({ tone: "success", title, description }),
    error:   (title, description) => toast({ tone: "error",   title, description }),
    info:    (title, description) => toast({ tone: "info",    title, description }),
  };

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-lg border bg-panel shadow-cardHover backdrop-blur",
              "px-4 py-3 flex items-start gap-3 animate-slide-in-right",
              t.tone === "success" && "border-emerald-200",
              t.tone === "error"   && "border-red-200",
              t.tone === "info"    && "border-border",
            )}
          >
            <div className={cn(
              "flex-shrink-0 mt-0.5",
              t.tone === "success" && "text-emerald-600",
              t.tone === "error"   && "text-red-600",
              t.tone === "info"    && "text-fgMuted",
            )}>
              {t.tone === "success" && <CheckCircle2 size={18} />}
              {t.tone === "error"   && <AlertCircle size={18} />}
              {t.tone === "info"    && <Info size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-fg">{t.title}</div>
              {t.description && <div className="text-xs text-fgMuted mt-0.5">{t.description}</div>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-fgSubtle hover:text-fg flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

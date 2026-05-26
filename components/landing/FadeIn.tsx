"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

// Wraps children in an IntersectionObserver-driven fade-up reveal. Used
// throughout the landing page so every section animates in as you scroll.
export function FadeIn({
  children, className, delay = 0, as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;     // ms
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delay]);

  const Component = Tag as any;
  return (
    <Component
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </Component>
  );
}

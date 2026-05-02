import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, leftIcon, ...props }, ref
) {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-fgSubtle pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-11 rounded-lg bg-panel border px-3 text-sm text-fg placeholder:text-fgSubtle shadow-card",
          "transition-colors focus:outline-none",
          invalid ? "border-danger focus:border-danger" : "border-border focus:border-accent",
          !!leftIcon && "pl-10",
          "disabled:bg-panel2 disabled:text-fgMuted disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  );
});

export function Label({
  children, className, htmlFor,
}: { children: React.ReactNode; className?: string; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-xs font-medium uppercase tracking-wide text-fgMuted mb-1.5", className)}
    >
      {children}
    </label>
  );
}

export function FormHint({ children, error }: { children?: React.ReactNode; error?: boolean }) {
  if (!children) return null;
  return (
    <p className={cn("text-xs mt-1.5", error ? "text-red-600" : "text-fgSubtle")}>
      {children}
    </p>
  );
}

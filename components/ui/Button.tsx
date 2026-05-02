import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "google";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent hover:bg-accentDim text-white shadow-card hover:shadow-cardHover",
  secondary:
    "bg-panel hover:bg-panel2 text-fg border border-border shadow-card",
  ghost:
    "bg-transparent hover:bg-panel2 text-fg border border-transparent",
  danger:
    "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200",
  google:
    "bg-panel hover:bg-panel2 text-fg border border-border shadow-card",
};

const sizes: Record<Size, string> = {
  sm: "h-8  px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2   rounded-lg",
  lg: "h-12 px-6 text-base gap-2 rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className, variant = "primary", size = "md",
    loading, disabled, leftIcon, rightIcon, fullWidth,
    children, ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-150 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variants[variant], sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export { Button };
export type { ButtonProps };

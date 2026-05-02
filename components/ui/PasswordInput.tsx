"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/cn";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  hideIcon?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, invalid, hideIcon, ...props }, ref) {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        {!hideIcon && (
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fgSubtle pointer-events-none" />
        )}
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            "w-full h-11 rounded-lg bg-panel border px-3 text-sm text-fg placeholder:text-fgSubtle shadow-card",
            "transition-colors focus:outline-none",
            invalid ? "border-danger focus:border-danger" : "border-border focus:border-accent",
            !hideIcon && "pl-10",
            "pr-11",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md text-fgSubtle hover:text-fg hover:bg-panel2 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    );
  }
);

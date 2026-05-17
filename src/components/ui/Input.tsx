import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export function Input({
  label,
  hint,
  error,
  iconLeft,
  iconRight,
  id,
  className,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name ?? rest.placeholder ?? "input";
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-white px-4 py-3 transition",
          error
            ? "border-primary/60 focus-within:border-primary"
            : "border-secondary/15 focus-within:border-secondary/40",
        )}
      >
        {iconLeft && <span className="text-muted">{iconLeft}</span>}
        <input
          id={inputId}
          {...rest}
          className={cn(
            "w-full bg-transparent text-sm outline-none placeholder:text-muted",
            className,
          )}
        />
        {iconRight && <span className="text-muted">{iconRight}</span>}
      </div>
      {(error ?? hint) && (
        <p className={cn("text-xs", error ? "text-primary" : "text-muted")}>{error ?? hint}</p>
      )}
    </div>
  );
}

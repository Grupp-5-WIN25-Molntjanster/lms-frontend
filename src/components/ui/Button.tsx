import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconOnly?: boolean;
};

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-400",
  secondary: "bg-secondary text-white hover:bg-secondary-500",
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-sm leading-5 gap-2",
  sm: "px-3.5 py-2 text-sm leading-5 gap-2",
  md: "px-4 py-2.5 text-sm leading-5 gap-2",
  lg: "px-5 py-3 text-base leading-6 gap-2",
  xl: "px-6 py-4 text-lg leading-7 gap-2",
};

const SIZE_ICON: Record<ButtonSize, string> = {
  xs: "p-1.5",
  sm: "p-2",
  md: "p-2.5",
  lg: "p-3.5",
  xl: "p-4.5",
};

const RADIUS: Record<ButtonSize, string> = {
  xs: "rounded-lg",
  sm: "rounded-lg",
  md: "rounded-lg",
  lg: "rounded-[10px]",
  xl: "rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  iconOnly = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANT[variant],
        iconOnly ? SIZE_ICON[size] : SIZE_TEXT[size],
        RADIUS[size],
        className,
      )}
    >
      {iconLeft}
      {!iconOnly && children}
      {iconRight}
    </button>
  );
}

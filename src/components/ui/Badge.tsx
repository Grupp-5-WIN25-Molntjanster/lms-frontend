import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeColor = "primary" | "secondary" | "tertiary" | "quaternary" | "neutral" | "ink";
type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = {
  color?: BadgeColor;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
};

const COLOR: Record<BadgeColor, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary" },
  tertiary: { bg: "bg-tertiary/10", text: "text-tertiary" },
  quaternary: { bg: "bg-quaternary-200/10", text: "text-quaternary-200" },
  neutral: { bg: "bg-muted/10", text: "text-muted" },
  ink: { bg: "bg-black/10", text: "text-black" },
};

const SIZE: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs leading-4",
  md: "px-2 py-0.5 text-sm leading-5",
  lg: "px-2.5 py-1 text-sm leading-5",
};

export function Badge({ color = "secondary", size = "md", children, className }: BadgeProps) {
  const c = COLOR[color];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium",
        c.bg,
        c.text,
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

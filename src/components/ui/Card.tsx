import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg" | "none";
};

const PAD = { none: "", sm: "p-4", md: "p-6", lg: "p-8" } as const;

export function Card({ padding = "md", className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-2xl border border-secondary/10 bg-white",
        PAD[padding],
        className,
      )}
    />
  );
}

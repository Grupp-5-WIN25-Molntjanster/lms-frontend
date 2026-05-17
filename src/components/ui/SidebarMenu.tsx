"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type SidebarItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number | string;
  /** Highlight as the destructive/exit action (e.g. Log Out). */
  danger?: boolean;
};

type SidebarMenuProps = {
  title: string;
  items: SidebarItem[];
  className?: string;
};

export function SidebarMenu({ title, items, className }: SidebarMenuProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={title} className={cn("flex w-[310px] flex-col gap-5", className)}>
      <p className="text-base font-medium uppercase text-muted">{title}</p>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const active = pathname === item.href;
          const tone = item.danger ? "danger" : active ? "active" : "idle";
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-[70px] py-2.5 pl-2.5 pr-4",
                  tone === "active" &&
                    "border border-primary/10 bg-gradient-to-r from-primary/10 to-transparent",
                  tone === "idle" && "bg-bg",
                  tone === "danger" && "bg-bg",
                )}
              >
                <span
                  className={cn(
                    "flex h-[50px] w-[50px] items-center justify-center rounded-full",
                    tone === "active" && "bg-primary text-white",
                    tone === "danger" && "bg-primary text-white",
                    tone === "idle" && "bg-secondary/10 text-secondary",
                  )}
                >
                  {item.icon}
                </span>

                <span
                  className={cn(
                    "flex-1 text-lg font-medium",
                    tone === "active" && "text-primary",
                    tone === "danger" && "text-primary",
                    tone === "idle" && "text-secondary",
                  )}
                >
                  {item.label}
                </span>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-lg font-medium text-white",
                      tone === "active" ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

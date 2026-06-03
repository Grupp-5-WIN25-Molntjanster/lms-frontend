import Link from "next/link";
import type { ReactNode } from "react";
import { DashboardShell } from "./DashboardShell";
import { cn } from "@/lib/cn";
import { HelpIcon } from "@/components/icons";

const TABS = [
  { slug: "general" as const, href: "/profile", label: "General" },

];

type ActiveTab = (typeof TABS)[number]["slug"];

type ProfileShellProps = {
  active: ActiveTab;
  /** Page header title. Defaults to a sensible value per active tab. */
  title?: string;
  children: ReactNode;
};

const DEFAULT_TITLE: Record<ActiveTab, string> = {
  general: "Profile"
};

export function ProfileShell({ active, title, children }: ProfileShellProps) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">{title ?? DEFAULT_TITLE[active]}</h1>
          <button className="inline-flex items-center gap-2 rounded-xl bg-bg px-5 py-2.5 text-xs font-semibold text-secondary hover:bg-secondary/10">
            <HelpIcon className="h-4 w-4" />
            Need Help?
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex gap-2">
          {TABS.map((t) => {
            const isActive = t.slug === active;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "rounded-xl px-6 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-secondary text-white"
                    : "text-muted hover:text-secondary hover:bg-bg",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </DashboardShell>
  );
}

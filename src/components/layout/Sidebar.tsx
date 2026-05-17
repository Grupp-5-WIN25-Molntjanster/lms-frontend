"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import Image from "next/image";
import {
  CalendarIcon,
  GraduationIcon,
  HelpIcon,
  HomeIcon,
  LogoutIcon,
  SettingsIcon,
  TeamIcon,
  UserIcon,
  VideoIcon,
  XIcon,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const MENU: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/courses", label: "Courses", icon: GraduationIcon },
  { href: "/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/live", label: "Live Class", icon: VideoIcon },
];

const GENERAL: NavItem[] = [
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/team", label: "Team", icon: TeamIcon },
  { href: "/settings/password", label: "Settings", icon: SettingsIcon },
  { href: "/help", label: "Help Center", icon: HelpIcon },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-4 rounded-full py-2.5 pl-2.5 pr-4 transition",
        active
          ? "border border-primary/10 bg-gradient-to-r from-primary/10 to-transparent"
          : "bg-transparent hover:bg-bg",
      )}
    >
      <span
        className={cn(
          "grid h-[50px] w-[50px] place-items-center rounded-full transition",
          active ? "bg-primary text-white" : "bg-secondary/10 text-secondary",
        )}
      >
        <Icon />
      </span>
      <span
        className={cn(
          "flex-1 text-base font-medium",
          active ? "text-primary" : "text-secondary",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-secondary/10 bg-white px-5 py-6 lg:w-[300px]">
      {/* Logo + close button on mobile */}
      <div className="flex items-center justify-between px-2 py-2">
          <Image
            src="/logo2.png"
            alt="Shiko Logo"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
          {onClose && (
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl bg-bg text-secondary lg:hidden"
              aria-label="Close menu"
            >
              <XIcon />
            </button>
          )}
      </div>

      <nav className="flex flex-col gap-1.5">
        <p className="px-2.5 pb-1 text-xs font-semibold uppercase tracking-widest text-muted">
          Menu
        </p>
        {MENU.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <nav className="flex flex-col gap-1.5">
        <p className="px-2.5 pb-1 text-xs font-semibold uppercase tracking-widest text-muted">
          General
        </p>
        {GENERAL.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <Link
          href="/sign-in"
          className="flex items-center gap-4 rounded-2xl py-2.5 pl-2.5 pr-4 transition hover:bg-bg"
        >
          <span className="grid h-[50px] w-[50px] place-items-center rounded-xl bg-primary text-white">
            <LogoutIcon />
          </span>
          <span className="flex-1 text-base font-medium text-primary">Log Out</span>
        </Link>
      </nav>

      {/* Promo — Download Our Mobile App */}
      <div className="relative mt-auto overflow-hidden rounded-2xl p-5 text-white">
        <Image src="/mobile-bg.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <p className="text-lg font-bold leading-snug">Download Our<br />Mobile App</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold">
            Download App
          </button>
        </div>
      </div>
    </aside>
  );
}

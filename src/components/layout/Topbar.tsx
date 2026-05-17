"use client";

import { BellIcon, MailIcon, MenuIcon, SearchIcon } from "@/components/icons";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-secondary/10 bg-white px-4 py-4 lg:gap-6 lg:px-8 lg:py-5">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bg text-secondary lg:hidden"
      >
        <MenuIcon />
      </button>

      {/* Search — hidden on mobile, visible on md+ */}
      <label className="hidden flex-1 max-w-[480px] items-center gap-3 rounded-2xl bg-bg px-5 py-3.5 md:flex">
        <SearchIcon className="shrink-0 text-muted" />
        <input
          type="search"
          placeholder="Search task..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>

      {/* Search icon only — mobile */}
      <button
        aria-label="Search"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bg text-secondary md:hidden"
      >
        <SearchIcon />
      </button>

      <div className="flex items-center gap-3 lg:gap-5">
        <button
          aria-label="Messages"
          className="grid h-10 w-10 place-items-center rounded-xl bg-bg text-secondary"
        >
          <MailIcon />
        </button>
        <span className="hidden h-5 w-px bg-secondary/15 sm:block" />
        <button
          aria-label="Notifications"
          className="grid h-10 w-10 place-items-center rounded-xl bg-bg text-secondary"
        >
          <BellIcon />
        </button>
        <span className="hidden h-5 w-px bg-secondary/15 sm:block" />
        <div className="flex items-center gap-2 lg:gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-white lg:h-11 lg:w-11">
            R
          </span>
          <div className="hidden flex-col leading-tight lg:flex">
            <span className="text-sm font-semibold">Riad Alrashed</span>
            <span className="text-xs text-muted">riad@example.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}

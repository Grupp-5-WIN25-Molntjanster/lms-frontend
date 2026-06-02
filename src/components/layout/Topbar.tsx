// components/Topbar.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BellIcon,
  MailIcon,
  MenuIcon,
  SearchIcon,
  KeyIcon,
} from "@/components/icons";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { getUser } from "@/lib/api";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ============================================================
  // REPLACED: Get real user data from localStorage (stored after login)
  // ============================================================
  const [user, setUser] = useState({
    name: "",
    email: "",
    initials: "",
  });

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      const name = `${storedUser.firstName} ${storedUser.lastName}`.trim();
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";
      setUser({
        name: name || storedUser.email,
        email: storedUser.email,
        initials,
      });
    }
  }, []);
  // ============================================================
  // END OF REPLACEMENT – Everything below is UNCHANGED
  // ============================================================

  const handleChangePassword = () => {
    setIsUserMenuOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirect to sign-in
    window.location.href = "/sign-in";
  };

  return (
    <>
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

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 lg:gap-3 focus:outline-none"
              aria-label="User menu"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-white lg:h-11 lg:w-11">
                {user.initials}
              </span>
              <div className="hidden flex-col leading-tight text-left lg:flex">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-muted">{user.email}</span>
              </div>
              <svg
                className={`hidden lg:block w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 z-20 py-1 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <KeyIcon className="w-4 h-4" />
                    Change Password
                  </button>

                  {/* NEW: Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { LockIcon, UserIcon } from "@/components/icons";

export default function EnterPasswordPage() {
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  return (
    <AuthShell>
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold leading-tight text-secondary lg:text-6xl">
          Enter Password
        </h1>
        <p className="text-base text-muted">
          Please enter your password to log in to your account.
        </p>
      </div>

      <form action="/dashboard" className="mt-12 flex flex-col gap-6">
        {/* Email (read-only) */}
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold text-secondary">
            Email address
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-secondary/15 bg-white px-5 py-5">
            <UserIcon className="text-muted" />
            <input
              type="email"
              defaultValue="hasan@gmail.com"
              readOnly
              className="w-full bg-transparent text-base text-secondary outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-3">
          <label
            className="text-base font-semibold text-secondary"
            htmlFor="password"
          >
            Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-secondary/15 bg-white px-5 py-5">
            <LockIcon className="text-muted" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                ceholder="Type your password"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted"
              required
            />
          </div>
        </div>

        {/* Keep me logged in / forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={keepLogged}
              onChange={(e) => setKeepLogged(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Keep me logged in
          </label>
          <Link
            href="#"
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-primary py-5 text-lg font-semibold text-white transition hover:bg-primary-400"
        >
          Sign In
        </button>
      </form>
    </AuthShell>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { UserIcon } from "@/components/icons";
import { authApi, setTokens, setUser } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();

  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // HANDLE LOGIN
  // ============================================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authApi.login({ email, password });

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // ✅ Check if email needs verification
      if (
        result.data?.requiresEmailVerification ||
        (result.data?.user && !result.data.user.emailConfirmed)
      ) {
        setError(
          "Your email is not confirmed. Please verify your email first.",
        );
        sessionStorage.setItem("verifyEmail", email);
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 2000);
        setIsLoading(false);
        return;
      }

      // ✅ Store tokens and redirect
      if (result.data?.accessToken) {
        setTokens(result.data.accessToken, result.data.refreshToken);
        setUser(result.data.user);
        router.push("/courses");
      } else {
        setError("Login succeeded but no token received.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  // ============================================================
  // HANDLE REGISTER
  // ============================================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authApi.register({
        email,
        password,
        firstName,
        lastName,
        role: "Student",
      });

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // ✅ Registration successful – show message then redirect
      setError("Account created! Redirecting to verify your email...");
      sessionStorage.setItem("verifyEmail", email);
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <AuthShell>
      {/* Heading */}
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold leading-tight text-secondary lg:text-6xl">
          {isLogin ? "Welcome" : "Create Account"}
        </h1>
        <p className="text-base text-muted">
          {isLogin
            ? "Please log in to your account to continue."
            : "Create your account to get started."}
        </p>
      </div>

      {/* Error/Success Message */}
      {error && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            error.includes("created") || error.includes("success")
              ? "bg-blue-50 text-blue-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {error}
          {error.includes("not confirmed") && (
            <button
              onClick={() =>
                router.push(`/verify?email=${encodeURIComponent(email)}`)
              }
              className="ml-2 font-medium underline"
            >
              Verify now
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={isLogin ? handleLogin : handleRegister}
        className="mt-12 flex flex-col gap-3"
      >
        {/* Email */}
        <label
          className="text-base font-semibold text-secondary"
          htmlFor="email"
        >
          Email address
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-secondary/15 bg-white px-5 py-5">
          <UserIcon className="text-muted" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email address"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
            required
          />
        </div>

        {/* First & Last Name (Register only) */}
        {!isLogin && (
          <>
            <label
              className="mt-3 text-base font-semibold text-secondary"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="rounded-xl border border-secondary/15 bg-white px-5 py-5 text-base outline-none"
              required
            />

            <label
              className="mt-3 text-base font-semibold text-secondary"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              className="rounded-xl border border-secondary/15 bg-white px-5 py-5 text-base outline-none"
              required
            />
          </>
        )}

        {/* Password */}
        <label
          className="mt-4 text-base font-semibold text-secondary"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password"
          className="rounded-xl border border-secondary/15 bg-white px-5 py-5 text-base outline-none"
          required
          minLength={8}
        />

        {/* Forgot Password (Login only) */}
        {isLogin && (
          <Link
            href="/forgot-password"
            className="self-end text-sm font-medium text-primary underline underline-offset-2"
          >
            Forgot your password?
          </Link>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-7 rounded-xl bg-primary py-5 text-lg font-semibold text-white transition hover:bg-primary-400 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : isLogin ? "Continue" : "Create Account"}
        </button>

        {/* Toggle Login/Register */}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className="rounded-xl border border-primary py-5 text-lg font-semibold text-primary transition hover:bg-primary/5"
        >
          {isLogin ? "Create New Account" : "Sign In Instead"}
        </button>
      </form>

    </AuthShell>
  );
}
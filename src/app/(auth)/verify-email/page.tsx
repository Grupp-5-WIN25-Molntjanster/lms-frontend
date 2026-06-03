"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { authApi } from "@/lib/api"; // عدّل المسار لو api.ts بمكان تاني

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await authApi.verifyEmail({ email, code });
      if (res.error) throw new Error(res.error);

      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => router.push("/sign-in"), 1500);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold leading-tight text-secondary lg:text-6xl">
          Verify Email
        </h1>

        <p className="text-base text-muted">
          Enter the 6-digit verification code sent to:
        </p>

        <p className="font-semibold text-secondary">
          {email}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleVerify} className="mt-12 flex flex-col gap-3">
        <label
          htmlFor="code"
          className="text-base font-semibold text-secondary"
        >
          Verification Code
        </label>

        <input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="rounded-xl border border-secondary/15 bg-white px-5 py-5 text-center text-2xl tracking-[0.5em] outline-none"
          required
        />

        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="mt-7 rounded-xl bg-primary py-5 text-lg font-semibold text-white transition hover:bg-primary-400 disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </AuthShell>
  );
}
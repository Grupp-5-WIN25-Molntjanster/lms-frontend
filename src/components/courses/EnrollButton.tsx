"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { enrollmentApi, getUser } from "@/lib/api";

interface EnrollButtonProps {
  courseId: number;
  courseTitle: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();
  const user = getUser();

  // ============================================================
  // Only render for STUDENT role – return null for others
  // ============================================================
  const isStudent = user?.role === "Student";

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Check if already enrolled
  useEffect(() => {
    if (!isStudent || !user) {
      setLoading(false);
      return;
    }

    const checkEnrollment = async () => {
      try {
        const res = await enrollmentApi.checkEnrollment(user.id, courseId);
        setEnrolled(res.data?.enrolled || false);
      } catch {
        // Not enrolled
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [user, courseId, isStudent]);

  // ============================================================
  // If NOT a student, render NOTHING
  // ============================================================
  if (!isStudent) return null;

  // ============================================================
  // Enroll
  // ============================================================
  const handleEnroll = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setEnrolling(true);
    setError("");
    setMessage("");

    try {
      const res = await enrollmentApi.enroll(courseId);

      if (res.error) {
        setError(res.error);
      } else if (res.data?.success) {
        setEnrolled(true);
        setMessage(res.data.message || "Successfully enrolled!");
      } else {
        setError(res.data?.message || "Enrollment failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  // ============================================================
  // Unenroll
  // ============================================================
  const handleUnenroll = async () => {
    if (!confirm("Are you sure you want to unenroll from this course?")) return;

    setEnrolling(true);
    setError("");
    setMessage("");

    try {
      const res = await enrollmentApi.unenroll(courseId);

      if (res.error) {
        setError(res.error);
      } else {
        setEnrolled(false);
        setMessage("You have been unenrolled.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleGoToCourse = () => {
    router.push(`/courses/${courseId}/learn`);
  };

  // ============================================================
  // Loading skeleton
  // ============================================================
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 border border-secondary/10 shadow-sm animate-pulse">
        <div className="h-5 w-2/3 rounded bg-secondary/10 mb-3" />
        <div className="h-4 w-full rounded bg-secondary/5 mb-4" />
        <div className="h-12 w-full rounded-xl bg-secondary/5" />
      </div>
    );
  }

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="rounded-2xl bg-white p-6 border border-secondary/10 shadow-sm">
      <h3 className="text-base font-bold text-secondary mb-2">
        {enrolled ? "You're Enrolled!" : "Ready to start?"}
      </h3>
      <p className="text-sm text-muted mb-4">
        {enrolled
          ? `You are enrolled in this course. Access all lessons and track your progress.`
          : `Enroll in this course to access all lessons and track your progress.`}
      </p>

      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-3 rounded-lg bg-green-50 p-3 text-xs text-green-600">
          {message}
        </div>
      )}

      {enrolled ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoToCourse}
            className="w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Go to Course
          </button>
          <button
            onClick={handleUnenroll}
            disabled={enrolling}
            className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          >
            {enrolling ? "Processing..." : "Unenroll"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:opacity-50"
        >
          {enrolling ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enrolling...
            </span>
          ) : (
            "Enroll Now – It's Free"
          )}
        </button>
      )}
    </div>
  );
}
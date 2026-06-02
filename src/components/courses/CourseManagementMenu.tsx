"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUser } from "@/lib/api";

export function CourseManagementMenu({ courseId }: { courseId: number }) {
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
  }, []);

  if (!mounted) return null;

  const isInstructorOrAdmin =
    user?.role === "Instructor" || user?.role === "Admin";

  if (!isInstructorOrAdmin) return null;

  return (
    <aside className="rounded-2xl bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </span>
        <div>
          <h3 className="text-sm font-bold text-secondary">
            Course Management
          </h3>
          <p className="text-xs text-muted">
            {user?.role === "Admin" ? "Admin Access" : "Instructor Access"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={`/courses/${courseId}/content`}
          className="flex items-center gap-3 rounded-xl bg-bg px-4 py-3 transition hover:bg-primary/5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-secondary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-secondary">
              Manage Content
            </p>
            <p className="text-xs text-muted">
              Add, edit, reorder modules & lessons
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted shrink-0"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
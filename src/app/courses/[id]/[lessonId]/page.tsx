"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { contentApi } from "@/lib/api";

interface LessonDto {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  durationMinutes: number;
  status: string;
}

export default function LessonPage() {
  const { id: courseId, lessonId } = useParams<{
    id: string;
    lessonId: string;
  }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;
    contentApi
      .getLesson(lessonId)
      .then((res) => {
        if (res.error) setError(res.error);
        else setLesson(res.data);
      })
      .catch(() => setError("Failed to load lesson"))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="animate-pulse p-6 max-w-3xl mx-auto">
          <div className="h-8 w-1/2 rounded bg-secondary/10 mb-4" />
          <div className="h-64 rounded bg-secondary/5" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !lesson) {
    return (
      <DashboardShell>
        <div className="p-6 text-center">
          <p className="text-red-500">{error || "Lesson not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-3 text-primary underline"
          >
            Go Back
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto p-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline mb-4"
        >
          ← Back to Course
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-secondary">{lesson.title}</h1>
        <p className="mt-1 text-sm text-muted">{lesson.durationMinutes} min</p>

        {/* Video */}
        {lesson.videoUrl && (
          <div className="mt-6 aspect-video rounded-xl bg-black overflow-hidden">
            <video src={lesson.videoUrl} controls className="w-full h-full" />
          </div>
        )}

        {/* Content */}
        {lesson.content && (
          <div
            className="mt-6 prose prose-sm max-w-none text-secondary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {/* Complete Button */}
        <div className="mt-8 flex justify-between">
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-400">
            Mark as Complete
          </button>
          <button className="rounded-xl border border-secondary/15 px-6 py-3 text-sm font-semibold text-secondary hover:bg-bg">
            Next Lesson →
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
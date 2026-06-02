"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { contentApi } from "@/lib/api";

// ============================================================
// TYPES
// ============================================================
interface ModuleDto {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  lessonCount: number;
  totalDurationMinutes: number;
  createdAt: string;
}

interface LessonDto {
  id: string;
  moduleId: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
  durationMinutes: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  resources?: ResourceDto[];
}

interface ResourceDto {
  id: string;
  fileId: string;
  resourceType: string;
  attachedAt: string;
}

// ============================================================
// PROPS – Only change: courseId accepts string OR number
// ============================================================
interface Props {
  courseId: string | number;  // ← ONLY THIS LINE CHANGED
  isInstructor?: boolean;
}

// ============================================================
// MODAL OVERLAY
// ============================================================
function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: "16px",
          maxHeight: "85vh",
          overflowY: "auto",
          width: "100%",
          maxWidth: "600px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#f3f4f6",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4b5563",
          }}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// LESSON DETAIL MODAL (UNCHANGED)
// ============================================================
function LessonDetailModal({
  lesson,
  moduleTitle,
  onClose,
}: {
  lesson: LessonDto;
  moduleTitle: string;
  onClose: () => void;
}) {
  const getYouTubeEmbed = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbed(lesson.videoUrl || "");

  return (
    <ModalOverlay onClose={onClose}>
      {embedUrl && (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            backgroundColor: "#000",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
          }}
        >
          <iframe
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      )}

      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "8px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor:
                lesson.status === "Published" ? "#dcfce7" : "#fef9c3",
              color: lesson.status === "Published" ? "#16a34a" : "#ca8a04",
            }}
          >
            {lesson.status}
          </span>
        </div>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "4px",
          }}
        >
          {lesson.title}
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
          Module: {moduleTitle}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "13px",
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          <span>⏱ {lesson.durationMinutes} min</span>
          <span>📝 Order: {lesson.order}</span>
          <span>📅 {new Date(lesson.createdAt).toLocaleDateString()}</span>
          {lesson.updatedAt && (
            <span>
              ✏️ Updated: {new Date(lesson.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {lesson.content && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionTitleStyle}>Content</h3>
            <div
              style={{
                fontSize: "14px",
                color: "#475569",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {lesson.content}
            </div>
          </div>
        )}

        {lesson.videoUrl && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionTitleStyle}>Video Link</h3>
            <a
              href={lesson.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3b82f6",
                fontSize: "14px",
                textDecoration: "underline",
                wordBreak: "break-all",
              }}
            >
              {lesson.videoUrl}
            </a>
          </div>
        )}

        {(lesson.resources || []).length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionTitleStyle}>
              Resources ({(lesson.resources || []).length})
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {(lesson.resources || []).map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    {r.resourceType}
                  </span>
                  <span style={{ color: "#94a3b8" }}>|</span>
                  <span style={{ color: "#64748b" }}>File ID: {r.fileId}</span>
                  <span style={{ color: "#94a3b8" }}>|</span>
                  <span style={{ color: "#64748b", marginLeft: "auto" }}>
                    {new Date(r.attachedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          Close
        </button>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// MODULE DETAIL MODAL (UNCHANGED)
// ============================================================
function ModuleDetailModal({
  module,
  lessonCount,
  onClose,
}: {
  module: ModuleDto;
  lessonCount: number;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ padding: "24px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "4px",
          }}
        >
          {module.title}
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
          Module Details
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "13px",
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          <span>📚 {lessonCount} lessons</span>
          <span>⏱ {module.totalDurationMinutes} min total</span>
          <span>📝 Order: {module.order}</span>
          <span>📅 {new Date(module.createdAt).toLocaleDateString()}</span>
        </div>

        {module.description && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={sectionTitleStyle}>Description</h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
              {module.description}
            </p>
          </div>
        )}

        <button onClick={onClose} style={closeBtnStyle}>
          Close
        </button>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// STYLES (UNCHANGED)
// ============================================================
const sectionTitleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1e293b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const closeBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#fff",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  color: "#64748b",
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export function CourseLessonList({ courseId, isInstructor = false }: Props) {
  const [modules, setModules] = useState<any[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [allLessons, setAllLessons] = useState<Record<string, any[]>>({});
  const [lessonPage, setLessonPage] = useState<Record<string, number>>({});
  const LESSONS_PER_PAGE = 5;

  const [lessonDetail, setLessonDetail] = useState<{
    lesson: LessonDto;
    moduleTitle: string;
  } | null>(null);
  const [moduleDetail, setModuleDetail] = useState<{
    module: ModuleDto;
    lessonCount: number;
  } | null>(null);

  useEffect(() => {
    // ============================================================
    // ONLY THIS LINE CHANGED: String(courseId) to handle both string & number
    // ============================================================
    contentApi.getModules(String(courseId)).then((res) => {
      const items = res.data?.items || [];
      setModules(items);
      if (items.length > 0) {
        setExpanded(items[0].id);
        fetchLessons(items[0].id);
      }
    });
  }, [courseId]);

  const fetchLessons = useCallback(
    async (moduleId: string) => {
      if (allLessons[moduleId]) return;
      const res = await contentApi.getLessons(moduleId, 1, 50);
      const lessons = res.data?.items || [];
      setAllLessons((prev) => ({ ...prev, [moduleId]: lessons }));
      setLessonPage((prev) => ({ ...prev, [moduleId]: 1 }));
    },
    [allLessons],
  );

  const handleToggle = (moduleId: string) => {
    if (expanded === moduleId) {
      setExpanded(null);
    } else {
      setExpanded(moduleId);
      fetchLessons(moduleId);
    }
  };

  const getPaginatedLessons = (moduleId: string) => {
    const lessons = allLessons[moduleId] || [];
    const page = lessonPage[moduleId] || 1;
    const filtered = lessons;
    const totalPages = Math.ceil(filtered.length / LESSONS_PER_PAGE);
    const start = (page - 1) * LESSONS_PER_PAGE;
    const paginated = filtered.slice(start, start + LESSONS_PER_PAGE);
    return { paginated, totalPages, page, total: filtered.length };
  };

  const goToPage = (moduleId: string, page: number) => {
    setLessonPage((prev) => ({ ...prev, [moduleId]: page }));
  };

  if (!modules) {
    return (
      <aside className="rounded-2xl bg-white p-6">
        <h3 className="text-base font-bold text-secondary">Course Content</h3>
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-12 rounded-xl bg-bg" />
          ))}
        </div>
      </aside>
    );
  }

  if (modules.length === 0) {
    return (
      <aside className="rounded-2xl bg-white p-6">
        <h3 className="text-base font-bold text-secondary">Course Content</h3>
        <p className="mt-2 text-sm text-muted">No content yet.</p>
      </aside>
    );
  }

  return (
    <>
      {lessonDetail && (
        <LessonDetailModal
          lesson={lessonDetail.lesson}
          moduleTitle={lessonDetail.moduleTitle}
          onClose={() => setLessonDetail(null)}
        />
      )}
      {moduleDetail && (
        <ModuleDetailModal
          module={moduleDetail.module}
          lessonCount={moduleDetail.lessonCount}
          onClose={() => setModuleDetail(null)}
        />
      )}

      <aside className="rounded-2xl bg-white p-6">
        <h3 className="text-base font-bold text-secondary">Course Content</h3>
        <p className="mt-1 text-xs text-muted">
          {modules.reduce((s: number, m: any) => s + (m.lessonCount || 0), 0)}{" "}
          lessons
        </p>

        <div className="mt-5 space-y-2">
          {modules.map((mod: any, i: number) => {
            const open = expanded === mod.id;
            const { paginated, totalPages, page, total } = getPaginatedLessons(
              mod.id,
            );

            return (
              <div key={mod.id} className="overflow-hidden rounded-xl bg-bg">
                <button
                  onClick={() => handleToggle(mod.id)}
                  className="flex w-full justify-between px-4 py-3.5 text-left hover:bg-secondary/5"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      Section {i + 1}:{" "}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setModuleDetail({
                            module: mod,
                            lessonCount:
                              allLessons[mod.id]?.length || mod.lessonCount,
                          });
                        }}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                          color: "#1e40af",
                        }}
                      >
                        {mod.title}
                      </span>
                    </p>
                    <p className="text-xs text-muted">
                      {isInstructor
                        ? `${mod.lessonCount} lessons`
                        : `${total} lessons`}
                      {isInstructor &&
                        allLessons[mod.id] &&
                        ` (${allLessons[mod.id].filter((l: any) => l.status === "Draft").length} drafts)`}
                    </p>
                  </div>
                  <svg
                    className={cn(
                      "h-4 w-4 text-muted transition",
                      open && "rotate-180",
                    )}
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

                {open && (
                  <div className="border-t border-secondary/10 px-4 pb-3 pt-2">
                    {paginated.length === 0 ? (
                      <p className="py-2 text-xs text-muted">
                        {isInstructor
                          ? "No lessons yet."
                          : "No published lessons."}
                      </p>
                    ) : (
                      <>
                        {paginated.map((lesson: any, j: number) => (
                          <div
                            key={lesson.id}
                            className="flex justify-between py-2 hover:bg-white/50 rounded px-2 -mx-2"
                          >
                            <div className="flex items-center gap-3">
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs text-primary">
                                {(page - 1) * LESSONS_PER_PAGE + j + 1}
                              </span>
                              <div>
                                <button
                                  onClick={() =>
                                    setLessonDetail({
                                      lesson,
                                      moduleTitle: mod.title,
                                    })
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#1e293b",
                                    textAlign: "left",
                                    padding: 0,
                                    textDecoration: "underline",
                                    textUnderlineOffset: "2px",
                                  }}
                                >
                                  {lesson.title}
                                </button>
                                {isInstructor && (
                                  <span
                                    className={`text-xs ml-2 ${
                                      lesson.status === "Published"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                    }`}
                                  >
                                    {lesson.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-muted shrink-0">
                              {lesson.durationMinutes} min
                            </span>
                          </div>
                        ))}

                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pt-3 border-t border-secondary/5 mt-2">
                            <button
                              onClick={() => goToPage(mod.id, page - 1)}
                              disabled={page <= 1}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-white text-xs font-medium text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ‹
                            </button>
                            {Array.from(
                              { length: totalPages },
                              (_, k) => k + 1,
                            ).map((p) => (
                              <button
                                key={p}
                                onClick={() => goToPage(mod.id, p)}
                                className={cn(
                                  "grid h-7 w-7 place-items-center rounded-lg text-xs font-medium",
                                  page === p
                                    ? "bg-primary text-white"
                                    : "bg-white text-secondary hover:bg-primary/10",
                                )}
                              >
                                {p}
                              </button>
                            ))}
                            <button
                              onClick={() => goToPage(mod.id, page + 1)}
                              disabled={page >= totalPages}
                              className="grid h-7 w-7 place-items-center rounded-lg bg-white text-xs font-medium text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ›
                            </button>
                            <span className="text-xs text-muted ml-2">
                              {page}/{totalPages}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
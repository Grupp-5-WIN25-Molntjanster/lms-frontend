"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { contentApi, getUser } from "@/lib/api";
import Link from "next/link";

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
  updatedAt: string;
  resources?: ResourceDto[];
}

interface ResourceDto {
  id: string;
  fileId: string;
  resourceType: string;
  attachedAt: string;
}

// ============================================================
// HELPERS
// ============================================================
function groupLessons(lessons: LessonDto[]) {
  const published = lessons.filter((l) => l.status === "Published");
  const drafts = lessons.filter((l) => l.status !== "Published");
  return { published, drafts };
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// ============================================================
// MODAL COMPONENT (Reusable)
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
        backgroundColor: "rgba(0,0,0,0.6)",
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
          maxHeight: "90vh",
          overflowY: "auto",
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
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// VIDEO MODAL
// ============================================================
function VideoModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const embedUrl = getYouTubeEmbedUrl(url);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          X
        </button>
        <div
          style={{
            padding: "14px 20px",
            backgroundColor: "#111",
            borderBottom: "1px solid #222",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </p>
        </div>
        <div
          style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
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
          ) : (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "16px", marginBottom: "12px" }}>
                  Video preview not available
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  Open video in new tab
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EDIT LESSON MODAL
// ============================================================
function EditLessonModal({
  lesson,
  onClose,
  onSave,
  saving,
}: {
  lesson: LessonDto;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content?: string;
    videoUrl?: string;
    durationMinutes: number;
    order: number;
  }) => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content || "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
  const [duration, setDuration] = useState(lesson.durationMinutes);
  const [order, setOrder] = useState(lesson.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content: content || undefined,
      videoUrl: videoUrl || undefined,
      durationMinutes: duration,
      order,
    });
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ width: "600px", padding: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
          Edit Lesson
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#6b7280",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#6b7280",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#6b7280",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Video URL
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#6b7280",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#6b7280",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={1}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#16a34a",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: saving ? "default" : "pointer",
                opacity: saving ? 0.5 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// LESSON DETAIL MODAL
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
  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl || "");

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ width: "700px" }}>
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
          <div style={{ marginBottom: "12px" }}>
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
          <p
            style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}
          >
            Module: {moduleTitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <span>{lesson.durationMinutes} minutes</span>
            <span>Order: {lesson.order}</span>
            <span>
              Created: {new Date(lesson.createdAt).toLocaleDateString()}
            </span>
            {lesson.updatedAt && (
              <span>
                Updated: {new Date(lesson.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {lesson.content && (
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Content
              </h3>
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
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Video Link
              </h3>
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
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Resources ({(lesson.resources || []).length})
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {(lesson.resources || []).map((resource) => (
                  <div
                    key={resource.id}
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
                      {resource.resourceType}
                    </span>
                    <span style={{ color: "#94a3b8" }}>|</span>
                    <span style={{ color: "#64748b" }}>
                      File ID: {resource.fileId}
                    </span>
                    <span style={{ color: "#94a3b8" }}>|</span>
                    <span style={{ color: "#64748b", marginLeft: "auto" }}>
                      {new Date(resource.attachedAt).toLocaleDateString()}
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
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// COMPONENT
// ============================================================
export default function CourseContentEditorPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    if (user && user.role !== "Instructor" && user.role !== "Admin") {
      router.push(`/courses/${courseId}/overview`);
    }
  }, [user, courseId, router]);

  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [lessonsMap, setLessonsMap] = useState<Record<string, LessonDto[]>>({});
  const [lessonsLoading, setLessonsLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );

  const [showModuleForm, setShowModuleForm] = useState(false);
  const [mTitle, setMTitle] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mOrder, setMOrder] = useState(1);

  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [emTitle, setEmTitle] = useState("");
  const [emDesc, setEmDesc] = useState("");
  const [emOrder, setEmOrder] = useState(1);

  const [showLessonFor, setShowLessonFor] = useState<string | null>(null);
  const [lTitle, setLTitle] = useState("");
  const [lContent, setLContent] = useState("");
  const [lVideo, setLVideo] = useState("");
  const [lDuration, setLDuration] = useState(30);
  const [lOrder, setLOrder] = useState(1);

  const [editLessonModal, setEditLessonModal] = useState<{
    lesson: LessonDto;
    moduleId: string;
  } | null>(null);
  const [detailLessonModal, setDetailLessonModal] = useState<{
    lesson: LessonDto;
    moduleTitle: string;
  } | null>(null);
  const [publishingLesson, setPublishingLesson] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const fetchModules = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await contentApi.getModules(courseId);
      setModules(res.data?.items || []);
    } catch {
      setMsg("Failed to load modules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchLessonsForModule = async (moduleId: string) => {
    if (lessonsMap[moduleId]) return;
    setLessonsLoading((prev) => ({ ...prev, [moduleId]: true }));
    try {
      const res = await contentApi.getLessons(moduleId, 1, 50);
      setLessonsMap((prev) => ({ ...prev, [moduleId]: res.data?.items || [] }));
    } catch {
      setMsg("Failed to load lessons.");
    } finally {
      setLessonsLoading((prev) => ({ ...prev, [moduleId]: false }));
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
        fetchLessonsForModule(moduleId);
      }
      return next;
    });
  };

  const refreshLessons = async (moduleId: string) => {
    setLessonsLoading((prev) => ({ ...prev, [moduleId]: true }));
    try {
      const res = await contentApi.getLessons(moduleId, 1, 50);
      setLessonsMap((prev) => ({ ...prev, [moduleId]: res.data?.items || [] }));
    } catch {
      setMsg("Failed to refresh lessons.");
    } finally {
      setLessonsLoading((prev) => ({ ...prev, [moduleId]: false }));
    }
  };

  const totalLessons = modules.reduce((s, m) => s + m.lessonCount, 0);
  let publishedLessons = 0,
    draftLessons = 0;
  Object.values(lessonsMap).forEach((lessons) => {
    publishedLessons += lessons.filter((l) => l.status === "Published").length;
    draftLessons += lessons.filter((l) => l.status !== "Published").length;
  });

  const addModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await contentApi.createModule(courseId!, {
      title: mTitle,
      description: mDesc || undefined,
      order: mOrder,
    });
    if (res.error) {
      setMsg(res.error);
    } else {
      setShowModuleForm(false);
      setMTitle("");
      setMDesc("");
      setMOrder(1);
      fetchModules();
    }
    setSaving(false);
  };
  const saveModuleEdit = async (moduleId: string) => {
    setSaving(true);
    setMsg("");
    const res = await contentApi.updateModule(moduleId, {
      title: emTitle,
      description: emDesc || undefined,
      order: emOrder,
    });
    if (res.error) {
      setMsg(res.error);
    } else {
      setEditingModule(null);
      fetchModules();
    }
    setSaving(false);
  };
  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    const res = await contentApi.deleteModule(moduleId);
    if (res.error) {
      setMsg(res.error);
    } else {
      setLessonsMap((prev) => {
        const next = { ...prev };
        delete next[moduleId];
        return next;
      });
      fetchModules();
    }
  };
  const addLesson = async (moduleId: string) => {
    setSaving(true);
    setMsg("");
    const res = await contentApi.createLesson(moduleId, {
      title: lTitle,
      content: lContent,
      videoUrl: lVideo || undefined,
      durationMinutes: lDuration,
      order: lOrder,
    });
    if (res.error) {
      setMsg(res.error);
    } else {
      setShowLessonFor(null);
      setLTitle("");
      setLContent("");
      setLVideo("");
      setLDuration(30);
      setLOrder(1);
      await refreshLessons(moduleId);
      fetchModules();
    }
    setSaving(false);
  };
  const handleSaveLesson = async (data: {
    title: string;
    content?: string;
    videoUrl?: string;
    durationMinutes: number;
    order: number;
  }) => {
    if (!editLessonModal) return;
    setSaving(true);
    setMsg("");
    const res = await contentApi.updateLesson(editLessonModal.lesson.id, data);
    if (res.error) {
      setMsg(res.error);
    } else {
      setEditLessonModal(null);
      await refreshLessons(editLessonModal.moduleId);
      fetchModules();
    }
    setSaving(false);
  };
  const publishLesson = async (moduleId: string, lessonId: string) => {
    setPublishingLesson(lessonId);
    setMsg("");
    const res = await contentApi.publishLesson(lessonId);
    if (res.error) {
      setMsg(res.error);
    } else {
      await refreshLessons(moduleId);
      fetchModules();
    }
    setPublishingLesson(null);
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-5xl p-6 animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded-xl bg-secondary/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-secondary/5" />
            ))}
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {videoModal && (
        <VideoModal
          url={videoModal.url}
          title={videoModal.title}
          onClose={() => setVideoModal(null)}
        />
      )}
      {editLessonModal && (
        <EditLessonModal
          lesson={editLessonModal.lesson}
          onClose={() => setEditLessonModal(null)}
          onSave={handleSaveLesson}
          saving={saving}
        />
      )}
      {detailLessonModal && (
        <LessonDetailModal
          lesson={detailLessonModal.lesson}
          moduleTitle={detailLessonModal.moduleTitle}
          onClose={() => setDetailLessonModal(null)}
        />
      )}

      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-4">
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-secondary font-medium">Content Editor</span>
        </div>

        <h1 className="text-2xl font-bold text-secondary">Content Editor</h1>
        <p className="text-sm text-muted">
          Manage modules, lessons, and publishing.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            <p className="text-3xl font-bold">{modules.length}</p>
            <p className="text-xs text-muted">Modules</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            <p className="text-3xl font-bold">{totalLessons}</p>
            <p className="text-xs text-muted">Lessons</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-green-100">
            <p className="text-3xl font-bold text-green-600">
              {publishedLessons}
            </p>
            <p className="text-xs text-green-600">Published</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-yellow-100">
            <p className="text-3xl font-bold text-yellow-600">{draftLessons}</p>
            <p className="text-xs text-yellow-600">Drafts</p>
          </div>
        </div>

        {msg && (
          <div className="mt-4 rounded-xl p-4 text-sm bg-red-50 text-red-600">
            {msg}
            <button
              onClick={() => setMsg("")}
              className="ml-3 underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setShowModuleForm(!showModuleForm);
              setEditingModule(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-400"
          >
            {showModuleForm ? "Cancel" : "+ Add Module"}
          </button>
        </div>

        {showModuleForm && (
          <form
            onSubmit={addModule}
            className="mt-4 rounded-2xl bg-white border p-6 space-y-4"
          >
            <h3 className="font-bold">New Module</h3>
            <input
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-xl border px-4 py-3 text-sm"
              required
            />
            <textarea
              value={mDesc}
              onChange={(e) => setMDesc(e.target.value)}
              placeholder="Description"
              className="w-full rounded-xl border px-4 py-3 text-sm"
              rows={2}
            />
            <input
              type="number"
              value={mOrder}
              onChange={(e) => setMOrder(+e.target.value)}
              className="w-24 rounded-xl border px-4 py-3 text-sm"
              min={1}
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              {saving ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {modules.map((mod, i) => {
            const ml = lessonsMap[mod.id] || [];
            const { published, drafts } = groupLessons(ml);
            const isExpanded = expandedModules.has(mod.id);
            return (
              <div
                key={mod.id}
                className="rounded-2xl bg-white border shadow-sm overflow-hidden"
              >
                {editingModule === mod.id ? (
                  <div className="p-5 space-y-4">
                    <h3 className="font-bold">Edit Module</h3>
                    <input
                      value={emTitle}
                      onChange={(e) => setEmTitle(e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-sm"
                    />
                    <textarea
                      value={emDesc}
                      onChange={(e) => setEmDesc(e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-sm"
                      rows={2}
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={emOrder}
                        onChange={(e) => setEmOrder(+e.target.value)}
                        className="w-20 rounded-xl border px-4 py-3 text-sm"
                        min={1}
                      />
                      <button
                        onClick={() => saveModuleEdit(mod.id)}
                        disabled={saving}
                        className="rounded-xl border px-5 py-2.5 text-sm bg-green-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingModule(null)}
                        className="rounded-xl border px-5 py-2.5 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full p-5 flex items-start justify-between text-left hover:bg-bg/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-bold">{mod.title}</h3>
                          <p className="text-xs text-muted">
                            {mod.lessonCount} lessons |{" "}
                            {mod.totalDurationMinutes} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {published.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                            {published.length}
                          </span>
                        )}
                        {drafts.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">
                            {drafts.length}
                          </span>
                        )}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`transition ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t">
                        <div className="flex gap-2 pt-4 mb-4">
                          <button
                            onClick={() =>
                              setShowLessonFor(
                                showLessonFor === mod.id ? null : mod.id,
                              )
                            }
                            className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                          >
                            + Lesson
                          </button>
                          <button
                            onClick={() => {
                              setEditingModule(mod.id);
                              setEmTitle(mod.title);
                              setEmDesc(mod.description || "");
                              setEmOrder(mod.order);
                            }}
                            className="rounded-lg border px-3 py-1.5 text-xs"
                          >
                            Edit Module
                          </button>
                          {user?.role === "Admin" && (
                            <button
                              onClick={() => deleteModule(mod.id)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500"
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        {drafts.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-yellow-600 mb-2">
                              Drafts ({drafts.length})
                            </h4>
                            <div className="space-y-1 rounded-xl bg-yellow-50/50 border border-yellow-100 p-3">
                              {drafts.map((lesson, li) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-yellow-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="grid h-5 w-5 place-items-center rounded bg-yellow-100 text-[10px] font-bold text-yellow-600">
                                      {li + 1}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setDetailLessonModal({
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
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">
                                      Draft
                                    </span>
                                    {lesson.videoUrl && (
                                      <button
                                        onClick={() =>
                                          setVideoModal({
                                            url: lesson.videoUrl!,
                                            title: lesson.title,
                                          })
                                        }
                                        className="text-[10px] text-primary underline ml-1"
                                      >
                                        Play
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted mr-1">
                                      {lesson.durationMinutes}m
                                    </span>
                                    <button
                                      onClick={() =>
                                        setEditLessonModal({
                                          lesson,
                                          moduleId: mod.id,
                                        })
                                      }
                                      className="rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        publishLesson(mod.id, lesson.id)
                                      }
                                      disabled={publishingLesson === lesson.id}
                                      className="rounded bg-green-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-green-600"
                                    >
                                      Pub
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {published.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-green-600 mb-2">
                              Published ({published.length})
                            </h4>
                            <div className="space-y-1 rounded-xl bg-green-50/50 border border-green-100 p-3">
                              {published.map((lesson, li) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-green-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="grid h-5 w-5 place-items-center rounded bg-green-100 text-[10px] font-bold text-green-600">
                                      {li + 1}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setDetailLessonModal({
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
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                                      Pub
                                    </span>
                                    {lesson.videoUrl && (
                                      <button
                                        onClick={() =>
                                          setVideoModal({
                                            url: lesson.videoUrl!,
                                            title: lesson.title,
                                          })
                                        }
                                        className="text-[10px] text-primary underline ml-1"
                                      >
                                        Play
                                      </button>
                                    )}
                                    {(lesson.resources || []).length > 0 && (
                                      <span className="text-[10px] text-muted">
                                        Files: {(lesson.resources || []).length}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted mr-1">
                                      {lesson.durationMinutes}m
                                    </span>
                                    <button
                                      onClick={() =>
                                        setEditLessonModal({
                                          lesson,
                                          moduleId: mod.id,
                                        })
                                      }
                                      className="rounded bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {showLessonFor === mod.id && (
                          <div className="mt-5 border-t pt-5 space-y-4">
                            <h4 className="font-bold">New Lesson</h4>
                            <input
                              value={lTitle}
                              onChange={(e) => setLTitle(e.target.value)}
                              placeholder="Title"
                              className="w-full rounded-xl border px-4 py-3 text-sm"
                              required
                            />
                            <textarea
                              value={lContent}
                              onChange={(e) => setLContent(e.target.value)}
                              placeholder="Content"
                              className="w-full rounded-xl border px-4 py-3 text-sm"
                              rows={4}
                            />
                            <input
                              value={lVideo}
                              onChange={(e) => setLVideo(e.target.value)}
                              placeholder="Video URL"
                              className="w-full rounded-xl border px-4 py-3 text-sm"
                            />
                            <div className="flex gap-3">
                              <input
                                type="number"
                                value={lDuration}
                                onChange={(e) => setLDuration(+e.target.value)}
                                className="w-32 rounded-xl border px-4 py-3 text-sm"
                              />
                              <input
                                type="number"
                                value={lOrder}
                                onChange={(e) => setLOrder(+e.target.value)}
                                className="w-24 rounded-xl border px-4 py-3 text-sm"
                              />
                            </div>
                            <button
                              onClick={() => addLesson(mod.id)}
                              disabled={saving}
                              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
                            >
                              {saving ? "Creating..." : "Create"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
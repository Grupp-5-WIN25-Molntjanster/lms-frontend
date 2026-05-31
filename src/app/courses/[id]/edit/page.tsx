"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";

type Course = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    instructor: string;
    lessonsCount: number;
    duration: string;
};

const courseImages = [
    "/courseImages/ai-small.svg",
    "/courseImages/data-science-small.svg",
    "/courseImages/digital-marketing-small.svg",
    "/courseImages/ui-ux-small.svg",
    "/courseImages/full-stack-small.svg",
    "/courseImages/sketch-small.svg",
];

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [instructor, setInstructor] = useState("");
    const [lessonsCount, setLessonsCount] = useState(0);
    const [duration, setDuration] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadCourse() {
            const res = await fetch(`http://localhost:5006/api/courses/${id}`);

            if (!res.ok) {
                alert("Could not load course.");
                router.push("/courses");
                return;
            }

            const course: Course = await res.json();

            setTitle(course.title);
            setDescription(course.description);
            setImageUrl(course.imageUrl);
            setInstructor(course.instructor);
            setLessonsCount(course.lessonsCount);
            setDuration(course.duration);
            setIsLoading(false);
        }

        loadCourse();
    }, [id, router]);

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const res = await fetch(`http://localhost:5006/api/courses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: Number(id),
                title,
                description,
                imageUrl,
                instructor,
                lessonsCount,
                duration,
            }),
        });

        setIsSubmitting(false);

        if (!res.ok) {
            alert("Could not update course.");
            return;
        }

        router.push("/courses");
        router.refresh();
    }

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="rounded-[32px] bg-white p-8 text-2xl">
                    Loading course...
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="max-w-[900px] rounded-[32px] bg-white p-8">
                <h1 className="text-5xl font-bold text-secondary">
                    Edit Course
                </h1>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-xl font-semibold text-secondary">
                            Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xl font-semibold text-secondary">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-2 h-28 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xl font-semibold text-secondary">
                            Course Image
                        </label>

                        <select
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-xl"
                            required
                        >
                            <option value="">Select image</option>

                            {courseImages.map((image) => (
                                <option key={image} value={image}>
                                    {image
                                        .replace("/courseImages/", "")
                                        .replace(".svg", "")
                                        .replaceAll("-", " ")}
                                </option>
                            ))}
                        </select>

                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Course preview"
                                className="mt-4 h-48 w-full rounded-xl border border-gray-200 object-cover"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-xl font-semibold text-secondary">
                            Instructor
                        </label>
                        <input
                            value={instructor}
                            onChange={(e) => setInstructor(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-xl"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xl font-semibold text-secondary">
                                Lessons Count
                            </label>
                            <input
                                type="number"
                                value={lessonsCount}
                                onChange={(e) =>
                                    setLessonsCount(Number(e.target.value))
                                }
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-xl"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xl font-semibold text-secondary">
                                Duration
                            </label>
                            <input
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="3 hr 45 min"
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={() => router.push("/courses")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardShell>
    );
}
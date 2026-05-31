"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";

export default function CreateCoursePage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [instructor, setInstructor] = useState("");
    const [lessonsCount, setLessonsCount] = useState(0);
    const [duration, setDuration] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const courseImages = [
        "/courseImages/ai-small.svg",
        "/courseImages/data-science-small.svg",
        "/courseImages/digital-marketing-small.svg",
        "/courseImages/ui-ux-small.svg",
        "/courseImages/full-stack-small.svg",
        "/courseImages/sketch-small.svg",
    ];

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const res = await fetch("http://localhost:5006/api/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
            alert("Could not create course.");
            return;
        }

        router.push("/courses");
        router.refresh();
    }

    return (
        <DashboardShell>
            <div className="max-w-[900px] rounded-[32px] bg-white p-8">
                <h1 className="text-5xl font-bold text-secondary">
                    Create Course
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
                                        .replace("/", "")
                                        .replace(".svg", "")
                                        .replaceAll("-", " ")}
                                </option>
                            ))}
                        </select>

                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Course preview"
                                className="mt-4 h-48 w-full rounded-xl object-cover border border-gray-200"
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
                                onChange={(e) => setLessonsCount(Number(e.target.value))}
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
                        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Course"}
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
"use client";

import { API_URL } from "@/lib/api";

type DeleteCourseButtonProps = {
    id: number;
};

export function DeleteCourseButton({ id }: DeleteCourseButtonProps) {
    async function handleDelete() {
        const confirmed = confirm("Are you sure you want to delete this course?");

        if (!confirmed) return;

        const res = await fetch(`${API_URL}/api/courses/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Could not delete course.");
            return;
        }

        window.location.reload();
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-500 px-4 py-2 text-white"
        >
            Delete
        </button>
    );
}
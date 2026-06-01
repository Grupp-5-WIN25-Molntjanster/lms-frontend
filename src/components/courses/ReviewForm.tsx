"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

type ReviewFormProps = {
    courseId: number;
};

export function ReviewForm({ courseId }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);

        const res = await fetch(`${API_URL}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courseId,
                rating,
                comment,
            }),
        });

        setIsSubmitting(false);

        if (!res.ok) {
            alert("Could not submit review. You may need to be logged in.");
            return;
        }

        setComment("");
        setRating(5);
        window.location.reload();
    }

    return (
        <form onSubmit={handleSubmit} className="mt-10">
            <h2 className="text-3xl font-bold text-secondary">
                Write a Review
            </h2>

            <label className="text-xl mt-4 block text-sm font-semibold text-muted">
                Select your rating
            </label>

            <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="mt-2 rounded-xl border border-gray-200 px-4 py-3"
            >
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
            </select>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-4 h-28 w-full resize-none rounded-2xl border border-gray-200 p-4"
                placeholder="Enter feedback here..."
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 rounded-xl bg-primary px-6 py-3 text-white disabled:opacity-50"
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}
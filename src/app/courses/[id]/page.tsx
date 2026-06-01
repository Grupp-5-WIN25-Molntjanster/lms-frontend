import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LessonExercise } from "@/components/courses/LessonExercise";
import { ReviewForm } from "@/components/courses/ReviewForm";
import { API_URL } from "@/lib/api";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ tab?: string; showAll?: string }>; };

type Course = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    instructor: string;
    lessonsCount: number;
    duration: string;
};

type RatingSummary = {
    averageRating: number;
    totalReviews: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
};

type Review = {
    id: number;
    userId: number;
    courseId: number;
    rating: number;
    comment: string;
    createdAtUtc: string;
};

async function getCourse(id: string): Promise<Course> {
    const res = await fetch(`${API_URL}/api/courses/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch course");

    return res.json();
}

async function getRatingSummary(id: string): Promise<RatingSummary> {
    const res = await fetch(`${API_URL}/api/reviews/course/${id}/summary`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch rating summary");

    return res.json();
}

async function getReviews(id: string): Promise<Review[]> {
    const res = await fetch(`${API_URL}/api/reviews/course/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch reviews");

    return res.json();
}

function getCourseImageUrl(imageUrl: string) {
    if (imageUrl.startsWith("/courseImages/")) return imageUrl;
    if (imageUrl.startsWith("/")) return `/courseImages${imageUrl}`;
    return `/courseImages/${imageUrl}`;
}

function getTabClass(isActive: boolean) {
    return isActive
        ? "rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white"
        : "rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-muted";
}

export default async function CourseDetailsPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { tab, showAll } = await searchParams;

    const activeTab = tab ?? "overview";
    const showAllReviews = showAll === "true";

    const course = await getCourse(id);
    const summary = await getRatingSummary(id);
    const reviews = await getReviews(id);
    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    return (
        <DashboardShell>
        
            <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-8">
                <section className="flex flex-col gap-6">
                    <p className="text-xl text-muted">
                        Courses » <span className="font-semibold text-secondary">{course.title}</span>
                    </p>

                    <div className="rounded-[32px] bg-white p-6">
                        <div className="relative overflow-hidden rounded-[28px]">
                            <img
                                src={getCourseImageUrl(course.imageUrl)}
                                alt={course.title}
                                className="h-[650px] w-full object-cover"/>
                        </div>

                        <h1 className="mt-6 text-5xl font-bold leading-tight text-secondary">
                            {course.title}
                        </h1>

                        <div className="mt-4 flex items-center gap-4 text-xl text-muted">
                            <span>{course.lessonsCount} Lessons</span>
                            <span>{course.duration}</span>
                            <span className="text-primary">★</span>
                            <span>
                                {summary.averageRating.toFixed(1)} ({summary.totalReviews} reviews)
                            </span>
                        </div>

                        <div className="mt-7 flex gap-8 text-2xl">
                            <Link href={`/courses/${id}`} className={getTabClass(activeTab === "overview")}>
                                Overview
                            </Link>

                            <Link href={`/courses/${id}?tab=faqs`} className={getTabClass(activeTab === "faqs")}>
                                FAQs
                            </Link>

                            <Link href={`/courses/${id}?tab=reviews`} className={getTabClass(activeTab === "reviews")}>
                                Reviews
                            </Link>

                            <Link href={`/courses/${id}?tab=instructor`} className={getTabClass(activeTab === "instructor")}>
                                Instructor
                            </Link>
                        </div>

                        {activeTab === "overview" && (
                            <>
                                <div className="mt-7">
                                    <h2 className="text-4xl font-bold text-secondary">About</h2>
                                    <p className="mt-3 max-w-[850px] text-2xl leading-7 text-muted">
                                        This course is designed to help you build a strong understanding of the topic
                                        through practical lessons and real-world examples.
                                    </p>
                                </div>

                                <div className="mt-7">
                                    <h2 className="text-4xl font-bold text-secondary">Key Point</h2>

                                    <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-3 text-xl text-muted">
                                        <p className="text-primary">✓ <span className="text-muted">Learn practical skills</span></p>
                                        <p className="text-primary">✓ <span className="text-muted">Real-world examples</span></p>
                                        <p className="text-primary">✓ <span className="text-muted">Beginner friendly</span></p>
                                        <p className="text-primary">✓ <span className="text-muted">Improve your knowledge</span></p>
                                        <p className="text-primary">✓ <span className="text-muted">Hands-on learning</span></p>
                                        <p className="text-primary">✓ <span className="text-muted">Build projects</span></p>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "reviews" && (
                            <div className="mt-8">
                                <div className="grid grid-cols-[220px_1fr_600px] gap-10">
                                    {/* Average Rating */}
                                    <div>
                                        <h2 className="text-3xl font-bold text-secondary">Average Rating</h2>

                                        <div className="mt-5 flex h-36 w-52 flex-col items-center justify-center rounded-2xl bg-gray-50">
                                            <div className="text-5xl font-bold text-secondary">
                                                {summary.averageRating.toFixed(1)}
                                                <span className="text-xl text-muted">/5</span>
                                            </div>

                                            <p className="mt-2 text-xl text-muted">
                                                Based on {summary.totalReviews} reviews
                                            </p>

                                            <p className="mt-2 text-primary">★★★★★</p>
                                        </div>
                                    </div>

                                    {/* Detailed Rating */}
                                    <div>
                                        <h2 className="text-3xl font-bold text-secondary">Detailed Rating</h2>

                                        <div className="text-xl mt-5 space-y-4">
                                            {[
                                                { label: "5", value: summary.fiveStar },
                                                { label: "4", value: summary.fourStar },
                                                { label: "3", value: summary.threeStar },
                                                { label: "2", value: summary.twoStar },
                                                { label: "1", value: summary.oneStar },
                                            ].map((item) => {
                                                const percent =
                                                    summary.totalReviews > 0
                                                        ? (item.value / summary.totalReviews) * 100
                                                        : 0;

                                                return (
                                                    <div key={item.label} className="flex items-center gap-4">
                                                        <span className="w-12 text-xl text-muted">
                                                            {Math.round(percent)}%
                                                        </span>

                                                        <span className="text-xl w-24 text-primary">
                                                            {"★".repeat(Number(item.label))}
                                                        </span>

                                                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                                                            <div
                                                                className="h-2 rounded-full bg-primary"
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="text-xl mt-4 max-w-[1520px]  pt-8">
                                            <ReviewForm courseId={course.id} />
                                        </div>
                                    </div>

                                    {/* Reviews list */}
                                    <div>
                                        <h2 className="text-3xl font-bold text-secondary">Reviews</h2>

                                        <div className="text-xl mt-5 max-h-[550px] space-y-4 overflow-y-auto pr-2">
                                        {reviews.length === 0 ? (
                                                <p className="text-xl text-muted">No reviews yet.</p>
                                            ) : (
                                                    visibleReviews.map((review) => (
                                                        <div
                                                            key={review.id}
                                                            className="rounded-2xl border border-gray-200 p-5"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <p className="font-semibold text-secondary">
                                                                    Joachim P.
                                                                </p>

                                                                <p className="text-sm text-muted">
                                                                    {new Date(review.createdAtUtc).toLocaleDateString("sv-SE")}
                                                                </p>
                                                            </div>

                                                            <div className="mt-2 text-primary">
                                                                {"★".repeat(review.rating)}
                                                                <span className="text-gray-300">
                                                                    {"★".repeat(5 - review.rating)}
                                                                </span>
                                                            </div>

                                                            <p className="mt-2 text-muted">
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                ))
                                            )}
                                        </div>
                                        {reviews.length > 3 && (
                                            <Link
                                                href={
                                                    showAllReviews
                                                        ? `/courses/${id}?tab=reviews`
                                                        : `/courses/${id}?tab=reviews&showAll=true`
                                                }
                                                className="mt-4 inline-block text-xl font-semibold text-primary"
                                            >
                                                {showAllReviews ? "Show less" : "See all reviews"}
                                            </Link>
                                        )}
                                    </div>

                                </div>

                            </div>
                        )}

                        {activeTab === "faqs" && (
                            <div className="mt-8">
                                <h2 className="text-4xl font-bold text-secondary">FAQs</h2>
                                <p className="mt-3 text-2xl text-muted">FAQs content coming soon.</p>
                            </div>
                        )}

                        {activeTab === "instructor" && (
                            <div className="mt-8">
                                <h2 className="text-4xl font-bold text-secondary">Instructor</h2>
                                <p className="mt-3 text-2xl text-muted">{course.instructor}</p>
                            </div>
                        )}
                    </div>
                </section>

                <aside className="pt-14">
                    <LessonExercise />
                </aside>
            </div>
        </DashboardShell>
    );
}
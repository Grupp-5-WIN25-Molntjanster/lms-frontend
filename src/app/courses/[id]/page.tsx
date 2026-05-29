import { DashboardShell } from "@/components/layout/DashboardShell";
import { LessonExercise } from "@/components/courses/LessonExercise";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

type Course = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    instructor: string;
    lessonsCount: number;
    duration: string;
};



async function getCourse(id: string): Promise<Course> {
    const res = await fetch(`http://localhost:5006/api/courses/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch course");
    }

    return res.json();
}

function getCourseImageUrl(imageUrl: string) {
    if (imageUrl.startsWith("/courseImages/")) return imageUrl;
    if (imageUrl.startsWith("/")) return `/courseImages${imageUrl}`;
    return `/courseImages/${imageUrl}`;
}

export default async function CourseDetailsPage({ params }: Props) {
    const { id } = await params;
    const course = await getCourse(id);

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
                                className="h-[1030px] w-full object-cover"
                            />
                        </div>

                        <h1 className="mt-6 text-[44px] font-bold leading-tight text-secondary">
                            {course.title}
                        </h1>

                        <div className="mt-4 flex items-center gap-4 text-xl text-muted">
                            <span>{course.lessonsCount} Lessons</span>
                            <span >{course.duration}</span>

                            <span className="text-primary">★</span>
                            <span>5.0 (264 reviews)</span>
                        </div>

                        <div className="text-2xl mt-7 flex gap-4">
                            <button className="rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white">
                                Overview
                            </button>
                            <button className="rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-muted">
                                FAQs
                            </button>
                            <button className="rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-muted">
                                Reviews
                            </button>
                            <button className="rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-muted">
                                Instructor
                            </button>
                        </div>

                        <div className="mt-7">
                            <h2 className="text-4xl font-bold text-secondary">About</h2>
                            <p className="text-2xl mt-3 max-w-[850px] leading-7 text-muted">
                                This course is designed to help you build a strong understanding of the topic
                                through practical lessons and real-world examples.
                            </p>
                        </div>

                        <div className="mt-7">
                            <h2 className="text-4xl font-bold text-secondary">Key Point</h2>

                            <div className="text-xl mt-4 grid grid-cols-2 gap-x-12 gap-y-3 text-base text-muted">
                                <p className="text-primary">✓ <span className="text-muted">Learn practical skills</span></p>
                                <p className="text-primary">✓ <span className="text-muted">Real-world examples</span></p>
                                <p className="text-primary">✓ <span className="text-muted">Beginner friendly</span></p>
                                <p className="text-primary">✓ <span className="text-muted">Improve your knowledge</span></p>
                                <p className="text-primary">✓ <span className="text-muted">Hands-on learning</span></p>
                                <p className="text-primary">✓ <span className="text-muted">Build projects</span></p>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="pt-14">
                    <LessonExercise />
                </aside>
            </div>
        </DashboardShell>
    );
}
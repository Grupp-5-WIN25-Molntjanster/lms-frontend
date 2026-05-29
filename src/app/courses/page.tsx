import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, Button } from "@/components/ui";

type Course = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  instructor: string;
  lessonsCount: number;
  duration: string;
};

const courseImages: Record<number, string> = {
    1: "/courseImages/ai-small.svg",
    2: "/courseImages/data-science-small.svg",
    3: "/courseImages/digital-marketing-small.svg",
    4: "/courseImages/ui-ux-small.svg",
    5: "/courseImages/full-stack-small.svg",
    6: "/courseImages/sketch-small.svg",
};

type PopularCourse = {
    title: string;
    subtitle: string;
    iconUrl: string;
};

async function getPopularCourses(): Promise<PopularCourse[]> {
    const res = await fetch(
        "http://localhost:5006/api/popular-courses",
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch popular courses");
    }

    return res.json();
}

async function getCourses(): Promise<Course[]> {
  const res = await fetch("http://localhost:5006/api/courses", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
}

export default async function CoursesPage() {
  const courses = await getCourses();
    const popularCourses = await getPopularCourses();

    return (
        <DashboardShell>
            <div className="flex flex-col gap-6">

                {/* Popular This Week */}
                <div className="rounded-3xl bg-white p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-secondary">
                            Popular This Week
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {popularCourses.map((course) => {
                            const Icon = course.iconUrl;

                            return (
                                <div
                                    key={course.title}
                                    className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-20 w-20 items-center justify-center">
                                            <img src={course.iconUrl} alt={course.title}/>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-secondary">
                                                {course.title}
                                            </h3>

                                            <p className="text-xs text-muted">
                                                {course.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                                        ↗
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* All Courses */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-secondary">
                        All Courses
                    </h1>

                    <button className="text-primary font-medium">
                        See All
                    </button>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="flex flex-col gap-6 overflow-hidden rounded-3xl bg-white p-6">

                            <div className="overflow-hidden rounded-2xl">
                                <img
                                    src={courseImages[course.id]}
                                    alt={course.title}
                                    className="w-full object-cover rounded-2xl"/>
                            </div>

                            <div className="flex flex-col gap-3 px-1 pt-2">
                                <h2 className="text-3xl font-semibold text-secondary">
                                    {course.title}
                                </h2>

                                <div className="flex items-center gap-3 text-muted">
                                    <span>{course.instructor}</span>
                                    <span>5.0 ★</span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <p className="text-muted">
                                        {course.lessonsCount} Lessons · {course.duration}
                                    </p>

                                    <Link href={`/courses/${course.id}`}>
                                        <Button variant="primary" size="lg">
                                            View Details ↗
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </DashboardShell>
    );
}
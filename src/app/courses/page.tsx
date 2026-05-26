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

  return (
    <DashboardShell title="Courses" subtitle="Browse available courses">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-secondary">All Courses</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col gap-4 overflow-hidden">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-48 w-full rounded-xl object-cover"
              />

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-secondary">
                  {course.title}
                </h3>

                <p className="text-sm text-muted line-clamp-2">
                  {course.description}
                </p>

                <p className="text-xs text-muted">
                  {course.instructor} · {course.lessonsCount} lessons ·{" "}
                  {course.duration}
                </p>
              </div>

              <Link href={`/courses/${course.id}`} className="mt-auto">
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
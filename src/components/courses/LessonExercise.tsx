const lessons = [
    { title: "Foundations of Digital Marketing", duration: "08:34", active: true, done: true },
    { title: "Introduction to Design Thinking", duration: "06:47", locked: true },
    { title: "Empathise With User", duration: "20:32", locked: true },
    { title: "Define the Problem Statement", duration: "26:53", locked: true },
    { title: "Analysing Usability Test Results", duration: "13:23", locked: true },
];

export function LessonExercise() {
    return (
        <div className="rounded-[32px] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-4xl font-bold text-secondary">Lesson Exercise</h2>
                <button className="text-base font-semibold text-primary">See All</button>
            </div>

            <div className="space-y-4">
                {lessons.map((lesson) => (
                    <div
                        key={lesson.title}
                        className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
                    >
                        <div className="flex items-center gap-4 text-xl">
                            <div
                                className={
                                    lesson.active
                                        ? "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white"
                                        : "flex h-12 w-12 items-center justify-center rounded-full bg-white text-muted"
                                }
                            >
                                ▶
                            </div>

                            <div>
                                <h3 className="font-bold text-secondary">{lesson.title}</h3>
                                <p className="mt-1 text-xl text-muted">{lesson.duration}</p>
                            </div>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted">
                            {lesson.done ? "✓" : lesson.locked ? "🔒" : ""}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
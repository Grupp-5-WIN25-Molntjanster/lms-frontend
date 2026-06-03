import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Welcome to your LMS platform"
    >
      <Card className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-secondary">
          Welcome back 👋
        </h1>

        <p className="max-w-md text-sm text-muted">
          Glad to see you again. You can manage your courses, profile, and learning progress from here.
        </p>
      </Card>
    </DashboardShell>
  );
}
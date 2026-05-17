// ─────────────────────────────────────────────────────────────
// EXAMPLE DASHBOARD PAGE
// Copy this file into your own service folder and customize it.
// Example: src/app/faq/page.tsx
// ─────────────────────────────────────────────────────────────

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// ── Stat Card ────────────────────────────────────────────────
// Replace the numbers and labels with your own data
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-3xl font-bold text-secondary">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening."
    >
      <div className="flex flex-col gap-8">

        {/* ── Stat Cards Row ── */}
        {/* Replace these with real data from your API */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users"    value="0"  sub="No data yet" />
          <StatCard label="Active Courses" value="0"  sub="No data yet" />
          <StatCard label="Live Sessions"  value="0"  sub="No data yet" />
          <StatCard label="Reviews"        value="0"  sub="No data yet" />
        </section>

        {/* ── Main Content Area ── */}
        {/* Replace this with your service's content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left — big card */}
          <Card className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-secondary">
                Your Content Here
              </h2>
              <Badge>New</Badge>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-bg py-16 text-center">
              <p className="text-sm text-muted">No data to display yet.</p>
              <Button variant="primary" size="sm">
                Add Your First Item
              </Button>
            </div>
          </Card>

          {/* Right — small card */}
          <Card className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-secondary">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2">
              {/* Replace buttons with actions relevant to your service */}
              <Button variant="primary"   size="sm" className="w-full">Action One</Button>
              <Button variant="secondary" size="sm" className="w-full">Action Two</Button>
            </div>
          </Card>

        </section>

      </div>
    </DashboardShell>
  );
}

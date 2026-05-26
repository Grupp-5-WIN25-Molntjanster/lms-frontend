import { ProfileShell } from "@/components/layout/ProfileShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProfilePage() {
  return (
    <ProfileShell active="general">
      {/* Main layout */}
      <div className="ml-auto w-full max-w-6xl">
        {/* Right form card */}
        <Card className="flex flex-col gap-6 p-6">
          {/* Upload row */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-bg" />

            <Button variant="secondary" size="sm">
              Upload photo
            </Button>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6">
            {/* First name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                First name *
              </label>

              <Input placeholder="Hasan" />
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                Last name *
              </label>

              <Input placeholder="Mahmud" />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                Phone number
              </label>

              <Input placeholder="Enter phone number" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                Description
              </label>

              <textarea
                className="min-h-[180px] rounded-2xl border border-secondary/10 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Write something about yourself..."
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="md">
                Cancel
              </Button>

              <Button variant="primary" size="md">
                Save
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ProfileShell>
  );
}

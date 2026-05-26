"use client";

import { useEffect, useState } from "react";

import { ProfileShell } from "@/components/layout/ProfileShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProfilePage() {
  // ── Form state ─────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  // ── Mock fetch ─────────────────────────────
  // Later this will come from API/Auth Service
  useEffect(() => {
    // Fake user data for now
    setFirstName("Hasan");
    setLastName("Mahmud");
    setPhone("+46 70 123 45 67");
    setDescription(
      "A passionate UI/UX Designer with hands-on experience designing intuitive digital products.",
    );
  }, []);

  // ── Save handler ───────────────────────────
  // Later this will call PUT /api/profile
  const handleSave = () => {
    const updatedProfile = {
      firstName,
      lastName,
      phone,
      description,
    };

    console.log("Saving profile:", updatedProfile);

    alert("Profile saved!");
  };

  return (
    <ProfileShell active="general">
      <div className="ml-auto w-full max-w-4xl">
        <Card className="flex flex-col gap-6 p-6">
          {/* Upload row */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-bg" />

            <Button variant="secondary" size="sm">
              Upload photo
            </Button>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* First name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                First name *
              </label>

              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                Last name *
              </label>

              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                Phone number
              </label>

              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

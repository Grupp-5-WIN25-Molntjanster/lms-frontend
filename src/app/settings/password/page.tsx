"use client";

import { useState } from "react";

import { ProfileShell } from "@/components/layout/ProfileShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function PasswordPage() {

  // ── Form state ─────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Save handler ───────────────────────────
  const handleSave = () => {

    const passwordData = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    console.log("Updating password:", passwordData);

    alert("Password updated!");
  };

  return (
    <ProfileShell active="password">

      <div className="ml-auto w-full max-w-4xl">

        <Card className="flex flex-col gap-6 p-6">

          {/* Header */}
          <div className="flex flex-col gap-1">

            <h2 className="text-xl font-semibold text-secondary">
              Change Password
            </h2>

            <p className="text-sm text-muted">
              Update your account password.
            </p>

          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >

            {/* Current password */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-secondary">
                Current password
              </label>

              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />

            </div>

            {/* New password */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-secondary">
                New password
              </label>

              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />

            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-secondary">
                Confirm password
              </label>

              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />

            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">

              <Button variant="secondary" size="md">
                Cancel
              </Button>

              <Button variant="primary" size="md">
                Save Changes
              </Button>

            </div>

          </form>

        </Card>

      </div>

    </ProfileShell>
  );
}
"use client";

import { useEffect, useState } from "react";

import { ProfileShell } from "@/components/layout/ProfileShell";
import { ProfileCard } from "@/components/profile/ProfileCard";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { jwtDecode } from "jwt-decode";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function ProfilePage() {
  // ── Form state ─────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  // ── Skills state ───────────────────────────
  const [skills, setSkills] = useState<string[]>([]);

  // ── Achievements state ───────────────────────────
  const [achievements, setAchievements] = useState<string[]>([]);

  const [profileImage, setProfileImage] = useState("/avatar-placeholder.png");
  const token = process.env.NEXT_PUBLIC_TOKEN!;
  type JwtPayload = {
    firstName: string;
    lastName: string;
  };

  const decodedToken = jwtDecode<JwtPayload>(token);

  const authUser = {
    firstName: decodedToken.firstName,
    lastName: decodedToken.lastName,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/profile`);

        const data = await response.json();

        setPhone(data.phoneNumber || "");
        setDescription(data.bio || "");
        setProfileImage(data.profileImageUrl || "/avatar-placeholder.png");
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
    fetchSkills();
    fetchAchievements();

    setFirstName(authUser.firstName);
    setLastName(authUser.lastName);
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile/skills`);

      const data = await response.json();

      const skillNames = data.map((skill: { name: string }) => skill.name);

      setSkills(skillNames);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile/achievements`);

      const data = await response.json();

      const achievementTitles = data.map(
        (achievement: { title: string }) => achievement.title,
      );

      setAchievements(achievementTitles);
    } catch (error) {
      console.error("Failed to fetch achievements", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(`${API_BASE}/api/profile/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      setProfileImage(data.imageUrl);
    } catch (error) {
      console.error(error);

      alert("Failed to upload image");
    }
  };

  // ── Save handler ───────────────────────────
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber: phone,
          bio: description,
          profileImageUrl: profileImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      alert("Profile saved!");
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  };

  return (
    <ProfileShell active="general">
      {/* Two columns */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        {/* Left column */}
        <ProfileCard
          firstName={firstName}
          lastName={lastName}
          description={description}
          skills={skills}
          achievements={achievements}
          profileImage={profileImage}
        />

        {/* Right column */}
        <Card className="flex flex-col gap-6 p-6">
          {/* Upload row */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-bg" />

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <span className="inline-flex items-center rounded-xl border border-secondary/10 bg-bg px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/5">
                Upload photo
              </span>
            </label>
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

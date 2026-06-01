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
  // state för profile formuläret
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  // sparar alla skills från api
  const [skills, setSkills] = useState<string[]>([]);

  // lista med achievements
  const [achievements, setAchievements] = useState<
    { title: string; icon: string }[]
  >([]);

  // profilbild
  const [profileImage, setProfileImage] = useState("/avatar-placeholder.png");

  // tillfällig token tills auth är kopplat
  const token = process.env.NEXT_PUBLIC_TOKEN!;

  // datan vi hämtar från jwt
  type JwtPayload = {
    firstName: string;
    lastName: string;
  };

  // decodear tokenen
  const decodedToken = jwtDecode<JwtPayload>(token);

  // användare från auth
  const authUser = {
    firstName: decodedToken.firstName,
    lastName: decodedToken.lastName,
  };

  // körs när sidan laddas
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // hämtar profile data
        const response = await fetch(`${API_BASE}/api/profile`);

        const data = await response.json();

        // sätter värden i formuläret
        setPhone(data.phoneNumber || "");
        setDescription(data.bio || "");
        setProfileImage(data.profileImageUrl || "/avatar-placeholder.png");
      } catch (error) {
        console.error("kunde inte hämta profile", error);
      }
    };

    fetchProfile();
    fetchSkills();
    fetchAchievements();

    // firstname och lastname kommer från jwt
    setFirstName(authUser.firstName);
    setLastName(authUser.lastName);
  }, []);

  // hämtar skills
  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile/skills`);

      const data = await response.json();

      // gör om objekten till bara namn
      const skillNames = data.map((skill: { name: string }) => skill.name);

      setSkills(skillNames);
    } catch (error) {
      console.error("kunde inte hämta skills", error);
    }
  };

  // hämtar achievements
  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile/achievements`);

      const data = await response.json();

      setAchievements(data);
    } catch (error) {
      console.error("kunde inte hämta achievements", error);
    }
  };

  // upload av profilbild
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // om ingen fil valdes
    if (!file) return;

    try {
      const formData = new FormData();

      // lägger filen i formdata
      formData.append("file", file);

      // skickar bilden till api
      const response = await fetch(`${API_BASE}/api/profile/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("kunde inte ladda upp bild");
      }

      const data = await response.json();

      // uppdaterar profilbilden direkt
      setProfileImage(data.imageUrl);
    } catch (error) {
      console.error(error);

      alert("något gick fel vid upload");
    }
  };

  // sparar profile ändringar
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        // skickar datan till backend
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber: phone,
          bio: description,
          profileImageUrl: profileImage,
        }),
      });

      if (!response.ok) {
        throw new Error("kunde inte spara");
      }

      alert("profile sparad!");
    } catch (error) {
      console.error(error);

      alert("något gick fel");
    }
  };

  return (
    <ProfileShell active="general">
      {/* layout med två kolumner */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        {/* vänster sida */}
        <ProfileCard
          firstName={firstName}
          lastName={lastName}
          description={description}
          skills={skills}
          achievements={achievements}
          profileImage={profileImage}
        />

        {/* höger sida */}
        <Card className="flex flex-col gap-6 p-6">
          {/* upload knapp */}
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

          {/* själva formuläret */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();

              // sparar utan refresh
              handleSave();
            }}
          >
            {/* firstname */}
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

            {/* lastname */}
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

            {/* telefonnummer */}
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

            {/* bio / beskrivning */}
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

            {/* knappar */}
            <div className="flex items-center gap-3">
              {/* avbryt knapp */}
              <Button variant="secondary" size="md">
                Cancel
              </Button>

              {/* spara knapp */}
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

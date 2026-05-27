type ProfileCardProps = {
  firstName: string;
  lastName: string;
  description: string;
  skills: string[];
  achievements: string[];
  profileImage: string;
};

export function ProfileCard({
  firstName,
  lastName,
  description,
  skills,
  achievements,
  profileImage,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-white p-5">
      {/* Banner */}
      <img
        src="/cover-image.png"
        alt="Cover"
        className="h-28 w-full rounded-2xl object-cover"
      />

      {/* Avatar */}
      <div className="-mt-14 flex justify-center">
        <img
          src={profileImage}
          alt="Profile"
          className="h-24 w-24 rounded-full border-4 border-white object-cover"
        />
      </div>

      {/* Name */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary">
          {firstName} {lastName}
        </h2>

        <p className="text-sm text-muted">Student</p>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-secondary">Skills</h3>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="rounded-full border border-secondary/10 bg-bg px-4 py-1 text-xs font-medium tracking-wide text-secondary/50"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-secondary">Achievements</h3>

        <div className="flex flex-wrap gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm"
              title={achievement}
            >
              🏆
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-secondary">Bio</h3>

        <div className="rounded-2xl bg-bg p-5 text-sm leading-7 text-muted">
          {description}
        </div>
      </div>
    </div>
  );
}

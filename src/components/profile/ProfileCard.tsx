type ProfileCardProps = {
  firstName: string;
  lastName: string;
  description: string;
  skills: string[];
};

export function ProfileCard({
  firstName,
  lastName,
  description,
  skills,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white p-6">
      {/* Banner */}
      <div className="h-32 rounded-2xl bg-secondary" />

      {/* Avatar */}
      <div className="-mt-16 flex justify-center">
        <div className="h-28 w-28 rounded-full border-4 border-white bg-bg" />
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

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="rounded-full bg-bg px-3 py-1 text-sm text-secondary"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-secondary">Achievements</h3>

        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100" />
          <div className="h-10 w-10 rounded-full bg-orange-100" />
          <div className="h-10 w-10 rounded-full bg-orange-100" />
          <div className="h-10 w-10 rounded-full bg-orange-100" />
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-secondary">Bio</h3>

        <div className="rounded-2xl bg-bg p-4 text-sm text-muted">
          {description}
        </div>
      </div>
    </div>
  );
}

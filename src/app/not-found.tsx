import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-secondary px-6 py-16 text-center">

      {/* Illustration */}
      <div className="relative w-full max-w-sm">
        <Image
          src="/404.png"
          alt="404 illustration"
          width={520}
          height={400}
          priority
          className="w-full h-auto"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold text-white">
          Page Not Found!
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-secondary-300">
          Sorry, the page you are looking for doesn&apos;t exist or has been removed.
          <br />
          Keep exploring our site.
        </p>
      </div>

      {/* Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-400"
      >
        Back to Home
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </Link>

    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  /** Right-pane content — usually a form. */
  children: ReactNode;
};

/**
 * Two-pane auth layout matching the Shiko Figma:
 * left = dark image with logo, right = white form on bg.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-bg p-7">
      <div className="relative mx-auto flex min-h-[calc(100vh-56px)] overflow-hidden rounded-[40px] bg-white shadow-sm">
        {/* Left — image panel */}
        <div className="relative hidden w-[45%] shrink-0 lg:block">
          <Image
            src="/plates.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 0px"
            className="object-cover"
            priority
          />
          {/* Dark overlay matching Figma (rgba 44,53,69,.7) */}
          <div className="absolute inset-0 bg-secondary/70" />

          <Link href="/" className="absolute left-12 top-12 z-10">
          <Image
            src="/logo.png"
            alt="Shiko"
            width={160}
            height={50}
            priority
            className="h-auto w-auto"
          />
          </Link>
        </div>

        {/* Right — form panel */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[560px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

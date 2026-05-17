/**
 * Lightweight icon set used across the app.
 * Each icon is a 24x24 SVG, accepts `className` for sizing/coloring via currentColor.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode) =>
  function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {children}
      </svg>
    );
  };

export const HomeIcon = base(
  <>
    <path d="M3 12l9-9 9 9" />
    <path d="M5 10v10h14V10" />
  </>,
);

export const GraduationIcon = base(
  <>
    <path d="M22 10L12 4 2 10l10 6 10-6z" />
    <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </>,
);

export const CalendarIcon = base(
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 9h18" />
  </>,
);

export const VideoIcon = base(
  <>
    <rect x="3" y="6" width="14" height="12" rx="2" />
    <path d="M17 10l4-2v8l-4-2" />
  </>,
);

export const UserIcon = base(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </>,
);

export const TeamIcon = base(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>,
);

export const SettingsIcon = base(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </>,
);

export const HelpIcon = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4" />
    <path d="M12 17h.01" />
  </>,
);

export const LogoutIcon = base(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </>,
);

export const SearchIcon = base(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </>,
);

export const BellIcon = base(
  <>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </>,
);

export const MenuIcon = base(
  <>
    <path d="M3 12h18" />
    <path d="M3 6h18" />
    <path d="M3 18h18" />
  </>,
);

export const ChevronLeft = base(<path d="M15 18l-6-6 6-6" />);
export const ChevronRight = base(<path d="M9 18l6-6-6-6" />);
export const ChevronDown = base(<path d="M6 9l6 6 6-6" />);
export const ChevronUp = base(<path d="M18 15l-6-6-6 6" />);

export const CheckIcon = base(<path d="M20 6L9 17l-5-5" />);
export const XIcon = base(
  <>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </>,
);

export const PlayIcon = base(<path d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none" />);

export const StarIcon = base(
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
);

export const ClockIcon = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);

export const FileIcon = base(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </>,
);

export const MailIcon = base(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </>,
);

export const LockIcon = base(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
);

export const EyeIcon = base(
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);

export const PlusIcon = base(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);

export const FilterIcon = base(
  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
);

export const GoogleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" {...props}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.88v-8.4H7.08v-3.48h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.48h-2.8V24c5.74-.91 10.13-5.88 10.13-11.93z" />
  </svg>
);

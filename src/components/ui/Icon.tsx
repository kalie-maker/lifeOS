import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "calendar"
  | "plus"
  | "spaces"
  | "user"
  | "mic"
  | "document"
  | "camera"
  | "chat"
  | "car"
  | "house"
  | "paw"
  | "family"
  | "bell"
  | "lock"
  | "download"
  | "trash"
  | "edit"
  | "library"
  | "logout"
  | "chevron-right"
  | "chevron-down"
  | "close"
  | "check"
  | "alert"
  | "arrow-right"
  | "sparkle"
  | "moon"
  | "bolt"
  | "dumbbell"
  | "heart"
  | "clock"
  | "gift"
  | "search"
  | "shield";

const paths: Record<IconName, React.ReactNode> = {
  home: <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  spaces: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </>
  ),
  document: (
    <>
      <path d="M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M13 3.5V9h5M8.5 13h7M8.5 16.5h7" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.5a2 2 0 0 1 2-2h1.5l1.2-2h6.6l1.2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  chat: (
    <path d="M5 5.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V6.5a1 1 0 0 1 1-1z" />
  ),
  car: (
    <>
      <path d="M3.5 13.5 5 8.5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8.5l1.5 5" />
      <path d="M3 13.5h18v4a1 1 0 0 1-1 1h-1.5v-1.5h-13V18.5H4a1 1 0 0 1-1-1z" />
      <path d="M6.5 16h.01M17.5 16h.01" />
    </>
  ),
  house: (
    <>
      <path d="M4 11 12 4.5 20 11" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="12" cy="15" rx="4" ry="3.2" />
      <circle cx="6.8" cy="11" r="1.5" />
      <circle cx="17.2" cy="11" r="1.5" />
      <circle cx="9.4" cy="7.6" r="1.5" />
      <circle cx="14.6" cy="7.6" r="1.5" />
    </>
  ),
  family: (
    <>
      <circle cx="8" cy="8" r="2.8" />
      <circle cx="16" cy="8.5" r="2.4" />
      <path d="M3.5 19a4.5 4.5 0 0 1 9 0M13 19a4 4 0 0 1 7.5-1.9" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  download: <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />,
  trash: (
    <path d="M5 7h14M9.5 7V5h5v2M6.5 7l.8 12a1 1 0 0 0 1 1h7.4a1 1 0 0 0 1-1l.8-12M10 11v6M14 11v6" />
  ),
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
  library: (
    <>
      <rect x="4" y="4" width="4.5" height="16" rx="1" />
      <rect x="10" y="4" width="4.5" height="16" rx="1" />
      <path d="M16.5 5.5 20 5l1.6 14.6-3.5.5z" />
    </>
  ),
  logout: <path d="M14 6V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1M9 12h11m0 0-3.5-3.5M20 12l-3.5 3.5" />,
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  "chevron-down": <path d="m5 9 7 7 7-7" />,
  close: <path d="M6 6 18 18M18 6 6 18" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  alert: (
    <>
      <path d="M12 4 2.5 20.5h19z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  "arrow-right": <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  sparkle: (
    <path d="M12 3.5c.6 3.8 1.7 4.9 5.5 5.5-3.8.6-4.9 1.7-5.5 5.5-.6-3.8-1.7-4.9-5.5-5.5C10.3 8.4 11.4 7.3 12 3.5ZM18.5 14c.3 1.6.8 2.1 2.4 2.4-1.6.3-2.1.8-2.4 2.4-.3-1.6-.8-2.1-2.4-2.4 1.6-.3 2.1-.8 2.4-2.4Z" />
  ),
  moon: <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />,
  bolt: <path d="M13 3 5 13.5h6L11 21l8-10.5h-6z" />,
  dumbbell: (
    <path d="M3 9.5v5M6 7.5v9M18 7.5v9M21 9.5v5M6 12h12" />
  ),
  heart: (
    <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7.5 3.8 3.8 0 0 1 19 10.5C19 15.5 12 20 12 20Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16M12 9v11M8.5 9C6 9 6 5.5 8.5 5.5S12 9 12 9s1-3.5 3.5-3.5S18 9 15.5 9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  shield: <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 22, strokeWidth = 1.6, ...rest }: IconProps & { strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

import type { SVGProps } from "react";

/**
 * Compact icon set for the chat mock. All icons use `stroke="currentColor"`
 * so they inherit text color and flip with the theme automatically.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const Plus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronUp = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export const ChevronExpand = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
  </svg>
);

export const PanelLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </svg>
);

export const Gear = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const ArrowUp = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const Swap = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
  </svg>
);

export const Copy = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

export const Rerun = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" />
  </svg>
);

export const Branch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="8" r="2.5" />
    <path d="M6 8.5v7M8.5 6H14a4 4 0 0 1 4 4v0" />
  </svg>
);

export const WalletIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <rect x="2" y="6" width="20" height="13" rx="3" />
    <path d="M16 12h.01" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const Coins = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9 10h6" />
  </svg>
);

export const Cube = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9 12h6" />
  </svg>
);

export const Sun = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
  </svg>
);

export const Moon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const Chart = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 3 3 5-5" />
  </svg>
);

export const Key = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <circle cx="8" cy="15" r="4" />
    <path d="M10.8 12.2 20 3M17 6l2 2M15 8l2 2" />
  </svg>
);

export const Bot = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 8V4M8 14h.01M16 14h.01" />
  </svg>
);

export const Lock = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const Shield = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
  </svg>
);

export const Sliders = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

"use client";

import type { Theme } from "../contracts";
import { ChevronDown, Gear, Moon, Sun } from "./icons";

/** Official Ethereum diamond — brand mark, not Solar. */
function EthereumMark({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 3L6.375 12.1667L12 15.4301L17.625 12.1667L12 3Z" fill="#627EEA" />
      <path
        d="M12 16.4778L6.375 13.2157L12 21L17.625 13.2157L12 16.4778Z"
        fill="#627EEA"
        opacity="0.62"
      />
      <path d="M12 3V9.6516L17.625 12.1667L12 3Z" fill="#627EEA" opacity="0.42" />
      <path
        d="M12 9.6516V15.4301L6.375 12.1667L12 9.6516Z"
        fill="#627EEA"
        opacity="0.28"
      />
    </svg>
  );
}

interface ChatHeaderProps {
  title: string;
  network: string;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({
  title,
  network,
  theme,
  onToggleTheme,
  onOpenSettings,
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-5">
      <h1 className="min-w-0 truncate text-sm font-medium leading-none tracking-[-0.01em]">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-1.5">
        <button className="flex h-8 items-center gap-1.5 rounded-full border border-border px-2.5 transition-colors hover:bg-surface-2">
          <EthereumMark size={13} />
          <span className="text-[13px] leading-none text-muted">{network}</span>
          <ChevronDown size={12} className="text-muted" />
        </button>

        <button
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          onClick={onOpenSettings}
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          aria-label="Settings"
        >
          <Gear size={18} />
        </button>
      </div>
    </header>
  );
}

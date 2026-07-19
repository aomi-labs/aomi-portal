"use client";

import type { Theme } from "../contracts";
import { ChevronDown, Gear, Moon, Sun } from "./icons";

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
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border px-5">
      <span className="text-sm font-medium">{title}</span>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-[7px] rounded-full border border-border px-2.5 py-1.5">
          <span className="h-[7px] w-[7px] rounded-full bg-success" />
          <span className="text-[13px] text-muted">{network}</span>
          <ChevronDown size={12} className="text-muted" />
        </div>
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

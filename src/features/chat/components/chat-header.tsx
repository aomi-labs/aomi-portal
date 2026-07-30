"use client";

import type { Theme } from "../contracts";
import { AppMark, ChevronDown, Gear, Moon, PanelLeft, Plus, Sun } from "./icons";
import { NetworkMark } from "./brands";
import { networks } from "../fixtures";

interface ChatHeaderProps {
  title: string;
  network: string;
  theme: Theme;
  /** Paper mobile: show menu + New chat instead of long title. */
  mobile?: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenApps?: () => void;
  onOpenNetwork: () => void;
  onOpenMobileNav?: () => void;
  onNewChat?: () => void;
}

export function ChatHeader({
  title,
  network,
  theme,
  mobile = false,
  onToggleTheme,
  onOpenSettings,
  onOpenApps,
  onOpenNetwork,
  onOpenMobileNav,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-3 sm:gap-4 sm:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:hidden"
            aria-label="Open navigation"
          >
            <PanelLeft size={18} />
          </button>
        )}
        {mobile && onNewChat ? (
          <button
            type="button"
            onClick={onNewChat}
            className="flex h-9 min-w-0 items-center gap-1.5 rounded-[var(--radius-sm)] px-1.5 text-left sm:hidden"
          >
            <Plus size={16} className="shrink-0" />
            <span className="truncate text-sm font-medium">New chat</span>
          </button>
        ) : null}
        <h1 className="hidden min-w-0 truncate text-sm font-medium leading-none tracking-[-0.01em] sm:block">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={onOpenNetwork}
          className="flex h-8 max-w-[140px] items-center gap-1.5 rounded-full border border-border px-2.5 transition-colors hover:bg-surface-2 sm:max-w-none"
        >
          <NetworkMark
            id={networks.find((n) => n.label === network)?.id ?? "ethereum"}
            size={13}
          />
          <span className="truncate text-[13px] leading-none text-muted">{network}</span>
          <ChevronDown size={12} className="hidden shrink-0 text-muted sm:block" />
        </button>

        {onOpenApps ? (
          <button
            type="button"
            onClick={onOpenApps}
            className="hidden h-8 items-center gap-1.5 rounded-full border border-border px-2.5 text-[13px] font-medium leading-none text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:flex"
          >
            <AppMark size={14} />
            Apps
          </button>
        ) : null}

        <button
          type="button"
          onClick={onToggleTheme}
          className="hidden h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:flex"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="hidden h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:flex"
          aria-label="Settings"
        >
          <Gear size={18} />
        </button>
      </div>
    </header>
  );
}

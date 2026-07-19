"use client";

import type { Account, Thread } from "../contracts";
import { ChevronDown, ChevronExpand, PanelLeft, Plus } from "./icons";

/** Real Aomi mark (circle-orbit glyph). currentColor — themes automatically. */
function AomiMark({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 208 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    >
      <path
        d="M184.214 54.146C184.214 37.0059 170.37 23.1111 153.293 23.1111C136.215 23.1111 122.371 37.0059 122.371 54.146C122.371 71.2861 136.215 85.1809 153.293 85.1809C170.37 85.1809 184.214 71.2861 184.214 54.146ZM207.241 54.146C207.241 84.0501 183.088 108.292 153.293 108.292C123.498 108.292 99.3442 84.0501 99.3442 54.146C99.3442 24.242 123.498 7.65756e-07 153.293 0C183.088 0 207.241 24.242 207.241 54.146Z"
        fill="currentColor"
      />
      <path
        d="M103.621 0C105.791 0 107.946 0.0668813 110.084 0.198934C108.49 1.57713 106.96 3.02745 105.499 4.54484C97.8939 11.9278 91.9814 21.0558 88.4036 31.2867C54.8263 38.3294 29.6059 68.2082 29.6059 104C29.6059 145.027 62.7434 178.286 103.621 178.286C139.282 178.286 169.051 152.973 176.068 119.272C186.268 115.679 195.367 109.74 202.726 102.101C204.233 100.638 205.674 99.1078 207.042 97.5132C207.174 99.6585 207.241 101.821 207.241 104C207.241 161.438 160.849 208 103.621 208C46.3925 208 0 161.438 0 104C0 46.5624 46.3925 0 103.621 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { AomiMark };

interface SidebarProps {
  account: Account;
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  account,
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <AomiMark />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Aomi</span>
          <ChevronDown size={14} className="text-muted" />
        </div>
        <button className="text-muted transition-colors hover:text-fg">
          <PanelLeft size={18} />
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="mx-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-3 py-[9px] text-left transition-colors hover:border-muted/40"
      >
        <Plus size={16} />
        <span className="text-sm font-medium">New chat</span>
      </button>

      <div className="flex flex-1 flex-col gap-0.5 px-2 pt-5">
        <span className="px-2 pb-2 text-xs font-medium text-muted">Recent</span>
        {threads.map((t) => {
          const active = t.id === activeThreadId;
          return (
            <button
              key={t.id}
              onClick={() => onSelectThread(t.id)}
              className={`flex items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-left transition-colors ${
                active ? "bg-surface-2" : "hover:bg-surface-2/60"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                  active ? "bg-accent" : "bg-transparent"
                }`}
              />
              <span
                className={`truncate text-sm ${active ? "text-fg" : "text-muted"}`}
              >
                {t.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="m-2 flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-border p-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold">
          GE
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] font-medium">{account.address}</span>
          <span className="text-[11px] text-muted">
            {account.credits?.toLocaleString()} credits
          </span>
        </div>
        <ChevronExpand size={16} className="flex-shrink-0 text-muted" />
      </div>
    </aside>
  );
}

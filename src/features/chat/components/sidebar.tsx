"use client";

import type { Account, Thread } from "../contracts";
import { ChevronDown, ChevronExpand, PanelLeft, Plus } from "./icons";

function AomiMark({ size = 24, inner = 10 }: { size?: number; inner?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[7px] bg-gradient-to-br from-accent to-accent-strong"
      style={{ width: size, height: size }}
    >
      <div
        className="rounded-[3px] bg-on-accent"
        style={{ width: inner, height: inner }}
      />
    </div>
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

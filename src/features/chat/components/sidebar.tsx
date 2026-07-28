"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Account, Thread } from "../contracts";
import {
  ChevronDown,
  ChevronExpand,
  ChevronRight,
  FolderPlus,
  MoreVertical,
  PanelLeft,
  Pencil,
  Plus,
  StopCircle,
  Trash,
} from "./icons";

/** Real Aomi mark (circle-orbit glyph). currentColor — themes automatically. */
function AomiMark({
  size = 22,
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
  busy?: boolean;
  collapsed: boolean;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  onToggleCollapse: () => void;
  onOpenWorkspace: () => void;
  onOpenAccount: () => void;
  onRenameThread: (id: string) => void;
  onMoveThread: (id: string) => void;
  onStopThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
}

export function Sidebar({
  account,
  threads,
  activeThreadId,
  busy = false,
  collapsed,
  onSelectThread,
  onNewChat,
  onToggleCollapse,
  onOpenWorkspace,
  onOpenAccount,
  onRenameThread,
  onMoveThread,
  onStopThread,
  onDeleteThread,
}: SidebarProps) {
  const [menuThreadId, setMenuThreadId] = useState<string | null>(null);

  const avatar = account.connected ? (
    <Image
      src="/avatar.png"
      alt=""
      width={28}
      height={28}
      className="h-7 w-7 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] text-muted">
      ?
    </span>
  );

  if (collapsed) {
    return (
      <aside className="relative flex h-full w-16 shrink-0 flex-col items-center border-r border-border bg-surface transition-[width]">
        <div className="flex flex-col items-center gap-1 pt-3">
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-surface-2/60"
            aria-label="Workspace"
          >
            <AomiMark size={22} />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label="Expand sidebar"
          >
            <PanelLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onNewChat}
            className="mt-2 flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-2 transition-colors hover:border-muted/40"
            aria-label="New chat"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onOpenAccount}
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-border transition-colors hover:bg-surface-2/50"
          aria-label="Account"
        >
          {avatar}
        </button>
      </aside>
    );
  }

  return (
    <aside className="relative flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-surface transition-[width]">
      <div className="flex h-14 items-center justify-between gap-2 px-3">
        <button
          type="button"
          onClick={onOpenWorkspace}
          className="flex h-10 min-w-0 items-center gap-2 rounded-[var(--radius-sm)] px-1.5 transition-colors hover:bg-surface-2/60"
        >
          <AomiMark size={22} />
          <span className="truncate text-[15px] font-semibold leading-none tracking-[-0.015em]">
            Aomi
          </span>
          <ChevronDown size={14} className="shrink-0 text-muted" />
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:flex"
          aria-label="Collapse sidebar"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mx-3 flex h-10 items-center gap-2.5 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-3 text-left transition-colors hover:border-muted/40"
        aria-label="New chat"
      >
        <Plus size={16} />
        <span className="text-sm font-medium leading-none">New chat</span>
      </button>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-2">
        <span className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
          Recent
        </span>
        {threads.map((t) => {
          const active = t.id === activeThreadId;
          return (
            <ThreadRow
              key={t.id}
              thread={t}
              active={active}
              showStatus={active}
              busy={busy && active}
              menuOpen={menuThreadId === t.id}
              onSelect={() => {
                setMenuThreadId(null);
                onSelectThread(t.id);
              }}
              onToggleMenu={() =>
                setMenuThreadId((cur) => (cur === t.id ? null : t.id))
              }
              onCloseMenu={() => setMenuThreadId(null)}
              onRename={() => {
                setMenuThreadId(null);
                onRenameThread(t.id);
              }}
              onMove={() => {
                setMenuThreadId(null);
                onMoveThread(t.id);
              }}
              onStop={() => {
                setMenuThreadId(null);
                onStopThread(t.id);
              }}
              onDelete={() => {
                setMenuThreadId(null);
                onDeleteThread(t.id);
              }}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={onOpenAccount}
        className="mx-3 mb-3 mt-2 flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-border p-2.5 text-left transition-colors hover:bg-surface-2/50"
      >
        {avatar}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-mono text-[12px] font-medium leading-none tracking-tight">
            {account.connected ? account.address : "Not connected"}
          </span>
          <span className="truncate text-[11px] leading-none text-muted">
            {account.connected
              ? `${account.credits?.toLocaleString()} credits`
              : "Connect wallet"}
          </span>
        </div>
        <ChevronExpand size={16} className="shrink-0 text-muted" />
      </button>
    </aside>
  );
}

function ThreadRow({
  thread,
  active,
  showStatus,
  busy,
  menuOpen,
  onSelect,
  onToggleMenu,
  onCloseMenu,
  onRename,
  onMove,
  onStop,
  onDelete,
}: {
  thread: Thread;
  active: boolean;
  showStatus: boolean;
  busy: boolean;
  menuOpen: boolean;
  onSelect: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onRename: () => void;
  onMove: () => void;
  onStop: () => void;
  onDelete: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseMenu();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <div
      className={`group relative flex h-9 items-center gap-1 rounded-[var(--radius-sm)] px-2 transition-colors ${
        active ? "bg-surface-2" : "hover:bg-surface-2/60"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 truncate py-1.5 text-left"
      >
        <span
          className={`block truncate text-[13px] leading-snug ${
            active ? "font-medium text-fg" : "text-muted"
          }`}
        >
          {thread.title}
        </span>
      </button>
      <div className="relative flex shrink-0 items-center gap-0.5">
        {showStatus && (
          <span
            aria-label={busy ? "Running" : "Active"}
            className="mx-0.5 h-2 w-2 rounded-full bg-fg"
          />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className={`flex h-7 w-7 items-center justify-center rounded-[6px] text-muted transition-opacity hover:bg-background/40 hover:text-fg ${
            menuOpen || active
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={`More actions for ${thread.title}`}
          aria-expanded={menuOpen}
        >
          <MoreVertical size={15} />
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-[calc(100%+4px)] z-50 flex w-[168px] flex-col gap-0.5 rounded-[10px] border border-border bg-elevated p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          >
            <MenuItem icon={<Pencil size={15} />} label="Rename" onClick={onRename} />
            <MenuItem
              icon={<FolderPlus size={15} />}
              label="Move to"
              trailing={<ChevronRight size={12} className="text-muted" />}
              onClick={onMove}
            />
            <MenuItem
              icon={<StopCircle size={15} />}
              label="Stop"
              onClick={onStop}
              disabled={!busy}
            />
            <MenuItem
              icon={<Trash size={15} />}
              label="Delete"
              onClick={onDelete}
              destructive
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  trailing,
  onClick,
  disabled,
  destructive,
}: {
  icon: ReactNode;
  label: string;
  trailing?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-full items-center gap-2.5 rounded-[7px] px-2 text-left text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        destructive
          ? "text-[#E5484D] hover:bg-surface-2"
          : "text-fg hover:bg-surface-2"
      }`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {trailing}
    </button>
  );
}

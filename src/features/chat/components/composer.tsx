"use client";

import { AppMark, ArrowUp, Plus } from "./icons";

interface ComposerProps {
  /** "hero" = tall empty-state composer; "dock" = single-line docked bar. */
  variant?: "hero" | "dock";
  placeholder: string;
  onSend: () => void;
}

export function Composer({ variant = "hero", placeholder, onSend }: ComposerProps) {
  if (variant === "dock") {
    return (
      <div className="flex w-full max-w-[720px] items-center gap-2.5 rounded-[var(--radius-lg)] border border-border bg-surface py-2 pl-3 pr-2">
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
          aria-label="Quick access"
        >
          <Plus size={16} />
        </button>
        <span className="min-w-0 flex-1 truncate text-[15px] leading-none text-muted">
          {placeholder}
        </span>
        <button
          onClick={onSend}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong text-on-accent"
          aria-label="Send"
        >
          <ArrowUp size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3.5">
      <p className="text-[15px] leading-snug text-muted">{placeholder}</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
            aria-label="Quick access"
          >
            <Plus size={16} />
          </button>
          <div className="flex h-8 max-w-[160px] items-center gap-1.5 rounded-full border border-border px-2.5">
            <AppMark size={14} className="shrink-0 text-accent" />
            <span className="truncate text-[13px] leading-none text-muted">aomi-defi</span>
          </div>
        </div>
        <button
          onClick={onSend}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong text-on-accent"
          aria-label="Send"
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </div>
  );
}

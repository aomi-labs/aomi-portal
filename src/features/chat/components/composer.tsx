"use client";

import { ArrowUp, Cube, Plus } from "./icons";

interface ComposerProps {
  /** "hero" = tall empty-state composer; "dock" = single-line docked bar. */
  variant?: "hero" | "dock";
  placeholder: string;
  onSend: () => void;
}

export function Composer({ variant = "hero", placeholder, onSend }: ComposerProps) {
  if (variant === "dock") {
    return (
      <div className="flex w-full max-w-[720px] items-center gap-2.5 rounded-[var(--radius-lg)] border border-border bg-surface py-2.5 pl-3.5 pr-2.5">
        <button className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg">
          <Plus size={16} />
        </button>
        <span className="flex-1 text-[15px] text-muted">{placeholder}</span>
        <button
          onClick={onSend}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong text-on-accent"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3.5 rounded-[var(--radius-lg)] border border-border bg-surface py-3.5 pl-4 pr-3.5">
      <span className="text-[15px] text-muted">{placeholder}</span>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg">
            <Plus size={16} />
          </button>
          <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5">
            <Cube size={14} className="text-muted" />
            <span className="text-[13px] text-muted">aomi-defi</span>
          </div>
        </div>
        <button
          onClick={onSend}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong text-on-accent"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}

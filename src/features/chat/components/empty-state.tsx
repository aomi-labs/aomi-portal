"use client";

import { suggestions, type SuggestionKey } from "../fixtures";
import { AomiMark } from "./sidebar";
import { Composer } from "./composer";
import { ArrowRight, Coins, CodeSquare, Swap } from "./icons";

function SuggestionIcon({ k }: { k: SuggestionKey }) {
  const cls = "shrink-0 text-accent";
  if (k === "swap") return <Swap size={15} className={cls} />;
  if (k === "bridge") return <ArrowRight size={15} className={cls} />;
  if (k === "portfolio") return <Coins size={15} className={cls} />;
  return <CodeSquare size={15} className={cls} />;
}

export function EmptyState({ onSend }: { onSend: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-[680px] flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-3.5">
          <AomiMark size={48} />
          <h1 className="max-w-[18ch] text-center text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-balance">
            What can I help you onchain?
          </h1>
        </div>

        <Composer
          variant="hero"
          placeholder="Ask Aomi to swap, bridge, send, or deploy…"
          onSend={onSend}
        />

        {/* Suggestion chips — single row wraps cleanly, icon slot fixed */}
        <div className="flex w-full flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.key}
              onClick={onSend}
              className="flex h-9 max-w-full items-center gap-2 rounded-full border border-border bg-surface px-3.5 transition-colors hover:border-muted/40"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                <SuggestionIcon k={s.key} />
              </span>
              <span className="truncate text-[13px] font-medium leading-none">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

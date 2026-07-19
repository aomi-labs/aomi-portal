"use client";

import { suggestions, type SuggestionKey } from "../fixtures";
import { AomiMark } from "./sidebar";
import { Composer } from "./composer";
import { Coins, Cube, Swap, ArrowRight } from "./icons";

function SuggestionIcon({ k }: { k: SuggestionKey }) {
  const cls = "text-accent";
  if (k === "swap") return <Swap size={15} className={cls} />;
  if (k === "bridge") return <ArrowRight size={15} className={cls} />;
  if (k === "portfolio") return <Coins size={15} className={cls} />;
  return <Cube size={15} className={cls} />;
}

export function EmptyState({ onSend }: { onSend: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-[720px] flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <AomiMark size={52} inner={20} />
          <h1 className="text-center text-[30px] font-semibold tracking-[-0.02em]">
            What can I help you onchain?
          </h1>
        </div>

        <Composer
          variant="hero"
          placeholder="Ask Aomi to swap, bridge, send, or deploy…"
          onSend={onSend}
        />

        <div className="flex w-full flex-wrap justify-center gap-2.5">
          {suggestions.map((s) => (
            <button
              key={s.key}
              onClick={onSend}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-[9px] text-[13px] transition-colors hover:border-muted/40"
            >
              <SuggestionIcon k={s.key} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { suggestions, type SuggestionKey } from "../fixtures";
import { AomiMark } from "./sidebar";
import { Composer } from "./composer";
import { ArrowRight, Coins, CodeSquare, Swap } from "./icons";

function SuggestionIcon({ k }: { k: SuggestionKey }) {
  const cls = "shrink-0 text-muted";
  if (k === "swap") return <Swap size={15} className={cls} />;
  if (k === "bridge") return <ArrowRight size={15} className={cls} />;
  if (k === "portfolio") return <Coins size={15} className={cls} />;
  return <CodeSquare size={15} className={cls} />;
}

/** Local-hour greeting — Claude-style, uses the visitor's timezone. */
function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good evening";
}

/** Soft rotating invites under the time greeting. */
const INVITES = [
  "What can I help you do?",
  "Ready when you are.",
  "What should we do onchain today?",
  "Where should we begin?",
] as const;

function useWelcomeCopy() {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [inviteIndex, setInviteIndex] = useState(0);
  const [inviteVisible, setInviteVisible] = useState(true);

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setInviteVisible(false);
      window.setTimeout(() => {
        setInviteIndex((i) => (i + 1) % INVITES.length);
        setInviteVisible(true);
      }, 320);
    }, 7500);
    return () => window.clearInterval(id);
  }, []);

  return {
    greeting,
    invite: INVITES[inviteIndex]!,
    inviteVisible,
  };
}

interface EmptyStateProps {
  draft: string;
  busy: boolean;
  appLabel: string;
  modelLabel: string;
  networkLabel: string;
  onDraftChange: (v: string) => void;
  onSend: (text?: string) => void;
  onStop: () => void;
  onOpenCommand: () => void;
  onOpenApp: () => void;
  onOpenModel: () => void;
  onOpenNetwork: () => void;
  onSuggestion: (threadId: string) => void;
  commandSlot?: React.ReactNode;
  selectorSlot?: React.ReactNode;
}

export function EmptyState({
  draft,
  busy,
  appLabel,
  modelLabel,
  networkLabel,
  onDraftChange,
  onSend,
  onStop,
  onOpenCommand,
  onOpenApp,
  onOpenModel,
  onOpenNetwork,
  onSuggestion,
  commandSlot,
  selectorSlot,
}: EmptyStateProps) {
  const { greeting, invite, inviteVisible } = useWelcomeCopy();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col sm:items-center sm:justify-center sm:px-6 sm:py-10">
      {/* Greeting — Paper 28 fills middle; desktop keeps left-aligned hero block */}
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 px-6 py-6 sm:flex-none sm:w-full sm:max-w-[680px] sm:items-start sm:gap-4 sm:px-0 sm:py-0">
          <AomiMark size={40} />
        <div className="flex flex-col gap-1 sm:min-h-[72px]">
          <h1
            className={`text-[30px] font-semibold leading-[1.15] tracking-[-0.025em] transition-opacity duration-500 sm:text-[28px] ${
              greeting ? "opacity-100" : "opacity-0"
            }`}
          >
            {greeting ?? "Good afternoon"}
          </h1>
          <p
            className={`text-[15px] font-medium leading-snug text-muted transition-opacity duration-300 sm:text-[28px] sm:leading-[1.15] sm:tracking-[-0.025em] ${
              inviteVisible && greeting ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            {invite}
          </p>
        </div>
      </div>

      {/* Composer — docked on mobile (Paper 28), centered in stack on desktop */}
      <div className="order-3 w-full shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:order-2 sm:max-w-[680px] sm:px-0 sm:pb-0 sm:pt-7">
        <div className="relative w-full">
          {commandSlot}
          {selectorSlot}
          <Composer
            variant="hero"
            draft={draft}
            placeholder="Ask Aomi to swap, bridge, send, or deploy…"
            busy={busy}
            appLabel={appLabel}
            modelLabel={modelLabel}
            networkLabel={networkLabel}
            onDraftChange={onDraftChange}
            onSend={() => onSend()}
            onStop={onStop}
            onOpenCommand={onOpenCommand}
            onOpenApp={onOpenApp}
            onOpenModel={onOpenModel}
            onOpenNetwork={onOpenNetwork}
          />
        </div>
      </div>

      {/* Suggestions — above composer on mobile, below on desktop */}
      <div className="order-2 w-full shrink-0 px-4 pb-2 sm:order-3 sm:max-w-[680px] sm:px-0 sm:pb-0 sm:pt-7">
        <div className="flex w-full gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-start sm:overflow-visible">
          {suggestions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onSuggestion(s.threadId)}
              className="flex h-9 shrink-0 max-w-full items-center gap-2 rounded-pill border border-border bg-elevated px-3.5 transition-colors hover:border-muted/40"
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

"use client";

import type { ToolStep, TxPreview } from "../contracts";
import { AomiMark } from "./sidebar";
import { Composer } from "./composer";
import { WorkingTrace } from "./working-trace";
import { TxPreviewCard } from "./tx-preview";
import { Branch, Copy, Rerun } from "./icons";

interface ConversationProps {
  userMessages: { id: string; content: string }[];
  answer: string | null;
  trace: ToolStep[];
  tx: TxPreview | null;
  durationLabel: string;
  busy: boolean;
  draft: string;
  appLabel: string;
  modelLabel: string;
  networkLabel: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  onOpenCommand: () => void;
  onOpenApp: () => void;
  onOpenModel: () => void;
  onOpenNetwork: () => void;
  onApprove: () => void;
  onCancelTx: () => void;
  onCopy: () => void;
  onRerun: () => void;
  onBranch: () => void;
  commandSlot?: React.ReactNode;
}

export function Conversation({
  userMessages,
  answer,
  trace,
  tx,
  durationLabel,
  busy,
  draft,
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
  onApprove,
  onCancelTx,
  onCopy,
  onRerun,
  onBranch,
  commandSlot,
}: ConversationProps) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex w-full max-w-[680px] flex-col gap-6">
          {userMessages.map((m) => (
            <div key={m.id} className="flex w-full justify-end">
              <div className="max-w-[min(70%,28rem)] rounded-2xl rounded-br-md bg-surface-2 px-3.5 py-2.5">
                <p className="text-[15px] leading-[1.45] text-pretty">{m.content}</p>
              </div>
            </div>
          ))}

          {(busy || answer || trace.length > 0) && (
            <div className="flex w-full gap-3">
              <div className="pt-0.5">
                <AomiMark size={24} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                {trace.length > 0 && (
                  <WorkingTrace durationLabel={durationLabel} steps={trace} busy={busy} />
                )}

                {answer && (
                  <div className="flex flex-col gap-3.5">
                    <p className="text-[15px] leading-[1.55] text-pretty">{answer}</p>
                    {tx && (
                      <TxPreviewCard tx={tx} onApprove={onApprove} onCancel={onCancelTx} />
                    )}
                    <div className="flex items-center gap-1 pt-0.5 text-muted">
                      <ActionBtn label="Copy" onClick={onCopy}>
                        <Copy size={15} />
                      </ActionBtn>
                      <ActionBtn label="Rerun" onClick={onRerun}>
                        <Rerun size={15} />
                      </ActionBtn>
                      <ActionBtn label="Branch" onClick={onBranch}>
                        <Branch size={15} />
                      </ActionBtn>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex shrink-0 justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6">
        {commandSlot}
        <Composer
          variant="dock"
          draft={draft}
          placeholder={busy ? "Aomi is working…" : "Reply to Aomi…"}
          busy={busy}
          appLabel={appLabel}
          modelLabel={modelLabel}
          networkLabel={networkLabel}
          onDraftChange={onDraftChange}
          onSend={onSend}
          onStop={onStop}
          onOpenCommand={onOpenCommand}
          onOpenApp={onOpenApp}
          onOpenModel={onOpenModel}
          onOpenNetwork={onOpenNetwork}
        />
      </div>
    </>
  );
}

function ActionBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={label}
    >
      {children}
    </button>
  );
}

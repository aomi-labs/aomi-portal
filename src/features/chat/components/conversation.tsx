"use client";

import { answerText, seedTrace, seedTx } from "../fixtures";
import { AomiMark } from "./sidebar";
import { Composer } from "./composer";
import { WorkingTrace } from "./working-trace";
import { TxPreviewCard } from "./tx-preview";
import { Branch, Copy, Rerun } from "./icons";

interface ConversationProps {
  userMessage: string;
  onApprove: () => void;
  onSend: () => void;
}

export function Conversation({ userMessage, onApprove, onSend }: ConversationProps) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 py-8">
        <div className="flex w-full max-w-[680px] flex-col gap-6">
          <div className="flex w-full justify-end">
            <div className="max-w-[min(70%,28rem)] rounded-2xl rounded-br-md bg-surface-2 px-3.5 py-2.5">
              <p className="text-[15px] leading-[1.45] text-pretty">{userMessage}</p>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <div className="pt-0.5">
              <AomiMark size={24} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <WorkingTrace durationLabel="Worked for 8s" steps={seedTrace} />

              <div className="flex flex-col gap-3.5">
                <p className="text-[15px] leading-[1.55] text-pretty">{answerText}</p>
                <TxPreviewCard tx={seedTx} onApprove={onApprove} onCancel={onApprove} />
                <div className="flex items-center gap-1 pt-0.5 text-muted">
                  <ActionBtn label="Copy">
                    <Copy size={15} />
                  </ActionBtn>
                  <ActionBtn label="Rerun">
                    <Rerun size={15} />
                  </ActionBtn>
                  <ActionBtn label="Branch">
                    <Branch size={15} />
                  </ActionBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 justify-center px-6 pb-6 pt-3">
        <Composer variant="dock" placeholder="Reply to Aomi…" onSend={onSend} />
      </div>
    </>
  );
}

function ActionBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={label}
    >
      {children}
    </button>
  );
}

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
        <div className="flex w-full max-w-[720px] flex-col gap-6">
          <div className="flex w-full justify-end">
            <div className="max-w-[70%] rounded-2xl rounded-br-md bg-surface-2 px-[15px] py-[11px]">
              <span className="text-[15px] leading-[22px]">{userMessage}</span>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <div className="pt-0.5">
              <AomiMark size={28} inner={11} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <WorkingTrace durationLabel="Worked for 8s" steps={seedTrace} />

              <div className="flex flex-col gap-3.5">
                <p className="text-[15px] leading-[23px]">{answerText}</p>
                <TxPreviewCard tx={seedTx} onApprove={onApprove} onCancel={onApprove} />
                <div className="flex items-center gap-3.5 pt-0.5 text-muted">
                  <button className="transition-colors hover:text-fg" aria-label="Copy">
                    <Copy size={15} />
                  </button>
                  <button className="transition-colors hover:text-fg" aria-label="Rerun">
                    <Rerun size={15} />
                  </button>
                  <button className="transition-colors hover:text-fg" aria-label="Branch">
                    <Branch size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-shrink-0 justify-center px-6 pb-6 pt-4">
        <Composer variant="dock" placeholder="Reply to Aomi…" onSend={onSend} />
      </div>
    </>
  );
}

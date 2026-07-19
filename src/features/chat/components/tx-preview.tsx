"use client";

import type { TxPreview } from "../contracts";
import { ArrowRight, Swap } from "./icons";

interface TxPreviewCardProps {
  tx: TxPreview;
  onApprove: () => void;
  onCancel: () => void;
}

export function TxPreviewCard({ tx, onApprove, onCancel }: TxPreviewCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Swap size={15} className="text-accent" />
        <span className="text-[13px] font-semibold">Swap preview</span>
        <span className="flex-1" />
        <span className="font-mono text-xs text-muted">{tx.provider}</span>
      </div>

      <div className="flex items-center p-4">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-xs text-muted">You pay</span>
          <span className="text-lg font-semibold">{tx.payAmount}</span>
        </div>
        <ArrowRight size={18} className="mx-2 text-muted" />
        <div className="flex flex-1 flex-col items-end gap-0.5">
          <span className="text-xs text-muted">You receive (est.)</span>
          <span className="text-lg font-semibold">{tx.receiveAmount}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 pb-3">
        <span className="font-mono text-xs text-muted">Rate {tx.rate}</span>
        <span className="font-mono text-xs text-muted">Slippage {tx.slippage}</span>
        <span className="font-mono text-xs text-muted">Gas {tx.gas}</span>
      </div>

      <div className="flex gap-2.5 border-t border-border px-4 py-3">
        <button
          onClick={onApprove}
          className="flex flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-accent to-accent-strong py-2.5 text-sm font-semibold text-on-accent"
        >
          Approve in wallet
        </button>
        <button
          onClick={onCancel}
          className="flex items-center justify-center rounded-[var(--radius-sm)] border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

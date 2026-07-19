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
      <div className="flex h-11 items-center gap-2 border-b border-border px-4">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <Swap size={15} className="text-accent" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-none">
          Swap preview
        </span>
        <span className="shrink-0 font-mono text-[11px] leading-none text-muted">
          {tx.provider}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] leading-none text-muted">You pay</span>
          <span className="truncate text-lg font-semibold leading-tight tracking-tight tabular-nums">
            {tx.payAmount}
          </span>
        </div>
        <ArrowRight size={16} className="shrink-0 text-muted" />
        <div className="flex min-w-0 flex-col items-end gap-1">
          <span className="text-[11px] leading-none text-muted">You receive (est.)</span>
          <span className="truncate text-lg font-semibold leading-tight tracking-tight tabular-nums">
            {tx.receiveAmount}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-3">
        <Meta label="Rate" value={tx.rate} />
        <Meta label="Slippage" value={tx.slippage} />
        <Meta label="Gas" value={tx.gas} />
      </div>

      <div className="flex gap-2.5 border-t border-border px-4 py-3">
        <button
          onClick={onApprove}
          className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-accent to-accent-strong text-sm font-semibold leading-none text-on-accent"
        >
          Approve in wallet
        </button>
        <button
          onClick={onCancel}
          className="flex h-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border px-4 text-sm font-medium leading-none text-muted transition-colors hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 font-mono text-[11px] leading-none text-muted">
      <span>{label}</span>
      <span className="tabular-nums text-fg/80">{value}</span>
    </span>
  );
}

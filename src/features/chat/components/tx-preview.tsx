"use client";

import { Button } from "@aomi-labs/design";
import type { TxPreview } from "../contracts";
import { ArrowRight, Swap } from "./icons";

interface TxPreviewCardProps {
  tx: TxPreview;
  onApprove: () => void;
  onCancel: () => void;
}

export function TxPreviewCard({ tx, onApprove, onCancel }: TxPreviewCardProps) {
  const statusLabel =
    tx.status === "approved"
      ? "Approved"
      : tx.status === "rejected"
        ? "Rejected"
        : tx.status === "cancelled"
          ? "Cancelled locally"
          : tx.status === "pending"
            ? "Waiting for wallet…"
            : null;

  const primaryLabel =
    tx.status === "approved"
      ? "Approved"
      : tx.status === "cancelled"
        ? "Cancelled locally"
        : tx.status === "rejected"
          ? "Rejected"
          : tx.approveLabel;

  const primaryDisabled = tx.status !== "ready" && tx.status !== "pending";

  const isCopyAction = tx.kind === "balances";

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-elevated">
      <div className="flex h-11 items-center gap-2 border-b border-border px-4">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <Swap size={15} className="text-muted" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-none">
          {tx.title}
        </span>
        <span className="shrink-0 font-mono text-[11px] leading-none text-muted">{tx.provider}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] leading-none text-muted">{tx.payLabel}</span>
          <span className="truncate text-lg font-semibold leading-tight tracking-tight tabular-nums">
            {tx.payAmount}
          </span>
        </div>
        <ArrowRight size={16} className="shrink-0 text-muted" />
        <div className="flex min-w-0 flex-col items-end gap-1">
          <span className="text-[11px] leading-none text-muted">{tx.receiveLabel}</span>
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

      {statusLabel && tx.status !== "ready" && (
        <div className="px-4 pb-2 text-[12px] font-medium text-muted">{statusLabel}</div>
      )}

      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <Button
          type="button"
          variant={isCopyAction ? "outline" : "primary"}
          size="md"
          shape="pill"
          onClick={onApprove}
          disabled={primaryDisabled && tx.status !== "pending"}
          className={`h-10 min-w-0 flex-1 text-sm font-semibold leading-none ${
            isCopyAction
              ? "border-border-strong bg-background text-fg hover:bg-surface"
              : "bg-primary text-primary-foreground hover:bg-primary-hover"
          }`}
        >
          {primaryLabel}
        </Button>
        {tx.status === "ready" && (
          <Button
            type="button"
            variant="outline"
            size="md"
            shape="pill"
            onClick={onCancel}
            className="h-10 shrink-0 border border-border-strong bg-transparent px-5 text-sm font-medium leading-none text-fg hover:bg-surface-2/70"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 font-mono text-[11px] leading-none text-muted">
      <span>{label}</span>
      <span className="tabular-nums text-fg">{value}</span>
    </span>
  );
}

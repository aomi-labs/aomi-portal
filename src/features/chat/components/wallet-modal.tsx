"use client";

import type { TxPreview } from "../contracts";
import { WalletIcon } from "./icons";

interface WalletModalProps {
  tx: TxPreview;
  onApprove: () => void;
  onReject: () => void;
}

export function WalletModal({ tx, onApprove, onReject }: WalletModalProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      <button
        aria-label="Dismiss"
        onClick={onReject}
        className="absolute inset-0 bg-black/55"
      />
      <div className="relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-surface-2">
            <WalletIcon size={15} />
          </div>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold leading-none">
            Wallet
          </span>
          <div className="flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] leading-none text-muted">Simulation</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 px-5 py-5 text-center">
          <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.015em]">
            Approve transaction
          </h2>
          <p className="max-w-[32ch] text-[13px] leading-snug text-muted text-pretty">
            app.aomi.xyz requests a swap on Ethereum
          </p>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border">
            <Row label="Send" value={tx.payAmount} border />
            <Row label="Receive (est.)" value={tx.receiveAmount} border />
            <Row label="Network fee" value={tx.gas} mono />
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onReject}
              className="flex h-11 flex-1 items-center justify-center rounded-[var(--radius-sm)] border border-border text-sm font-medium leading-none"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              className="flex h-11 flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-accent to-accent-strong text-sm font-semibold leading-none text-on-accent"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  border,
  mono,
}: {
  label: string;
  value: string;
  border?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-3.5 py-3 ${
        border ? "border-b border-border" : ""
      }`}
    >
      <span className="shrink-0 text-[13px] leading-none text-muted">{label}</span>
      <span
        className={`min-w-0 truncate text-right tabular-nums ${
          mono ? "font-mono text-[13px] leading-none" : "text-sm font-semibold leading-none"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

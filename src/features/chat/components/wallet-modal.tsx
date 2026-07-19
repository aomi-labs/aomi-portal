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
    <div className="absolute inset-0 flex items-center justify-center">
      <button
        aria-label="Dismiss"
        onClick={onReject}
        className="absolute inset-0 bg-black/55"
      />
      <div className="relative flex w-[400px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5 border-b border-border px-[18px] py-4">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-surface-2">
            <WalletIcon size={15} />
          </div>
          <span className="flex-1 text-sm font-semibold">Wallet</span>
          <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] text-muted">Simulation</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 px-[18px] py-5">
          <span className="text-[17px] font-semibold">Approve transaction</span>
          <span className="text-center text-[13px] text-muted">
            app.aomi.xyz requests a swap on {tx.receiveSymbol === "USDC" ? "Ethereum" : "Ethereum"}
          </span>
        </div>

        <div className="flex flex-col gap-3 px-[18px] pb-[18px]">
          <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border">
            <Row label="Send" value={tx.payAmount} border />
            <Row label="Receive (est.)" value={tx.receiveAmount} border />
            <Row label="Network fee" value={tx.gas} mono />
          </div>
          <div className="flex gap-2.5 pt-0.5">
            <button
              onClick={onReject}
              className="flex flex-1 items-center justify-center rounded-[var(--radius-sm)] border border-border py-3 text-sm font-medium"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              className="flex flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-accent to-accent-strong py-3 text-sm font-semibold text-on-accent"
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
      className={`flex items-center justify-between px-3.5 py-3 ${
        border ? "border-b border-border" : ""
      }`}
    >
      <span className="text-[13px] text-muted">{label}</span>
      <span className={`${mono ? "font-mono text-[13px]" : "text-sm font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}

"use client";

import { Button } from "@aomi-labs/design";
import { useState } from "react";
import type { Gate, LinkedWallet, Toast, TxPreview, WalletOption } from "../contracts";
import { Close, WalletIcon } from "./icons";
import { ParaMark, WalletMark } from "./brands";
import { walletOptions } from "../fixtures";

export function ToastBanner({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const tone =
    toast.tone === "success"
      ? "bg-[#3DD68C]"
      : toast.tone === "error"
        ? "bg-[var(--aomi-danger-500)]"
        : "bg-accent";
  return (
    <div className="pointer-events-auto absolute left-1/2 top-3 z-50 flex w-[min(100%-1.5rem,420px)] -translate-x-1/2 items-center gap-2 rounded-pill border border-border bg-elevated px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)] sm:top-4">
      <span className={`h-2 w-2 shrink-0 rounded-full ${tone}`} />
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{toast.message}</span>
      <button type="button" aria-label="Dismiss toast" onClick={onDismiss} className="shrink-0 text-muted hover:text-fg">
        <Close size={12} />
      </button>
    </div>
  );
}

export function GateModal({
  gate,
  onOpenSecrets,
  onSwitchApp,
  onConnectWallet,
  onUseOwnKey,
  onOpenUsage,
  onClose,
}: {
  gate: Gate;
  onOpenSecrets: () => void;
  onSwitchApp: () => void;
  onConnectWallet?: () => void;
  onUseOwnKey?: () => void;
  onOpenUsage?: () => void;
  onClose: () => void;
}) {
  const isPayment = gate.kind === "payment";
  const actions = gate.paymentActions ?? [];

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/55" />
      <div className="relative w-full max-w-[420px] rounded-t-xl border border-border border-b-0 bg-elevated p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:rounded-lg sm:border-b sm:pb-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[17px] font-semibold tracking-[-0.015em]">{gate.title}</h2>
          {isPayment && (
            <span className="shrink-0 rounded-pill border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              Simulation
            </span>
          )}
        </div>
        <p className="mt-2 text-[13px] leading-snug text-muted text-pretty">{gate.message}</p>
        {gate.secretLabel && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3.5 py-3">
            <div className="min-w-0">
              <div className="text-[13px] font-medium">{gate.secretLabel}</div>
              <div className="mt-1 text-[11px] text-muted">Required by this app to continue.</div>
            </div>
            <span className="shrink-0 text-[12px] font-medium text-[#E5484D]">Missing</span>
          </div>
        )}
        {isPayment ? (
          <div className="mt-4 flex flex-col gap-2.5">
            {actions.includes("connect_wallet") && (
              <Button
                type="button"
                variant="primary"
                size="md"
                shape="pill"
                onClick={onConnectWallet}
                className="h-10 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Connect wallet pay
              </Button>
            )}
            <div className="flex gap-2.5">
              {actions.includes("use_own_key") && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  shape="pill"
                  onClick={onUseOwnKey}
                  className="h-10 flex-1 text-sm font-medium"
                >
                  Use own model key
                </Button>
              )}
              {actions.includes("view_usage") && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  shape="pill"
                  onClick={onOpenUsage}
                  className="h-10 flex-1 text-sm font-medium"
                >
                  View usage
                </Button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-center text-[12px] text-muted transition-colors hover:text-fg"
            >
              Not now
            </button>
          </div>
        ) : (
          <div className="mt-4 flex gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="md"
              shape="pill"
              onClick={onSwitchApp}
              className="h-10 flex-1 text-sm font-medium"
            >
              Switch app
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              shape="pill"
              onClick={onOpenSecrets}
              className="h-10 flex-1 bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Open Secrets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function DisconnectModal({
  address,
  onConfirm,
  onCancel,
}: {
  address?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Dismiss" onClick={onCancel} className="absolute inset-0 bg-black/55" />
      <div className="relative w-full max-w-[400px] rounded-t-xl border border-border border-b-0 bg-elevated p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:rounded-lg sm:border-b sm:pb-6">
        <h2 className="text-base font-semibold">Disconnect wallet?</h2>
        <p className="mt-2 text-[14px] leading-5 text-muted">
          Ends the simulated session for {address ?? "this wallet"}. Local threads stay on this device.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            onClick={onCancel}
            className="h-9 px-3.5 text-[13px] font-medium text-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            shape="pill"
            onClick={onConfirm}
            className="h-9 px-3.5 text-[13px] font-semibold bg-danger text-white"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DeleteThreadModal({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Dismiss" onClick={onCancel} className="absolute inset-0 bg-black/55" />
      <div className="relative w-full max-w-[400px] rounded-t-xl border border-border border-b-0 bg-elevated p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:rounded-lg sm:border-b sm:pb-6">
        <h2 className="text-base font-semibold">Delete chat?</h2>
        <p className="mt-2 text-[14px] leading-5 text-muted">
          This will permanently remove{" "}
          <span className="font-medium text-fg">“{title}”</span> from this device.
          This can’t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            onClick={onCancel}
            className="h-9 px-3.5 text-[13px] font-medium text-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            shape="pill"
            onClick={onConfirm}
            className="h-9 px-3.5 text-[13px] font-semibold bg-danger text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function FamilyChip({ family }: { family: "EVM" | "SVM" }) {
  return (
    <span className="shrink-0 rounded-pill border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-muted">
      {family}
    </span>
  );
}

function Spinner() {
  return (
    <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-border border-t-accent" />
  );
}

function ChevronLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          void navigator.clipboard.writeText(address);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      className="shrink-0 text-[10px] font-medium text-muted transition-colors hover:text-fg"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/**
 * Manage wallets — progressive disclosure like Rainbow/Family:
 * view 1 shows connected accounts as cards with Set active / Unlink,
 * view 2 ("Add a wallet") lists installed connectors first, then the rest.
 */
export function WalletsModal({
  wallets,
  onClose,
  onConnect,
  onSetActive,
  onUnlink,
}: {
  wallets: LinkedWallet[];
  onClose: () => void;
  onConnect: (optionId: string) => void;
  onSetActive: (id: string) => void;
  onUnlink: (id: string) => void;
}) {
  const [view, setView] = useState<"list" | "add">(wallets.length === 0 ? "add" : "list");
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const connectedNames = new Set(wallets.map((w) => w.name));
  const available = walletOptions.filter((o) => !connectedNames.has(o.name));
  const installed = available.filter((o) => o.status === "ready");
  const others = available.filter((o) => o.status === "notInstalled");

  const startConnect = (optionId: string) => {
    if (connectingId) return;
    setConnectingId(optionId);
    window.setTimeout(() => {
      onConnect(optionId);
      setConnectingId(null);
      setView("list");
    }, 900);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/55" />
      <div className="relative flex max-h-[min(85dvh,640px)] w-full max-w-[380px] flex-col overflow-hidden rounded-t-xl border border-border border-b-0 bg-elevated shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:rounded-lg sm:border-b">
        <div className="flex h-13 shrink-0 items-center gap-2 border-b border-border px-3 py-3">
          {view === "add" && (
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="Back"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ChevronLeft />
            </button>
          )}
          <div className="min-w-0 flex-1 pl-1">
            <div className="truncate text-sm font-semibold leading-tight">
              {view === "list" ? "Wallets" : "Add a wallet"}
            </div>
            <div className="truncate text-[11px] leading-tight text-muted">
              {view === "list"
                ? `${wallets.length} connected · simulation`
                : "Link an Ethereum or Solana wallet"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <Close size={13} />
          </button>
        </div>

        {view === "list" ? (
          <div className="flex flex-col gap-2 overflow-y-auto p-3">
            {wallets.map((w) => {
              const active = w.status === "active";
              return (
                <div
                  key={w.id}
                  className={`group flex items-center gap-3 rounded-[var(--radius-md)] border px-3 py-3 transition-colors ${
                    active
                      ? "border-success/35 bg-success/[0.06]"
                      : "border-border"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[12px] font-medium">
                    {WalletMark({ name: w.name, size: 20 }) ?? w.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-medium leading-none">{w.name}</span>
                      <FamilyChip family={w.chain === "evm" ? "EVM" : "SVM"} />
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="truncate font-mono text-[11px] leading-none text-muted">
                        {w.address}
                      </span>
                      <CopyAddress address={w.address} />
                    </div>
                  </div>
                  {active ? (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-pill bg-success/15 px-2 py-1 text-[10px] font-semibold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Active
                    </span>
                  ) : (
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => onSetActive(w.id)}
                        className="rounded-[var(--radius-sm)] border border-border px-2 py-1 text-[11px] font-medium transition-colors hover:bg-surface-2"
                      >
                        Set active
                      </button>
                      <button
                        type="button"
                        onClick={() => onUnlink(w.id)}
                        className="px-2 text-[10px] text-muted transition-colors hover:text-[#E5484D]"
                      >
                        Unlink
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {wallets.length === 0 && (
              <p className="px-2 py-4 text-center text-[13px] text-muted">
                No wallets connected yet.
              </p>
            )}
            <Button
              type="button"
              variant="primary"
              size="md"
              shape="pill"
              onClick={() => setView("add")}
              className="mt-1 h-10 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Add wallet
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              shape="pill"
              className="h-10 w-full gap-2 text-[13px] font-medium text-muted"
            >
              <ParaMark size={13} />
              Email or Google
              <span className="text-[10px] text-muted">· Para</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 overflow-y-auto p-3">
            {installed.length > 0 && (
              <div className="px-1.5 pb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                Installed
              </div>
            )}
            {installed.map((o: WalletOption) => {
              const connecting = connectingId === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => startConnect(o.id)}
                  disabled={connectingId !== null}
                  className="flex h-12 items-center gap-3 rounded-[var(--radius-sm)] px-2.5 text-left transition-colors hover:bg-surface-2/60 disabled:cursor-wait"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
                    {WalletMark({ name: o.id, size: 18 }) ?? o.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{o.name}</span>
                  <FamilyChip family={o.family === "evm" ? "EVM" : "SVM"} />
                  {connecting ? (
                    <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted">
                      <Spinner />
                      Connecting…
                    </span>
                  ) : (
                    <span className="shrink-0 text-muted">›</span>
                  )}
                </button>
              );
            })}
            {others.length > 0 && (
              <div className="px-1.5 pb-1 pt-3 text-[10px] font-medium uppercase tracking-[0.08em] text-muted/70">
                More wallets
              </div>
            )}
            {others.map((o: WalletOption) => (
              <div
                key={o.id}
                className="flex h-12 items-center gap-3 rounded-[var(--radius-sm)] px-2.5 opacity-55"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
                  {WalletMark({ name: o.id, size: 18 }) ?? o.name.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{o.name}</span>
                <FamilyChip family={o.family === "evm" ? "EVM" : "SVM"} />
                <span className="shrink-0 text-[11px] text-muted">Not installed</span>
              </div>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <div className="px-1.5 pb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                Quick sign-in
              </div>
              <button
                type="button"
                className="flex h-12 w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 text-left transition-colors hover:bg-surface-2/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
                  <ParaMark size={15} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">Email or Google</span>
                <span className="shrink-0 text-[11px] text-muted">Para</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function WalletModal({
  tx,
  onApprove,
  onReject,
}: {
  tx: TxPreview;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Dismiss" onClick={onReject} className="absolute inset-0 bg-black/55" />
      <div className="relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-t-xl border border-border border-b-0 bg-elevated pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:rounded-lg sm:border-b sm:pb-0">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-surface-2">
            <WalletIcon size={15} />
          </div>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold leading-none">Wallet</span>
          <div className="flex h-6 shrink-0 items-center gap-1.5 rounded-pill border border-border px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fg" />
            <span className="font-mono text-[11px] leading-none text-muted">Simulation</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 px-5 py-5 text-center">
          <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.015em]">
            Approve transaction
          </h2>
          <p className="max-w-[32ch] text-[13px] leading-snug text-muted text-pretty">
            app.aomi.xyz requests a {tx.kind} on Ethereum
          </p>
        </div>
        <div className="flex flex-col gap-3 px-4 pb-4">
          <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border">
            <Row label="Send" value={tx.payAmount} border />
            <Row label="Receive (est.)" value={tx.receiveAmount} border />
            <Row label="Network fee" value={tx.gas} mono />
          </div>
          <div className="flex gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="md"
              shape="pill"
              onClick={onReject}
              className="h-11 flex-1 border border-border-strong bg-transparent text-sm font-medium leading-none text-fg hover:bg-surface-2/70"
            >
              Reject
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              shape="pill"
              onClick={onApprove}
              className="h-11 flex-1 bg-primary text-sm font-semibold leading-none text-primary-foreground hover:bg-primary-hover"
            >
              Approve
            </Button>
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
    <div className={`flex items-center justify-between gap-4 px-3.5 py-3 ${border ? "border-b border-border" : ""}`}>
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

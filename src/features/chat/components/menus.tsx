"use client";

import { Button } from "@aomi-labs/design";
import { commandItems } from "../fixtures";
import { formatAllowanceSummary } from "../billing-fixtures";
import { AppMark, ChevronDown, Lock, Logout, Search } from "./icons";
import { EthereumMark, RabbyMark } from "./brands";

interface CommandMenuProps {
  onAction: (
    action:
      | "app"
      | "network"
      | "wallets"
      | "settings-bots"
      | "settings-secrets"
      | "simulate-payment"
      | "simulate-secret",
  ) => void;
  onClose: () => void;
}

export function CommandMenu({ onAction, onClose }: CommandMenuProps) {
  return (
    <>
      <button aria-label="Dismiss" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
      <div className="absolute bottom-[calc(100%+10px)] left-0 right-0 z-40 mx-auto flex w-[min(336px,calc(100vw-1.5rem))] flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-elevated p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] sm:right-auto sm:mx-0">
        <div className="flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-2.5">
          <Search size={14} className="text-muted" />
          <span className="flex-1 text-[13px] text-muted">Search Aomi actions</span>
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
            ESC
          </span>
        </div>
        <div className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
          Quick access
        </div>
        {commandItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAction(item.action)}
            className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5 text-left hover:bg-surface-2"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted">
              <CommandIcon id={item.id} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-none">{item.label}</span>
              <span className="mt-1 block truncate text-[11px] leading-none text-muted">
                {item.description}
              </span>
            </span>
            {item.shortcut && (
              <span className="shrink-0 font-mono text-[10px] text-muted">{item.shortcut}</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

function CommandIcon({ id }: { id: string }) {
  if (id === "choose-app") return <AppMark size={14} />;
  if (id === "switch-network") return <EthereumMark size={14} />;
  if (id === "manage-wallets") return <RabbyMark size={15} />;
  if (id === "bots") return <ChevronDown size={14} />;
  return <Lock size={14} />;
}

export function AccountMenu({
  ens,
  address,
  credits,
  creditUsed,
  creditIncluded,
  network,
  theme,
  onManageWallets,
  onSwitchNetwork,
  onToggleTheme,
  onOpenSettings,
  onDisconnect,
  onClose,
}: {
  ens?: string;
  address?: string;
  credits?: number;
  creditUsed?: number;
  creditIncluded?: number;
  network?: string;
  theme: string;
  onManageWallets: () => void;
  onSwitchNetwork: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onDisconnect: () => void;
  onClose: () => void;
}) {
  const allowanceLine =
    creditUsed != null && creditIncluded != null
      ? formatAllowanceSummary(creditUsed, creditIncluded)
      : `${(credits ?? 0).toLocaleString()} credits left`;
  return (
    <>
      <button aria-label="Dismiss" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
      <div className="absolute bottom-[calc(100%+8px)] left-0 z-40 flex w-[min(248px,calc(100vw-1.5rem))] flex-col rounded-[var(--radius-md)] border border-border bg-elevated p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
        <div className="border-b border-border px-2.5 pb-3 pt-2">
          <div className="flex items-center gap-1.5">
            <RabbyMark size={14} />
            <span className="truncate text-[13px] font-semibold">{ens ?? "Wallet"}</span>
          </div>
          <div className="mt-1 truncate font-mono text-[11px] text-muted">{address}</div>
          <div className="mt-2 text-[12px] font-medium text-muted">{allowanceLine}</div>
        </div>
        <MenuRow label="Manage wallets" onClick={onManageWallets} trailing="›" />
        <MenuRow label="Switch network" onClick={onSwitchNetwork} trailing={`${network?.slice(0, 3) ?? "Net"} ›`} />
        <MenuRow
          label="Theme"
          onClick={onToggleTheme}
          trailing={`${theme === "dark" ? "Dark" : "Light"} ›`}
        />
        <MenuRow label="Settings" onClick={onOpenSettings} />
        <MenuRow label="Deployments" trailing="›" />
        <a
          href="https://aomi.dev/docs"
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center rounded-[var(--radius-sm)] px-2.5 text-[13px] text-muted hover:bg-surface-2 hover:text-fg"
          onClick={onClose}
        >
          Docs
        </a>
        <button
          type="button"
          onClick={onDisconnect}
          className="mt-1 flex h-9 items-center gap-2 rounded-[var(--radius-sm)] px-2.5 text-[13px] font-medium text-[#E5484D] hover:bg-surface-2"
        >
          <Logout size={14} />
          Disconnect
        </button>
      </div>
    </>
  );
}

function MenuRow({
  label,
  trailing,
  onClick,
}: {
  label: string;
  trailing?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center justify-between rounded-[var(--radius-sm)] px-2.5 text-left hover:bg-surface-2"
    >
      <span className="text-[13px]">{label}</span>
      {trailing && <span className="text-[12px] text-muted">{trailing}</span>}
    </button>
  );
}

export function WorkspaceMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button aria-label="Dismiss" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
      <div className="absolute left-3 top-14 z-40 flex w-[min(240px,calc(100vw-1.5rem))] flex-col gap-0.5 rounded-[var(--radius-md)] border border-border bg-elevated p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
        <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
          Workspace
        </div>
        <div className="flex h-10 items-center justify-between rounded-[var(--radius-sm)] bg-surface-2 px-2.5">
          <span className="text-[13px] font-medium">Aomi Portal</span>
          <span className="text-[11px] font-medium text-accent">Active</span>
        </div>
        <a
          href="https://aomi.dev/docs"
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center rounded-[var(--radius-sm)] px-2.5 text-[13px] hover:bg-surface-2"
          onClick={onClose}
        >
          Docs
        </a>
        <a
          href="https://aomi.dev"
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center rounded-[var(--radius-sm)] px-2.5 text-[13px] hover:bg-surface-2"
          onClick={onClose}
        >
          Home
        </a>
      </div>
    </>
  );
}

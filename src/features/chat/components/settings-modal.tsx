"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import type {
  AccountOverview,
  DelegationGrant,
  SettingsTab,
  Theme,
  WalletPolicy,
} from "../contracts";
import { AccountSettings } from "./account-settings";
import { UsageSettings } from "./usage-settings";
import {
  Chart,
  ChevronDown,
  Close,
  Sliders,
  User,
  WalletIcon,
} from "./icons";

const NAV: { id: SettingsTab; label: string; Icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "general", label: "General", Icon: Sliders },
  { id: "account", label: "Account", Icon: WalletIcon },
  { id: "usage", label: "Usage", Icon: Chart },
];

interface SettingsModalProps {
  theme: Theme;
  network: string;
  account: AccountOverview;
  wallets: WalletPolicy[];
  grants: DelegationGrant[];
  onSetTheme: (t: Theme) => void;
  onClose: () => void;
}

export function SettingsModal({
  theme,
  network,
  account,
  wallets,
  grants,
  onSetTheme,
  onClose,
}: SettingsModalProps) {
  const [tab, setTab] = useState<SettingsTab>("general");

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <button aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/55" />
      <div className="relative flex h-[600px] w-[900px] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <nav className="flex w-[220px] flex-shrink-0 flex-col gap-0.5 border-r border-border bg-background/40 p-3 pt-[18px]">
          <span className="px-2.5 pb-3 pt-1 text-[15px] font-semibold">Settings</span>
          {NAV.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-[9px] text-left transition-colors ${
                  active ? "bg-surface-2" : "hover:bg-surface-2/60"
                }`}
              >
                <Icon size={16} className={active ? "text-fg" : "text-muted"} />
                <span
                  className={`text-sm ${active ? "font-medium text-fg" : "text-muted"}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
            <span className="text-base font-semibold">{NAV.find((n) => n.id === tab)?.label}</span>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
            >
              <Close size={15} />
            </button>
          </div>

          {tab === "general" ? (
            <GeneralTab
              theme={theme}
              network={network}
              account={account}
              onSetTheme={onSetTheme}
              onManageAccount={() => setTab("account")}
            />
          ) : tab === "account" ? (
            <AccountSettings
              accountId={account.userId}
              email={account.verifiedEmail}
              wallets={wallets}
              grants={grants}
            />
          ) : (
            <UsageSettings />
          )}
        </div>
      </div>
    </div>
  );
}

function GeneralTab({
  theme,
  network,
  account,
  onSetTheme,
  onManageAccount,
}: {
  theme: Theme;
  network: string;
  account: AccountOverview;
  onSetTheme: (t: Theme) => void;
  onManageAccount: () => void;
}) {
  return (
    <div className="flex flex-col gap-[18px] p-[22px]">
      {/* Identity (from img-2 › Account › Identity) */}
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40">
        <div className="flex items-start justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-muted">
              <User size={20} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">{account.address}</span>
                <Badge>{account.authType}</Badge>
              </div>
              <span className="text-[13px] text-muted">
                Primary identity · {account.primary}
              </span>
            </div>
          </div>
          <button
            onClick={onManageAccount}
            className="flex-shrink-0 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Manage account
          </button>
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-border bg-border">
          <MetaCell icon={<WalletIcon size={14} />} label="Type">
            <span className="text-[13px]">{account.authType}</span>
          </MetaCell>
          <MetaCell icon={<NetworkDot />} label="Network">
            <span className="text-[13px]">{account.network}</span>
          </MetaCell>
        </div>
      </div>

      <Divider />

      <SettingRow title="Theme" desc="Match system, light, or dark">
        <div className="flex rounded-full border border-border p-[3px]">
          {(["dark", "light"] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => onSetTheme(t)}
              className={`rounded-full px-3 py-[5px] text-xs capitalize transition-colors ${
                theme === t ? "bg-surface-2 font-medium text-fg" : "text-muted"
              }`}
            >
              {t}
            </button>
          ))}
          <button className="rounded-full px-3 py-[5px] text-xs text-muted">
            System
          </button>
        </div>
      </SettingRow>

      <Divider />

      <SettingRow title="Default network" desc="Used for new chats">
        <div className="flex items-center gap-[7px] rounded-[var(--radius-sm)] border border-border px-3 py-[7px]">
          <NetworkDot />
          <span className="text-[13px]">{network}</span>
          <ChevronDown size={12} className="text-muted" />
        </div>
      </SettingRow>

      <Divider />

      <SettingRow title="Connected wallet" desc={account.address} descMono>
        <button className="rounded-[var(--radius-sm)] border border-border px-3.5 py-2 text-[13px] font-medium text-muted transition-colors hover:text-fg">
          Disconnect
        </button>
      </SettingRow>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
      {children}
    </span>
  );
}

function NetworkDot() {
  return <span className="h-[7px] w-[7px] rounded-full bg-success" />;
}

function MetaCell({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-background/40 px-4 py-3">
      <span className="flex-shrink-0 text-muted">{icon}</span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs text-muted">{label}</span>
        <div className="min-w-0 truncate text-fg">{children}</div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  desc,
  descMono,
  children,
}: {
  title: string;
  desc: string;
  descMono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className={`text-[13px] text-muted ${descMono ? "font-mono" : ""}`}>
          {desc}
        </span>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

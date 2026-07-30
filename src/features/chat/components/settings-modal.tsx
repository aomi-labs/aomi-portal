"use client";

import { Button } from "@aomi-labs/design";
import { useState, type ComponentType } from "react";
import type {
  AccountBillingSnapshot,
  AccountOverview,
  DelegationGrant,
  PaymentMethodsFixture,
  SettingsTab,
  Theme,
  UsageOverview,
  WalletPolicy,
} from "../contracts";
import {
  formatAllowanceSummary,
  seedPaymentMethods,
  tierLabel,
} from "../billing-fixtures";
import { AccountSettings } from "./account-settings";
import { reconcile } from "../account-reconcile";
import { GeneralSettings } from "./general-settings";
import { UsageSettings } from "./usage-settings";
import { Divider, SettingRow } from "./settings-rows";
import {
  Bot,
  Chart,
  Close,
  Key,
  Lock,
  Sliders,
  WalletIcon,
} from "./icons";

const NAV: {
  id: SettingsTab;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "general", label: "General", Icon: Sliders },
  { id: "account", label: "Account", Icon: WalletIcon },
  { id: "usage", label: "Usage", Icon: Chart },
  { id: "appKeys", label: "App Keys", Icon: Key },
  { id: "bots", label: "Bots", Icon: Bot },
  { id: "secrets", label: "Secrets", Icon: Lock },
];

interface SettingsModalProps {
  theme: Theme;
  tab: SettingsTab;
  address: string;
  network: string;
  account: AccountOverview;
  wallets: WalletPolicy[];
  grants: DelegationGrant[];
  billing: AccountBillingSnapshot;
  usage: UsageOverview;
  paymentMethods?: PaymentMethodsFixture;
  onSetTheme: (t: Theme) => void;
  onSetTab: (tab: SettingsTab) => void;
  onDisconnect: () => void;
  onClose: () => void;
}

export function SettingsModal({
  theme,
  tab,
  address,
  network,
  account,
  wallets,
  grants,
  billing,
  usage,
  paymentMethods = seedPaymentMethods,
  onSetTheme,
  onSetTab,
  onDisconnect,
  onClose,
}: SettingsModalProps) {
  const activeLabel = NAV.find((n) => n.id === tab)?.label ?? "Settings";
  const [botOn, setBotOn] = useState(true);
  const allowanceLine = formatAllowanceSummary(
    account.usage.creditsUsed,
    account.usage.creditsIncluded,
  );
  const planLabel = tierLabel(billing.tier);
  const walletAttentionCount = wallets.filter(
    (wallet) => reconcile(wallet).status === "drifted",
  ).length;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/55" />
      <div className="relative flex max-h-[min(560px,92dvh)] w-full flex-col overflow-hidden rounded-t-xl border border-border border-b-0 bg-elevated shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:h-[min(600px,90vh)] sm:max-w-[900px] sm:flex-row sm:rounded-lg sm:border-b">
        {/* Paper 29 — mobile sheet chrome */}
        <div className="flex shrink-0 flex-col gap-3.5 px-4 pb-1 pt-3 sm:hidden">
          <div className="flex h-4 items-center justify-center">
            <span className="h-1 w-10 rounded-pill bg-border" />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold leading-none tracking-[-0.01em]">Settings</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:text-fg"
              aria-label="Close settings"
            >
              <Close size={16} />
            </button>
          </div>
          {tab !== "general" && (
            <div className="flex h-[52px] items-center gap-2.5 rounded-[var(--radius-md)] bg-surface-2 px-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface text-[11px] text-muted">
                {(address || "?").slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[12px] leading-none">
                  {address || "Not connected"}
                </div>
                <div className="mt-1 truncate text-[11px] leading-none text-muted">
                  {allowanceLine} · {planLabel}
                </div>
              </div>
            </div>
          )}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map(({ id, label }) => {
              const active = id === tab;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSetTab(id)}
                  className={`flex h-8 shrink-0 items-center rounded-pill px-3 text-[12px] leading-none transition-colors ${
                    active
                      ? "bg-surface-2 font-medium text-fg"
                      : "border border-border text-muted"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <nav className="hidden w-[220px] shrink-0 flex-col gap-0.5 border-r border-border bg-background/40 p-3 pt-4 sm:flex">
          <span className="px-2.5 pb-3 text-[15px] font-semibold leading-none tracking-[-0.01em]">
            Settings
          </span>
          {NAV.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSetTab(id)}
                className={`flex h-9 items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 text-left transition-colors ${
                  active ? "bg-surface-2" : "hover:bg-surface-2/60"
                }`}
              >
                <Icon size={16} className={active ? "text-fg" : "text-muted"} />
                <span className={`truncate text-sm leading-none ${active ? "font-medium text-fg" : "text-muted"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="hidden h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-5 sm:flex">
            <h2 className="min-w-0 truncate text-base font-semibold leading-none tracking-[-0.01em]">
              {activeLabel}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
              aria-label="Close settings"
            >
              <Close size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:p-5">
            {tab === "general" && (
              <GeneralSettings
                account={account}
                address={address}
                network={network}
                theme={theme}
                walletAttentionCount={walletAttentionCount}
                onSetTheme={onSetTheme}
                onManageAccount={() => onSetTab("account")}
                onFixWallets={() => onSetTab("account")}
                onViewUsage={() => onSetTab("usage")}
                onDisconnect={onDisconnect}
              />
            )}

            {tab === "account" && (
              <AccountSettings wallets={wallets} grants={grants} />
            )}

            {tab === "usage" && <UsageSettings />}

            {tab === "appKeys" && (
              <div className="flex flex-col">
                <SettingRow title="Portal key" desc="aomi_pk_••••••••4f2a" descMono>
                  <div className="flex gap-2">
                    <GhostBtn>Rotate</GhostBtn>
                    <GhostBtn>Copy</GhostBtn>
                  </div>
                </SettingRow>
                <Divider />
                <SettingRow title="Create key" desc="Scoped to apps you authorize. Simulation only.">
                  <PrimaryBtn>New key</PrimaryBtn>
                </SettingRow>
              </div>
            )}

            {tab === "bots" && (
              <div className="flex flex-col">
                <SettingRow title="Portfolio bot" desc="Watches balances · paused">
                  <GhostBtn onClick={() => setBotOn(true)}>Enable</GhostBtn>
                </SettingRow>
                <Divider />
                <SettingRow title="Swap alerts" desc="Notifies on fill · active">
                  <button type="button" onClick={() => setBotOn((v) => !v)} className="text-[12px] font-medium text-accent">
                    {botOn ? "On" : "Off"}
                  </button>
                </SettingRow>
                <Divider />
                <SettingRow title="Create bot" desc="Fixture bots only. Simulation.">
                  <PrimaryBtn>New bot</PrimaryBtn>
                </SettingRow>
              </div>
            )}

            {tab === "secrets" && (
              <div className="flex flex-col">
                <SettingRow title="Hyperliquid API key" desc="Required by Hyperliquid · missing">
                  <span className="text-[12px] font-medium text-[#E5484D]">Missing</span>
                </SettingRow>
                <Divider />
                <SettingRow title="OpenAI (optional)" desc="••••••••••••k9m2" descMono>
                  <GhostBtn>Replace</GhostBtn>
                </SettingRow>
                <Divider />
                <SettingRow title="Add secret" desc="Write-only vault. Simulation only. Nothing stored.">
                  <PrimaryBtn>Add</PrimaryBtn>
                </SettingRow>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      shape="pill"
      onClick={onClick}
      className="h-8 px-3 text-[13px] text-muted"
    >
      {children}
    </Button>
  );
}

function PrimaryBtn({ children }: { children: React.ReactNode }) {
  return (
    <Button type="button" variant="primary" size="sm" shape="pill" className="h-8 bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary-hover">
      {children}
    </Button>
  );
}

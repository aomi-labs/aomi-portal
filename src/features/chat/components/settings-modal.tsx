"use client";

import { Button } from "@aomi-labs/design";
import { useState, type ComponentType } from "react";
import type { AccountBillingSnapshot, PaymentMethodsFixture, SettingsTab, Theme, UsageOverview } from "../contracts";
import {
  formatCompactTokens,
  formatUsagePeriod,
  seedPaymentMethods,
  seedUsageOverview,
  tierLabel,
} from "../billing-fixtures";
import {
  Bot,
  Chart,
  ChevronDown,
  Close,
  Key,
  Lock,
  Shield,
  Sliders,
} from "./icons";
import { NetworkMark } from "./brands";
import { networks } from "../fixtures";

const NAV: {
  id: SettingsTab;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "general", label: "General", Icon: Sliders },
  { id: "usage", label: "Usage", Icon: Chart },
  { id: "appKeys", label: "App Keys", Icon: Key },
  { id: "bots", label: "Bots", Icon: Bot },
  { id: "secrets", label: "Secrets", Icon: Lock },
  { id: "byok", label: "BYOK", Icon: Shield },
];

interface SettingsModalProps {
  theme: Theme;
  tab: SettingsTab;
  address: string;
  network: string;
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
  const remaining = Math.max(0, billing.credit_paid - billing.credit_used);
  const totalTokens =
    usage.overall.input_tokens + usage.overall.output_tokens;
  const planLabel = tierLabel(billing.tier);

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
          <div className="flex h-[52px] items-center gap-2.5 rounded-[var(--radius-md)] bg-surface-2 px-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface text-[11px] text-muted">
              {(address || "?").slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[12px] leading-none">{address || "Not connected"}</div>
              <div className="mt-1 truncate text-[11px] leading-none text-muted">
                {remaining.toLocaleString()} credits left · {planLabel}
              </div>
            </div>
          </div>
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
              <div className="flex flex-col">
                <SettingRow
                  title="Plan"
                  desc={`${planLabel} · member since ${billing.member_since ?? "—"}`}
                >
                  <span className="text-[13px] font-medium text-accent">
                    {billing.credit_used.toLocaleString()} /{" "}
                    {billing.credit_paid.toLocaleString()} credits used
                  </span>
                </SettingRow>
                <Divider />
                <SettingRow
                  title="Monthly quota"
                  desc={`${billing.period_utc_month} · resets each UTC month`}
                >
                  <span className="text-[13px] font-medium text-fg">
                    {remaining.toLocaleString()} remaining
                  </span>
                </SettingRow>
                <Divider />
                <p className="py-2 text-[12px] leading-snug text-muted">
                  Usage shows spend by app. Payment setup (wallet pay and your own model keys) lives
                  under BYOK. Partner app fees may apply separately — not shown here yet.
                </p>
                <Divider />
                <SettingRow title="Theme" desc="Match system, light, or dark">
                  <div className="flex h-8 items-center rounded-pill border border-border p-0.5">
                    {(["dark", "light"] as Theme[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => onSetTheme(t)}
                        className={`rounded-pill px-3 py-1 text-[12px] capitalize leading-none ${
                          theme === t ? "bg-surface-2 font-medium text-fg" : "text-muted"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </SettingRow>
                <Divider />
                <SettingRow title="Default network" desc="Used for new chats">
                  <div className="flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border px-2.5">
                    <NetworkMark
                      id={networks.find((n) => n.label === network)?.id ?? "ethereum"}
                      size={12}
                    />
                    <span className="truncate text-[13px] leading-none">{network}</span>
                    <ChevronDown size={12} className="shrink-0 text-muted" />
                  </div>
                </SettingRow>
                <Divider />
                <SettingRow title="Connected wallet" desc={address || "Not connected"} descMono>
                  <button
                    type="button"
                    onClick={onDisconnect}
                    className="flex h-8 shrink-0 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium leading-none text-muted transition-colors hover:text-fg"
                  >
                    Disconnect
                  </button>
                </SettingRow>
              </div>
            )}

            {tab === "usage" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Spend meter</div>
                    <div className="mt-1 text-[12px] text-muted">
                      {formatUsagePeriod(usage.period_utc_from, usage.period_utc_to)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSetTab("byok")}
                    className="shrink-0 rounded-pill border border-border px-3 py-1 text-[12px] text-muted transition-colors hover:text-fg"
                  >
                    Payment setup
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Stat
                    label="Credits used"
                    value={usage.overall.credit_used.toLocaleString()}
                  />
                  <Stat label="Tokens" value={formatCompactTokens(totalTokens)} />
                  <Stat label="Remaining" value={remaining.toLocaleString()} accent />
                </div>
                <p className="text-[12px] leading-snug text-muted">
                  This is your usage meter — not invoices or wallet balance. When quota runs out,
                  chat asks for wallet pay or your own model key.
                </p>
                <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
                  <div className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 text-[11px] uppercase tracking-wide text-muted">
                    <span>App</span>
                    <span>Credits</span>
                    <span>Tokens</span>
                    <span>Share</span>
                  </div>
                  {usage.apps.map((row) => (
                    <div
                      key={row.app}
                      className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2.5 text-[13px] last:border-0"
                    >
                      <span className="truncate font-mono">{row.app}</span>
                      <span>{row.credits_used.toLocaleString()}</span>
                      <span>
                        {formatCompactTokens(row.input_tokens + row.output_tokens)}
                      </span>
                      <span className={row.share_pct >= 50 ? "text-accent" : ""}>
                        {row.share_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <SettingRow title="Create bot" desc="Simulation — fixture bots only.">
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
                <SettingRow title="Add secret" desc="Write-only vault. Simulation — nothing stored.">
                  <PrimaryBtn>Add</PrimaryBtn>
                </SettingRow>
              </div>
            )}

            {tab === "byok" && (
              <div className="flex flex-col">
                <SettingRow
                  title="Free quota"
                  desc={`${billing.credit_used.toLocaleString()} of ${billing.credit_paid.toLocaleString()} credits used this month`}
                >
                  <span
                    className={`text-[12px] font-medium ${
                      paymentMethods.quota.status === "exhausted"
                        ? "text-[#E5484D]"
                        : "text-accent"
                    }`}
                  >
                    {paymentMethods.quota.remaining.toLocaleString()} left
                  </span>
                </SettingRow>
                <Divider />
                <SettingRow
                  title="Wallet pay"
                  desc="Pay per turn when quota runs out · connects in your wallet"
                >
                  <span className="text-[12px] font-medium text-muted">
                    {paymentMethods.wallet_pay.status === "ready" ? "Connected" : "Not connected"}
                  </span>
                </SettingRow>
                <Divider />
                {paymentMethods.own_api_keys.map((key) => (
                  <div key={key.provider}>
                    <SettingRow
                      title={`${key.provider} key`}
                      desc={`${key.key_prefix} · ${key.active ? "active" : "inactive"}`}
                      descMono
                    >
                      <GhostBtn>Replace</GhostBtn>
                    </SettingRow>
                    <Divider />
                  </div>
                ))}
                <SettingRow
                  title="Use your own model key"
                  desc="When credits run low, chat can bill your provider directly. Simulation only."
                >
                  <PrimaryBtn>Add key</PrimaryBtn>
                </SettingRow>
                <Divider />
                <p className="py-2 text-[12px] leading-snug text-muted">
                  Payment setup lives on Chat — not on Build. No invoices or dollar balances here
                  until backend APIs expose them.
                </p>
              </div>
            )}
          </div>
        </div>
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
    <div className="flex items-start justify-between gap-3 py-3.5 sm:items-center sm:gap-6 sm:py-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium leading-none">{title}</span>
        <span className={`truncate text-[13px] leading-snug text-muted ${descMono ? "font-mono" : ""}`}>
          {desc}
        </span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border p-3">
      <div className="text-[11px] text-muted">{label}</div>
      <div className={`mt-1 text-xl font-semibold tabular-nums ${accent ? "text-accent" : ""}`}>
        {value}
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

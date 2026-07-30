"use client";

import { type ReactNode } from "react";
import type { AccountOverview, Theme } from "../contracts";
import { tierLabel } from "../billing-fixtures";
import { networks } from "../fixtures";
import { NetworkMark } from "./brands";
import { ChevronDown, Shield } from "./icons";
import { Divider, SettingRow } from "./settings-rows";

interface GeneralSettingsProps {
  account: AccountOverview;
  address: string;
  network: string;
  theme: Theme;
  walletAttentionCount: number;
  onSetTheme: (theme: Theme) => void;
  onManageAccount: () => void;
  onFixWallets: () => void;
  onViewUsage: () => void;
  onDisconnect: () => void;
}

export function GeneralSettings({
  account,
  address,
  network,
  theme,
  walletAttentionCount,
  onSetTheme,
  onManageAccount,
  onFixWallets,
  onViewUsage,
  onDisconnect,
}: GeneralSettingsProps) {
  const networkId = networks.find((entry) => entry.label === network)?.id ?? "ethereum";
  const needsWalletFix = walletAttentionCount > 0;
  const walletHint =
    address && address !== account.address ? address : "Active signing session";

  return (
    <div className="flex flex-col gap-5">
      {needsWalletFix && (
        <WalletAttentionBanner
          walletAttentionCount={walletAttentionCount}
          onReview={onFixWallets}
        />
      )}

      <AccountSummaryCard
        account={account}
        onManageAccount={onManageAccount}
        onViewUsage={onViewUsage}
      />

      <div className="flex flex-col">
        <FlatSettingRow label="Theme">
          <div className="flex h-8 items-center rounded-pill border border-border p-0.5">
            {(["dark", "light"] as Theme[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onSetTheme(value)}
                className={`rounded-pill px-3 py-1 text-[12px] capitalize leading-none ${
                  theme === value ? "bg-surface-2 font-medium text-fg" : "text-muted"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </FlatSettingRow>

        <Divider />
        <FlatSettingRow label="Default network">
          <div className="flex items-center gap-1.5 text-[13px]">
            <NetworkMark id={networkId} size={14} />
            <span>{network}</span>
            <ChevronDown size={14} className="shrink-0 text-muted" />
          </div>
        </FlatSettingRow>

        <Divider />
        <FlatSettingRow label="Connected wallet" hint={walletHint} hintMono={address !== account.address}>
          <button
            type="button"
            onClick={onDisconnect}
            className="rounded-full border border-border px-3 py-1 text-[13px] font-medium text-fg transition-colors hover:bg-surface-2"
          >
            Disconnect
          </button>
        </FlatSettingRow>
      </div>
    </div>
  );
}

function AccountSummaryCard({
  account,
  onManageAccount,
  onViewUsage,
}: {
  account: AccountOverview;
  onManageAccount: () => void;
  onViewUsage: () => void;
}) {
  const { creditsUsed, creditsIncluded, periodLabel } = account.usage;
  const remaining = Math.max(0, creditsIncluded - creditsUsed);

  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40">
      <SettingRow
        title={account.primary}
        desc={`${account.authType} · ${account.address}`}
        descMono
        className="px-4 sm:px-5"
      >
        <button
          type="button"
          onClick={onManageAccount}
          className="flex h-8 shrink-0 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium leading-none text-muted transition-colors hover:text-fg"
        >
          Manage account
        </button>
      </SettingRow>

      <Divider />

      <SettingRow
        title="Plan"
        desc={`Member since ${account.createdAt}`}
        className="px-4 sm:px-5"
      >
        <span className="text-[13px] font-medium text-fg">{tierLabel(account.tier)}</span>
      </SettingRow>

      <Divider />

      <SettingRow
        title="Monthly allowance"
        desc={`${periodLabel} · resets each UTC month`}
        className="px-4 sm:px-5"
      >
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[13px] font-medium tabular-nums text-fg">
            {remaining.toLocaleString()} remaining
          </span>
          <span className="text-[12px] tabular-nums text-accent">
            {creditsUsed.toLocaleString()} / {creditsIncluded.toLocaleString()} used
          </span>
        </div>
      </SettingRow>

      <div className="flex items-start justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
        <p className="min-w-0 flex-1 text-[12px] leading-snug text-muted">
          Usage shows spend by app. Overflow settles via wallet pay when allowance is used.
        </p>
        <button
          type="button"
          onClick={onViewUsage}
          className="flex shrink-0 items-center gap-0.5 text-[12px] font-medium text-muted transition-colors hover:text-fg"
        >
          View usage
          <ChevronDown size={12} className="-rotate-90" />
        </button>
      </div>
    </div>
  );
}

function WalletAttentionBanner({
  walletAttentionCount,
  onReview,
}: {
  walletAttentionCount: number;
  onReview: () => void;
}) {
  return (
    <div className="relative rounded-[var(--radius-md)] bg-surface px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-surface-2 text-muted">
          <Shield size={20} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-snug">Review wallet signing</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            {walletAttentionCount}{" "}
            {walletAttentionCount === 1 ? "wallet needs" : "wallets need"} a renewed provider
            grant before Aomi auto can run.
          </p>
        </div>

        <button
          type="button"
          onClick={onReview}
          className="h-9 shrink-0 self-start rounded-full border border-border px-4 text-[13px] font-medium text-fg transition-colors hover:bg-surface-2"
        >
          Review
        </button>
      </div>
    </div>
  );
}

function FlatSettingRow({
  label,
  hint,
  hintMono,
  children,
}: {
  label: string;
  hint?: string;
  hintMono?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium leading-none">{label}</span>
        {hint && (
          <span
            className={`mt-1 block truncate text-[12px] leading-snug text-muted ${
              hintMono ? "font-mono" : ""
            }`}
          >
            {hint}
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

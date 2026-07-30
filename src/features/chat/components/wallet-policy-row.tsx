"use client";

import { Button } from "@aomi-labs/design";
import type { DelegationGrant, SignerMode, WalletPolicy } from "../contracts";
import {
  findGrantForWallet,
  isReadOnly,
  reconcile,
  walletDisplayName,
  walletMarkKey,
  walletStatusLabel,
} from "../account-reconcile";
import { WalletMark } from "./brands";
import { SigningModeList } from "./signing-mode-list";
import { ChevronDown, WalletIcon } from "./icons";
import { Divider, SettingRow } from "./settings-rows";

function WalletProviderAvatar({ wallet }: { wallet: WalletPolicy }) {
  const markKey = walletMarkKey(wallet);
  const mark = markKey ? WalletMark({ name: markKey, size: 18 }) : null;

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
      {mark ?? <WalletIcon size={16} className="text-muted" />}
    </span>
  );
}

interface WalletPolicyRowProps {
  wallet: WalletPolicy;
  grants: DelegationGrant[];
  draft?: SignerMode;
  expanded: boolean;
  flash: boolean;
  onToggle: () => void;
  onDraft: (mode: SignerMode) => void;
  onCommit: () => void;
  onCancel: () => void;
  onRegrant: () => void;
  onRevokeGrant: (grantId: string) => void;
  onActivate: () => void;
}

export function WalletPolicyRow({
  wallet,
  grants,
  draft,
  expanded,
  flash,
  onToggle,
  onDraft,
  onCommit,
  onCancel,
  onRegrant,
  onRevokeGrant,
  onActivate,
}: WalletPolicyRowProps) {
  const selected = draft ?? wallet.desiredMode;
  const pending = draft !== undefined && draft !== wallet.desiredMode;
  const recon = reconcile(wallet);
  const locked = isReadOnly(wallet);
  const open = !locked && (expanded || pending);
  const grant = findGrantForWallet(grants, wallet);
  const displayName = walletDisplayName(wallet);
  const status = walletStatusLabel(wallet, recon, pending);

  return (
    <div
      id={`wallet-${wallet.id}`}
      className={`transition-colors ${flash ? "bg-surface-2/40 ring-1 ring-inset ring-fg/20" : ""}`}
    >
      <div
        role={locked ? undefined : "button"}
        tabIndex={locked ? undefined : 0}
        onClick={locked ? undefined : onToggle}
        onKeyDown={
          locked
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle();
                }
              }
        }
        className={locked ? "" : "cursor-pointer"}
      >
        <SettingRow
          className="px-4"
          leading={<WalletProviderAvatar wallet={wallet} />}
          title={displayName}
          desc={wallet.address}
          descMono
        >
          {locked ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              shape="pill"
              onClick={(e) => {
                e.stopPropagation();
                onActivate();
              }}
              className="h-8 px-3 text-[13px] font-medium"
            >
              Activate
            </Button>
          ) : (
            <span className="flex items-center gap-1">
              <span
                className={`max-w-[9.5rem] truncate text-right text-[13px] font-medium sm:max-w-none ${
                  recon.status === "drifted" ? "text-danger" : "text-muted"
                }`}
              >
                {status}
              </span>
              <ChevronDown
                size={14}
                className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
              />
            </span>
          )}
        </SettingRow>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-border bg-surface-2/15 px-4 pb-4 pt-3">
          <SigningModeList
            linkedVia={wallet.linkedVia}
            selected={selected}
            pending={pending}
            inset
            onSelect={onDraft}
          />

          {wallet.desiredMode === "auto" && grant && (
            <>
              <Divider />
              <SettingRow
                className="py-2"
                title="Provider grant"
                desc={
                  recon.status === "drifted"
                    ? recon.detail
                    : `${grant.provider} · ${grant.scope}`
                }
              >
                {grant.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => onRevokeGrant(grant.id)}
                    className="flex h-8 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    Revoke
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onRegrant}
                    className="flex h-8 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    Renew grant
                  </button>
                )}
              </SettingRow>
            </>
          )}

          {pending ? (
            <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-background/60 px-3 py-2.5">
              <span className="text-[13px] text-fg">
                Sign to apply this change.
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:text-fg"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={onCommit}
                  className="h-8 px-3 text-[13px] font-semibold"
                >
                  Sign to authorize
                </Button>
              </div>
            </div>
          ) : (
            recon.status === "drifted" &&
            !(wallet.desiredMode === "auto" && grant) && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted">{recon.detail}</span>
                <button
                  type="button"
                  onClick={onRegrant}
                  className="flex h-8 shrink-0 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  {recon.action}
                </button>
              </div>
            )
          )}

          <span className="pt-0.5 text-[11px] text-muted/75">
            Last updated {wallet.lastPermit?.replace(/^you · /, "") ?? "-"}
          </span>
        </div>
      )}
    </div>
  );
}

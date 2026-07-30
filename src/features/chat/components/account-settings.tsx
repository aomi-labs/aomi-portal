"use client";

import { Button } from "@aomi-labs/design";
import { useMemo, useState } from "react";
import type { DelegationGrant, SignerMode, WalletPolicy } from "../contracts";
import {
  CUSTODY_GROUPS,
  reconcile,
  sortWallets,
  walletGroupKey,
} from "../account-reconcile";
import { Divider, SettingRow } from "./settings-rows";
import { WalletPolicyRow } from "./wallet-policy-row";

interface AccountSettingsProps {
  wallets: WalletPolicy[];
  grants: DelegationGrant[];
}

export function AccountSettings({ wallets: seedWallets, grants: seedGrants }: AccountSettingsProps) {
  const [wallets, setWallets] = useState(seedWallets);
  const [grants, setGrants] = useState(seedGrants);
  const [drafts, setDrafts] = useState<Record<string, SignerMode>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const w of seedWallets) {
      if (reconcile(w).status === "drifted") init[w.id] = true;
    }
    return init;
  });
  const [flashId, setFlashId] = useState<string | null>(null);

  const attentionCount = useMemo(
    () => wallets.filter((w) => reconcile(w).status === "drifted").length,
    [wallets],
  );

  const groups = useMemo(
    () =>
      CUSTODY_GROUPS.map((group) => ({
        key: group.key,
        label: group.label,
        wallets: sortWallets(wallets.filter((w) => walletGroupKey(w) === group.key)),
      })).filter((g) => g.wallets.length > 0),
    [wallets],
  );

  const jumpToAttention = () => {
    const target = wallets.find((w) => reconcile(w).status === "drifted");
    if (!target) return;
    setExpanded((e) => ({ ...e, [target.id]: true }));
    setFlashId(target.id);
    window.setTimeout(() => setFlashId(null), 1600);
    window.setTimeout(() => {
      const card = document.getElementById(`wallet-${target.id}`);
      const container = card?.closest(".overflow-y-auto");
      if (!card || !container) return;
      const cardRect = card.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      container.scrollTo({
        top:
          container.scrollTop +
          (cardRect.top - contRect.top) -
          (contRect.height - cardRect.height) / 2,
      });
    }, 80);
  };

  const setDraft = (id: string, mode: SignerMode) =>
    setDrafts((d) => ({ ...d, [id]: mode }));

  const cancelDraft = (id: string) =>
    setDrafts((d) => {
      const next = { ...d };
      delete next[id];
      return next;
    });

  const commit = (id: string) => {
    const mode = drafts[id];
    if (!mode) return;
    setWallets((ws) =>
      ws.map((w) =>
        w.id === id
          ? { ...w, desiredMode: mode, authVersion: w.authVersion + 1, lastPermit: "you · just now" }
          : w,
      ),
    );
    cancelDraft(id);
  };

  const walletById = (id: string) => wallets.find((w) => w.id === id);

  const regrant = (id: string) => {
    const address = walletById(id)?.address ?? "";
    setWallets((ws) =>
      ws.map((w) =>
        w.id === id ? { ...w, grantActive: true, grantExpiresLabel: "Aug 22, 2026" } : w,
      ),
    );
    setGrants((gs) =>
      gs.map((g) =>
        g.scope.includes(address)
          ? { ...g, status: "active", expiresLabel: "Aug 22, 2026" }
          : g,
      ),
    );
  };

  const revokeGrant = (grantId: string) => {
    const grant = grants.find((g) => g.id === grantId);
    setGrants((gs) => gs.map((g) => (g.id === grantId ? { ...g, status: "revoked" } : g)));
    if (grant) {
      setWallets((ws) =>
        ws.map((w) => (grant.scope.includes(w.address) ? { ...w, grantActive: false } : w)),
      );
    }
  };

  const stopAllAuto = () => {
    setGrants((gs) => gs.map((g) => ({ ...g, status: "revoked" })));
    setWallets((ws) => ws.map((w) => ({ ...w, grantActive: false })));
  };

  const activate = (id: string) => {
    setWallets((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        const linkedVia =
          w.linkedVia === "read_only" ? (w.chain === "evm" ? "siwe" : "siws") : w.linkedVia;
        return {
          ...w,
          linkedVia,
          readOnly: false,
          desiredMode: "human_sync" as SignerMode,
          authVersion: w.authVersion + 1,
          lastPermit: "you · just now",
        };
      }),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {attentionCount > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface-2/40 px-4 py-3">
          <span className="text-[13px] text-fg">
            {attentionCount} {attentionCount === 1 ? "wallet needs" : "wallets need"} a new
            provider grant
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            onClick={jumpToAttention}
            className="h-8 shrink-0 px-3 text-[13px] font-medium"
          >
            Fix
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">Wallet signing</span>
          <span className="text-[13px] text-muted">
            Choose who can sign for each wallet. Changes require your signature.
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.key} className="flex flex-col">
              <span className="px-0.5 pb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted/80">
                {group.label}
              </span>
              <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40">
                {group.wallets.map((wallet, index) => (
                  <div key={wallet.id}>
                    {index > 0 && <Divider />}
                    <WalletPolicyRow
                      wallet={wallet}
                      grants={grants}
                      draft={drafts[wallet.id]}
                      expanded={Boolean(expanded[wallet.id])}
                      flash={flashId === wallet.id}
                      onToggle={() =>
                        setExpanded((e) => ({ ...e, [wallet.id]: !e[wallet.id] }))
                      }
                      onDraft={(mode) => setDraft(wallet.id, mode)}
                      onCommit={() => commit(wallet.id)}
                      onCancel={() => cancelDraft(wallet.id)}
                      onRegrant={() => regrant(wallet.id)}
                      onRevokeGrant={revokeGrant}
                      onActivate={() => activate(wallet.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col pt-1">
        <Divider />
        <SettingRow
          className="pt-4"
          title="Stop all auto-signing"
          desc="Revokes every provider grant. Wallets set to Aomi auto will fall back to manual until renewed."
        >
          <button
            type="button"
            onClick={stopAllAuto}
            className="flex h-8 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            Revoke all
          </button>
        </SettingRow>
      </div>
    </div>
  );
}

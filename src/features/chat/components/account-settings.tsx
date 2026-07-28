"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import type {
  DelegationGrant,
  LinkedVia,
  SignerMode,
  WalletPolicy,
} from "../contracts";
import {
  Alert,
  Bolt,
  Check,
  ChevronDown,
  Copy,
  Help,
  Key,
  Lock,
  Rerun,
  Star,
  User,
} from "./icons";

interface AccountSettingsProps {
  accountId: string;
  email: string;
  wallets: WalletPolicy[];
  grants: DelegationGrant[];
}

type IconType = ComponentType<{ size?: number; className?: string }>;
type Custody = "self" | "embedded" | "watch";
type SortKey = "custody" | "chain";
type ProviderIdentity = { name: string; color: string };

/** The "pink" signer authorities — the ACL a wallet may be set to. */
const MODES: { id: SignerMode; label: string; hint: string; Icon: IconType }[] = [
  {
    id: "human_sync",
    label: "Manual",
    hint: "You approve every transaction in your wallet — nothing signs without you.",
    Icon: User,
  },
  {
    id: "agent_sync",
    label: "Accept transactions",
    hint: "Your own key auto-signs transactions with no prompt each time — Aomi never holds the key.",
    Icon: Key,
  },
  {
    id: "auto",
    label: "Auto",
    hint: "Aomi's delegated signer acts on your behalf with no prompt, so scheduled and background actions can run. Needs an active delegation grant.",
    Icon: Bolt,
  },
  {
    id: "denied",
    label: "Locked",
    hint: "Freezes this wallet — it can never sign until you change this.",
    Icon: Lock,
  },
];

/**
 * rdns → display brand, captured at connect (EIP-6963 / wallet-adapter).
 * Display-only decoration on top of the `linkedVia` proof. Unknown → fall back
 * to the provenance tag.
 */
const BRANDS: Record<string, ProviderIdentity> = {
  "io.metamask": { name: "MetaMask", color: "#E2761B" },
  "io.rabby": { name: "Rabby", color: "#7084FF" },
  "com.coinbase.wallet": { name: "Coinbase", color: "#2C5FF6" },
  "app.phantom": { name: "Phantom", color: "#AB9FF2" },
  "app.backpack": { name: "Backpack", color: "#E33E3F" },
};

const EMBEDDED_PROVIDERS: Partial<Record<LinkedVia, ProviderIdentity>> = {
  privy: { name: "Privy", color: "#7C6AF2" },
  para: { name: "Para", color: "#5B8DEF" },
};

const CUSTODY_GROUPS: { key: Custody; label: string }[] = [
  { key: "self", label: "Self-custody wallets" },
  { key: "embedded", label: "Embedded wallets" },
  { key: "watch", label: "Read-only wallets" },
];

function custodyOf(v: LinkedVia): Custody {
  if (v === "siwe" || v === "siws") return "self";
  if (v === "privy" || v === "para") return "embedded";
  return "watch";
}

/** Read-only = tracked but not enabled for signing. Either a pure watch-only
 *  address (`read_only`) or a provider wallet flagged read-only. */
function isReadOnly(wallet: WalletPolicy): boolean {
  return wallet.readOnly === true || wallet.linkedVia === "read_only";
}

/** Which custody group a wallet renders under — read-only always wins. */
function walletGroupKey(wallet: WalletPolicy): Custody {
  return isReadOnly(wallet) ? "watch" : custodyOf(wallet.linkedVia);
}

/** Provider provenance as an EVM-style tag label. */
function providerBadgeLabel(v: LinkedVia): string {
  return v === "read_only" ? "READ-ONLY" : v.toUpperCase();
}

/** The custody axis, shown as muted text beside the provider tag. */
function custodyLabel(v: LinkedVia): string {
  const c = custodyOf(v);
  return c === "self" ? "self-custody" : c === "embedded" ? "embedded" : "";
}

function modeValidFor(v: LinkedVia, mode: SignerMode): boolean {
  const custody = custodyOf(v);
  if (custody === "watch") return mode === "denied";
  if (mode === "denied" || mode === "human_sync") return true;
  if (mode === "agent_sync") return custody === "self";
  return custody === "embedded"; // auto
}

/** Why a mode is greyed out for this wallet — shown under the hint. */
function unavailableReason(v: LinkedVia, mode: SignerMode): string {
  if (custodyOf(v) === "watch") return "Read-only wallet — it has no signing key.";
  if (mode === "auto") return "Needs a provider-delegated wallet (Para or Privy).";
  if (mode === "agent_sync") return "Only self-custody wallets can sign at the edge.";
  return "Not available for this wallet.";
}

type Recon =
  | { status: "reconciled"; detail: string }
  | { status: "drifted"; detail: string; action: string };

/** Desired ACL × capability → what the runtime can actually honor right now. */
function reconcile(wallet: WalletPolicy): Recon {
  if (isReadOnly(wallet)) {
    return {
      status: "reconciled",
      detail:
        wallet.linkedVia === "read_only"
          ? "Read-only — tracked address, no signing key."
          : "Read-only — tracked, not enabled for signing yet.",
    };
  }
  switch (wallet.desiredMode) {
    case "denied":
      return { status: "reconciled", detail: "Locked — this wallet can't sign." };
    case "human_sync":
      return { status: "reconciled", detail: "You approve every transaction." };
    case "agent_sync":
      return { status: "reconciled", detail: "Your wallet auto-signs each transaction." };
    case "auto":
      return wallet.grantActive
        ? {
            status: "reconciled",
            detail: `Aomi auto-signs · grant valid to ${wallet.grantExpiresLabel ?? "—"}.`,
          }
        : {
            status: "drifted",
            detail: "You want auto — the runtime fell back to manual.",
            action: "Re-grant",
          };
  }
}

export function AccountSettings({
  accountId,
  email,
  wallets: seedWallets,
  grants: seedGrants,
}: AccountSettingsProps) {
  const [wallets, setWallets] = useState(seedWallets);
  const [grants, setGrants] = useState(seedGrants);
  const [drafts, setDrafts] = useState<Record<string, SignerMode>>({});
  const [sortBy, setSortBy] = useState<SortKey>("custody");
  // Collapsed by default — a wallet that drifted opens itself so the fix is visible.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const w of seedWallets) {
      if (reconcile(w).status === "drifted") init[w.id] = true;
    }
    return init;
  });
  const [flashId, setFlashId] = useState<string | null>(null);

  const posture = useMemo(() => {
    let attention = 0;
    for (const w of wallets) {
      const r = reconcile(w);
      if (r.status === "drifted") attention += 1;
    }
    return { attention };
  }, [wallets]);

  const groups = useMemo(() => {
    if (sortBy === "custody") {
      return CUSTODY_GROUPS.map((group) => ({
        key: group.key,
        label: group.label,
        wallets: wallets.filter((wallet) => walletGroupKey(wallet) === group.key),
      })).filter((g) => g.wallets.length > 0);
    }
    return (["evm", "svm"] as const)
      .map((c) => ({
        key: c as string,
        label: c === "evm" ? "Ethereum" : "Solana",
        wallets: wallets.filter((w) => w.chain === c),
      }))
      .filter((g) => g.wallets.length > 0);
  }, [wallets, sortBy]);

  const toggleExpanded = (id: string) =>
    setExpanded((e) => ({ ...e, [id]: !e[id] }));

  /** Posture chip → scroll to the first drifted wallet, open and flash it. */
  const jumpToAttention = () => {
    const target = wallets.find((w) => reconcile(w).status === "drifted");
    if (!target) return;
    setExpanded((e) => ({ ...e, [target.id]: true }));
    setFlashId(target.id);
    window.setTimeout(() => setFlashId(null), 1600);
    // Scroll after React commits the expansion, or the layout shifts mid-scroll.
    // Scroll the modal's own container — scrollIntoView is unreliable with
    // nested scroll areas (it can pick the chat pane behind the modal).
    window.setTimeout(() => {
      const card = document.getElementById(`wallet-${target.id}`);
      const container = card?.closest(".overflow-y-auto");
      if (!card || !container) return;
      const cardRect = card.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      // Instant, not smooth — smooth is unreliable here (no-ops under
      // reduced-motion/automation), and the flash ring shows where we landed.
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

  /** Commit the signed permit: desired mode lands, version bumps. */
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
    const address = walletById(id)?.address ?? " ";
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

  /**
   * Activate a read-only wallet: proving ownership (connect + sign SIWE/SIWS)
   * upgrades it from a watched address into an owned, signable key. linked_via
   * flips to the proof method, signing_mode lands at the default `human_sync`.
   */
  const activate = (id: string) => {
    setWallets((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        // Pure watch-only proves ownership → gains a siwe/siws provenance.
        // A provider wallet just enables signing → keeps its provider.
        const linkedVia: LinkedVia =
          w.linkedVia === "read_only"
            ? w.chain === "evm"
              ? "siwe"
              : "siws"
            : w.linkedVia;
        return {
          ...w,
          linkedVia,
          readOnly: false,
          desiredMode: "human_sync",
          authVersion: w.authVersion + 1,
          lastPermit: "you · just now",
        };
      }),
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-[22px] py-5">
      <div className="flex flex-col gap-6">
        {/* Status band */}
        <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{email}</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
              {accountId}
              <button
                aria-label="Copy account ID"
                onClick={() => void navigator.clipboard?.writeText(accountId)}
                className="text-muted/60 transition-colors hover:text-fg"
              >
                <Copy size={11} />
              </button>
            </span>
          </div>
          <div
            className={`grid gap-2 ${
              posture.attention > 0 ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            <PostureChip tone="muted">
              {wallets.length} {wallets.length === 1 ? "wallet" : "wallets"}
            </PostureChip>
            <PostureChip tone="success">
              {grants.length} delegated {grants.length === 1 ? "grant" : "grants"}
            </PostureChip>
            {posture.attention > 0 && (
              <PostureChip tone="accent" onClick={jumpToAttention}>
                {posture.attention} needs attention
              </PostureChip>
            )}
          </div>
          <p className="text-[13px] leading-relaxed text-muted">
            You authorize who may sign for each wallet. Aomi reconciles the runtime
            to match — changes are signed authorizations, not toggles.
          </p>
        </div>

        {/* Wallet policies */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">Wallet signing policy</span>
              <span className="text-[13px] text-muted">
                Choose how each wallet signs transactions.
              </span>
            </div>
            <SortSwitch value={sortBy} onChange={setSortBy} />
          </div>

          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-2">
                <span className="px-0.5 text-[11px] font-medium uppercase tracking-wide text-muted/80">
                  {group.label}
                </span>
                {group.wallets.map((wallet) => (
                  <WalletPolicyCard
                    key={wallet.id}
                    wallet={wallet}
                    sortBy={sortBy}
                    draft={drafts[wallet.id]}
                    expanded={Boolean(expanded[wallet.id])}
                    flash={flashId === wallet.id}
                    onToggle={() => toggleExpanded(wallet.id)}
                    onDraft={(mode) => setDraft(wallet.id, mode)}
                    onCommit={() => commit(wallet.id)}
                    onCancel={() => cancelDraft(wallet.id)}
                    onRegrant={() => regrant(wallet.id)}
                    onActivate={() => activate(wallet.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Delegated grants — the capability axis */}
        <Section
          title="Delegated signing grants"
          desc="These grants are what let an “Aomi auto” policy actually reconcile. Revoke to force those wallets back to manual."
        >
          {grants.map((grant) => (
            <GrantRow key={grant.id} grant={grant} onRevoke={() => revokeGrant(grant.id)} />
          ))}
          <button
            onClick={stopAllAuto}
            className="mt-1 flex items-center gap-3 rounded-[var(--radius-md)] border border-accent/40 bg-accent/5 px-4 py-3 text-left transition-colors hover:bg-accent/10"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Lock size={15} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[13px] font-medium text-accent">Stop all auto-signing</span>
              <span className="text-xs text-muted">
                Revokes every grant. Your ACL stays “auto”, but the runtime drifts to
                manual until you re-grant.
              </span>
            </span>
          </button>
        </Section>
      </div>
    </div>
  );
}

function WalletPolicyCard({
  wallet,
  sortBy,
  draft,
  expanded,
  flash,
  onToggle,
  onDraft,
  onCommit,
  onCancel,
  onRegrant,
  onActivate,
}: {
  wallet: WalletPolicy;
  sortBy: SortKey;
  draft?: SignerMode;
  expanded: boolean;
  flash: boolean;
  onToggle: () => void;
  onDraft: (mode: SignerMode) => void;
  onCommit: () => void;
  onCancel: () => void;
  onRegrant: () => void;
  onActivate: () => void;
}) {
  const selected = draft ?? wallet.desiredMode;
  const pending = draft !== undefined && draft !== wallet.desiredMode;
  const recon = reconcile(wallet);
  const locked = isReadOnly(wallet);
  // A ceremony in flight keeps the editor open; read-only rows have no editor.
  const open = !locked && (expanded || pending);
  const currentMode = MODES.find((m) => m.id === wallet.desiredMode);
  const providerIdentity =
    (wallet.rdns ? BRANDS[wallet.rdns] : undefined) ??
    EMBEDDED_PROVIDERS[wallet.linkedVia];
  const custody = custodyLabel(wallet.linkedVia);
  const showChainTag = sortBy !== "chain";
  const showProviderTag = sortBy === "chain" || Boolean(providerIdentity);
  const showCustodyLabel = sortBy === "chain" && Boolean(custody);

  return (
    <div
      id={`wallet-${wallet.id}`}
      className={`overflow-hidden rounded-[var(--radius-md)] border bg-background/40 transition-shadow ${
        flash ? "border-accent ring-1 ring-accent" : "border-border"
      }`}
    >
      {/* Row — collapsed summary; click to open the editor */}
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
        className={`flex items-center justify-between gap-3 p-4 ${
          open ? "border-b border-border" : ""
        } ${locked ? "" : "cursor-pointer"}`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {showProviderTag && (
            <ProviderTag linkedVia={wallet.linkedVia} brand={providerIdentity} />
          )}
          <span className="truncate font-mono text-sm font-medium">{wallet.address}</span>
          {showChainTag && <ChainLabel chain={wallet.chain} />}
          {showCustodyLabel && <span className="text-[11px] text-muted">{custody}</span>}
          {wallet.primary && (
            <span className="flex items-center gap-1 text-[11px] text-muted">
              <Star size={12} className="text-accent" />
              primary
            </span>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2.5">
          {locked ? (
            <>
              <span className="text-[11px] text-muted">Read-only</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActivate();
                }}
                title="Verify to enable signing for this wallet."
                className="flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-gradient-to-br from-accent to-accent-strong px-3 py-1.5 text-[13px] font-semibold text-on-accent"
              >
                <Key size={13} />
                Activate
              </button>
            </>
          ) : (
            <>
              {!open && currentMode && (
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
                  <currentMode.Icon size={12} />
                  {currentMode.label}
                </span>
              )}
              <ReconPill recon={recon} pending={pending} />
              {!open && recon.status === "drifted" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegrant();
                  }}
                  className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-accent/50 px-2.5 py-1 text-[12px] font-medium text-accent transition-colors hover:bg-accent/10"
                >
                  <Rerun size={12} />
                  {recon.action}
                </button>
              )}
              <ChevronDown
                size={14}
                className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Signing mode editor — only when open */}
      {open && (
        <div className="flex flex-col gap-3 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Signing mode
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {MODES.map((mode) => {
              const valid = modeValidFor(wallet.linkedVia, mode.id);
              const isSelected = selected === mode.id;
              return (
                <div key={mode.id} className="relative">
                  <button
                    disabled={!valid}
                    onClick={() => onDraft(mode.id)}
                    className={`flex h-[72px] w-full flex-col items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border px-2 text-center transition-colors ${
                      isSelected
                        ? "border-transparent bg-surface-2 text-fg"
                        : "border-border text-muted hover:text-fg"
                    } ${!valid ? "cursor-not-allowed opacity-35 hover:text-muted" : ""} ${
                      isSelected && pending ? "ring-1 ring-accent" : ""
                    }`}
                  >
                    <mode.Icon size={16} className={isSelected ? "text-fg" : ""} />
                    <span className="flex items-center gap-1 text-[11px] font-medium leading-tight">
                      {isSelected && <Check size={11} />}
                      {mode.label}
                    </span>
                  </button>
                  {/* Hover ? — what this mode means for the user */}
                  <span className="peer/hint absolute right-2 top-2 z-10 flex cursor-help text-muted/50 transition-colors hover:text-muted">
                    <Help size={12} />
                  </span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-40 -translate-x-1/2 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2.5 py-2 text-left text-[11px] leading-snug text-fg shadow-[0_8px_24px_rgba(0,0,0,0.45)] peer-hover/hint:block">
                    {mode.hint}
                    {!valid && (
                      <span className="mt-1 block text-muted">
                        {unavailableReason(wallet.linkedVia, mode.id)}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reconciliation / ceremony line */}
          {pending ? (
            <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-accent/40 bg-accent/5 px-3 py-2.5">
              <span className="text-[13px] text-fg">
                Authorization change — sign the permit to apply.
              </span>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button
                  onClick={onCancel}
                  className="rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:text-fg"
                >
                  Cancel
                </button>
                <button
                  onClick={onCommit}
                  className="rounded-[var(--radius-sm)] bg-gradient-to-br from-accent to-accent-strong px-3 py-1.5 text-[13px] font-semibold text-on-accent"
                >
                  Sign to authorize
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-muted">{recon.detail}</span>
              {recon.status === "drifted" && (
                <button
                  onClick={onRegrant}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-accent/50 px-3 py-1.5 text-[13px] font-medium text-accent transition-colors hover:bg-accent/10"
                >
                  <Rerun size={13} />
                  {recon.action}
                </button>
              )}
            </div>
          )}

          {/* Audit meta */}
          <span className="text-[11px] text-muted/80">
            Last updated {wallet.lastPermit?.replace(/^you · /, "") ?? "—"}
          </span>
        </div>
      )}
    </div>
  );
}

function GrantRow({
  grant,
  onRevoke,
}: {
  grant: DelegationGrant;
  onRevoke: () => void;
}) {
  const live = grant.status === "active";
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background/40 px-4 py-3">
      <ProviderLogo provider={grant.provider} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[13px] font-medium">
          {grant.provider} · {grant.kind}
        </span>
        <span className="truncate text-xs text-muted">{grant.scope}</span>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        <span className={`text-xs ${live ? "text-success" : "text-muted"}`}>
          {grant.status === "active"
            ? `valid to ${grant.expiresLabel}`
            : grant.status === "expired"
              ? `expired ${grant.expiresLabel}`
              : "revoked"}
        </span>
        {live && (
          <button
            onClick={onRevoke}
            className="rounded-[var(--radius-sm)] border border-border px-2.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-fg"
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}

function ProviderLogo({ provider }: { provider: string }) {
  const containerClass =
    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)]";

  if (provider === "Privy") {
    return (
      <span className={`${containerClass} bg-[#FF7F73] text-[#05030F]`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <circle cx="12" cy="9.5" r="5.6" fill="currentColor" />
          <ellipse cx="12" cy="18.5" rx="4" ry="0.9" fill="currentColor" />
        </svg>
      </span>
    );
  }

  if (provider === "Para") {
    return (
      <span className={`${containerClass} bg-[#FF4E00]/15 text-[#FF4E00]`}>
        <svg aria-hidden="true" viewBox="0 0 26 25" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M16.7506 0.114342H7.01716V13.267C7.01716 14.2305 6.24304 15.0128 5.28576 15.0128H0V23.8289H8.74337V18.4992C8.74337 17.5357 9.51749 16.7534 10.4748 16.7534H16.8854C21.4904 16.7534 25.2124 12.9517 25.1363 8.29101C25.0603 3.63032 21.2761 0.114342 16.7506 0.114342Z"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${containerClass} bg-surface-2 text-[13px] font-semibold text-muted`}>
      {provider.slice(0, 1)}
    </span>
  );
}

function SortSwitch({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <div className="flex flex-shrink-0 items-center gap-2">
      <span className="text-[11px] text-muted">Sort by</span>
      <div className="flex rounded-full border border-border p-[3px]">
        {(["custody", "chain"] as SortKey[]).map((k) => (
          <button
            key={k}
            onClick={() => onChange(k)}
            className={`rounded-full px-3 py-[5px] text-xs capitalize transition-colors ${
              value === k ? "bg-surface-2 font-medium text-fg" : "text-muted"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReconPill({ recon, pending }: { recon: Recon; pending: boolean }) {
  if (pending) {
    return (
      <span className="flex flex-shrink-0 items-center gap-1.5 text-[13px] text-danger">
        <span className="h-[7px] w-[7px] rounded-full bg-danger" />
        Awaiting signature
      </span>
    );
  }
  // Reconciled is the silent default — nothing to show when the runtime already
  // honors the ACL. Only drift is worth surfacing.
  if (recon.status === "reconciled") return null;
  return (
    <span className="flex flex-shrink-0 items-center gap-1.5 text-[13px] text-accent">
      <Alert size={13} />
      Needs attention
    </span>
  );
}

function ChainLabel({ chain }: { chain: "evm" | "svm" }) {
  return (
    <span
      className={`text-[11px] font-semibold ${
        chain === "evm" ? "text-info" : "text-success"
      }`}
    >
      {chain === "evm" ? "EVM" : "SVM"}
    </span>
  );
}

function ProviderTag({
  linkedVia,
  brand,
}: {
  linkedVia: LinkedVia;
  brand?: { name: string; color: string };
}) {
  if (brand) {
    return (
      <span className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fg">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: brand.color }}
        />
        {brand.name}
      </span>
    );
  }
  return (
    <span className="rounded-[var(--radius-sm)] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
      {providerBadgeLabel(linkedVia)}
    </span>
  );
}

function PostureChip({
  children,
  tone,
  onClick,
}: {
  children: ReactNode;
  tone: "muted" | "success" | "accent";
  onClick?: () => void;
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "accent"
        ? "text-accent"
        : "text-muted";
  const baseClass = `flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium ${toneClass}`;
  const dot = tone !== "muted" && (
    <span
      className={`h-[6px] w-[6px] rounded-full ${
        tone === "success" ? "bg-success" : "bg-accent"
      }`}
    />
  );
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClass} transition-colors hover:border-accent/60`}
      >
        {dot}
        {children}
      </button>
    );
  }
  return (
    <span className={baseClass}>
      {dot}
      {children}
    </span>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-[13px] text-muted">{desc}</span>
      </div>
      {children}
    </div>
  );
}

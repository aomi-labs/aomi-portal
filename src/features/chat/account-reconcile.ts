import type { DelegationGrant, LinkedVia, SignerMode, WalletPolicy } from "./contracts";

export const SIGNER_MODES: { id: SignerMode; label: string; hint: string }[] = [
  {
    id: "human_sync",
    label: "Manual",
    hint: "You approve every transaction in your wallet. Nothing signs without you.",
  },
  {
    id: "agent_sync",
    label: "Auto-approve",
    hint: "Your wallet auto-signs each transaction. Aomi never holds the key.",
  },
  {
    id: "auto",
    label: "Aomi auto",
    hint: "Aomi signs on your behalf for scheduled and background actions. Requires an active provider grant.",
  },
  {
    id: "denied",
    label: "Locked",
    hint: "This wallet cannot sign until you change the setting.",
  },
];

const BRANDS: Record<string, string> = {
  "io.metamask": "MetaMask",
  "io.rabby": "Rabby",
  "com.coinbase.wallet": "Coinbase",
  "app.phantom": "Phantom",
  "app.backpack": "Backpack",
};

const RDNS_MARK_KEYS: Record<string, string> = {
  "io.metamask": "metamask",
  "io.rabby": "rabby",
  "com.coinbase.wallet": "coinbase",
  "app.phantom": "phantom",
  "app.backpack": "backpack",
};

const EMBEDDED_PROVIDERS: Partial<Record<LinkedVia, string>> = {
  privy: "Privy",
  para: "Para",
};

type Custody = "self" | "embedded" | "watch";

export type Recon =
  | { status: "reconciled"; detail: string }
  | { status: "drifted"; detail: string; action: string };

export function modeLabel(mode: SignerMode): string {
  return SIGNER_MODES.find((m) => m.id === mode)?.label ?? mode;
}

export function walletMarkKey(wallet: WalletPolicy): string | null {
  if (wallet.rdns && RDNS_MARK_KEYS[wallet.rdns]) return RDNS_MARK_KEYS[wallet.rdns]!;
  if (wallet.linkedVia === "para") return "para";
  if (wallet.linkedVia === "privy") return "privy";
  return null;
}

export function walletDisplayName(wallet: WalletPolicy): string {
  if (wallet.rdns && BRANDS[wallet.rdns]) return BRANDS[wallet.rdns]!;
  const embedded = EMBEDDED_PROVIDERS[wallet.linkedVia];
  if (embedded) return embedded;
  if (wallet.linkedVia === "read_only") return "Read-only";
  if (wallet.linkedVia === "siwe" || wallet.linkedVia === "siws") {
    return wallet.chain === "evm" ? "Self-custody" : "Self-custody";
  }
  return wallet.linkedVia.toUpperCase();
}

function custodyOf(v: LinkedVia): Custody {
  if (v === "siwe" || v === "siws") return "self";
  if (v === "privy" || v === "para") return "embedded";
  return "watch";
}

export function isReadOnly(wallet: WalletPolicy): boolean {
  return wallet.readOnly === true || wallet.linkedVia === "read_only";
}

export function walletGroupKey(wallet: WalletPolicy): Custody {
  return isReadOnly(wallet) ? "watch" : custodyOf(wallet.linkedVia);
}

export const CUSTODY_GROUPS: { key: Custody; label: string }[] = [
  { key: "self", label: "Self-custody wallets" },
  { key: "embedded", label: "Embedded wallets" },
  { key: "watch", label: "Read-only wallets" },
];

export function modeValidFor(v: LinkedVia, mode: SignerMode): boolean {
  const custody = custodyOf(v);
  if (custody === "watch") return mode === "denied";
  if (mode === "denied" || mode === "human_sync") return true;
  if (mode === "agent_sync") return custody === "self";
  return custody === "embedded";
}

export function unavailableReason(v: LinkedVia, mode: SignerMode): string {
  if (custodyOf(v) === "watch") return "Read-only wallet. No signing key.";
  if (mode === "auto") return "Only available on embedded wallets (Para or Privy).";
  if (mode === "agent_sync") return "Only available on self-custody wallets.";
  return "Not available for this wallet.";
}

export function reconcile(wallet: WalletPolicy): Recon {
  if (isReadOnly(wallet)) {
    return {
      status: "reconciled",
      detail:
        wallet.linkedVia === "read_only"
          ? "Tracked address. No signing key."
          : "Tracked, not enabled for signing yet.",
    };
  }
  switch (wallet.desiredMode) {
    case "denied":
      return { status: "reconciled", detail: "Locked. This wallet cannot sign." };
    case "human_sync":
      return { status: "reconciled", detail: "You approve every transaction." };
    case "agent_sync":
      return { status: "reconciled", detail: "Your wallet auto-signs each transaction." };
    case "auto":
      return wallet.grantActive
        ? {
            status: "reconciled",
            detail: `Grant valid to ${wallet.grantExpiresLabel ?? "-"}.`,
          }
        : {
            status: "drifted",
            detail: "Aomi auto is set, but the provider grant expired.",
            action: "Renew grant",
          };
  }
}

export function findGrantForWallet(
  grants: DelegationGrant[],
  wallet: WalletPolicy,
): DelegationGrant | undefined {
  return grants.find((g) => g.scope.includes(wallet.address));
}

export function walletStatusLabel(
  wallet: WalletPolicy,
  recon: Recon,
  pending: boolean,
): string {
  if (pending) return "Awaiting signature";
  if (isReadOnly(wallet)) return "Read-only";
  if (recon.status === "drifted") return "Grant expired";
  if (wallet.desiredMode === "auto" && wallet.grantActive) {
    return `Grant valid to ${wallet.grantExpiresLabel ?? "-"}`;
  }
  return modeLabel(wallet.desiredMode);
}

export function sortWallets(wallets: WalletPolicy[]): WalletPolicy[] {
  return [...wallets].sort((a, b) => {
    const aDrift = reconcile(a).status === "drifted" ? 0 : 1;
    const bDrift = reconcile(b).status === "drifted" ? 0 : 1;
    if (aDrift !== bDrift) return aDrift - bDrift;
    if (a.primary && !b.primary) return -1;
    if (!a.primary && b.primary) return 1;
    return 0;
  });
}

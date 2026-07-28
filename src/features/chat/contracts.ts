/**
 * Typed contracts for the Aomi chat mock.
 * Simulation only — mirrors Paper V2 interaction states.
 */

export type SessionState =
  | "anonymous"
  | "connecting"
  | "connected"
  | "emptyThread"
  | "submitting"
  | "working"
  | "streaming"
  | "completed"
  | "stopped"
  | "failedSend"
  | "paymentRequired"
  | "requiredSecrets"
  | "walletPending"
  | "settings";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  error?: string;
}

export interface ToolStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  result?: string;
  tools?: string[];
}

export type TxStatus = "ready" | "pending" | "approved" | "rejected" | "cancelled";

export interface TxPreview {
  kind: "swap" | "bridge" | "deploy" | "balances";
  provider: string;
  title: string;
  payLabel: string;
  payAmount: string;
  receiveLabel: string;
  receiveAmount: string;
  rate: string;
  slippage: string;
  gas: string;
  status: TxStatus;
  approveLabel: string;
}

export type Overlay =
  | "none"
  | "wallet"
  | "settings"
  | "wallets"
  | "gate"
  | "disconnect"
  | "deleteThread";

export type Popover =
  | "none"
  | "command"
  | "account"
  | "workspace"
  | "network"
  | "app"
  | "model";

/** Where catalog pickers (network/app/model) should anchor. */
export type PopoverAnchor = "composer" | "header";

export type Theme = "dark" | "light" | "system";

export interface Thread {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  answer?: string;
  trace?: ToolStep[];
  tx?: TxPreview;
  kind: "swap" | "balance" | "bridge" | "deploy" | "blank" | "branch";
}

export interface WalletRequest {
  id: string;
  summary: string;
  network: string;
  outcome: "pending" | "approved" | "rejected";
}

export interface LinkedWallet {
  id: string;
  name: string;
  chain: "evm" | "solana";
  address: string;
  status: "active" | "linked";
}

/** Mirrors portal session `usage` + tier — swap for GET /api/aomi/account later. */
export interface AccountBillingSnapshot {
  tier: string;
  period_utc_month: string;
  credit_used: number;
  credit_paid: number;
  member_since?: string;
}

/** Mirrors GET /api/account/usage — swap for live fetch in portal. */
export interface UsageOverview {
  period_utc_from: string;
  period_utc_to: string;
  overall: {
    credit_used: number;
    credit_paid: number;
    input_tokens: number;
    output_tokens: number;
  };
  apps: Array<{
    app: string;
    credits_used: number;
    input_tokens: number;
    output_tokens: number;
    share_pct: number;
  }>;
}

/** Mirrors GET /api/account/payment — product labels only, no rail ids in UI. */
export interface PaymentMethodsFixture {
  quota: {
    status: "active" | "exhausted";
    remaining: number;
    cap: number;
  };
  own_api_keys: Array<{
    provider: string;
    key_prefix: string;
    active: boolean;
  }>;
  wallet_pay: {
    status: "not_connected" | "ready";
  };
}

export type PaymentGateAction = "connect_wallet" | "use_own_key" | "view_usage";

export interface Account {
  connected: boolean;
  address?: string;
  ens?: string;
  network?: string;
  /** Remaining quota credits (UI convenience). */
  credits?: number;
  /** Monthly cap — maps to `credit_paid`. */
  creditCap?: number;
  billing?: AccountBillingSnapshot;
  email?: string;
}

export interface CatalogItem {
  id: string;
  label: string;
  description?: string;
  /** Section heading in grouped pickers (vendor, category, EVM/SVM). */
  group?: string;
  /** Hidden until the "Show testnets" toggle is on. */
  testnet?: boolean;
  /** 1–2 letter avatar fallback when no brand icon exists. */
  abbr?: string;
}

/** A connectable wallet row in the Manage-wallets picker. */
export interface WalletOption {
  id: string;
  name: string;
  family: "evm" | "svm";
  status: "ready" | "notInstalled";
}

export interface Gate {
  kind: "payment" | "requiredSecret";
  title: string;
  message: string;
  secretLabel?: string;
  paymentActions?: PaymentGateAction[];
}

export type SettingsTab =
  | "general"
  | "usage"
  | "appKeys"
  | "bots"
  | "secrets"
  | "byok";

export interface Toast {
  id: string;
  message: string;
  tone?: "info" | "success" | "error";
}

export interface ChatSnapshot {
  state: SessionState;
  theme: Theme;
  account: Account;
  threads: Thread[];
  activeThreadId: string | null;
  draft: string;
  selectedAppId: string;
  selectedModelId: string;
  selectedNetworkId: string;
  wallets: LinkedWallet[];
  trace: ToolStep[];
  answer: string | null;
  tx: TxPreview | null;
  walletRequest: WalletRequest | null;
  gate: Gate | null;
  overlay: Overlay;
  /** Thread pending delete confirmation (overlay === "deleteThread"). */
  pendingDeleteThreadId: string | null;
  popover: Popover;
  settingsTab: SettingsTab | null;
  sidebarCollapsed: boolean;
  toast: Toast | null;
  workingElapsedSec: number;
}

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
  | "deleteThread"
  | "apps";

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
  | "account"
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

/** Usage rollup for the current billing period. */
export interface AccountUsage {
  periodLabel: string;
  creditsUsed: number;
  creditsIncluded: number;
  inputTokens: number;
  outputTokens: number;
}

/** Settings › General / Account identity block. */
export interface AccountOverview {
  userId: string;
  authType: string;
  primary: string;
  address: string;
  network: string;
  tier: string;
  status: string;
  verifiedEmail: string;
  createdAt: string;
  lastSeenAt: string;
  usage: AccountUsage;
}

export type SignerMode = "human_sync" | "agent_sync" | "auto" | "denied";

export type LinkedVia = "siwe" | "siws" | "privy" | "para" | "read_only";

export interface WalletPolicy {
  id: string;
  chain: "evm" | "svm";
  address: string;
  linkedVia: LinkedVia;
  rdns?: string;
  primary?: boolean;
  readOnly?: boolean;
  desiredMode: SignerMode;
  grantActive?: boolean;
  grantExpiresLabel?: string;
  authVersion: number;
  lastPermit?: string;
}

export interface DelegationGrant {
  id: string;
  provider: string;
  scope: string;
  kind: string;
  status: "active" | "expired" | "revoked";
  expiresLabel: string;
}

export interface UsageLineRow {
  label: string;
  detail?: string;
  amountUsd: number;
  free?: boolean;
}

export interface UsageTxRow {
  label: string;
  chain: string;
  feeUsd: number;
}

export interface UsageStatement {
  periodLabel: string;
  creditsUsed: number;
  creditsIncluded: number;
  byokTurns: number;
  settledVia: string;
  aiTools: UsageLineRow[];
  onchain: UsageTxRow[];
}

export interface UsageAccount {
  userId: string;
  handle: string;
  authType: string;
  address: string;
  network: string;
  tier: string;
  status: string;
  byok: boolean;
  verifiedEmail: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface UsagePeriod {
  periodLabel: string;
  from: string;
  to: string;
  issued: string;
}

export interface UsageSummaryTotals {
  modelUsd: number;
  toolUsd: number;
  outcomeUsd: number;
  computeUsd: number;
  onchainUsd: number;
  totalUsd: number;
  managedMarkupUsd: number;
}

export interface UsageAllowance {
  included: number;
  used: number;
}

export interface UsagePayment {
  settledVia: string;
  allowanceCredits: UsageAllowance;
  allowanceAppliedUsd: number;
  x402SettledUsd: number;
  onchainUsd: number;
  onchainNote: string;
}

export type AppModelKey = "managed" | "byok";

export interface AppSettings {
  modelKey: AppModelKey;
  appByok: boolean;
  managedMarkupPct: number;
  note: string;
}

export interface AppModelRow {
  model: string;
  turns: number;
  inputTokens: number;
  outputTokens: number;
  baseUsd: number;
  chargedUsd: number;
  note?: string;
}

export interface AppModelUsage {
  baseUsd: number;
  markupPct: number;
  markupUsd: number;
  chargedUsd: number;
  billed?: boolean;
  turns: number;
  byModel: AppModelRow[];
}

export interface AppToolItem {
  tool: string;
  calls: number;
  unitCredits: number;
  usd: number;
}

export interface AppToolUsage {
  chargedUsd: number;
  calls: number;
  items: AppToolItem[];
}

export interface AppOutcomeItem {
  date: string;
  action: string;
  chain: string;
  flow: string;
  bps: number;
  feeToken: string;
  usd: number;
  tx: string;
}

export interface AppOutcomeUsage {
  chargedUsd: number;
  txns: number;
  items: AppOutcomeItem[];
}

export interface AppUsageEntry {
  id: string;
  name: string;
  native: boolean;
  settings: AppSettings;
  model: AppModelUsage;
  tool: AppToolUsage | null;
  outcome: AppOutcomeUsage | null;
  appTotalUsd: number;
}

export interface ByAppRow {
  app: string;
  modelUsd: number;
  toolUsd: number | null;
  outcomeUsd: number | null;
  totalUsd: number;
}

export interface UsageColumnTotals {
  modelUsd: number;
  toolUsd: number;
  outcomeUsd: number;
  totalUsd: number;
}

export interface MonthlyStatement {
  period: UsagePeriod;
  summary: UsageSummaryTotals;
  payment: UsagePayment;
  apps: AppUsageEntry[];
  byApp: ByAppRow[];
  columnTotals: UsageColumnTotals;
}

export interface UsageFixtureData {
  account: UsageAccount;
  months: MonthlyStatement[];
}

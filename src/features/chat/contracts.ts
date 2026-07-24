/**
 * Typed contracts for the Aomi chat mock.
 *
 * These mirror the product surfaces and interaction states in
 * ../../../CHAT-ARCHITECTURE.md (§3 surfaces, §4 state matrix).
 *
 * Everything here is simulation-only. No real auth, signing, BFF, or secrets.
 */

/** §4 — interaction state matrix (drives the whole view). */
export type SessionState =
  | "anonymous"
  | "connecting"
  | "connected"
  | "threadLoading"
  | "emptyThread"
  | "submitting"
  | "working"
  | "completed"
  | "failedSend"
  | "paymentRequired"
  | "requiredSecrets"
  | "walletPending"
  | "settings";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  /** Rendered as plain text in the skeleton; markdown craft is TBD. */
  content: string;
  createdAt: number;
  /** Present when a send failed but we keep the optimistic message. */
  error?: string;
}

/** A single step inside the Working trace. Final answer never lives here (§8). */
export interface ToolStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  /** Safe-to-fake tool result summary. */
  result?: string;
  /** Tool-call chips shown under the step (safe-to-fake names). */
  tools?: string[];
}

/** Simulated swap/transaction preview rendered outside the trace. */
export interface TxPreview {
  provider: string;
  paySymbol: string;
  payAmount: string;
  receiveSymbol: string;
  receiveAmount: string;
  rate: string;
  slippage: string;
  gas: string;
}

/** Which blocking overlay (if any) is shown over the chat. */
export type Overlay = "none" | "wallet" | "settings" | "apps";

export type Theme = "dark" | "light";

export interface Thread {
  id: string;
  title: string;
  updatedAt: number;
  archived?: boolean;
  messages: Message[];
}

export interface WalletRequest {
  id: string;
  /** Human summary of what the (simulated) wallet is being asked to do. */
  summary: string;
  network: string;
  outcome: "pending" | "approved" | "rejected";
}

export interface Account {
  connected: boolean;
  address?: string;
  network?: string;
  credits?: number;
  email?: string;
}

/** Usage rollup for the current billing period (§8: safe-to-fake). */
export interface AccountUsage {
  /** Human label for the period, e.g. "July 2026". */
  periodLabel: string;
  creditsUsed: number;
  creditsIncluded: number;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Full account overview rendered in Settings › General.
 * Mirrors the portal's /api/account shape (identity + subscription/usage),
 * but every value here is fabricated demo data.
 */
export interface AccountOverview {
  userId: string;
  /** Auth method label, e.g. "Wallet". */
  authType: string;
  /** Primary identity summary, e.g. "Connected". */
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

/** Blocking gate fixture (§4: payment / required secrets). */
export interface Gate {
  kind: "payment" | "requiredSecret";
  message: string;
}

export type SettingsTab = "general" | "account" | "usage";

/**
 * ACL policy axis — the `public_keys.signing_mode` a user *wants* a wallet to
 * stay in (desired state). The runtime reconciles toward it; it is not the
 * runtime's live mode. Mirrors the backend `SigningMode` enum.
 */
export type SignerMode = "human_sync" | "agent_sync" | "auto" | "denied";

/**
 * How a wallet was proven and attached — the tidy provenance set that mirrors
 * the kernel's `auth_providers.provider`. Custody is *derived* from it:
 * siwe/siws → self-custody, privy/para → embedded, read_only → watch (no key).
 */
export type LinkedVia = "siwe" | "siws" | "privy" | "para" | "read_only";

/**
 * One `public_keys` row as the account owns it: identity + the ACL (desired
 * signing policy). Chain topology is deliberately absent — that's thread state.
 */
export interface WalletPolicy {
  id: string;
  chain: "evm" | "svm";
  address: string;
  /** How the wallet was proven/attached; drives custody + valid signer modes. */
  linkedVia: LinkedVia;
  /**
   * EIP-6963 rdns (EVM) / wallet-adapter id (SVM) captured at connect time,
   * when known — e.g. "io.metamask", "app.phantom". Display-only; the proof is
   * still `linkedVia`. Absent for older/backfilled wallets → falls back to it.
   */
  rdns?: string;
  primary?: boolean;
  /**
   * Read-only STATE — tracked but not enabled for signing. Orthogonal to
   * provenance: a provider wallet (para/privy) can be read-only, while a pure
   * watch-only address uses `linkedVia: "read_only"`. Activation clears this.
   */
  readOnly?: boolean;
  /** The ACL — the committed desired signing mode. */
  desiredMode: SignerMode;
  /** Whether a live delegated grant currently backs `auto` (capability axis). */
  grantActive?: boolean;
  /** Human label for the backing grant's expiry, when relevant. */
  grantExpiresLabel?: string;
  /** Monotonic authorization_version (bumped by each committed permit). */
  authVersion: number;
  /** Audit label of the last permit that set the mode. */
  lastPermit?: string;
}

/**
 * A `delegated_approval` row — the capability axis. Its presence + validity is
 * what lets an `auto` ACL actually reconcile.
 */
export interface DelegationGrant {
  id: string;
  provider: string;
  /** What the grant is scoped to, e.g. "Solana · 8xKn…9QpS". */
  scope: string;
  kind: string;
  status: "active" | "expired" | "revoked";
  expiresLabel: string;
}

/** Section A row — a model or tool line from `llm_usage_events`. */
export interface UsageLineRow {
  label: string;
  detail?: string;
  amountUsd: number;
  /** BYOK / own-key turns: charged nothing, shown as a reassurance line. */
  free?: boolean;
}

/** Section B row — one transaction's fee leg from `user_transactions`. */
export interface UsageTxRow {
  label: string;
  chain: string;
  feeUsd: number;
}

/**
 * The monthly statement. The popup summary is a pure rollup of these rows:
 * AI & tools = sum(aiTools), On-chain fees = sum(onchain), Total = both.
 */
export interface UsageStatement {
  periodLabel: string;
  creditsUsed: number;
  creditsIncluded: number;
  byokTurns: number;
  settledVia: string;
  aiTools: UsageLineRow[];
  onchain: UsageTxRow[];
}

/**
 * Rich per-app usage fixture (mirrors `user-fixture.json` at the repo root).
 * A user is charged on three subjects — model, tool use, outcome — each
 * attributed to the app it ran under. The flat `usage` block above
 * (`UsageStatement`) is a drop-in-compatible rollup of the same data.
 */
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

/** `apps[].settings.modelKey` — how the app's model calls are billed. */
export type AppModelKey = "managed" | "byok";

export interface AppSettings {
  modelKey: AppModelKey;
  appByok: boolean;
  managedMarkupPct: number;
  note: string;
}

/** One model line within an app's Section A group (`apps[].model.byModel[]`). */
export interface AppModelRow {
  model: string;
  turns: number;
  inputTokens: number;
  outputTokens: number;
  baseUsd: number;
  chargedUsd: number;
  /** Present on BYOK-app model rows: "paid by {app}'s own key". */
  note?: string;
}

export interface AppModelUsage {
  baseUsd: number;
  markupPct: number;
  markupUsd: number;
  chargedUsd: number;
  /** false only for a BYOK app's model spend (Aomi doesn't bill it). */
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

/** One row of `apps[]` — everything one app charged the user this period. */
export interface AppUsageEntry {
  id: string;
  name: string;
  native: boolean;
  settings: AppSettings;
  model: AppModelUsage;
  /** null when the app has no tool calls this period. */
  tool: AppToolUsage | null;
  /** null when the app has no on-chain outcomes this period. */
  outcome: AppOutcomeUsage | null;
  appTotalUsd: number;
}

/** One row of the by-app matrix. `null` = subject not charged by this app. */
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

/** One calendar month of the statement — everything pre-rolled per month. */
export interface MonthlyStatement {
  period: UsagePeriod;
  summary: UsageSummaryTotals;
  payment: UsagePayment;
  apps: AppUsageEntry[];
  byApp: ByAppRow[];
  columnTotals: UsageColumnTotals;
}

/** The full statement fixture shape — matches `user-fixture.json` 1:1. */
export interface UsageFixtureData {
  account: UsageAccount;
  /** Newest month first. */
  months: MonthlyStatement[];
}

export interface ChatSnapshot {
  state: SessionState;
  account: Account;
  threads: Thread[];
  activeThreadId: string | null;
  trace: ToolStep[];
  walletRequest: WalletRequest | null;
  gate: Gate | null;
  settingsTab: SettingsTab | null;
}

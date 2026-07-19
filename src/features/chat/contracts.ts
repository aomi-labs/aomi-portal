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
export type Overlay = "none" | "wallet" | "settings";

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

/** Blocking gate fixture (§4: payment / required secrets). */
export interface Gate {
  kind: "payment" | "requiredSecret";
  message: string;
}

export type SettingsTab =
  | "general"
  | "usage"
  | "appKeys"
  | "bots"
  | "secrets"
  | "byok";

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

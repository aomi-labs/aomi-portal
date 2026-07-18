/**
 * Seed fixtures for the chat mock. Safe-to-fake data only (§8).
 *
 * NEVER put real .env, cookies, AccountBearer keys, JWTs, calldata,
 * signatures, app keys, or production IDs in here.
 */

import type {
  Account,
  ChatSnapshot,
  Thread,
  ToolStep,
} from "./contracts";

export const seedAccount: Account = {
  connected: false,
};

export const seedThreads: Thread[] = [
  {
    id: "thread-welcome",
    title: "New chat",
    updatedAt: Date.now(),
    messages: [],
  },
];

/** Example trace steps for the working state. Timing/craft TBD. */
export const seedTrace: ToolStep[] = [
  { id: "step-1", label: "Simulated tool step", status: "pending" },
];

export const suggestions: string[] = [
  // Placeholder prompts — real copy comes with the design reference.
  "Suggestion 1 (placeholder)",
  "Suggestion 2 (placeholder)",
  "Suggestion 3 (placeholder)",
  "Suggestion 4 (placeholder)",
];

export const initialSnapshot: ChatSnapshot = {
  state: "anonymous",
  account: seedAccount,
  threads: seedThreads,
  activeThreadId: seedThreads[0]?.id ?? null,
  trace: [],
  walletRequest: null,
  gate: null,
  settingsTab: null,
};

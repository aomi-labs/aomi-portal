/**
 * Seed fixtures for the chat mock. Safe-to-fake data only (§8).
 *
 * NEVER put real .env, cookies, AccountBearer keys, JWTs, calldata,
 * signatures, app keys, or production IDs in here.
 */

import type {
  Account,
  AccountOverview,
  DelegationGrant,
  Thread,
  ToolStep,
  TxPreview,
  UsageStatement,
  WalletPolicy,
} from "./contracts";

export const seedAccount: Account = {
  connected: true,
  address: "0x7a1f…4e9c",
  network: "Ethereum",
  credits: 1240,
};

export const seedAccountOverview: AccountOverview = {
  userId: "8641fa7c-c03c-47b4-89af-0230bad8cbf6",
  authType: "Wallet",
  primary: "Connected",
  address: "0x7a1f…4e9c",
  network: "Ethereum",
  tier: "free",
  status: "active",
  verifiedEmail: "cecilia@foameo.ai",
  createdAt: "Jun 26, 2026 · 7:04 PM",
  lastSeenAt: "Jul 21, 2026 · 8:46 PM",
  usage: {
    periodLabel: "July 2026",
    creditsUsed: 7.171,
    creditsIncluded: 500,
    inputTokens: 69652,
    outputTokens: 2247,
  },
};

/**
 * Wallet ACL fixtures — one row per `public_keys` record. Chosen to exercise
 * every reconciliation state: self-custody, provider-embedded manual,
 * auto reconciled (live grant), and auto drifted (grant expired).
 */
export const seedWalletPolicies: WalletPolicy[] = [
  {
    id: "w-siwe",
    chain: "evm",
    address: "0x71C7…3E2a",
    linkedVia: "siwe",
    rdns: "io.metamask",
    primary: true,
    desiredMode: "agent_sync",
    authVersion: 2,
    lastPermit: "you · Jul 12",
  },
  {
    id: "w-siws",
    chain: "svm",
    address: "9xQm…4kZ7",
    linkedVia: "siws",
    rdns: "app.phantom",
    desiredMode: "human_sync",
    authVersion: 1,
    lastPermit: "you · Jul 9",
  },
  {
    id: "w-privy",
    chain: "svm",
    address: "8xKn…9QpS",
    linkedVia: "privy",
    desiredMode: "auto",
    grantActive: true,
    grantExpiresLabel: "Aug 3, 2026",
    authVersion: 4,
    lastPermit: "you · Jul 20",
  },
  {
    id: "w-para",
    chain: "evm",
    address: "0x9f2B…A41c",
    linkedVia: "para",
    desiredMode: "auto",
    grantActive: false,
    grantExpiresLabel: "expired Jul 18",
    authVersion: 3,
    lastPermit: "you · Jul 2",
  },
  {
    // Deactivated-but-owned: a Privy wallet you froze. Still Privy, still keyed
    // — flip its mode to reactivate, no re-proof needed.
    id: "w-privy-locked",
    chain: "evm",
    address: "0x2E9a…B73c",
    linkedVia: "privy",
    desiredMode: "denied",
    authVersion: 2,
    lastPermit: "you · Jul 15",
  },
  {
    // Read-only STATE on a provider wallet: Para attests it, but it's not
    // enabled for signing yet. Keeps its PARA tag; Activate to enable it.
    id: "w-para-readonly",
    chain: "evm",
    address: "0x8B4d…F19a",
    linkedVia: "para",
    readOnly: true,
    desiredMode: "denied",
    authVersion: 1,
    lastPermit: "Jul 8",
  },
  {
    // Pure watch-only: a pasted address, no provider, no key.
    id: "w-readonly",
    chain: "evm",
    address: "0x40C3…7A1d",
    linkedVia: "read_only",
    desiredMode: "denied",
    authVersion: 1,
    lastPermit: "Jul 5",
  },
];

export const seedGrants: DelegationGrant[] = [
  {
    id: "g-privy",
    provider: "Privy",
    scope: "Solana · 8xKn…9QpS",
    kind: "session delegation",
    status: "active",
    expiresLabel: "Aug 3, 2026",
  },
  {
    id: "g-para",
    provider: "Para",
    scope: "Ethereum · 0x9f2B…A41c",
    kind: "session delegation",
    status: "expired",
    expiresLabel: "Jul 18, 2026",
  },
];

/**
 * Monthly usage statement. Detail rows sum exactly to the summary:
 * AI & tools = $30.34, on-chain fees = $42.75, total = $73.09.
 */
export const seedUsage: UsageStatement = {
  periodLabel: "July 2026",
  creditsUsed: 500,
  creditsIncluded: 500,
  byokTurns: 30,
  settledVia: "Coinbase x402",
  aiTools: [
    { label: "Opus 4.8", detail: "in 420k · out 38k", amountUsd: 18.2 },
    { label: "Sonnet 5", detail: "in 610k · out 45k", amountUsd: 7.9 },
    { label: "Haiku 4.5", detail: "in 280k · out 22k", amountUsd: 1.24 },
    { label: "Tool calls", detail: "142 calls", amountUsd: 3.0 },
    { label: "BYOK · your key", detail: "30 turns", amountUsd: 0, free: true },
  ],
  onchain: [
    { label: "Swap 0.5 ETH → USDC", chain: "Ethereum", feeUsd: 12.4 },
    { label: "Deploy ERC-20 token", chain: "Ethereum", feeUsd: 15.6 },
    { label: "Bridge USDC → Base", chain: "Base", feeUsd: 8.15 },
    { label: "Swap USDC → SOL", chain: "Solana", feeUsd: 4.3 },
    { label: "Approve USDC", chain: "Ethereum", feeUsd: 2.3 },
  ],
};

export const seedThreads: Thread[] = [
  {
    id: "t-swap",
    title: "Swap 0.5 ETH to USDC",
    updatedAt: Date.now(),
    messages: [{ id: "m1", role: "user", content: "Swap 0.5 ETH to USDC at the best rate", createdAt: Date.now() }],
  },
  { id: "t-balance", title: "Check my wallet balance", updatedAt: Date.now(), messages: [] },
  { id: "t-bridge", title: "Bridge to Base", updatedAt: Date.now(), messages: [] },
  { id: "t-deploy", title: "Deploy an ERC-20 token", updatedAt: Date.now(), messages: [] },
];

export const seedTrace: ToolStep[] = [
  { id: "s1", label: "Resolved tokens · ETH, USDC", status: "done" },
  {
    id: "s2",
    label: "Fetched best route across 6 DEXs",
    status: "done",
    tools: ["uniswap_v3.quote", "1inch.aggregate"],
  },
  { id: "s3", label: "Simulated transaction · no revert", status: "done" },
];

export const seedTx: TxPreview = {
  provider: "Uniswap v3",
  paySymbol: "ETH",
  payAmount: "0.5 ETH",
  receiveSymbol: "USDC",
  receiveAmount: "1,612.40 USDC",
  rate: "1 ETH = 3,224.8 USDC",
  slippage: "0.5%",
  gas: "~$3.10",
};

export const answerText =
  "Best route found on Uniswap v3. You’ll receive an estimated 1,612.40 USDC for 0.5 ETH. Review and approve in your wallet to continue.";

export type SuggestionKey = "swap" | "bridge" | "portfolio" | "deploy";

export const suggestions: { key: SuggestionKey; label: string }[] = [
  { key: "swap", label: "Swap 0.5 ETH to USDC" },
  { key: "bridge", label: "Bridge USDC to Base" },
  { key: "portfolio", label: "Check my portfolio" },
  { key: "deploy", label: "Deploy an ERC-20 token" },
];

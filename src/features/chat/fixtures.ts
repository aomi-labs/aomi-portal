/**
 * Seed fixtures for the chat mock. Safe-to-fake data only (§8).
 *
 * NEVER put real .env, cookies, AccountBearer keys, JWTs, calldata,
 * signatures, app keys, or production IDs in here.
 */

import type { Account, Thread, ToolStep, TxPreview } from "./contracts";

export const seedAccount: Account = {
  connected: true,
  address: "0x7a1f…4e9c",
  network: "Ethereum",
  credits: 1240,
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

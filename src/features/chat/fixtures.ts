/**
 * Seed fixtures for the chat mock. Safe-to-fake data only.
 */

import type {
  Account,
  CatalogItem,
  Gate,
  LinkedWallet,
  Thread,
  ToolStep,
  TxPreview,
  WalletOption,
} from "./contracts";
import { creditsRemaining, seedBilling } from "./billing-fixtures";

export const seedAccount: Account = {
  connected: true,
  address: "0x7a1f…4e9c",
  ens: "gordian.eth",
  network: "Ethereum",
  credits: creditsRemaining(seedBilling),
  creditCap: seedBilling.credit_paid,
  billing: seedBilling,
};

export const seedWallets: LinkedWallet[] = [
  {
    id: "w-rabby",
    name: "Rabby",
    chain: "evm",
    address: "0x7a1f…4e9c",
    status: "active",
  },
  {
    id: "w-phantom",
    name: "Phantom",
    chain: "solana",
    address: "7nK2…pQ9a",
    status: "linked",
  },
];

/**
 * App catalog — mirrors the portal's app-metadata.ts labels and categories.
 * `default` (Basic Apps) is the portal's real default; rows are backend-driven
 * in prod, so this is a representative authorized subset.
 */
export const apps: CatalogItem[] = [
  { id: "default", label: "Basic Apps", description: "Use curated apps by Aomi", group: "All", abbr: "All" },
  { id: "oneinch", label: "1inch", group: "DEX & Swaps", abbr: "1" },
  { id: "cow", label: "CoW Protocol", group: "DEX & Swaps", abbr: "CoW" },
  { id: "lifi", label: "LI.FI", group: "DEX & Swaps", abbr: "LF" },
  { id: "across", label: "Across", group: "DEX & Swaps", abbr: "A" },
  { id: "hyperliquid", label: "Hyperliquid", group: "Perps", abbr: "HL" },
  { id: "gmx", label: "GMX", group: "Perps", abbr: "G" },
  { id: "dydx", label: "dYdX", group: "Perps", abbr: "dY" },
  { id: "dune", label: "Dune", group: "Analytics", abbr: "D" },
  { id: "defillama", label: "DefiLlama", group: "Analytics", abbr: "DL" },
  { id: "polymarket", label: "Polymarket", group: "Prediction Markets", abbr: "P" },
  { id: "kalshi", label: "Kalshi", group: "Prediction Markets", abbr: "K" },
  { id: "morpho", label: "Morpho", group: "Lending & Yield", abbr: "M" },
  { id: "yearn", label: "Yearn", group: "Lending & Yield", abbr: "Y" },
  { id: "binance", label: "Binance", group: "Centralized Exchanges", abbr: "B" },
  { id: "okx", label: "OKX", group: "Centralized Exchanges", abbr: "O" },
  { id: "x", label: "X", group: "Social", abbr: "X" },
  { id: "kaito", label: "Kaito", group: "Social", abbr: "K" },
  { id: "zora", label: "Zora", group: "Other", abbr: "Z" },
];

/**
 * Model catalog — the portal shows `Auto` plus backend-driven raw model
 * strings grouped by vendor. This is a realistic fixture of that list.
 */
export const models: CatalogItem[] = [
  { id: "auto", label: "Auto", description: "Best balance of speed & cost" },
  { id: "claude-opus-4.8", label: "claude-opus-4.8", group: "Anthropic", abbr: "A" },
  { id: "claude-4.6-sonnet", label: "claude-4.6-sonnet", group: "Anthropic", abbr: "A" },
  { id: "claude-4.5-haiku", label: "claude-4.5-haiku", group: "Anthropic", abbr: "A" },
  { id: "gpt-5.2", label: "gpt-5.2", group: "OpenAI", abbr: "O" },
  { id: "gpt-4o-mini", label: "gpt-4o-mini", group: "OpenAI", abbr: "O" },
  { id: "gemini-2.5-pro", label: "gemini-2.5-pro", group: "Google", abbr: "G" },
  { id: "gemini-flash", label: "gemini-flash", group: "Google", abbr: "G" },
  { id: "llama-4-maverick", label: "llama-4-maverick", group: "Meta", abbr: "M" },
  { id: "mistral-large-3", label: "mistral-large-3", group: "Mistral", abbr: "Mi" },
  { id: "deepseek-v3.2", label: "deepseek-v3.2", group: "DeepSeek", abbr: "D" },
  { id: "grok-4", label: "grok-4", group: "xAI", abbr: "X" },
  { id: "kimi-k2", label: "kimi-k2", group: "Moonshot AI", abbr: "K" },
];

/**
 * Network catalog — the portal's exact runtime list (wallet-providers.tsx):
 * 8 visible mainnets and 5 networks behind "Show testnets".
 */
export const networks: CatalogItem[] = [
  { id: "ethereum", label: "Ethereum", description: "Chain 1 · default", group: "EVM" },
  { id: "arbitrum", label: "Arbitrum One", description: "Chain 42161", group: "EVM" },
  { id: "optimism", label: "OP Mainnet", description: "Chain 10", group: "EVM" },
  { id: "base", label: "Base", description: "Chain 8453", group: "EVM" },
  { id: "polygon", label: "Polygon", description: "Chain 137", group: "EVM" },
  { id: "linea", label: "Linea Mainnet", description: "Chain 59144", group: "EVM" },
  { id: "monad", label: "Monad", description: "Chain 143", group: "EVM" },
  { id: "solana-mainnet", label: "Solana Mainnet", description: "solana:mainnet", group: "SVM" },
  { id: "sepolia", label: "Sepolia", description: "Chain 11155111", group: "EVM", testnet: true },
  { id: "linea-sepolia", label: "Linea Sepolia Testnet", description: "Chain 59141", group: "EVM", testnet: true },
  { id: "monad-testnet", label: "Monad Testnet", description: "Chain 10143", group: "EVM", testnet: true },
  { id: "solana-devnet", label: "Solana Devnet", description: "solana:devnet", group: "SVM", testnet: true },
  { id: "solana-testnet", label: "Solana Testnet", description: "solana:testnet", group: "SVM", testnet: true },
];

/**
 * Wallet connect catalog — the portal's configured EVM connectors plus the
 * popular SVM allowlist, and Para quick sign-in ("Email or Google").
 */
export const walletOptions: WalletOption[] = [
  { id: "metamask", name: "MetaMask", family: "evm", status: "ready" },
  { id: "rabby", name: "Rabby", family: "evm", status: "ready" },
  { id: "coinbase", name: "Coinbase Wallet", family: "evm", status: "notInstalled" },
  { id: "walletconnect", name: "WalletConnect", family: "evm", status: "ready" },
  { id: "phantom", name: "Phantom", family: "svm", status: "ready" },
  { id: "solflare", name: "Solflare", family: "svm", status: "notInstalled" },
  { id: "backpack", name: "Backpack", family: "svm", status: "notInstalled" },
  { id: "glow", name: "Glow", family: "svm", status: "notInstalled" },
];

export const swapTrace: ToolStep[] = [
  { id: "s1", label: "Resolved tokens · ETH, USDC", status: "done" },
  {
    id: "s2",
    label: "Fetched best route across 6 DEXs",
    status: "done",
    tools: ["uniswap_v3.quote", "1inch.aggregate"],
  },
  { id: "s3", label: "Simulated transaction · no revert", status: "done" },
];

export const balanceTrace: ToolStep[] = [
  { id: "b1", label: "Connected wallet · 0x7a1f…4e9c", status: "done" },
  { id: "b2", label: "Fetched balances on Ethereum", status: "done", tools: ["eth_getBalance"] },
  { id: "b3", label: "Summarized positions", status: "done" },
];

export const bridgeTrace: ToolStep[] = [
  { id: "br1", label: "Resolved USDC on Ethereum → Base", status: "done" },
  { id: "br2", label: "Quoted official bridge route", status: "done", tools: ["bridge.quote"] },
  { id: "br3", label: "Prepared bridge transaction", status: "done" },
];

export const deployTrace: ToolStep[] = [
  { id: "d1", label: "Compiled AomiDemo ERC-20", status: "done" },
  { id: "d2", label: "Estimated deploy gas", status: "done" },
  { id: "d3", label: "Prepared deployment tx", status: "done" },
];

export const swapTx: TxPreview = {
  kind: "swap",
  provider: "Uniswap v3",
  title: "Swap preview",
  payLabel: "You pay",
  payAmount: "0.5 ETH",
  receiveLabel: "You receive (est.)",
  receiveAmount: "1,612.40 USDC",
  rate: "1 ETH = 3,224.8 USDC",
  slippage: "0.5%",
  gas: "~$3.10",
  status: "ready",
  approveLabel: "Approve in wallet",
};

export const balanceTx: TxPreview = {
  kind: "balances",
  provider: "Portfolio",
  title: "Balances",
  payLabel: "ETH",
  payAmount: "1.82 ETH",
  receiveLabel: "USDC",
  receiveAmount: "4,210 USDC",
  rate: "WETH 0.4",
  slippage: "61% USDC",
  gas: "Simulation",
  status: "ready",
  approveLabel: "Copy balances",
};

export const bridgeTx: TxPreview = {
  kind: "bridge",
  provider: "Official bridge",
  title: "Bridge preview",
  payLabel: "From Ethereum",
  payAmount: "100 USDC",
  receiveLabel: "To Base (est.)",
  receiveAmount: "99.96 USDC",
  rate: "~2 min arrival",
  slippage: "0.04%",
  gas: "~$0.40",
  status: "ready",
  approveLabel: "Approve bridge",
};

export const deployTx: TxPreview = {
  kind: "deploy",
  provider: "Ethereum",
  title: "Deploy preview",
  payLabel: "Token",
  payAmount: "AomiDemo",
  receiveLabel: "Supply",
  receiveAmount: "1,000,000",
  rate: "18 decimals",
  slippage: "—",
  gas: "~$12.40",
  status: "ready",
  approveLabel: "Approve deploy",
};

export const swapAnswer =
  "Best route found on Uniswap v3. You’ll receive an estimated 1,612.40 USDC for 0.5 ETH. Review and approve in your wallet to continue.";

export const balanceAnswer =
  "Across Ethereum you hold 1.82 ETH, 4,210 USDC, and 0.4 WETH. Largest position is USDC (~61%). Simulation only — balances are fixtures.";

export const bridgeAnswer =
  "Bridge quote ready: 100 USDC Ethereum → Base via official bridge. Est. arrival ~2 min. Fee ~$0.40. Simulation only.";

export const deployAnswer =
  "Ready to deploy AomiDemo (ERC-20) on Ethereum. Supply 1,000,000 · 18 decimals. Review the deployment tx before signing.";

/** Fixed timestamps — avoid SSR/client hydration mismatch from Date.now(). */
const now = 1_752_921_600_000;

export const seedThreads: Thread[] = [
  {
    id: "t-swap",
    title: "Swap 0.5 ETH to USDC",
    updatedAt: now,
    kind: "swap",
    messages: [
      {
        id: "m-swap-u",
        role: "user",
        content: "Swap 0.5 ETH to USDC at the best rate",
        createdAt: now - 8_000,
      },
    ],
    answer: swapAnswer,
    trace: swapTrace,
    tx: swapTx,
  },
  {
    id: "t-balance",
    title: "Check my wallet balance",
    updatedAt: now - 60_000,
    kind: "balance",
    messages: [
      {
        id: "m-bal-u",
        role: "user",
        content: "Show my wallet balances and positions",
        createdAt: now - 70_000,
      },
    ],
    answer: balanceAnswer,
    trace: balanceTrace,
    tx: balanceTx,
  },
  {
    id: "t-bridge",
    title: "Bridge to Base",
    updatedAt: now - 120_000,
    kind: "bridge",
    messages: [
      {
        id: "m-br-u",
        role: "user",
        content: "Bridge 100 USDC from Ethereum to Base",
        createdAt: now - 130_000,
      },
    ],
    answer: bridgeAnswer,
    trace: bridgeTrace,
    tx: bridgeTx,
  },
  {
    id: "t-deploy",
    title: "Deploy an ERC-20 token",
    updatedAt: now - 180_000,
    kind: "deploy",
    messages: [
      {
        id: "m-dep-u",
        role: "user",
        content: "Deploy a simple ERC-20 called AomiDemo",
        createdAt: now - 190_000,
      },
    ],
    answer: deployAnswer,
    trace: deployTrace,
    tx: deployTx,
  },
];

export type SuggestionKey = "swap" | "bridge" | "portfolio" | "deploy";

/** Portal-style suggestion copy, kept consistent with the seeded threads. */
export const suggestions: { key: SuggestionKey; label: string; threadId: string }[] = [
  { key: "portfolio", label: "Show my wallet balances and positions", threadId: "t-balance" },
  { key: "swap", label: "Swap 0.5 ETH to USDC with the best price", threadId: "t-swap" },
  { key: "bridge", label: "Bridge 100 USDC from Ethereum to Base", threadId: "t-bridge" },
  { key: "deploy", label: "Deploy an ERC-20 token", threadId: "t-deploy" },
];

export const commandItems = [
  {
    id: "choose-app",
    label: "Choose app",
    description: "Basic and authorized apps",
    action: "app" as const,
    shortcut: "⌘1",
  },
  {
    id: "switch-network",
    label: "Switch network",
    description: "EVM, Solana and testnets",
    action: "network" as const,
    shortcut: "⌘2",
  },
  {
    id: "manage-wallets",
    label: "Manage wallets",
    description: "Connect, link or switch active wallet",
    action: "wallets" as const,
    shortcut: "⌘3",
  },
  {
    id: "bots",
    label: "Bots",
    description: "Settings ›",
    action: "settings-bots" as const,
  },
  {
    id: "secrets",
    label: "Secrets & BYOK",
    description: "Settings ›",
    action: "settings-secrets" as const,
  },
  {
    id: "simulate-payment",
    label: "Simulate payment gate",
    description: "Credits exhausted · 402 moment",
    action: "simulate-payment" as const,
  },
  {
    id: "simulate-secret",
    label: "Simulate secret gate",
    description: "Required app secret missing",
    action: "simulate-secret" as const,
  },
];

export const secretGate: Gate = {
  kind: "requiredSecret",
  title: "Required secret missing",
  message:
    "Hyperliquid needs an API key before this order can continue. Simulation only — nothing is stored.",
  secretLabel: "Hyperliquid API key",
};

export function threadFixtureForPrompt(text: string): {
  kind: Thread["kind"];
  title: string;
  answer: string;
  trace: ToolStep[];
  tx: TxPreview | null;
} {
  const lower = text.toLowerCase();
  if (lower.includes("bridge")) {
    return {
      kind: "bridge",
      title: "Bridge to Base",
      answer: bridgeAnswer,
      trace: bridgeTrace.map((s) => ({ ...s, status: "pending" })),
      tx: { ...bridgeTx, status: "ready" },
    };
  }
  if (lower.includes("deploy") || lower.includes("erc-20") || lower.includes("token")) {
    return {
      kind: "deploy",
      title: "Deploy an ERC-20 token",
      answer: deployAnswer,
      trace: deployTrace.map((s) => ({ ...s, status: "pending" })),
      tx: { ...deployTx, status: "ready" },
    };
  }
  if (lower.includes("balance") || lower.includes("portfolio") || lower.includes("position")) {
    return {
      kind: "balance",
      title: "Check my wallet balance",
      answer: balanceAnswer,
      trace: balanceTrace.map((s) => ({ ...s, status: "pending" })),
      tx: { ...balanceTx, status: "ready" },
    };
  }
  return {
    kind: "swap",
    title: text.slice(0, 42) || "New chat",
    answer: swapAnswer,
    trace: swapTrace.map((s) => ({ ...s, status: "pending" })),
    tx: { ...swapTx, status: "ready" },
  };
}

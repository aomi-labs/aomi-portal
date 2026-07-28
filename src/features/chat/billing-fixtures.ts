/**
 * Billing fixtures — backend-shaped, simulation only.
 * Portal integration: replace imports with API responses; keep these types in contracts.ts.
 */

import type {
  AccountBillingSnapshot,
  Gate,
  PaymentMethodsFixture,
  UsageOverview,
} from "./contracts";

export const seedBilling: AccountBillingSnapshot = {
  tier: "free",
  period_utc_month: "2026-07",
  credit_used: 842,
  credit_paid: 1240,
  member_since: "Mar 2026",
};

export const seedUsageOverview: UsageOverview = {
  period_utc_from: "2026-07-01",
  period_utc_to: "2026-07-19",
  overall: {
    credit_used: 842,
    credit_paid: 1240,
    input_tokens: 1_200_000,
    output_tokens: 340_000,
  },
  apps: [
    {
      app: "Basic Apps",
      credits_used: 512,
      input_tokens: 740_000,
      output_tokens: 210_000,
      share_pct: 61,
    },
    {
      app: "Hyperliquid",
      credits_used: 210,
      input_tokens: 310_000,
      output_tokens: 90_000,
      share_pct: 25,
    },
    {
      app: "Polymarket",
      credits_used: 120,
      input_tokens: 150_000,
      output_tokens: 40_000,
      share_pct: 14,
    },
  ],
};

export const seedPaymentMethods: PaymentMethodsFixture = {
  quota: {
    status: "active",
    remaining: creditsRemaining(seedBilling),
    cap: seedBilling.credit_paid,
  },
  own_api_keys: [
    { provider: "OpenAI", key_prefix: "sk-…k9m2", active: true },
  ],
  wallet_pay: {
    status: "not_connected",
  },
};

export const paymentGate: Gate = {
  kind: "payment",
  title: "Need a way to pay for this turn",
  message:
    "Your free credits for this month are used up. Connect wallet pay, add your own model key, or review usage. Simulation only — no real charge.",
  paymentActions: ["connect_wallet", "use_own_key", "view_usage"],
};

export function creditsRemaining(billing: AccountBillingSnapshot): number {
  return Math.max(0, billing.credit_paid - billing.credit_used);
}

export function formatCompactTokens(total: number): string {
  if (total >= 1_000_000) {
    return `${(total / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (total >= 1_000) {
    return `${Math.round(total / 1_000)}k`;
  }
  return String(total);
}

export function formatUsagePeriod(from: string, to: string): string {
  const fmt = (iso: string) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };
  return `UTC · ${fmt(from)} – ${fmt(to)}, ${to.slice(0, 4)}`;
}

export function tierLabel(tier: string): string {
  if (!tier || tier === "free") return "Free";
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

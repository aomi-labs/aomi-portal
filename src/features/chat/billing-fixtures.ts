/**
 * Billing adapter — maps `user-fixture.json` to legacy portal-shaped exports.
 * Deprecated shim: delete in S6 when all consumers read `usage-fixture.ts` directly.
 */

import type {
  AccountBillingSnapshot,
  Gate,
  PaymentMethodsFixture,
  UsageOverview,
} from "./contracts";
import { usageFixture } from "./usage-fixture";

const month = usageFixture.months[0]!;
const allowance = month.payment.allowanceCredits;

function tokenTotals() {
  let input = 0;
  let output = 0;
  for (const app of month.apps) {
    for (const row of app.model.byModel) {
      input += row.inputTokens;
      output += row.outputTokens;
    }
  }
  return { input, output };
}

const tokens = tokenTotals();

export const seedBilling: AccountBillingSnapshot = {
  tier: usageFixture.account.tier,
  period_utc_month: month.period.from.slice(0, 7),
  credit_used: allowance.used,
  credit_paid: allowance.included,
  member_since: usageFixture.account.createdAt,
};

export const seedUsageOverview: UsageOverview = {
  period_utc_from: month.period.from,
  period_utc_to: month.period.to,
  overall: {
    credit_used: allowance.used,
    credit_paid: allowance.included,
    input_tokens: tokens.input,
    output_tokens: tokens.output,
  },
  apps: month.byApp.map((row) => ({
    app: row.app,
    credits_used: Math.round(row.totalUsd / 0.01),
    input_tokens: 0,
    output_tokens: 0,
    share_pct: Math.round((row.totalUsd / month.summary.totalUsd) * 100),
  })),
};

export const seedPaymentMethods: PaymentMethodsFixture = {
  quota: {
    status: allowance.used >= allowance.included ? "exhausted" : "active",
    remaining: creditsRemaining(seedBilling),
    cap: allowance.included,
  },
  own_api_keys: [{ provider: "OpenAI", key_prefix: "sk-…k9m2", active: true }],
  wallet_pay: {
    status: month.payment.x402SettledUsd > 0 ? "ready" : "not_connected",
  },
};

export const paymentGate: Gate = {
  kind: "payment",
  title: "Allowance used for this month",
  message: `Your ${allowance.included} credit allowance is used (${allowance.used}/${allowance.included}). Overflow settles via ${month.payment.settledVia}. Simulation only — no real charge.`,
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

"use client";

import Link from "next/link";
import { usageFixture } from "../usage-fixture";
import {
  AllowanceSettlementSection,
  MatrixTable,
  PeriodTotalHero,
  SectionHeading,
  SpendBreakdownSection,
  USAGE_MATRIX_HINT,
} from "./usage-shared";
import { ChevronDown } from "./icons";

/**
 * Settings › Usage — full Cecilia detail (summary, allowance, by-app matrix)
 * with product hierarchy: scan → understand settlement → drill by app → statement.
 */
export function UsageSettings() {
  const month = usageFixture.months[0]!;
  const { period, summary } = month;

  return (
    <div className="flex flex-col gap-6">
      <PeriodTotalHero periodLabel={period.periodLabel} totalUsd={summary.totalUsd} />

      <SpendBreakdownSection month={month} />

      <AllowanceSettlementSection month={month} />

      <section className="flex flex-col gap-2.5">
        <SectionHeading title="By app" hint={USAGE_MATRIX_HINT} />
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40 px-4 py-3 sm:px-5">
          <MatrixTable month={month} />
        </div>
      </section>

      <Link
        href="/statement"
        className="group flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface/40 px-4 py-3.5 transition-colors hover:bg-surface-2/40 sm:px-5"
      >
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-none">Full statement</span>
          <span className="text-[12px] leading-snug text-muted">
            Itemized lines, past months, and filters
          </span>
        </div>
        <ChevronDown
          size={14}
          className="-rotate-90 shrink-0 text-muted transition-colors group-hover:text-fg"
        />
      </Link>
    </div>
  );
}

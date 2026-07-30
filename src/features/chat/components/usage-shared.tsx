"use client";

import type { ReactNode } from "react";
import type {
  AppModelRow,
  AppOutcomeItem,
  AppToolItem,
  AppUsageEntry,
  MonthlyStatement,
  UsagePeriod,
} from "../contracts";
import { ExternalLink } from "./icons";

/* ---------------------------------------------------------------------- */
/* Formatting                                                              */
/* ---------------------------------------------------------------------- */

export function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function formatTokens(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(n);
}

const MODEL_NAMES: Record<string, string> = {
  "claude-opus-4-8": "Opus 4.8",
  "claude-sonnet-4-6": "Sonnet 4.6",
  "claude-haiku-4-5": "Haiku 4.5",
};

export function modelName(id: string): string {
  return MODEL_NAMES[id] ?? id;
}

export function truncateHex(value: string): string {
  return value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseYMD(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

export function formatShortDate(s: string): string {
  const { m, d } = parseYMD(s);
  return `${MONTHS[m - 1]} ${d}`;
}

export function formatPeriodRange(period: UsagePeriod): string {
  const from = parseYMD(period.from);
  const to = parseYMD(period.to);
  const issued = parseYMD(period.issued);
  const issuedStr = `${MONTHS[issued.m - 1]} ${issued.d}`;
  const range =
    from.y === to.y && from.m === to.m
      ? `${MONTHS[from.m - 1]} ${from.d}-${to.d}, ${to.y}`
      : `${MONTHS[from.m - 1]} ${from.d} - ${MONTHS[to.m - 1]} ${to.d}, ${to.y}`;
  return `${range} · issued ${issuedStr}`;
}

/** "Jul 2026" — compact month-pill label. */
export function monthShortLabel(period: UsagePeriod): string {
  const { y, m } = parseYMD(period.from);
  return `${MONTHS[m - 1]} ${y}`;
}

/** `byApp[].app` uses id-style keys for some apps ("default") and
 * name-style for others ("foo app") — match against either. */
export function findAppEntry(
  month: MonthlyStatement,
  key: string,
): AppUsageEntry | undefined {
  const norm = key.trim().toLowerCase();
  return month.apps.find(
    (a) => a.id === key || a.id.toLowerCase() === norm || a.name.toLowerCase() === norm,
  );
}

/* ---------------------------------------------------------------------- */
/* By-app matrix (frameless)                                               */
/* ---------------------------------------------------------------------- */

const MATRIX_COLS = "grid-cols-[1fr_96px_96px_96px_96px]";

export function MatrixTable({
  month,
  appId,
}: {
  month: MonthlyStatement;
  /** When set (and not "all"), show only that app's row and hide the total. */
  appId?: string;
}) {
  const filtered = !appId || appId === "all";
  const rows = month.byApp.filter(
    (r) => filtered || findAppEntry(month, r.app)?.id === appId,
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[540px]">
        <div
          className={`grid ${MATRIX_COLS} items-center gap-2 border-b border-border pb-2 text-[10px] font-medium uppercase tracking-wide text-muted`}
        >
          <span>App</span>
          <span className="text-right">model</span>
          <span className="text-right">tool use</span>
          <span className="text-right">outcome</span>
          <span className="text-right">total</span>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {rows.map((row) => {
            const entry = findAppEntry(month, row.app);
            const txns = entry?.outcome?.txns ?? 0;
            return (
              <div
                key={row.app}
                className={`grid ${MATRIX_COLS} items-center gap-2 py-3`}
              >
                <span className="truncate text-[13px]">{row.app}</span>
                <MatrixCell
                  value={row.modelUsd}
                  tooltip={entry ? `${entry.model.turns} turns` : undefined}
                  chip={entry?.settings.appByok ? "app key" : undefined}
                />
                <MatrixCell
                  value={row.toolUsd}
                  tooltip={entry?.tool ? `${entry.tool.calls} calls` : undefined}
                />
                <MatrixCell
                  value={row.outcomeUsd}
                  tooltip={
                    entry?.outcome
                      ? `${txns} transaction${txns === 1 ? "" : "s"} · ${entry.outcome.items[0]?.bps ?? 0} bps`
                      : undefined
                  }
                />
                <span className="text-right font-mono text-[13px] font-semibold">
                  {usd(row.totalUsd)}
                </span>
              </div>
            );
          })}
        </div>
        {filtered && (
          <div
            className={`grid ${MATRIX_COLS} items-center gap-2 border-t border-border py-3`}
          >
            <span className="text-[13px] font-semibold">Total</span>
            <span className="text-right font-mono text-[13px] font-semibold">
              {usd(month.columnTotals.modelUsd)}
            </span>
            <span className="text-right font-mono text-[13px] font-semibold">
              {usd(month.columnTotals.toolUsd)}
            </span>
            <span className="text-right font-mono text-[13px] font-semibold">
              {usd(month.columnTotals.outcomeUsd)}
            </span>
            <span className="text-right font-mono text-[13px] font-semibold">
              {usd(month.columnTotals.totalUsd)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixCell({
  value,
  tooltip,
  chip,
}: {
  value: number | null;
  tooltip?: string;
  chip?: string;
}) {
  if (value === null) {
    return <span className="text-right text-[13px] text-muted">-</span>;
  }
  return (
    <div className="group relative flex justify-end">
      <span className="flex items-center gap-1.5 text-right font-mono text-[13px]">
        {usd(value)}
        {chip && (
          <span className="whitespace-nowrap rounded-pill border border-border bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted">
            {chip}
          </span>
        )}
      </span>
      {tooltip && (
        <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-1.5 hidden whitespace-nowrap rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2.5 py-1.5 text-[11px] text-fg shadow-[0_8px_24px_rgba(0,0,0,0.45)] group-hover:block">
          {tooltip}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Itemized building blocks                                                */
/* ---------------------------------------------------------------------- */

export const MODEL_COLS = "grid-cols-[1fr_140px_60px_90px_120px]";
export const OUTCOME_COLS =
  "grid-cols-[60px_minmax(160px,1fr)_90px_70px_150px_90px_140px]";

export function StatementSection({
  title,
  subtitle,
  total,
  children,
}: {
  title: string;
  subtitle: string;
  total: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold">{title}</span>
          <span className="text-[11px] text-muted">{subtitle}</span>
        </div>
        <span className="font-mono text-[13px] font-semibold">{total}</span>
      </div>
      {children}
    </div>
  );
}

export function AppGroup({
  app,
  showModels = true,
  showTools = true,
}: {
  app: AppUsageEntry;
  showModels?: boolean;
  showTools?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 bg-surface-2/40 px-4 py-2">
        <span className="text-[13px] font-semibold">{app.name}</span>
        <SettingsChip app={app} />
      </div>
      <div className="flex flex-col divide-y divide-border">
        {showModels &&
          app.model.byModel.map((row) => (
            <ModelRow key={row.model} app={app} row={row} />
          ))}
        {showTools && app.tool && (
          <>
            <div className="bg-surface-2/20 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              Tool calls
            </div>
            {app.tool.items.map((item) => (
              <ToolRow key={item.tool} item={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export function SettingsChip({ app }: { app: AppUsageEntry }) {
  if (app.native) return <Chip>native · base</Chip>;
  if (app.settings.appByok) return <Chip>app key · model free</Chip>;
  return <Chip accent>{`managed · +${app.settings.managedMarkupPct}%`}</Chip>;
}

export function Chip({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-pill border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
        accent
          ? "border-border bg-surface-2 text-fg"
          : "border-border bg-surface-2 text-muted"
      }`}
    >
      {children}
    </span>
  );
}

export function ModelRow({ app, row }: { app: AppUsageEntry; row: AppModelRow }) {
  const isByok = app.settings.appByok;
  const hasMarkup = !isByok && row.baseUsd !== row.chargedUsd;

  return (
    <>
      <div className={`grid ${MODEL_COLS} items-center gap-2 px-4 py-2.5`}>
        <span className="text-[13px]">{modelName(row.model)}</span>
        <span className="font-mono text-[11px] text-muted">
          in {formatTokens(row.inputTokens)} · out {formatTokens(row.outputTokens)}
        </span>
        <span className="text-right font-mono text-[13px] text-muted">{row.turns}</span>
        <span className={`text-right font-mono text-[13px] ${isByok ? "text-muted" : ""}`}>
          {usd(row.baseUsd)}
        </span>
        <span className="flex items-center justify-end gap-1.5">
          {isByok ? (
            <span className="text-[13px] text-success">free</span>
          ) : (
            <>
              <span className="font-mono text-[13px] font-medium">{usd(row.chargedUsd)}</span>
              {hasMarkup && <Chip accent>{`+${app.settings.managedMarkupPct}%`}</Chip>}
            </>
          )}
        </span>
      </div>
      {isByok && row.note && (
        <div className="-mt-1.5 px-4 pb-2 text-[11px] text-muted">{row.note}</div>
      )}
    </>
  );
}

export function ToolRow({ item }: { item: AppToolItem }) {
  return (
    <div className="grid grid-cols-[1fr_80px_80px_90px] items-center gap-2 px-4 py-2.5">
      <span className="font-mono text-[13px]">{item.tool}</span>
      <span className="text-right text-[13px] text-muted">{item.calls} calls</span>
      <span className="text-right text-[13px] text-muted">{item.unitCredits} cr</span>
      <span className="text-right font-mono text-[13px]">{usd(item.usd)}</span>
    </div>
  );
}

export function OutcomeTable({
  pairs,
}: {
  pairs: { app: AppUsageEntry; item: AppOutcomeItem }[];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px] divide-y divide-border">
        <div
          className={`grid ${OUTCOME_COLS} gap-2 border-b border-border bg-surface-2/30 px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-muted`}
        >
          <span>Date</span>
          <span>App · action</span>
          <span className="text-right">Flow</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Fee</span>
          <span className="text-right">Chain</span>
          <span className="text-right">Tx</span>
        </div>
        {pairs.map(({ app, item }, i) => (
          <div
            key={`${app.id}-${i}`}
            className={`grid ${OUTCOME_COLS} items-center gap-2 px-4 py-2.5`}
          >
            <span className="text-[13px] text-muted">{formatShortDate(item.date)}</span>
            <span className="truncate text-[13px]">
              {app.name} · {item.action}
            </span>
            <span className="text-right font-mono text-[13px]">{item.flow}</span>
            <span className="text-right text-[13px] text-muted">{item.bps} bps</span>
            <span className="text-right font-mono text-[13px]">
              {item.feeToken}
              <span className="block text-[11px] text-muted">{usd(item.usd)}</span>
            </span>
            <span className="justify-self-end rounded-[var(--radius-sm)] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">
              {item.chain}
            </span>
            <span className="flex items-center justify-end gap-1 font-mono text-[11px] text-muted transition-colors hover:text-fg">
              {truncateHex(item.tx)}
              <ExternalLink size={11} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Stat tile (Usage + Statement)                                           */
/* ---------------------------------------------------------------------- */

export function StatTile({
  label,
  value,
  detail,
  primary,
}: {
  label: string;
  value: string;
  detail?: string;
  primary?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-background/40 px-3 py-3 sm:px-4 sm:py-3.5">
      <span className="truncate text-[11px] text-muted">{label}</span>
      <span
        className={`truncate font-mono font-semibold tabular-nums ${
          primary ? "text-lg sm:text-xl" : "text-base sm:text-lg"
        }`}
      >
        {value}
      </span>
      {detail && <span className="truncate text-[10px] text-muted">{detail}</span>}
    </div>
  );
}

export const USAGE_MATRIX_HINT =
  "Hover a cell for counts · — means not billed · $0 + app key = app BYOK";

export function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 px-0.5">
      <span className="text-sm font-medium leading-none">{title}</span>
      {hint && <span className="text-[11px] text-muted">{hint}</span>}
    </div>
  );
}

export function PeriodTotalHero({
  periodLabel,
  totalUsd,
  periodCaption = "Current period",
}: {
  periodLabel: string;
  totalUsd: number;
  periodCaption?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0 flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
          {periodCaption}
        </span>
        <span className="text-lg font-semibold leading-none tracking-[-0.01em]">{periodLabel}</span>
      </div>
      <div className="shrink-0 text-right">
        <span className="font-mono text-2xl font-semibold tabular-nums leading-none">
          {usd(totalUsd)}
        </span>
        <span className="mt-1 block text-[11px] text-muted">Total spend</span>
      </div>
    </div>
  );
}

function monthActivityStats(month: MonthlyStatement) {
  const turns = month.apps.reduce((s, a) => s + a.model.turns, 0);
  const toolCalls = month.apps.reduce((s, a) => s + (a.tool?.calls ?? 0), 0);
  const txns = month.apps.reduce((s, a) => s + (a.outcome?.txns ?? 0), 0);
  const { payment, summary } = month;
  const over = payment.x402SettledUsd > 0;
  const creditsPct = Math.min(
    100,
    (payment.allowanceCredits.used / payment.allowanceCredits.included) * 100,
  );
  const computeShare = Math.round((summary.computeUsd / summary.totalUsd) * 100);
  const onchainShare = 100 - computeShare;

  return { turns, toolCalls, txns, over, creditsPct, computeShare, onchainShare };
}

export function SpendBreakdownSection({ month }: { month: MonthlyStatement }) {
  const { summary } = month;
  const { turns, toolCalls, txns, computeShare, onchainShare } = monthActivityStats(month);

  return (
    <section className="flex flex-col gap-2.5">
      <SectionHeading
        title="Spend breakdown"
        hint={`${computeShare}% compute · ${onchainShare}% on-chain`}
      />
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <StatTile label="Models" value={usd(summary.modelUsd)} detail={`${turns} turns`} />
        <StatTile label="Tool calls" value={usd(summary.toolUsd)} detail={`${toolCalls} calls`} />
        <StatTile
          label="On-chain"
          value={usd(summary.onchainUsd)}
          detail={`${txns} txn${txns === 1 ? "" : "s"}`}
        />
      </div>
      <p className="px-0.5 text-[12px] leading-snug text-muted">
        Compute subtotal {usd(summary.computeUsd)} (models + tools)
        {summary.managedMarkupUsd > 0 && (
          <> · includes {usd(summary.managedMarkupUsd)} managed markup on third-party apps</>
        )}
        . On-chain fees settle separately in-token on your transactions.
      </p>
    </section>
  );
}

export function AllowanceSettlementSection({ month }: { month: MonthlyStatement }) {
  const { payment } = month;
  const { over, creditsPct } = monthActivityStats(month);

  return (
    <section className="flex flex-col gap-2.5">
      <SectionHeading title="Allowance & settlement" />
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
          <span className="text-[13px] font-medium text-fg">Monthly credits</span>
          <span className="text-[13px] tabular-nums text-muted">
            {payment.allowanceCredits.used.toLocaleString()} /{" "}
            {payment.allowanceCredits.included.toLocaleString()} used
          </span>
        </div>
        <div className="flex flex-col gap-2.5 px-4 py-3.5 sm:px-5">
          <Meter pct={creditsPct} over={over} />
          <span className="text-[12px] leading-snug text-muted">
            Paid via {payment.settledVia}.{" "}
            {over
              ? `${usd(payment.x402SettledUsd)} billed via x402 beyond your ${usd(
                  payment.allowanceAppliedUsd,
                )} monthly allowance.`
              : `Compute fully covered by your allowance (${usd(
                  payment.allowanceAppliedUsd,
                )} applied).`}
            {" "}
            On-chain fees {payment.onchainNote}.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Meter                                                                   */
/* ---------------------------------------------------------------------- */

export function Meter({ pct, over }: { pct: number; over?: boolean }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-pill bg-surface-2">
      <div
        className={`h-full rounded-pill transition-[width] ${
          over ? "bg-fg/70" : "bg-fg/45"
        }`}
        style={{ width: `${Math.max(pct, 2)}%` }}
      />
    </div>
  );
}

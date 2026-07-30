"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { MonthlyStatement } from "../contracts";
import { usageFixture } from "../usage-fixture";
import { ArrowLeft, Check, ChevronDown } from "./icons";
import {
  AllowanceSettlementSection,
  AppGroup,
  MatrixTable,
  MODEL_COLS,
  monthShortLabel,
  OutcomeTable,
  SectionHeading,
  SpendBreakdownSection,
  StatementSection,
  USAGE_MATRIX_HINT,
  usd,
} from "./usage-shared";

type View = "byApp" | "itemized";
type Subject = "all" | "model" | "tool" | "onchain";

const SUBJECTS: { id: Subject; label: string }[] = [
  { id: "all", label: "All" },
  { id: "model", label: "Models" },
  { id: "tool", label: "Tool calls" },
  { id: "onchain", label: "On-chain" },
];

/**
 * /statement — full usage statement: month picker, itemized audit, filters.
 * Top summary band matches Settings › Usage; detail below is statement-only.
 */
export function StatementView() {
  const { account, months } = usageFixture;
  const [monthIdx, setMonthIdx] = useState(0);
  const [view, setView] = useState<View>("byApp");
  const [appFilter, setAppFilter] = useState<string>("all");
  const [subject, setSubject] = useState<Subject>("all");

  const month = months[monthIdx]!;
  const { summary } = month;

  const selectMonth = (idx: number) => {
    setMonthIdx(idx);
    setAppFilter("all");
    setSubject("all");
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-background font-sans text-fg">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
          <header className="flex flex-col gap-5">
            <Link
              href="/"
              className="flex w-fit items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft size={14} />
              Back to chat
            </Link>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold tracking-tight">Usage statement</h1>
              <span className="text-[13px] text-muted">
                {account.handle} ·{" "}
                <span className="font-mono">
                  {account.address.slice(0, 6)}…{account.address.slice(-4)}
                </span>
              </span>
            </div>

            <StatementPeriodHero totalUsd={summary.totalUsd}>
              <Dropdown
                value={String(monthIdx)}
                options={months.map((m, i) => ({
                  id: String(i),
                  label: monthShortLabel(m.period),
                }))}
                onChange={(id) => selectMonth(Number(id))}
              />
            </StatementPeriodHero>
          </header>

          <SpendBreakdownSection month={month} />

          <AllowanceSettlementSection month={month} />

          <section className="flex flex-col gap-3">
            <SectionHeading
              title="Statement detail"
              hint={view === "byApp" ? "Pivot by app" : "Line-by-line audit"}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-full border border-border p-[3px]">
                {(["byApp", "itemized"] as View[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`rounded-full px-3.5 py-[6px] text-xs font-medium transition-colors ${
                      view === v ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {v === "byApp" ? "By app" : "Itemized"}
                  </button>
                ))}
              </div>

              <Dropdown
                value={appFilter}
                options={[
                  { id: "all", label: "All apps" },
                  ...month.apps.map((app) => ({ id: app.id, label: app.name })),
                ]}
                onChange={setAppFilter}
              />
            </div>

            {view === "itemized" && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] uppercase tracking-wide text-muted">Subject</span>
                {SUBJECTS.map((s) => (
                  <FilterChip
                    key={s.id}
                    active={subject === s.id}
                    onClick={() => setSubject(s.id)}
                  >
                    {s.label}
                  </FilterChip>
                ))}
              </div>
            )}

            {view === "byApp" ? (
              <div className="flex flex-col gap-2.5">
                <SectionHeading title="By app" hint={USAGE_MATRIX_HINT} />
                <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-background/40 px-4 py-2 sm:px-5">
                  <div className="py-2">
                    <MatrixTable month={month} appId={appFilter} />
                  </div>
                </div>
              </div>
            ) : (
              <ItemizedContent month={month} appFilter={appFilter} subject={subject} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatementPeriodHero({
  totalUsd,
  children,
}: {
  totalUsd: number;
  children: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0 flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
          Statement period
        </span>
        {children}
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

function ItemizedContent({
  month,
  appFilter,
  subject,
}: {
  month: MonthlyStatement;
  appFilter: string;
  subject: Subject;
}) {
  const { summary, period } = month;

  const showModels = subject === "all" || subject === "model";
  const showTools = subject === "all" || subject === "tool";
  const showOnchain = subject === "all" || subject === "onchain";
  const filtersActive = appFilter !== "all" || subject !== "all";

  const visibleApps = month.apps.filter((a) => appFilter === "all" || a.id === appFilter);

  const computeApps = visibleApps.filter(
    (a) => (showModels && a.model.byModel.length > 0) || (showTools && a.tool !== null),
  );
  const sectionATotal = visibleApps.reduce(
    (s, a) =>
      s +
      (showModels ? a.model.chargedUsd : 0) +
      (showTools ? (a.tool?.chargedUsd ?? 0) : 0),
    0,
  );

  const outcomePairs = showOnchain
    ? visibleApps.flatMap((a) => (a.outcome?.items ?? []).map((item) => ({ app: a, item })))
    : [];
  const sectionBTotal = showOnchain
    ? visibleApps.reduce((s, a) => s + (a.outcome?.chargedUsd ?? 0), 0)
    : 0;

  const showSectionA = (showModels || showTools) && computeApps.length > 0;
  const showSectionB = showOnchain && outcomePairs.length > 0;

  if (!showSectionA && !showSectionB) {
    return (
      <div className="rounded-[var(--radius-md)] border border-border bg-background/40 px-4 py-10 text-center text-[13px] text-muted">
        No items match these filters.
      </div>
    );
  }

  const aomiTotal = month.apps.reduce(
    (s, a) => s + (a.native ? a.model.chargedUsd : a.settings.appByok ? 0 : a.model.baseUsd),
    0,
  );
  const appRecipients = month.apps
    .filter((a) => !a.native)
    .map((a) => ({
      name: a.name,
      amount: (a.tool?.chargedUsd ?? 0) + (a.outcome?.chargedUsd ?? 0),
    }))
    .filter((a) => a.amount > 0);

  return (
    <div className="flex flex-col gap-5">
      {showSectionA && (
        <StatementSection
          title="Compute · off-chain"
          subtitle="AI models + app tool calls, in credits"
          total={usd(sectionATotal)}
        >
          {showModels && (
            <div
              className={`grid ${MODEL_COLS} gap-2 border-b border-border bg-surface-2/30 px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-muted`}
            >
              <span>Model</span>
              <span>Detail</span>
              <span className="text-right">Turns</span>
              <span className="text-right">Base</span>
              <span className="text-right">Charged</span>
            </div>
          )}
          <div className="flex flex-col divide-y divide-border">
            {computeApps.map((app) => (
              <AppGroup key={app.id} app={app} showModels={showModels} showTools={showTools} />
            ))}
          </div>
        </StatementSection>
      )}

      {showSectionB && (
        <StatementSection
          title="On-chain fees"
          subtitle="paid in the flowed token, on your own transactions"
          total={usd(sectionBTotal)}
        >
          <OutcomeTable pairs={outcomePairs} />
        </StatementSection>
      )}

      <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-background/40 px-4 py-3.5">
        <span className="text-sm font-semibold">
          {filtersActive ? "Filtered total" : `Total · ${period.periodLabel}`}
        </span>
        <span className="font-mono text-base font-semibold tabular-nums">
          {usd(filtersActive ? sectionATotal + sectionBTotal : summary.totalUsd)}
        </span>
      </div>

      {!filtersActive && (
        <div className="flex flex-col gap-2.5 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
          <span className="text-[13px] font-semibold">Where your money went</span>
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span>Aomi · model compute on managed/native</span>
              <span className="font-mono tabular-nums">{usd(aomiTotal)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span>The apps · tool + outcome fees</span>
              <div className="flex flex-col gap-1 border-l border-border pl-3">
                {appRecipients.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-muted">
                    <span>{a.name}</span>
                    <span className="font-mono tabular-nums text-fg">{usd(a.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-muted">
              <span>Your model provider</span>
              <span>None (would show for BYOK)</span>
            </div>
          </div>
          <span className="text-[11px] text-muted">
            These tool and outcome fees also appear on the apps&apos; own builder statements as
            Aomi&apos;s take.
          </span>
        </div>
      )}
    </div>
  );
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border px-3.5 py-[7px] text-xs font-medium text-fg transition-colors hover:bg-surface-2/60"
      >
        {current?.label}
        <ChevronDown
          size={12}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <button
            aria-label="Close menu"
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 cursor-default"
          />
          <div className="absolute left-0 top-full z-30 mt-1.5 min-w-[160px] overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-2 py-1 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
            {options.map((o) => {
              const selected = o.id === value;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] transition-colors hover:bg-surface ${
                    selected ? "font-medium text-fg" : "text-muted"
                  }`}
                >
                  {o.label}
                  {selected && <Check size={13} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-[5px] text-xs transition-colors ${
        active
          ? "border-transparent bg-surface-2 font-medium text-fg"
          : "border-border text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

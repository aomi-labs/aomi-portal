"use client";

import { useEffect, useState } from "react";
import type { ToolStep } from "../contracts";
import { Check, ChevronRight } from "./icons";

/** ~5 steps visible; scroll for more (matches portal working window). */
const WORKING_WINDOW_PX = 260;

interface WorkingTraceProps {
  durationLabel: string;
  steps: ToolStep[];
  busy?: boolean;
}

/**
 * Inline working trace — portal pattern.
 * Light disclosure on the chat canvas; not a bordered card (tx preview owns elevation).
 */
export function WorkingTrace({ durationLabel, steps, busy }: WorkingTraceProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (busy) setOpen(true);
  }, [busy]);

  const running = Boolean(busy);
  const headerLabelClass =
    running && !open
      ? "aui-working-shimmer font-medium text-fg"
      : running && open
        ? "font-medium text-muted"
        : "text-muted";

  const showEdgeFades = open && steps.length > 4;

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-left text-sm"
      >
        <ChevronRight
          size={14}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
        <span className={headerLabelClass}>{durationLabel}</span>
        {!open && (
          <span className="font-mono text-[11px] leading-none text-muted/80">
            {steps.length} steps
          </span>
        )}
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="relative mt-1.5">
            {showEdgeFades && (
              <>
                <span
                  aria-hidden
                  className="aui-working-trace-edge-fade-top pointer-events-none absolute inset-x-0 top-0 z-20 h-12"
                />
                <span
                  aria-hidden
                  className="aui-working-trace-edge-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12"
                />
              </>
            )}
            <div
              className="aui-working-trace-scroll overflow-y-auto"
              style={{ maxHeight: WORKING_WINDOW_PX }}
            >
              <div className="relative isolate ml-1 flex flex-col text-sm">
                {steps.length > 1 && (
                  <span
                    aria-hidden
                    className="absolute bottom-3.5 left-[7px] top-3.5 w-px bg-border"
                  />
                )}
                {steps.map((step, index) => {
                  const active =
                    running &&
                    index === steps.length - 1 &&
                    (step.status === "running" || step.status === "pending");
                  return (
                    <TraceStep key={step.id} step={step} active={active} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TraceStep({ step, active }: { step: ToolStep; active: boolean }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const hasDetail = Boolean(step.result);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        disabled={!hasDetail}
        onClick={() => hasDetail && setDetailOpen((v) => !v)}
        className="flex w-full items-start gap-2 py-1 text-left disabled:cursor-default"
      >
        <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center bg-background">
          <StepIcon status={step.status} active={active} />
        </span>
        <span className="min-w-0 flex-1">
          <StepLabel label={step.label} active={active} />
        </span>
        {hasDetail && (
          <ChevronRight
            size={12}
            className={`mt-1 shrink-0 text-muted/60 transition-transform ${
              detailOpen ? "rotate-90" : ""
            }`}
          />
        )}
      </button>

      {step.tools && step.tools.length > 0 && (
        <div className="mb-1 ml-6 flex max-w-full flex-wrap items-center gap-1.5">
          {step.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex max-w-full min-w-0 items-center rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] leading-4 text-fg/80"
            >
              <span className="truncate tabular-nums">{tool}</span>
            </span>
          ))}
        </div>
      )}

      {detailOpen && step.result && (
        <pre className="mb-1 ml-6 overflow-x-auto whitespace-pre-wrap break-words rounded-md border border-border/60 bg-muted/40 p-2 font-mono text-xs leading-relaxed text-muted">
          {step.result}
        </pre>
      )}
    </div>
  );
}

function StepIcon({
  status,
  active,
}: {
  status: ToolStep["status"];
  active: boolean;
}) {
  if (status === "running" || active) {
    return (
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    );
  }
  if (status === "error") {
    return <span className="h-2 w-2 rounded-full bg-[var(--aomi-danger-500)]" />;
  }
  if (status === "done") {
    return <Check size={14} className="text-success" />;
  }
  return <span className="h-2 w-2 rounded-full bg-border" />;
}

function StepLabel({ label, active }: { label: string; active: boolean }) {
  const dot = label.indexOf(" · ");
  const head = dot >= 0 ? label.slice(0, dot) : label;
  const tail = dot >= 0 ? label.slice(dot + 3) : null;

  return (
    <p
      className={`text-[13px] leading-snug ${
        active ? "aui-working-shimmer font-medium" : "text-fg"
      }`}
    >
      <span className={active ? "" : "font-medium"}>{head}</span>
      {tail && (
        <>
          <span className="text-muted"> · </span>
          <span className="text-muted">{tail}</span>
        </>
      )}
    </p>
  );
}

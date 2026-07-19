"use client";

import { useState } from "react";
import type { ToolStep } from "../contracts";
import { Check, ChevronDown, ChevronUp } from "./icons";

interface WorkingTraceProps {
  durationLabel: string;
  steps: ToolStep[];
}

export function WorkingTrace({ durationLabel, steps }: WorkingTraceProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-2.5 bg-surface px-3.5 text-left"
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <Check size={15} className="text-success" />
        </span>
        <span className="truncate text-[13px] font-medium leading-none">{durationLabel}</span>
        <span className="shrink-0 font-mono text-[11px] leading-none text-muted">
          {steps.length} steps
        </span>
        <span className="flex-1" />
        {open ? (
          <ChevronUp size={14} className="shrink-0 text-muted" />
        ) : (
          <ChevronDown size={14} className="shrink-0 text-muted" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-border px-3.5 py-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-2.5">
              {/* Fixed icon lane — keeps labels vertically aligned */}
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                <Check size={14} className="text-success" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="truncate font-mono text-[13px] leading-snug">{step.label}</span>
                {step.tools && (
                  <div className="flex flex-wrap gap-1.5">
                    {step.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex h-6 max-w-full items-center gap-1.5 rounded-full bg-surface-2 px-2"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span className="truncate font-mono text-[11px] leading-none text-muted">
                          {tool}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

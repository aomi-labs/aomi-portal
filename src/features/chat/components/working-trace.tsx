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
        className="flex items-center gap-2.5 bg-surface px-3.5 py-[11px] text-left"
      >
        <Check size={14} className="text-success" />
        <span className="text-[13px] font-medium">{durationLabel}</span>
        <span className="font-mono text-xs text-muted">{steps.length} steps</span>
        <span className="flex-1" />
        {open ? (
          <ChevronUp size={14} className="text-muted" />
        ) : (
          <ChevronDown size={14} className="text-muted" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-border px-3.5 pb-3.5 pt-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-2.5">
              <Check size={14} className="mt-0.5 flex-shrink-0 text-success" />
              <div className="flex min-w-0 flex-col gap-2">
                <span className="font-mono text-[13px]">{step.label}</span>
                {step.tools && (
                  <div className="flex flex-wrap gap-1.5">
                    {step.tools.map((tool) => (
                      <span
                        key={tool}
                        className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1"
                      >
                        <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                        <span className="font-mono text-xs text-muted">{tool}</span>
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

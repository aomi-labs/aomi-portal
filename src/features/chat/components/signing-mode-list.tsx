"use client";

import type { LinkedVia, SignerMode } from "../contracts";
import {
  SIGNER_MODES,
  modeValidFor,
  unavailableReason,
} from "../account-reconcile";

interface SigningModeListProps {
  linkedVia: LinkedVia;
  selected: SignerMode;
  pending: boolean;
  inset?: boolean;
  onSelect: (mode: SignerMode) => void;
}

export function SigningModeList({
  linkedVia,
  selected,
  pending,
  inset = false,
  onSelect,
}: SigningModeListProps) {
  return (
    <div
      className={`flex flex-col divide-y divide-border rounded-[var(--radius-md)] ${
        inset ? "bg-surface-2/35" : "border border-border"
      }`}
    >
      {SIGNER_MODES.map((mode) => {
        const valid = modeValidFor(linkedVia, mode.id);
        const isSelected = selected === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            disabled={!valid}
            onClick={() => onSelect(mode.id)}
            className={`flex items-start gap-3 px-4 py-3 text-left transition-colors ${
              isSelected ? "bg-surface-2/60" : "hover:bg-surface-2/30"
            } ${!valid ? "cursor-not-allowed opacity-40" : ""} ${
              isSelected && pending ? "ring-1 ring-inset ring-fg/20" : ""
            }`}
          >
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                isSelected ? "border-fg bg-fg" : "border-border bg-background"
              }`}
            >
              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
            </span>
            <span className="min-w-0 flex flex-col gap-0.5">
              <span className={`text-sm font-medium leading-none ${isSelected ? "text-fg" : ""}`}>
                {mode.label}
              </span>
              <span className="text-[12px] leading-snug text-muted">{mode.hint}</span>
              {!valid && (
                <span className="text-[11px] leading-snug text-muted/80">
                  {unavailableReason(linkedVia, mode.id)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

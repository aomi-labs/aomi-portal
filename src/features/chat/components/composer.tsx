"use client";

import { Button } from "@aomi-labs/design";
import { useEffect, useRef, useState } from "react";
import { NetworkMark, ModelMark } from "./brands";
import { AppBrandMark } from "./app-brands";
import { apps, models, networks } from "../fixtures";
import { ArrowUp, ChevronDown, Plus } from "./icons";

function networkIdFromLabel(label: string): string {
  return networks.find((n) => n.label === label)?.id ?? "ethereum";
}

function StopIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <rect x="5" y="5" width="10" height="10" rx="1.5" />
    </svg>
  );
}

interface ComposerProps {
  variant?: "hero" | "dock";
  draft: string;
  placeholder: string;
  busy: boolean;
  appLabel: string;
  modelLabel: string;
  networkLabel: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onOpenCommand: () => void;
  onOpenApp: () => void;
  onOpenModel: () => void;
  onOpenNetwork: () => void;
}

export function Composer({
  variant = "hero",
  draft,
  placeholder,
  busy,
  appLabel,
  modelLabel,
  networkLabel,
  onDraftChange,
  onSend,
  onStop,
  onOpenCommand,
  onOpenApp,
  onOpenModel,
  onOpenNetwork,
}: ComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (variant === "hero") ref.current?.focus();
  }, [variant]);

  const submit = () => {
    if (busy) onStop();
    else onSend();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!busy && draft.trim()) onSend();
    }
    if (e.key === "/" && draft === "") {
      // allow typing slash; + menu is explicit
    }
    if (e.key === "Escape") {
      // parent closes popovers
    }
  };

  if (variant === "dock") {
    return (
      <div className="relative flex w-full max-w-[720px] flex-col gap-0 rounded-composer border border-border bg-elevated px-3 py-2">
        {busy && (
          <p className="px-1 pb-1.5 text-[13px] text-muted">
            {placeholder}
          </p>
        )}
        <div className="flex items-end gap-2.5">
          <button
            type="button"
            onClick={onOpenCommand}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
            aria-label="Quick access"
          >
            <Plus size={16} />
          </button>
          <textarea
            ref={ref}
            value={draft}
            disabled={busy}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={busy ? "" : placeholder}
            className="min-h-[32px] max-h-32 min-w-0 flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-snug text-fg outline-none placeholder:text-muted disabled:cursor-not-allowed"
          />
          <Button
            type="button"
            variant="primary"
            size="icon"
            shape="pill"
            onClick={submit}
            disabled={!busy && !draft.trim()}
            className="mb-0.5 h-8 w-8 shrink-0 bg-primary text-primary-foreground hover:bg-primary-hover"
            aria-label={busy ? "Stop" : "Send"}
          >
            {busy ? <StopIcon /> : <ArrowUp size={15} />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-composer border border-border bg-elevated px-3 py-3 sm:px-4 sm:py-3.5">
      <textarea
        ref={ref}
        value={draft}
        disabled={busy}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        placeholder={placeholder}
        className="min-h-[40px] w-full resize-none bg-transparent text-[15px] leading-snug text-fg outline-none placeholder:text-muted disabled:cursor-not-allowed sm:min-h-[48px]"
      />
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2 sm:overflow-visible">
          <button
            type="button"
            onClick={onOpenCommand}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
            aria-label="Quick access"
          >
            <Plus size={16} />
          </button>
          <SelectorChip
            label={appLabel}
            onClick={onOpenApp}
            icon={
              <AppBrandMark
                id={apps.find((a) => a.label === appLabel)?.id ?? "default"}
                size={13}
              />
            }
          />
          <SelectorChip
            label={modelLabel}
            onClick={onOpenModel}
            icon={
              <ModelMark
                id={models.find((m) => m.label === modelLabel)?.id ?? "auto"}
                size={13}
              />
            }
          />
          {/* Network lives in the mobile header chip (Paper 28) */}
          <span className="hidden sm:contents">
            <SelectorChip
              label={networkLabel}
              onClick={onOpenNetwork}
              icon={<NetworkMark id={networkIdFromLabel(networkLabel)} size={13} />}
            />
          </span>
        </div>
        <Button
          type="button"
          variant="primary"
          size="icon"
          shape="pill"
          onClick={submit}
          disabled={!busy && !draft.trim()}
          className="h-8 w-8 shrink-0 bg-primary text-primary-foreground hover:bg-primary-hover"
          aria-label={busy ? "Stop" : "Send"}
        >
          {busy ? <StopIcon /> : <ArrowUp size={15} />}
        </Button>
      </div>
    </div>
  );
}

function SelectorChip({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 max-w-[160px] items-center gap-1.5 rounded-pill border border-border px-2.5 transition-colors hover:bg-surface-2"
    >
      {icon}
      <span className="truncate text-[13px] leading-none text-muted">{label}</span>
      <ChevronDown size={12} className="shrink-0 text-muted" />
    </button>
  );
}

export interface CatalogPopoverItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  testnet?: boolean;
  abbr?: string;
}

/**
 * Grouped, searchable picker — mirrors the portal's network/model/app
 * selects (search field, section headings, "Show testnets" toggle).
 * `placement`:
 *  - "composer" — sits just above the composer (hero or dock)
 *  - "header" — fixed under the header network chip (top-right)
 */
export function CatalogPopover({
  title,
  items,
  activeId,
  onSelect,
  onClose,
  className = "",
  iconFor,
  searchPlaceholder,
  withTestnetToggle = false,
  placement = "composer",
}: {
  title: string;
  items: CatalogPopoverItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  className?: string;
  iconFor?: (id: string) => React.ReactNode;
  searchPlaceholder?: string;
  withTestnetToggle?: boolean;
  placement?: "composer" | "header";
}) {
  const [query, setQuery] = useState("");
  const [showTestnets, setShowTestnets] = useState(false);

  const q = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    if (withTestnetToggle && item.testnet && !showTestnets && !q) return false;
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false)
    );
  });

  // Preserve fixture order while bucketing by group heading.
  const sections: { group: string | null; rows: CatalogPopoverItem[] }[] = [];
  for (const item of visible) {
    const group = item.group ?? null;
    const last = sections[sections.length - 1];
    if (last && last.group === group) last.rows.push(item);
    else sections.push({ group, rows: [item] });
  }

  const panelClass =
    placement === "header"
      ? "fixed top-[3.75rem] right-4 z-50 flex w-[min(280px,calc(100vw-2rem))] max-h-[min(360px,calc(100vh-5rem))] flex-col rounded-[var(--radius-md)] border border-border bg-elevated p-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)] sm:right-5"
      : `absolute bottom-full left-1/2 z-40 mb-2 flex w-[min(280px,calc(100%-0.5rem))] max-h-[min(320px,calc(100vh-12rem))] -translate-x-1/2 flex-col rounded-[var(--radius-md)] border border-border bg-elevated p-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)] ${className}`;

  return (
    <>
      <button
        aria-label="Dismiss"
        className={`cursor-default ${placement === "header" ? "fixed inset-0 z-40" : "fixed inset-0 z-30"}`}
        onClick={onClose}
      />
      <div className={panelClass}>
        <div className="flex shrink-0 items-center justify-between px-2 py-1.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">{title}</span>
          <span className="text-[11px] text-muted">Simulation</span>
        </div>
        {searchPlaceholder && (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="mx-1 mb-1.5 h-8 shrink-0 rounded-[var(--radius-sm)] border border-border bg-transparent px-2.5 text-[13px] text-fg outline-none placeholder:text-muted"
          />
        )}
        <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          {visible.length === 0 && (
            <p className="px-2.5 py-3 text-[13px] text-muted">
              No {title.toLowerCase()}s found.
            </p>
          )}
          {sections.map((section, i) => (
            <div key={`${section.group ?? "none"}-${i}`} className="flex flex-col gap-0.5">
              {section.group && (
                <div className="px-2.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                  {section.group}
                </div>
              )}
              {section.rows.map((item) => {
                const active = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-left ${
                      active ? "bg-surface-2" : "hover:bg-surface-2/60"
                    }`}
                  >
                    {iconFor && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2">
                        {iconFor(item.id) ?? (
                          <span className="text-[9px] font-semibold text-muted">
                            {item.abbr ?? item.label.slice(0, 1)}
                          </span>
                        )}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium leading-none">{item.label}</div>
                      {item.description && (
                        <div className="mt-1 truncate text-[11px] leading-none text-muted">{item.description}</div>
                      )}
                    </div>
                    {active && <span className="shrink-0 text-[11px] font-medium text-accent">Active</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {withTestnetToggle && (
          <button
            type="button"
            onClick={() => setShowTestnets((v) => !v)}
            className="mt-1 flex h-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-t border-border text-[12px] font-medium text-muted hover:text-fg"
          >
            {showTestnets ? "Hide testnets" : "Show testnets"}
          </button>
        )}
      </div>
    </>
  );
}

export { apps, models, networks };

"use client";

import { useState, type ComponentType } from "react";
import type { SettingsTab, Theme } from "../contracts";
import {
  Bot,
  Chart,
  ChevronDown,
  Close,
  Key,
  Lock,
  Shield,
  Sliders,
} from "./icons";

const NAV: {
  id: SettingsTab;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "general", label: "General", Icon: Sliders },
  { id: "usage", label: "Usage", Icon: Chart },
  { id: "appKeys", label: "App Keys", Icon: Key },
  { id: "bots", label: "Bots", Icon: Bot },
  { id: "secrets", label: "Secrets", Icon: Lock },
  { id: "byok", label: "BYOK", Icon: Shield },
];

interface SettingsModalProps {
  theme: Theme;
  address: string;
  network: string;
  onSetTheme: (t: Theme) => void;
  onClose: () => void;
}

export function SettingsModal({
  theme,
  address,
  network,
  onSetTheme,
  onClose,
}: SettingsModalProps) {
  const [tab, setTab] = useState<SettingsTab>("general");
  const activeLabel = NAV.find((n) => n.id === tab)?.label ?? "Settings";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      <button aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/55" />
      <div className="relative flex h-[min(600px,90vh)] w-full max-w-[900px] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <nav className="flex w-[220px] shrink-0 flex-col gap-0.5 border-r border-border bg-background/40 p-3 pt-4">
          <span className="px-2.5 pb-3 text-[15px] font-semibold leading-none tracking-[-0.01em]">
            Settings
          </span>
          {NAV.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex h-9 items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 text-left transition-colors ${
                  active ? "bg-surface-2" : "hover:bg-surface-2/60"
                }`}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <Icon size={16} className={active ? "text-fg" : "text-muted"} />
                </span>
                <span
                  className={`truncate text-sm leading-none ${
                    active ? "font-medium text-fg" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-5">
            <h2 className="min-w-0 truncate text-base font-semibold leading-none tracking-[-0.01em]">
              {activeLabel}
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
              aria-label="Close settings"
            >
              <Close size={15} />
            </button>
          </div>

          {tab === "general" ? (
            <div className="flex flex-col gap-0 overflow-y-auto p-5">
              <SettingRow title="Theme" desc="Match system, light, or dark">
                <div className="flex h-8 items-center rounded-full border border-border p-0.5">
                  {(["dark", "light"] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => onSetTheme(t)}
                      className={`rounded-full px-3 py-1 text-[12px] capitalize leading-none ${
                        theme === t ? "bg-surface-2 font-medium text-fg" : "text-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button className="rounded-full px-3 py-1 text-[12px] leading-none text-muted">
                    System
                  </button>
                </div>
              </SettingRow>
              <Divider />
              <SettingRow title="Default network" desc="Used for new chats">
                <div className="flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border px-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span className="truncate text-[13px] leading-none">{network}</span>
                  <ChevronDown size={12} className="shrink-0 text-muted" />
                </div>
              </SettingRow>
              <Divider />
              <SettingRow title="Connected wallet" desc={address} descMono>
                <button className="flex h-8 shrink-0 items-center rounded-[var(--radius-sm)] border border-border px-3 text-[13px] font-medium leading-none text-muted transition-colors hover:text-fg">
                  Disconnect
                </button>
              </SettingRow>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-5 text-center">
              <span className="text-sm font-medium leading-none">{activeLabel}</span>
              <span className="max-w-[28ch] text-[13px] leading-snug text-muted text-pretty">
                Preview — content fixture pending.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  desc,
  descMono,
  children,
}: {
  title: string;
  desc: string;
  descMono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium leading-none">{title}</span>
        <span
          className={`truncate text-[13px] leading-snug text-muted ${
            descMono ? "font-mono" : ""
          }`}
        >
          {desc}
        </span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

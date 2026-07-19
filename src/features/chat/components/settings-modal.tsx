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

const NAV: { id: SettingsTab; label: string; Icon: ComponentType<{ size?: number; className?: string }> }[] = [
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

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <button aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/55" />
      <div className="relative flex h-[600px] w-[900px] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <nav className="flex w-[220px] flex-shrink-0 flex-col gap-0.5 border-r border-border bg-background/40 p-3 pt-[18px]">
          <span className="px-2.5 pb-3 pt-1 text-[15px] font-semibold">Settings</span>
          {NAV.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-[9px] text-left transition-colors ${
                  active ? "bg-surface-2" : "hover:bg-surface-2/60"
                }`}
              >
                <Icon size={16} className={active ? "text-fg" : "text-muted"} />
                <span
                  className={`text-sm ${active ? "font-medium text-fg" : "text-muted"}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
            <span className="text-base font-semibold">{NAV.find((n) => n.id === tab)?.label}</span>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-border text-muted transition-colors hover:text-fg"
            >
              <Close size={15} />
            </button>
          </div>

          {tab === "general" ? (
            <div className="flex flex-col gap-[18px] p-[22px]">
              <SettingRow title="Theme" desc="Match system, light, or dark">
                <div className="flex rounded-full border border-border p-[3px]">
                  {(["dark", "light"] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => onSetTheme(t)}
                      className={`rounded-full px-3 py-[5px] text-xs capitalize ${
                        theme === t ? "bg-surface-2 font-medium text-fg" : "text-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button className="rounded-full px-3 py-[5px] text-xs text-muted">
                    System
                  </button>
                </div>
              </SettingRow>
              <Divider />
              <SettingRow title="Default network" desc="Used for new chats">
                <div className="flex items-center gap-[7px] rounded-[var(--radius-sm)] border border-border px-3 py-[7px]">
                  <span className="h-[7px] w-[7px] rounded-full bg-success" />
                  <span className="text-[13px]">{network}</span>
                  <ChevronDown size={12} className="text-muted" />
                </div>
              </SettingRow>
              <Divider />
              <SettingRow title="Connected wallet" desc={address} descMono>
                <button className="rounded-[var(--radius-sm)] border border-border px-3.5 py-2 text-[13px] font-medium text-muted transition-colors hover:text-fg">
                  Disconnect
                </button>
              </SettingRow>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-[22px] text-center">
              <span className="text-sm font-medium">
                {NAV.find((n) => n.id === tab)?.label}
              </span>
              <span className="text-[13px] text-muted">
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
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className={`text-[13px] text-muted ${descMono ? "font-mono" : ""}`}>
          {desc}
        </span>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

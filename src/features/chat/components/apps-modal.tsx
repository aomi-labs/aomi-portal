"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Chart,
  Chat,
  Close,
  Gear,
  MoreHorizontal,
  Search,
  Shield,
  Trash,
  WalletIcon,
} from "./icons";

type AppVisibility = "public" | "personal";
type PublicCategory = "Featured" | "Markets & onchain" | "Productivity";

interface CatalogApp {
  id: string;
  name: string;
  description: string;
  iconDomain?: string;
  iconUrl?: string;
  glyph?: "wallet" | "chart" | "shield";
  background: string;
  foreground: string;
  visibility: AppVisibility;
  category: PublicCategory | "Your apps";
  installed?: boolean;
}

const PUBLIC_APPS: CatalogApp[] = [
  {
    id: "uniswap",
    name: "Uniswap",
    description: "Swap tokens and manage liquidity on Ethereum.",
    iconDomain: "uniswap.org",
    background: "#fff1f7",
    foreground: "#ff007a",
    visibility: "public",
    category: "Featured",
    installed: true,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    description: "Find and execute the best swap routes on Solana.",
    iconDomain: "jup.ag",
    background: "#effff8",
    foreground: "#144d3b",
    visibility: "public",
    category: "Featured",
    installed: true,
  },
  {
    id: "wallet-intelligence",
    name: "Wallet Intelligence",
    description: "Review balances, activity, and portfolio risk.",
    glyph: "wallet",
    background: "#7c6cf2",
    foreground: "#ffffff",
    visibility: "public",
    category: "Featured",
  },
  {
    id: "dune",
    name: "Dune",
    description: "Query, chart, and explain onchain data.",
    iconDomain: "dune.com",
    background: "#fff5ee",
    foreground: "#f26f45",
    visibility: "public",
    category: "Featured",
    installed: true,
  },
  {
    id: "aave",
    name: "Aave",
    description: "Lend, borrow, and monitor DeFi positions.",
    iconDomain: "aave.com",
    background: "#f3f0ff",
    foreground: "#7868e6",
    visibility: "public",
    category: "Featured",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Triage PRs, issues, CI, and releases.",
    iconDomain: "github.com",
    background: "#f4f4f4",
    foreground: "#161616",
    visibility: "public",
    category: "Featured",
    installed: true,
  },
  {
    id: "coingecko",
    name: "CoinGecko",
    description: "Track token prices, markets, and metadata.",
    iconDomain: "coingecko.com",
    background: "#f4ffe6",
    foreground: "#173300",
    visibility: "public",
    category: "Markets & onchain",
  },
  {
    id: "etherscan",
    name: "Etherscan",
    description: "Inspect Ethereum contracts and transactions.",
    iconDomain: "etherscan.io",
    background: "#eef8ff",
    foreground: "#4d96c7",
    visibility: "public",
    category: "Markets & onchain",
    installed: true,
  },
  {
    id: "birdeye",
    name: "Birdeye",
    description: "Explore Solana tokens, markets, and wallets.",
    iconDomain: "birdeye.so",
    background: "#eef3ff",
    foreground: "#2d63e2",
    visibility: "public",
    category: "Markets & onchain",
  },
  {
    id: "defillama",
    name: "DefiLlama",
    description: "Compare protocols, yields, and TVL.",
    iconDomain: "defillama.com",
    background: "#e7f3fb",
    foreground: "#2777a8",
    visibility: "public",
    category: "Markets & onchain",
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    description: "Research markets and manage perp positions.",
    iconDomain: "hyperliquid.xyz",
    background: "#b8ffe2",
    foreground: "#12362b",
    visibility: "public",
    category: "Markets & onchain",
  },
  {
    id: "solscan",
    name: "Solscan",
    description: "Inspect Solana accounts and transactions.",
    iconDomain: "solscan.io",
    background: "#f1edff",
    foreground: "#7f5af0",
    visibility: "public",
    category: "Markets & onchain",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Search and organize your team knowledge.",
    iconDomain: "notion.so",
    background: "#f4f4f4",
    foreground: "#151515",
    visibility: "public",
    category: "Productivity",
    installed: true,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Plan follow-ups and scheduled actions.",
    iconUrl: "https://api.iconify.design/logos:google-calendar.svg",
    background: "#eef5ff",
    foreground: "#4f8ff7",
    visibility: "public",
    category: "Productivity",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Turn team conversations into coordinated work.",
    iconDomain: "slack.com",
    background: "#fff3f8",
    foreground: "#e34b86",
    visibility: "public",
    category: "Productivity",
    installed: true,
  },
  {
    id: "linear",
    name: "Linear",
    description: "Create and update product work.",
    iconDomain: "linear.app",
    background: "#f1f2ff",
    foreground: "#5e6ad2",
    visibility: "public",
    category: "Productivity",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Find, save, and share project files.",
    iconDomain: "dropbox.com",
    background: "#eef5ff",
    foreground: "#3984ff",
    visibility: "public",
    category: "Productivity",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Work with documents and shared files.",
    iconUrl: "https://api.iconify.design/logos:google-drive.svg",
    background: "#fffbea",
    foreground: "#1c3f67",
    visibility: "public",
    category: "Productivity",
  },
];

const PERSONAL_APPS: CatalogApp[] = [
  {
    id: "treasury-ops",
    name: "Treasury Ops",
    description: "Prepare approvals and recurring treasury moves.",
    glyph: "wallet",
    background: "#ff7a1a",
    foreground: "#ffffff",
    visibility: "personal",
    category: "Your apps",
  },
  {
    id: "partner-reporting",
    name: "Partner Reporting",
    description: "Summarize partner activity and account usage.",
    glyph: "chart",
    background: "#4e7af0",
    foreground: "#ffffff",
    visibility: "personal",
    category: "Your apps",
  },
  {
    id: "protocol-watch",
    name: "Protocol Watch",
    description: "Monitor the contracts and events your team follows.",
    glyph: "shield",
    background: "#39b779",
    foreground: "#ffffff",
    visibility: "personal",
    category: "Your apps",
  },
];

const ALL_APPS = [...PUBLIC_APPS, ...PERSONAL_APPS];
const PUBLIC_CATEGORIES: PublicCategory[] = [
  "Featured",
  "Markets & onchain",
  "Productivity",
];

interface AppsModalProps {
  onClose: () => void;
}

export function AppsModal({ onClose }: AppsModalProps) {
  const [activeView, setActiveView] = useState<AppVisibility>("public");
  const [query, setQuery] = useState("");
  const [installedIds, setInstalledIds] = useState(
    () => new Set(ALL_APPS.filter((app) => app.installed).map((app) => app.id)),
  );
  const [justInstalledId, setJustInstalledId] = useState<string | null>(null);
  const [installToast, setInstallToast] = useState<string | null>(null);
  const [openMenuAppId, setOpenMenuAppId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (openMenuAppId) {
          setOpenMenuAppId(null);
          return;
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, openMenuAppId]);

  const visibleApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const source = activeView === "public" ? PUBLIC_APPS : PERSONAL_APPS;

    if (!normalizedQuery) return source;
    return source.filter((app) =>
      `${app.name} ${app.description}`.toLowerCase().includes(normalizedQuery),
    );
  }, [activeView, query]);

  const installedApps = ALL_APPS.filter((app) => installedIds.has(app.id));
  const categories =
    activeView === "public" ? PUBLIC_CATEGORIES : (["Your apps"] as const);

  const install = (appId: string) => {
    const app = ALL_APPS.find((entry) => entry.id === appId);
    setInstalledIds((current) => new Set([...current, appId]));
    setJustInstalledId(appId);
    setInstallToast(app?.name ?? "App");
    setOpenMenuAppId(appId);
    window.setTimeout(() => setJustInstalledId(null), 1600);
    window.setTimeout(() => setInstallToast(null), 2400);
  };

  const uninstall = (appId: string) => {
    setInstalledIds((current) => {
      const next = new Set(current);
      next.delete(appId);
      return next;
    });
    setOpenMenuAppId(null);
  };

  return (
    <>
      <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="absolute inset-0 bg-black/55"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apps-title"
          className="relative flex h-[min(600px,92dvh)] w-full max-w-[900px] flex-col overflow-hidden rounded-t-xl border border-border border-b-0 bg-elevated text-fg shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:rounded-lg sm:border-b"
        >
          <header className="relative shrink-0 border-b border-border px-4 pb-3 pt-4 sm:px-[22px] sm:pb-2 sm:pt-[22px]">
            <h1 id="apps-title" className="text-[15px] font-semibold leading-none">
              Apps
            </h1>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close apps"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:right-[22px] sm:top-[18px]"
            >
              <Close size={16} />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-5 pt-4 sm:px-[22px]">
            <label className="flex h-[38px] items-center gap-2.5 rounded-full border border-border bg-surface-2/25 px-4 transition-colors focus-within:border-muted/70">
              <Search size={16} className="shrink-0 text-muted" />
              <span className="sr-only">Search apps</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search apps"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-muted"
              />
            </label>

            {installedApps.length > 0 && (
              <section className="mt-4" aria-labelledby="installed-apps-title">
                <span
                  id="installed-apps-title"
                  className="text-[13px] font-semibold leading-none"
                >
                  Installed
                </span>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {installedApps.map((app) => (
                    <InstalledAppDockIcon key={app.id} app={app} />
                  ))}
                </div>
              </section>
            )}

            <div className="mt-4 flex items-center gap-1">
              {(["public", "personal"] as AppVisibility[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={`rounded-full px-3.5 py-[5px] text-[13px] capitalize transition-colors ${
                    activeView === view
                      ? "bg-surface-2 font-medium text-fg"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {view === "public" ? "Public" : "Personal"}
                </button>
              ))}
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto border-t border-border pt-4">
              {visibleApps.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8 text-center">
                  <p className="text-[13px] font-medium">No apps found</p>
                  <p className="mt-1 text-[12px] text-muted">Try another name or capability.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 pb-2">
                  {categories.map((category) => {
                    const apps = visibleApps.filter((app) => app.category === category);
                    if (apps.length === 0) return null;
                    const categoryId = `apps-${category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

                    return (
                      <section key={category} aria-labelledby={categoryId}>
                        <h2
                          id={categoryId}
                          className="border-b border-border pb-3 text-[13px] font-semibold"
                        >
                          {category}
                        </h2>
                        <div className="grid md:grid-cols-2 md:gap-x-8">
                          {apps.map((app) => (
                            <CatalogAppRow
                              key={app.id}
                              app={app}
                              installed={installedIds.has(app.id)}
                              menuOpen={openMenuAppId === app.id}
                              highlight={justInstalledId === app.id}
                              onInstall={() => install(app.id)}
                              onToggleMenu={() =>
                                setOpenMenuAppId((current) =>
                                  current === app.id ? null : app.id,
                                )
                              }
                              onCloseMenu={() => setOpenMenuAppId(null)}
                              onUninstall={() => uninstall(app.id)}
                              onChat={() => {
                                setInstallToast(`Opened chat with ${app.name}`);
                                setOpenMenuAppId(null);
                                window.setTimeout(() => setInstallToast(null), 2400);
                              }}
                              onManage={() => {
                                setInstallToast(`Manage ${app.name} (simulation)`);
                                setOpenMenuAppId(null);
                                window.setTimeout(() => setInstallToast(null), 2400);
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {installToast && (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-border bg-elevated px-4 py-2 text-[13px] font-medium text-fg shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            {installToast} installed
          </div>
        )}
      </div>
    </>
  );
}

function InstalledAppDockIcon({ app }: { app: CatalogApp }) {
  return (
    <button
      type="button"
      title={app.name}
      aria-label={app.name}
      className="shrink-0 transition-transform hover:scale-[1.03]"
    >
      <AppIcon app={app} size="dock" />
    </button>
  );
}

function CatalogAppRow({
  app,
  installed,
  menuOpen,
  highlight,
  onInstall,
  onToggleMenu,
  onCloseMenu,
  onUninstall,
  onChat,
  onManage,
}: {
  app: CatalogApp;
  installed: boolean;
  menuOpen: boolean;
  highlight: boolean;
  onInstall: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onUninstall: () => void;
  onChat: () => void;
  onManage: () => void;
}) {
  return (
    <article
      className={`group/row relative flex items-start gap-3.5 rounded-[var(--radius-md)] py-4 pr-1 transition-colors hover:bg-surface-2/25 ${
        highlight ? "bg-surface-2/30 ring-1 ring-inset ring-border" : ""
      }`}
    >
      <AppIcon app={app} size="lg" />
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-[15px] font-medium leading-snug">{app.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{app.description}</p>
      </div>
      {installed ? (
        <AppOptionsTrigger
          appName={app.name}
          open={menuOpen}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          onChat={onChat}
          onManage={onManage}
          onUninstall={onUninstall}
        />
      ) : (
        <button
          type="button"
          onClick={onInstall}
          className="mt-0.5 h-9 shrink-0 rounded-full border border-border bg-surface-2/50 px-4 text-[13px] font-medium text-fg transition-colors hover:bg-surface-2"
        >
          Install
        </button>
      )}
    </article>
  );
}

function AppOptionsTrigger({
  appName,
  open,
  onToggle,
  onClose,
  onChat,
  onManage,
  onUninstall,
}: {
  appName: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChat: () => void;
  onManage: () => void;
  onUninstall: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, onClose]);

  return (
    <div ref={rootRef} className="relative mt-0.5 shrink-0">
      <button
        type="button"
        aria-label={`More options for ${appName}`}
        aria-expanded={open}
        onClick={onToggle}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all hover:bg-surface-2 hover:text-fg ${
          open ? "bg-surface-2 text-fg" : "opacity-70 group-hover/row:opacity-100"
        }`}
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 flex w-[188px] flex-col gap-0.5 rounded-[10px] border border-border bg-elevated p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <AppMenuItem icon={<Chat size={16} />} label="Chat" onClick={onChat} />
          <AppMenuItem icon={<Gear size={16} />} label="Manage" onClick={onManage} />
          <AppMenuItem
            icon={<Trash size={16} />}
            label="Uninstall"
            onClick={onUninstall}
            destructive
          />
        </div>
      )}
    </div>
  );
}

function AppMenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-left text-[13px] transition-colors ${
        destructive
          ? "text-danger hover:bg-danger/10"
          : "text-fg hover:bg-surface-2/80"
      }`}
    >
      <span className={destructive ? "text-danger" : "text-muted"}>{icon}</span>
      {label}
    </button>
  );
}

function AppIcon({
  app,
  size = "lg",
}: {
  app: CatalogApp;
  size?: "dock" | "lg";
}) {
  const sizeClass =
    size === "dock"
      ? "h-11 w-11 rounded-full text-xs shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
      : "h-11 w-11 rounded-[14px] text-xs";
  const glyphSize = 20;
  const Glyph =
    app.glyph === "chart"
      ? Chart
      : app.glyph === "shield"
        ? Shield
        : WalletIcon;

  return (
    <div
      title={app.name}
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center border border-black/10 font-bold tracking-[-0.04em] ${sizeClass}`}
      style={{ backgroundColor: app.background, color: app.foreground }}
    >
      {app.iconDomain || app.iconUrl ? (
        <span
          aria-hidden="true"
          className="h-[68%] w-[68%] bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${
              app.iconUrl ??
              `https://www.google.com/s2/favicons?domain=${app.iconDomain}&sz=128`
            }")`,
          }}
        />
      ) : (
        <Glyph aria-hidden="true" size={glyphSize} />
      )}
    </div>
  );
}

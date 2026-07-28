"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Chart,
  Close,
  Filter,
  Gear,
  MoreHorizontal,
  Search,
  Shield,
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
    setInstalledIds((current) => new Set([...current, appId]));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apps-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-background text-fg"
    >
      <div className="mx-auto min-h-full w-full max-w-[1120px] px-8 py-10 sm:px-12 sm:py-12">
        <header className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close apps"
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <Close size={17} />
          </button>
          <h1 id="apps-title" className="text-[32px] font-medium tracking-[-0.025em]">
            Apps
          </h1>
          <p className="mt-2 text-[17px] text-muted">
            Connect Aomi to the protocols and tools you use every day.
          </p>

          <label className="mt-8 flex h-12 items-center gap-3 rounded-full border border-border bg-surface px-5 transition-colors focus-within:border-muted">
            <Search size={20} className="flex-shrink-0 text-muted" />
            <span className="sr-only">Search apps</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search apps"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </label>
        </header>

        <section className="mt-11" aria-labelledby="installed-apps-title">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 id="installed-apps-title" className="text-lg font-semibold">
              Installed
            </h2>
            <button
              type="button"
              aria-label="Manage installed apps"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <Gear size={18} />
            </button>
          </div>
          <div className="flex min-h-[74px] flex-wrap items-center gap-3 py-4">
            {installedApps.map((app) => (
              <AppIcon key={app.id} app={app} size="small" />
            ))}
          </div>
        </section>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {(["public", "personal"] as AppVisibility[]).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setActiveView(view)}
                className={`rounded-[var(--radius-sm)] px-3 py-2 text-[15px] capitalize transition-colors ${
                  activeView === view
                    ? "bg-surface-2 font-medium text-fg"
                    : "text-muted hover:text-fg"
                }`}
              >
                {view === "public" ? "Public" : "Personal"}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Filter apps"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <Filter size={19} />
          </button>
        </div>

        <div className="pb-12 pt-7">
          {visibleApps.length === 0 ? (
            <div className="border-t border-border py-16 text-center">
              <p className="font-medium">No apps found</p>
              <p className="mt-1 text-sm text-muted">
                Try another name or capability.
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const apps = visibleApps.filter((app) => app.category === category);
              if (apps.length === 0) return null;
              const categoryId = `apps-${category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

              return (
                <section key={category} className="mb-10" aria-labelledby={categoryId}>
                  <h2
                    id={categoryId}
                    className="border-b border-border pb-4 text-lg font-semibold"
                  >
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-2 md:gap-x-14">
                    {apps.map((app) => (
                      <AppRow
                        key={app.id}
                        app={app}
                        installed={installedIds.has(app.id)}
                        onInstall={() => install(app.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function AppRow({
  app,
  installed,
  onInstall,
}: {
  app: CatalogApp;
  installed: boolean;
  onInstall: () => void;
}) {
  return (
    <article className="flex min-h-[92px] items-center gap-4 border-b border-border py-4">
      <AppIcon app={app} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold">{app.name}</h3>
        <p className="mt-1 truncate text-sm text-muted">{app.description}</p>
      </div>
      {installed ? (
        <button
          type="button"
          aria-label={`More options for ${app.name}`}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <MoreHorizontal size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onInstall}
          className="flex-shrink-0 rounded-[var(--radius-md)] border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          Install
        </button>
      )}
    </article>
  );
}

function AppIcon({
  app,
  size = "large",
}: {
  app: CatalogApp;
  size?: "small" | "large";
}) {
  const sizeClass = size === "small" ? "h-11 w-11 text-xs" : "h-12 w-12 text-sm";
  const glyphSize = size === "small" ? 21 : 23;
  const Glyph =
    app.glyph === "chart"
      ? Chart
      : app.glyph === "shield"
        ? Shield
        : WalletIcon;

  return (
    <div
      title={app.name}
      aria-label={app.name}
      className={`flex flex-shrink-0 items-center justify-center rounded-[13px] border border-black/10 font-bold tracking-[-0.04em] shadow-sm ${sizeClass}`}
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

"use client";

/**
 * ChatMockView — orchestrator for the Aomi chat mock.
 *
 * Single tree (per CHAT-ARCHITECTURE.md §8): the settings + wallet overlays
 * mount inside the same shell — no second runtime. State here drives which
 * scene/overlay shows. Simulation only.
 */

import { useState } from "react";
import type { Overlay, Theme } from "./contracts";
import { seedAccount, seedThreads, seedTx } from "./fixtures";
import { Sidebar } from "./components/sidebar";
import { ChatHeader } from "./components/chat-header";
import { EmptyState } from "./components/empty-state";
import { Conversation } from "./components/conversation";
import { WalletModal } from "./components/wallet-modal";
import { SettingsModal } from "./components/settings-modal";

const SWAP_THREAD_ID = "t-swap";

export function ChatMockView() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(SWAP_THREAD_ID);
  const [overlay, setOverlay] = useState<Overlay>("none");

  const activeThread = seedThreads.find((t) => t.id === activeThreadId) ?? null;
  const hasConversation =
    activeThreadId === SWAP_THREAD_ID && (activeThread?.messages.length ?? 0) > 0;
  const userMessage = activeThread?.messages[0]?.content ?? "";
  const headerTitle = activeThread?.title ?? "New chat";

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex h-screen w-full bg-background text-fg">
        <Sidebar
          account={seedAccount}
          threads={seedThreads}
          activeThreadId={activeThreadId}
          onSelectThread={setActiveThreadId}
          onNewChat={() => setActiveThreadId(null)}
        />

        <main className="relative flex flex-1 flex-col">
          <ChatHeader
            title={headerTitle}
            network={seedAccount.network ?? "Ethereum"}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            onOpenSettings={() => setOverlay("settings")}
          />

          {hasConversation ? (
            <Conversation
              userMessage={userMessage}
              onApprove={() => setOverlay("wallet")}
              onSend={() => setActiveThreadId(SWAP_THREAD_ID)}
            />
          ) : (
            <EmptyState onSend={() => setActiveThreadId(SWAP_THREAD_ID)} />
          )}

          {overlay === "wallet" && (
            <WalletModal
              tx={seedTx}
              onApprove={() => setOverlay("none")}
              onReject={() => setOverlay("none")}
            />
          )}
          {overlay === "settings" && (
            <SettingsModal
              theme={theme}
              address={seedAccount.address ?? ""}
              network={seedAccount.network ?? "Ethereum"}
              onSetTheme={setTheme}
              onClose={() => setOverlay("none")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

/**
 * ChatMockView — thin renderer of useChatSession.
 * Simulation only; Paper V2 boards are the design source of truth.
 */

import { useChatSession } from "./hooks/use-chat-session";
import { apps, models, networks } from "./fixtures";
import { Sidebar } from "./components/sidebar";
import { ChatHeader } from "./components/chat-header";
import { EmptyState } from "./components/empty-state";
import { Conversation } from "./components/conversation";
import { AppsModal } from "./components/apps-modal";
import { SettingsModal } from "./components/settings-modal";
import { CatalogPopover } from "./components/composer";
import { NetworkMark, ModelMark } from "./components/brands";
import { AppBrandMark } from "./components/app-brands";
import { AccountMenu, CommandMenu, WorkspaceMenu } from "./components/menus";
import {
  DeleteThreadModal,
  DisconnectModal,
  GateModal,
  ToastBanner,
  WalletModal,
  WalletsModal,
} from "./components/overlays";

export function ChatMockView() {
  const session = useChatSession();
  const { snapshot: s } = session;

  const activeThread = s.threads.find((t) => t.id === s.activeThreadId) ?? null;
  const busy = s.state === "working" || s.state === "submitting";
  const hasConversation =
    Boolean(activeThread) &&
    (activeThread!.messages.length > 0 || s.trace.length > 0 || Boolean(s.answer));

  const appLabel = apps.find((a) => a.id === s.selectedAppId)?.label ?? "Basic Apps";
  const modelLabel = models.find((m) => m.id === s.selectedModelId)?.label ?? "Auto";
  const networkLabel =
    networks.find((n) => n.id === s.selectedNetworkId)?.label ?? s.account.network ?? "Ethereum";

  const headerTitle = activeThread?.title ?? (s.draft ? "New chat · drafting" : "New chat");
  const durationLabel = busy
    ? `Working · ${Math.max(1, s.workingElapsedSec)}s`
    : s.state === "stopped"
      ? `Stopped · ${s.workingElapsedSec}s`
      : `Worked for ${s.workingElapsedSec || 8}s`;

  const resolvedTheme = s.theme === "system" ? "dark" : s.theme;

  const catalogOpen = s.popover === "network" || s.popover === "app" || s.popover === "model";
  const catalogPlacement = session.popoverAnchor === "header" ? "header" : "composer";

  const catalogPopover = catalogOpen ? (
    <CatalogPopover
      title={s.popover === "network" ? "Network" : s.popover === "app" ? "App" : "Model"}
      items={s.popover === "network" ? networks : s.popover === "app" ? apps : models}
      activeId={
        s.popover === "network"
          ? s.selectedNetworkId
          : s.popover === "app"
            ? s.selectedAppId
            : s.selectedModelId
      }
      onSelect={
        s.popover === "network"
          ? session.selectNetwork
          : s.popover === "app"
            ? session.selectApp
            : session.selectModel
      }
      onClose={session.closePopover}
      placement={catalogPlacement}
      iconFor={
        s.popover === "network"
          ? (id) => <NetworkMark id={id} size={14} />
          : s.popover === "model"
            ? (id) => <ModelMark id={id} size={14} />
            : s.popover === "app"
              ? (id) => <AppBrandMark id={id} size={14} />
              : () => null
      }
      searchPlaceholder={
        s.popover === "network"
          ? "Search networks..."
          : s.popover === "app"
            ? "Search apps..."
            : "Search models..."
      }
      withTestnetToggle={s.popover === "network"}
    />
  ) : null;

  /** Composer-anchored pickers live next to the composer; header-anchored are fixed. */
  const composerCatalog = catalogPlacement === "composer" ? catalogPopover : null;
  const headerCatalog = catalogPlacement === "header" ? catalogPopover : null;

  const commandSlot =
    s.popover === "command" ? (
      <CommandMenu onAction={session.runCommand} onClose={session.closePopover} />
    ) : null;

  return (
    <div className={resolvedTheme === "dark" ? "dark" : ""}>
      <div className="relative flex h-dvh w-full overflow-hidden bg-background text-fg">
        {/* Mobile drawer backdrop — Paper 28 hides nav behind a menu */}
        {session.mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/55 sm:hidden"
            onClick={session.closeMobileNav}
          />
        )}

        <div
          className={`relative z-50 shrink-0 transition-transform duration-200 ease-out max-sm:fixed max-sm:inset-y-0 max-sm:left-0 max-sm:shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:translate-x-0 ${
            session.mobileNavOpen ? "max-sm:translate-x-0" : "max-sm:-translate-x-full"
          }`}
        >
          <Sidebar
            account={s.account}
            threads={s.threads}
            activeThreadId={s.activeThreadId}
            busy={busy}
            collapsed={s.sidebarCollapsed}
            onSelectThread={(id) => {
              session.selectThread(id);
              session.closeMobileNav();
            }}
            onNewChat={() => {
              session.newChat();
              session.closeMobileNav();
            }}
            onToggleCollapse={session.toggleSidebar}
            onOpenWorkspace={() => session.openPopover("workspace")}
            onOpenAccount={() => session.openPopover("account")}
            onRenameThread={session.renameThread}
            onMoveThread={session.moveThread}
            onStopThread={() => session.stop()}
            onDeleteThread={(id) => {
              session.closeMobileNav();
              session.requestDeleteThread(id);
            }}
          />
          {s.popover === "workspace" && <WorkspaceMenu onClose={session.closePopover} />}
          {s.popover === "account" && (
            <div className="absolute bottom-16 left-2 z-40 max-sm:left-3 max-sm:right-3 max-sm:w-auto">
              <AccountMenu
                ens={s.account.ens}
                address={s.account.address}
                credits={s.account.credits}
                network={networkLabel}
                theme={resolvedTheme}
                onManageWallets={() => {
                  session.closeMobileNav();
                  session.openOverlay("wallets");
                }}
                onSwitchNetwork={() => {
                  session.closeMobileNav();
                  session.openPopover("network", "header");
                }}
                onToggleTheme={() =>
                  session.setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                onOpenSettings={() => {
                  session.closeMobileNav();
                  session.openOverlay("settings", "general");
                }}
                onDisconnect={session.disconnect}
                onClose={session.closePopover}
              />
            </div>
          )}
        </div>

        <main className="relative flex min-w-0 flex-1 flex-col">
          <ChatHeader
            title={headerTitle}
            network={networkLabel}
            theme={resolvedTheme}
            mobile
            onToggleTheme={() =>
              session.setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            onOpenSettings={() => session.openOverlay("settings", "general")}
            onOpenApps={() => session.openOverlay("apps")}
            onOpenNetwork={() => session.openPopover("network", "header")}
            onOpenMobileNav={session.openMobileNav}
            onNewChat={session.newChat}
          />

          {headerCatalog}

          {s.toast && <ToastBanner toast={s.toast} onDismiss={session.dismissToast} />}

          {hasConversation ? (
            <Conversation
              userMessages={activeThread?.messages.filter((m) => m.role === "user") ?? []}
              answer={s.answer}
              trace={s.trace}
              tx={s.tx}
              durationLabel={durationLabel}
              busy={busy}
              draft={s.draft}
              appLabel={appLabel}
              modelLabel={modelLabel}
              networkLabel={networkLabel}
              onDraftChange={session.setDraft}
              onSend={() => session.send()}
              onStop={session.stop}
              onOpenCommand={() => session.openPopover("command")}
              onOpenApp={() => session.openPopover("app", "composer")}
              onOpenModel={() => session.openPopover("model", "composer")}
              onOpenNetwork={() => session.openPopover("network", "composer")}
              onApprove={session.requestWalletApproval}
              onCancelTx={session.cancelTx}
              onCopy={session.copyAnswer}
              onRerun={session.rerun}
              onBranch={session.branch}
              commandSlot={
                <>
                  {commandSlot}
                  {composerCatalog}
                </>
              }
            />
          ) : (
            <EmptyState
              draft={s.draft}
              busy={busy}
              appLabel={appLabel}
              modelLabel={modelLabel}
              networkLabel={networkLabel}
              onDraftChange={session.setDraft}
              onSend={(text) => session.send(text)}
              onStop={session.stop}
              onOpenCommand={() => session.openPopover("command")}
              onOpenApp={() => session.openPopover("app", "composer")}
              onOpenModel={() => session.openPopover("model", "composer")}
              onOpenNetwork={() => session.openPopover("network", "composer")}
              onSuggestion={(threadId) => session.selectThread(threadId)}
              commandSlot={commandSlot}
              selectorSlot={composerCatalog}
            />
          )}

          {s.overlay === "wallet" && s.tx && (
            <WalletModal
              tx={s.tx}
              onApprove={() => session.resolveWallet("approved")}
              onReject={() => session.resolveWallet("rejected")}
            />
          )}
          {s.overlay === "wallets" && (
            <WalletsModal
              wallets={s.wallets}
              onClose={session.closeOverlay}
              onConnect={session.connectWallet}
              onSetActive={session.setActiveWallet}
              onUnlink={session.unlinkWallet}
            />
          )}
          {s.overlay === "apps" && (
            <AppsModal onClose={session.closeOverlay} />
          )}
          {s.overlay === "settings" && s.settingsTab && (
            <SettingsModal
              theme={resolvedTheme}
              tab={s.settingsTab}
              address={s.account.address ?? ""}
              network={networkLabel}
              account={session.accountOverview}
              wallets={session.walletPolicies}
              grants={session.grants}
              billing={session.billing}
              usage={session.usageOverview}
              paymentMethods={session.paymentMethods}
              onSetTheme={session.setTheme}
              onSetTab={session.setSettingsTab}
              onDisconnect={session.disconnect}
              onClose={session.closeOverlay}
            />
          )}
          {s.overlay === "gate" && s.gate && (
            <GateModal
              gate={s.gate}
              onOpenSecrets={() => session.openOverlay("settings", "secrets")}
              onSwitchApp={() => {
                session.closeOverlay();
                session.openPopover("app");
              }}
              onConnectWallet={session.simulateConnectWalletPay}
              onOpenByok={() => session.openOverlay("settings", "secrets")}
              onOpenUsage={() => session.openOverlay("settings", "usage")}
              onClose={session.closeOverlay}
            />
          )}
          {s.overlay === "disconnect" && (
            <DisconnectModal
              address={s.account.address}
              onConfirm={session.confirmDisconnect}
              onCancel={session.closeOverlay}
            />
          )}
          {s.overlay === "deleteThread" && s.pendingDeleteThreadId && (
            <DeleteThreadModal
              title={
                s.threads.find((t) => t.id === s.pendingDeleteThreadId)?.title ?? "this chat"
              }
              onConfirm={session.confirmDeleteThread}
              onCancel={session.closeOverlay}
            />
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

/**
 * ChatMockView — thin orchestrator for the Aomi chat mock.
 *
 * This renders STRUCTURAL PLACEHOLDERS for the product surfaces in
 * ../../../CHAT-ARCHITECTURE.md (§3). There is intentionally NO visual craft
 * here — no color system, typography scale, spacing rhythm, or component
 * design. Those land only after a design reference is supplied.
 *
 * Keep this file thin: it wires surfaces to the single `useChatSession`
 * driver. Surface components get their own files under ./components once the
 * design exists.
 */

import { useChatSession } from "./hooks/use-chat-session";

export function ChatMockView() {
  const { snapshot } = useChatSession();

  return (
    <div data-mock-root className="flex min-h-full flex-1 flex-col">
      <p data-mock-note>
        Aomi chat mock — skeleton only. Current state:{" "}
        <strong>{snapshot.state}</strong>. Visual design is pending a reference;
        surfaces below are structural placeholders (see CHAT-ARCHITECTURE.md
        §3).
      </p>

      <div data-mock-layout className="flex flex-1">
        {/* §3 Sidebar / threads */}
        <aside data-surface="sidebar" aria-label="Threads">
          <p>Sidebar / threads — New Chat, skeletons, active row, archive</p>
        </aside>

        <div data-surface="conversation" className="flex flex-1 flex-col">
          {/* §3 Header */}
          <header data-surface="header">
            <p>Header — toggle, title, settings gear, account menu</p>
          </header>

          {/* §3 Empty chat / Messages / Working trace */}
          <main data-surface="thread" className="flex-1">
            <p>Empty chat — greeting + suggestions</p>
            <p>Messages — user/assistant, edit, copy, rerun, branch, errors</p>
            <p>Working trace — tool steps; final answer rendered OUTSIDE trace</p>
          </main>

          {/* §3 Composer / controls */}
          <footer data-surface="composer">
            <p>Composer — input, send↔stop, network/model/app controls</p>
          </footer>
        </div>
      </div>

      {/* Overlays — mounted in the single tree, toggled by state (§4). */}
      <div data-surface="overlays" hidden>
        <p>Settings modal — General, Usage, App Keys, Bots, Secrets, BYOK</p>
        <p>Wallet approval — external/simulated approve/reject</p>
        <p>Gates — payment / required secrets</p>
        <p>Notifications — toasts / system notices</p>
      </div>
    </div>
  );
}

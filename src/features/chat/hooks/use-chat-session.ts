"use client";

/**
 * use-chat-session — the single simulation driver for the mock.
 *
 * This is a SKELETON. It holds the snapshot and exposes the actions the
 * core journey needs (§7). The timing/animation and honest "Simulation"
 * labels get fleshed out once a design reference exists — do not invent
 * visual behavior before then.
 */

import { useCallback, useMemo, useState } from "react";
import type { ChatSnapshot, SessionState } from "./../contracts";
import { initialSnapshot } from "./../fixtures";

export interface ChatSessionApi {
  snapshot: ChatSnapshot;
  /** Move the state machine to an explicit state (§4). */
  setState: (next: SessionState) => void;
  /** Submit a draft message — wiring TBD (optimistic user message first). */
  send: (text: string) => void;
  /** Stop an in-flight simulated run. */
  stop: () => void;
  /** Start a fresh local draft thread. */
  newChat: () => void;
  /** Simulated wallet approve / reject (§7). */
  resolveWallet: (outcome: "approved" | "rejected") => void;
}

export function useChatSession(): ChatSessionApi {
  const [snapshot, setSnapshot] = useState<ChatSnapshot>(initialSnapshot);

  const setState = useCallback((next: SessionState) => {
    setSnapshot((prev) => ({ ...prev, state: next }));
  }, []);

  const send = useCallback((_text: string) => {
    // TODO: optimistic user message → submitting → working → completed.
    // Implement with honest simulated timing once design lands.
    setSnapshot((prev) => ({ ...prev, state: "submitting" }));
  }, []);

  const stop = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, state: "completed" }));
  }, []);

  const newChat = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, state: "emptyThread", trace: [] }));
  }, []);

  const resolveWallet = useCallback((outcome: "approved" | "rejected") => {
    setSnapshot((prev) => ({
      ...prev,
      walletRequest: prev.walletRequest
        ? { ...prev.walletRequest, outcome }
        : null,
    }));
  }, []);

  return useMemo(
    () => ({ snapshot, setState, send, stop, newChat, resolveWallet }),
    [snapshot, setState, send, stop, newChat, resolveWallet],
  );
}

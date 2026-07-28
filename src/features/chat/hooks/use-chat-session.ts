"use client";

/**
 * use-chat-session — single simulation driver for the mock.
 * Owns theme, overlays, menus, composer, lifecycle timers.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  AccountBillingSnapshot,
  ChatSnapshot,
  Overlay,
  PaymentMethodsFixture,
  Popover,
  PopoverAnchor,
  SettingsTab,
  Theme,
  Thread,
  ToolStep,
  TxPreview,
  UsageOverview,
} from "../contracts";
import {
  paymentGate,
  seedPaymentMethods,
  seedUsageOverview,
} from "../billing-fixtures";
import {
  apps,
  models,
  networks,
  seedAccount,
  seedThreads,
  seedWallets,
  secretGate,
  threadFixtureForPrompt,
  walletOptions,
} from "../fixtures";

const STEP_MS = 450;
const TOAST_MS = 2200;

function cloneThreads(threads: Thread[]): Thread[] {
  return threads.map((t) => ({
    ...t,
    messages: t.messages.map((m) => ({ ...m })),
    trace: t.trace?.map((s) => ({ ...s })),
    tx: t.tx ? { ...t.tx } : undefined,
  }));
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface ChatSessionApi {
  snapshot: ChatSnapshot;
  setDraft: (value: string) => void;
  send: (text?: string) => void;
  stop: () => void;
  newChat: () => void;
  selectThread: (id: string) => void;
  renameThread: (id: string) => void;
  /** Opens delete confirmation — does not remove until confirmDeleteThread. */
  requestDeleteThread: (id: string) => void;
  confirmDeleteThread: () => void;
  moveThread: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  openPopover: (popover: Popover, anchor?: PopoverAnchor) => void;
  closePopover: () => void;
  openOverlay: (overlay: Overlay, settingsTab?: SettingsTab) => void;
  closeOverlay: () => void;
  setSettingsTab: (tab: SettingsTab) => void;
  selectApp: (id: string) => void;
  selectModel: (id: string) => void;
  selectNetwork: (id: string) => void;
  resolveWallet: (outcome: "approved" | "rejected") => void;
  cancelTx: () => void;
  requestWalletApproval: () => void;
  copyAnswer: () => void;
  rerun: () => void;
  branch: () => void;
  disconnect: () => void;
  confirmDisconnect: () => void;
  connectWallet: (optionId: string) => void;
  setActiveWallet: (id: string) => void;
  unlinkWallet: (id: string) => void;
  showSecretGate: () => void;
  showPaymentGate: () => void;
  simulateConnectWalletPay: () => void;
  billing: AccountBillingSnapshot;
  usageOverview: UsageOverview;
  paymentMethods: PaymentMethodsFixture;
  dismissToast: () => void;
  runCommand: (
    action:
      | "app"
      | "network"
      | "wallets"
      | "settings-bots"
      | "settings-secrets"
      | "simulate-payment"
      | "simulate-secret",
  ) => void;
  /** Catalog picker placement — composer chips vs header network. */
  popoverAnchor: PopoverAnchor;
  /** Mobile nav drawer (Paper 28) — distinct from desktop collapse rail. */
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
}

export function useChatSession(): ChatSessionApi {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [account, setAccount] = useState(seedAccount);
  const [usageOverview] = useState<UsageOverview>(seedUsageOverview);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsFixture>(seedPaymentMethods);
  const [wallets, setWallets] = useState(seedWallets);
  const [threads, setThreads] = useState(() => cloneThreads(seedThreads));
  const [activeThreadId, setActiveThreadId] = useState<string | null>("t-swap");
  const [draft, setDraft] = useState("");
  const [selectedAppId, setSelectedAppId] = useState(apps[0]!.id);
  const [selectedModelId, setSelectedModelId] = useState(models[0]!.id);
  const [selectedNetworkId, setSelectedNetworkId] = useState(networks[0]!.id);
  const [state, setState] = useState<ChatSnapshot["state"]>("completed");
  const [trace, setTrace] = useState<ToolStep[]>(() => seedThreads[0]!.trace ?? []);
  const [answer, setAnswer] = useState<string | null>(seedThreads[0]!.answer ?? null);
  const [tx, setTx] = useState<TxPreview | null>(seedThreads[0]!.tx ?? null);
  const [walletRequest, setWalletRequest] = useState<ChatSnapshot["walletRequest"]>(null);
  const [gate, setGate] = useState<ChatSnapshot["gate"]>(null);
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [pendingDeleteThreadId, setPendingDeleteThreadId] = useState<string | null>(null);
  const [popover, setPopover] = useState<Popover>("none");
  const [popoverAnchor, setPopoverAnchor] = useState<PopoverAnchor>("composer");
  const [settingsTab, setSettingsTabState] = useState<SettingsTab | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<ChatSnapshot["toast"]>(null);
  const [workingElapsedSec, setWorkingElapsedSec] = useState(8);

  const timers = useRef<number[]>([]);
  const runId = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const showToast = useCallback(
    (message: string, tone: "info" | "success" | "error" = "info") => {
      const id = uid("toast");
      setToast({ id, message, tone });
      schedule(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, TOAST_MS);
    },
    [schedule],
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Paper mobile (390): nav starts closed; desktop keeps the expanded rail.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      if (mq.matches) {
        setMobileNavOpen(false);
        setSidebarCollapsed(false);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const loadThread = useCallback((thread: Thread, asCompleted = true) => {
    setActiveThreadId(thread.id);
    setTrace(thread.trace?.map((s) => ({ ...s })) ?? []);
    setAnswer(thread.answer ?? null);
    setTx(thread.tx ? { ...thread.tx } : null);
    setWorkingElapsedSec(asCompleted ? 8 : 0);
    setState(asCompleted && thread.answer ? "completed" : "emptyThread");
    setWalletRequest(null);
    setGate(null);
  }, []);

  const runLifecycle = useCallback(
    (threadId: string, pendingTrace: ToolStep[], finalAnswer: string, finalTx: TxPreview | null) => {
      clearTimers();
      const id = ++runId.current;
      setState("submitting");
      setTrace(pendingTrace.map((s) => ({ ...s, status: "pending" })));
      setAnswer(null);
      setTx(null);
      setWorkingElapsedSec(0);

      schedule(() => {
        if (runId.current !== id) return;
        setState("working");
        let elapsed = 0;
        pendingTrace.forEach((step, index) => {
          schedule(() => {
            if (runId.current !== id) return;
            elapsed = Math.max(1, Math.round(((index + 1) * STEP_MS) / 1000));
            setWorkingElapsedSec(elapsed);
            setTrace((prev) =>
              prev.map((s, i) => {
                if (i < index) return { ...s, status: "done" };
                if (i === index) return { ...s, status: "running" };
                return { ...s, status: "pending" };
              }),
            );
          }, STEP_MS * (index + 1));
        });

        const doneAt = STEP_MS * (pendingTrace.length + 1);
        schedule(() => {
          if (runId.current !== id) return;
          setTrace((prev) => prev.map((s) => ({ ...s, status: "done" })));
          setAnswer(finalAnswer);
          setTx(finalTx);
          setState("completed");
          setWorkingElapsedSec(Math.max(1, Math.round(doneAt / 1000)));
          setThreads((prev) =>
            prev.map((t) =>
              t.id === threadId
                ? {
                    ...t,
                    answer: finalAnswer,
                    trace: pendingTrace.map((s) => ({ ...s, status: "done" })),
                    tx: finalTx ?? undefined,
                    updatedAt: Date.now(),
                  }
                : t,
            ),
          );
        }, doneAt);
      }, 280);
    },
    [clearTimers, schedule],
  );

  const send = useCallback(
    (text?: string) => {
      const value = (text ?? draft).trim();
      if (!value) return;
      if (state === "working" || state === "submitting") return;

      setPopover("none");
      setDraft("");
      const fixture = threadFixtureForPrompt(value);
      const threadId = activeThreadId && threads.find((t) => t.id === activeThreadId)
        ? activeThreadId
        : uid("t");

      const userMessage = {
        id: uid("m"),
        role: "user" as const,
        content: value,
        createdAt: Date.now(),
      };

      setThreads((prev) => {
        const existing = prev.find((t) => t.id === threadId);
        if (existing) {
          return prev.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  title: fixture.title,
                  kind: fixture.kind,
                  messages: [...t.messages, userMessage],
                  updatedAt: Date.now(),
                }
              : t,
          );
        }
        return [
          {
            id: threadId,
            title: fixture.title,
            kind: fixture.kind,
            updatedAt: Date.now(),
            messages: [userMessage],
          },
          ...prev,
        ];
      });
      setActiveThreadId(threadId);
      runLifecycle(threadId, fixture.trace, fixture.answer, fixture.tx);
    },
    [activeThreadId, draft, runLifecycle, state, threads],
  );

  const stop = useCallback(() => {
    clearTimers();
    runId.current += 1;
    setState("stopped");
    setTrace((prev) =>
      prev.map((s) =>
        s.status === "running" || s.status === "pending" ? { ...s, status: "error" } : s,
      ),
    );
    setAnswer((prev) => prev ?? "Generation stopped.");
    showToast("Generation stopped", "info");
  }, [clearTimers, showToast]);

  const newChat = useCallback(() => {
    clearTimers();
    runId.current += 1;
    setActiveThreadId(null);
    setDraft("");
    setTrace([]);
    setAnswer(null);
    setTx(null);
    setState("emptyThread");
    setPopover("none");
    setOverlay("none");
    setWalletRequest(null);
    setGate(null);
  }, [clearTimers]);

  const renameThread = useCallback(
    (id: string) => {
      const thread = threads.find((t) => t.id === id);
      if (!thread) return;
      const next = window.prompt("Rename chat", thread.title);
      if (next === null) return;
      const title = next.trim();
      if (!title) return;
      setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
      showToast("Chat renamed", "success");
    },
    [showToast, threads],
  );

  const deleteThread = useCallback(
    (id: string) => {
      const thread = threads.find((t) => t.id === id);
      if (!thread) return;
      setThreads((prev) => prev.filter((t) => t.id !== id));
      if (activeThreadId === id) {
        clearTimers();
        runId.current += 1;
        setActiveThreadId(null);
        setDraft("");
        setTrace([]);
        setAnswer(null);
        setTx(null);
        setState("emptyThread");
      }
      showToast(`Deleted · ${thread.title}`, "info");
    },
    [activeThreadId, clearTimers, showToast, threads],
  );

  const requestDeleteThread = useCallback(
    (id: string) => {
      const thread = threads.find((t) => t.id === id);
      if (!thread) return;
      setPopover("none");
      setPendingDeleteThreadId(id);
      setOverlay("deleteThread");
    },
    [threads],
  );

  const confirmDeleteThread = useCallback(() => {
    if (!pendingDeleteThreadId) return;
    const id = pendingDeleteThreadId;
    setPendingDeleteThreadId(null);
    setOverlay("none");
    deleteThread(id);
  }, [deleteThread, pendingDeleteThreadId]);

  const moveThread = useCallback(
    (id: string) => {
      const thread = threads.find((t) => t.id === id);
      if (!thread) return;
      showToast(`Move to · ${thread.title} (simulation)`, "info");
    },
    [showToast, threads],
  );

  const selectThread = useCallback(
    (id: string) => {
      const thread = threads.find((t) => t.id === id);
      if (!thread) return;
      clearTimers();
      runId.current += 1;
      setPopover("none");
      setOverlay("none");
      loadThread(thread, Boolean(thread.answer));
    },
    [clearTimers, loadThread, threads],
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next === "system" ? "dark" : next);
  }, []);

  const openPopover = useCallback((next: Popover, anchor: PopoverAnchor = "composer") => {
    // Don't stack pickers under wallets/settings — close overlays first.
    setOverlay("none");
    setSettingsTabState(null);
    setGate(null);
    setPopoverAnchor(anchor);
    setPopover((prev) => (prev === next ? "none" : next));
  }, []);

  const closePopover = useCallback(() => setPopover("none"), []);

  const openOverlay = useCallback((next: Overlay, tab?: SettingsTab) => {
    setPopover("none");
    if (next !== "deleteThread") setPendingDeleteThreadId(null);
    setOverlay(next);
    if (next === "settings") {
      setSettingsTabState(tab ?? "general");
      setState("settings");
    }
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay("none");
    setPendingDeleteThreadId(null);
    setSettingsTabState(null);
    setGate(null);
    setWalletRequest(null);
    setState((prev) =>
      prev === "settings" ||
      prev === "walletPending" ||
      prev === "paymentRequired" ||
      prev === "requiredSecrets"
        ? "completed"
        : prev,
    );
  }, []);

  const setSettingsTab = useCallback((tab: SettingsTab) => {
    setSettingsTabState(tab);
    setOverlay("settings");
  }, []);

  const selectApp = useCallback(
    (id: string) => {
      setSelectedAppId(id);
      setPopover("none");
      showToast(`App · ${apps.find((a) => a.id === id)?.label ?? id}`, "success");
    },
    [showToast],
  );

  const selectModel = useCallback(
    (id: string) => {
      setSelectedModelId(id);
      setPopover("none");
      showToast(`Model · ${models.find((m) => m.id === id)?.label ?? id}`, "success");
    },
    [showToast],
  );

  const selectNetwork = useCallback(
    (id: string) => {
      const label = networks.find((n) => n.id === id)?.label ?? id;
      setSelectedNetworkId(id);
      setAccount((prev) => ({ ...prev, network: label }));
      setPopover("none");
      showToast(`Network · ${label}`, "success");
    },
    [showToast],
  );

  const requestWalletApproval = useCallback(() => {
    if (!tx || tx.kind === "balances") {
      if (tx?.kind === "balances") {
        showToast("Copied balances", "success");
        return;
      }
      return;
    }
    setWalletRequest({
      id: uid("wr"),
      summary: `Approve ${tx.title.toLowerCase()}`,
      network: account.network ?? "Ethereum",
      outcome: "pending",
    });
    setTx((prev) => (prev ? { ...prev, status: "pending" } : prev));
    setOverlay("wallet");
    setState("walletPending");
  }, [account.network, showToast, tx]);

  const resolveWallet = useCallback(
    (outcome: "approved" | "rejected") => {
      setWalletRequest((prev) => (prev ? { ...prev, outcome } : prev));
      setTx((prev) => (prev ? { ...prev, status: outcome } : prev));
      setOverlay("none");
      setState("completed");
      showToast(outcome === "approved" ? "Transaction approved" : "Transaction rejected", outcome === "approved" ? "success" : "error");
    },
    [showToast],
  );

  const cancelTx = useCallback(() => {
    setTx((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
    setOverlay("none");
    setWalletRequest(null);
    setState("completed");
    showToast("Cancelled locally — wallet not opened", "info");
  }, [showToast]);

  const copyAnswer = useCallback(() => {
    const text = answer ?? "";
    if (typeof navigator !== "undefined" && navigator.clipboard && text) {
      void navigator.clipboard.writeText(text);
    }
    showToast("Copied to clipboard", "success");
  }, [answer, showToast]);

  const rerun = useCallback(() => {
    const thread = threads.find((t) => t.id === activeThreadId);
    const prompt = thread?.messages.filter((m) => m.role === "user").at(-1)?.content;
    if (!prompt) return;
    send(prompt);
  }, [activeThreadId, send, threads]);

  const branch = useCallback(() => {
    const thread = threads.find((t) => t.id === activeThreadId);
    if (!thread) return;
    const branched: Thread = {
      ...thread,
      id: uid("t"),
      title: `Branch of ${thread.title}`,
      kind: "branch",
      updatedAt: Date.now(),
      messages: thread.messages.map((m) => ({ ...m, id: uid("m") })),
      trace: thread.trace?.map((s) => ({ ...s })),
      tx: thread.tx ? { ...thread.tx } : undefined,
    };
    setThreads((prev) => [branched, ...prev]);
    loadThread(branched, true);
    showToast("Branched thread", "success");
  }, [activeThreadId, loadThread, showToast, threads]);

  const disconnect = useCallback(() => {
    setOverlay("disconnect");
    setPopover("none");
  }, []);

  const confirmDisconnect = useCallback(() => {
    setAccount((prev) => ({ ...prev, connected: false, address: undefined, ens: undefined }));
    setWallets([]);
    setOverlay("none");
    setPopover("none");
    showToast("Disconnected (simulation)", "info");
  }, [showToast]);

  const connectWallet = useCallback(
    (optionId: string) => {
      const option = walletOptions.find((o) => o.id === optionId);
      if (!option) return;
      setWallets((prev) => {
        if (prev.some((w) => w.name === option.name)) return prev;
        const address =
          option.family === "evm"
            ? `0x${uid("").slice(1, 5)}…${uid("").slice(1, 5)}`
            : `${uid("").slice(1, 5)}…${uid("").slice(1, 5)}`;
        return [
          ...prev,
          {
            id: uid("w"),
            name: option.name,
            chain: option.family === "evm" ? "evm" : "solana",
            address,
            status: "linked",
          },
        ];
      });
      showToast(`${option.name} connected (simulation)`, "success");
    },
    [showToast],
  );

  const setActiveWallet = useCallback(
    (id: string) => {
      setWallets((prev) =>
        prev.map((w) => ({ ...w, status: w.id === id ? "active" : "linked" })),
      );
      const wallet = wallets.find((w) => w.id === id);
      setAccount((prev) => ({ ...prev, address: wallet?.address ?? prev.address }));
      if (wallet) showToast(`${wallet.name} is now active`, "success");
    },
    [showToast, wallets],
  );

  const unlinkWallet = useCallback(
    (id: string) => {
      const wallet = wallets.find((w) => w.id === id);
      setWallets((prev) => prev.filter((w) => w.id !== id));
      if (wallet) showToast(`${wallet.name} unlinked`, "info");
    },
    [showToast, wallets],
  );

  const showSecretGate = useCallback(() => {
    setGate(secretGate);
    setOverlay("gate");
    setState("requiredSecrets");
  }, []);

  const showPaymentGate = useCallback(() => {
    setGate(paymentGate);
    setOverlay("gate");
    setState("paymentRequired");
  }, []);

  const simulateConnectWalletPay = useCallback(() => {
    setPaymentMethods((prev) => ({
      ...prev,
      wallet_pay: { status: "ready" },
    }));
    closeOverlay();
    showToast("Wallet pay connected (simulation)", "success");
  }, [closeOverlay, showToast]);

  const runCommand = useCallback(
    (
      action:
        | "app"
        | "network"
        | "wallets"
        | "settings-bots"
        | "settings-secrets"
        | "simulate-payment"
        | "simulate-secret",
    ) => {
      setPopover("none");
      if (action === "app") setPopover("app");
      else if (action === "network") setPopover("network");
      else if (action === "wallets") openOverlay("wallets");
      else if (action === "settings-bots") openOverlay("settings", "bots");
      else if (action === "settings-secrets") openOverlay("settings", "secrets");
      else if (action === "simulate-payment") showPaymentGate();
      else if (action === "simulate-secret") showSecretGate();
    },
    [openOverlay, showPaymentGate, showSecretGate],
  );

  const snapshot: ChatSnapshot = useMemo(
    () => ({
      state,
      theme,
      account,
      threads,
      activeThreadId,
      draft,
      selectedAppId,
      selectedModelId,
      selectedNetworkId,
      wallets,
      trace,
      answer,
      tx,
      walletRequest,
      gate,
      overlay,
      pendingDeleteThreadId,
      popover,
      settingsTab,
      sidebarCollapsed,
      toast,
      workingElapsedSec,
    }),
    [
      account,
      activeThreadId,
      answer,
      draft,
      gate,
      overlay,
      pendingDeleteThreadId,
      popover,
      selectedAppId,
      selectedModelId,
      selectedNetworkId,
      settingsTab,
      sidebarCollapsed,
      state,
      theme,
      threads,
      toast,
      trace,
      tx,
      walletRequest,
      wallets,
      workingElapsedSec,
    ],
  );

  return {
    snapshot,
    setDraft,
    send,
    stop,
    newChat,
    selectThread,
    renameThread,
    requestDeleteThread,
    confirmDeleteThread,
    moveThread,
    setTheme,
    toggleSidebar: () => setSidebarCollapsed((v) => !v),
    openPopover,
    closePopover,
    openOverlay,
    closeOverlay,
    setSettingsTab,
    selectApp,
    selectModel,
    selectNetwork,
    resolveWallet,
    cancelTx,
    requestWalletApproval,
    copyAnswer,
    rerun,
    branch,
    disconnect,
    confirmDisconnect,
    connectWallet,
    setActiveWallet,
    unlinkWallet,
    showSecretGate,
    showPaymentGate,
    simulateConnectWalletPay,
    billing: account.billing ?? seedAccount.billing!,
    usageOverview,
    paymentMethods,
    dismissToast: () => setToast(null),
    runCommand,
    popoverAnchor,
    mobileNavOpen,
    openMobileNav: () => setMobileNavOpen(true),
    closeMobileNav: () => setMobileNavOpen(false),
  };
}

# Aomi Chat — Architecture Map & Checklist

> **Purpose:** Reference for a separate clickable-mock redesign repo (like Aomi Build).  
> **Not included:** Visual redesign, fonts, colors, or invented UI craft.  
> **Design reference:** Still pending from product. Do not invent a look without it.  
> **Last updated:** 2026-07-18

Related live code lives mainly in:

- `apps/portal/` — host, shell, settings, BFF
- `apps/shadcn-registry/` — `AomiFrame` chat UI
- `packages/react/` — runtime / contexts
- `packages/client/` — `AomiClient` / `ClientSession`
- `packages/account/` — BetterAuth session → AccountBearer proxy

Build-process precedent: `apps/aomi-build/AI-BUILDER-EXPERIENCE.md`

---

## 1. System layers

| Layer | Owns | Key files |
| --- | --- | --- |
| Portal host | Next layout, wallet providers, theme init, same-origin BFF | `apps/portal/src/app/layout.tsx`, `components/providers/wallet-providers.tsx`, `app/api/[...slug]/route.ts` |
| Portal shell | Settings modal/controller, account menu, app URL lock, payment-aware fetch, secret gate | `components/shell/portal-aomi-frame.tsx`, `components/settings/settings-shell.tsx`, `portal-account-menu.tsx` |
| Widget UI | Sidebar, header, thread, composer, notifications, invisible tx bridge | `apps/shadcn-registry/src/components/aomi-frame.tsx`, `assistant-ui/thread.tsx`, `working-trace.tsx` |
| React runtime | Threads, messages, control state, sessions, SSE/poll, wallet requests, assistant-ui adapters | `packages/react/src/runtime/*`, `contexts/*` |
| Trust boundary | BetterAuth cookie → canonical user → AccountBearer → backend; external wallet prompts | `packages/account`, `runtime-tx-handler.tsx`, wallet-kit |

### Composition (live)

```text
RootLayout
└─ WalletProviders
   └─ SettingsInitializer
      └─ SettingsShell
         ├─ SettingsControllerProvider
         ├─ AccountOverviewProvider
         └─ PortalAomiFrame
            └─ AomiFrame.Root
               └─ AomiRuntimeProvider
                  ├─ Thread / Notify / ExtUser / Control / Event / Core
                  ├─ ThreadListSidebar
                  ├─ Header (settings + PortalAccountMenu)
                  ├─ Thread + Composer (+ control bar)
                  ├─ SettingsModal
                  ├─ RequiredSecretsGate
                  ├─ NotificationToaster
                  └─ RuntimeTxHandler
```

### Request path

```text
Browser → relative /api/* (+ X-Thread-Id)
  → Portal BFF (strip cookies/Authorization; mint AccountBearer)
  → Rust backend

Wallet path:
Backend wallet request → ClientSession → RuntimeTxHandler → external wallet UI
```

---

## 2. Routes

| Route | Role | First mock? |
| --- | --- | --- |
| `/` | Full chat portal | Yes |
| `/settings` | Redirect → `/?settings=<tab>` (modal over chat) | Yes (modal) |
| `/deployments*` | Projects / deploy | No |
| `/device-auth*` | CLI auth | No |
| `/mcp/connect` | MCP OAuth | No |

---

## 3. Product surfaces

| Surface | Behavior to preserve | Source |
| --- | --- | --- |
| Sidebar / threads | New Chat, skeletons, active row, archive (no delete) | `threadlist-sidebar.tsx`, `thread-list.tsx` |
| Header | Toggle, title, settings gear, account menu | `aomi-frame.tsx`, `portal-aomi-frame.tsx` |
| Empty chat | Greeting + suggestions (4 desktop / 2 mobile) | `thread.tsx` `ThreadWelcome` |
| Messages | User/assistant, edit, copy, rerun, branch picker, errors | `thread.tsx`, `markdown-text.tsx` |
| Working trace | Tool steps + chips; final answer **outside** trace; buffer while running | `working-trace.tsx`, `tool-interpreter/` |
| Composer / controls | Input, send↔stop, network/model/app | `thread.tsx`, `control-bar/*` |
| Wallet / account | Connect, EVM/Solana picker; portal menu + credits | `connect-button`, `wallet-picker`, `portal-account-menu` |
| Approvals | No in-app tx center — external wallet prompts | `runtime-tx-handler.tsx` |
| Notifications | Toasts; system messages → notices | `notification.tsx` |
| Gates | Payment/BYOK; required secrets | `payment-required-gate`, `secret-gate`, `required-secrets-gate` |
| Settings | Modal: General, Usage, App Keys, Bots, Secrets, BYOK | `components/settings/*`, `features/*` |

---

## 4. Interaction state matrix

| State | What the UI must show |
| --- | --- |
| Anonymous | Local empty draft; connect affordances; no remote thread list |
| Connecting | Wallet/provider owns progress |
| Connected | Account summary can lazy-load; remote threads hydrate |
| Thread loading | Sidebar + conversation skeletons |
| Empty thread | Greeting, suggestions, composer |
| Submitting | Optimistic user message; stop; short pending indicator |
| Working | Collapsible Working trace; final answer buffered |
| Completed | Trace collapses; final answer reveals; copy/rerun/edit |
| Failed send | Optimistic message kept with error |
| 402 payment | Payment notice + blocking BYOK path |
| Required secrets | Blocking credential overlay / switch app |
| Wallet pending | Network switch guarded; external/simulated approval |
| Settings | Skeleton / retry / empty / success; two-click destructive confirms |

---

## 5. Checklist — before you design

- [ ] Product direction confirmed (separate mock repo, like Build)
- [ ] **Design reference received** (sketch / Figma / screenshots) — do not invent look without it
- [ ] Repo name agreed (`aomi-labs/aomi-chat-design`)
- [ ] Stack agreed (Next.js 16 + React 19 + Tailwind 4)
- [ ] Scope agreed (core journey: empty → chat → trace → wallet → settings)
- [ ] Non-goals written (no real auth, signing, BFF, secrets, deployments)

## 6. Checklist — repo / mock infrastructure

- [ ] Create GitHub repo `aomi-labs/aomi-chat-design`
- [ ] Scaffold Next app: thin `page.tsx` → feature orchestrator
- [ ] Add `CHAT-EXPERIENCE.md` (map, journey, mock-vs-target, bring/don't copy, phases)
- [ ] Typed `contracts.ts` + `fixtures.ts` (seeded threads/messages/tools/wallet/settings)
- [ ] `use-chat-session` timer driver with honest **Simulation** labels
- [ ] Versioned localStorage for UI prefs only — never real keys/cookies/message bodies
- [ ] One shell/runtime tree — settings must not remount a second provider
- [ ] Click-through script for product review gate

## 7. Checklist — core journey coverage

- [ ] Empty chat + suggestions
- [ ] Send → submitting → working trace → completed answer
- [ ] Stop / New Chat actually work
- [ ] Simulated wallet approve + reject mid-trace
- [ ] Settings modal (General + Usage minimum)
- [ ] Account menu identity + credits fixture
- [ ] One blocking gate fixture (payment or required secret)
- [ ] Desktop + usable mobile (sidebar sheet)

---

## 8. Preserve / fake / never

### Preserve (architecture contracts)

- Single runtime tree (no second client for settings)
- Thread lifecycle: local draft → first send creates remote thread
- Working-trace rule: final answer never lives inside the trace
- Per-thread app/model; disabled while processing
- Wallet approvals require an explicit user action (even if simulated)
- Same-origin mental model (`/api` relative) even when faked
- Esc, modal focus trap, reduced-motion basics

### Safe to fake

- Thread titles, messages, timestamps, credits, usage tables
- Tool names/results and Working-trace timing
- Wallet address / network labels and approval outcomes
- Settings load/error/empty/success fixtures
- App/model/network catalogs

### Never copy into the mock

- Real `.env`, BetterAuth cookies, AccountBearer keys, JWTs
- Para/Privy tokens, WalletConnect secrets
- Executable calldata, RPC, real signatures or broadcasts
- Raw app keys, BotFather tokens, BYOK secrets
- Production thread/account/deployment IDs or live message data

---

## 9. Suggested mock repo layout (scaffold only)

```text
aomi-chat-design/
  README.md
  CHAT-EXPERIENCE.md          # write after design reference exists
  src/app/page.tsx            # thin → ChatMockView
  src/features/chat/
    chat-view.tsx
    contracts.ts
    fixtures.ts
    hooks/use-chat-session.ts
    components/               # surfaces from §3 — craft TBD
```

Do not implement visual components until a design reference is supplied.

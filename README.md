# aomi-chat-design

Clickable **design mock** of the Aomi chat journey — a standalone playground
(like Aomi Build) for iterating on the chat experience without the real
portal, auth, backend, or wallet signing.

> **Simulation only.** No real auth, signing, BFF, secrets, or production data.
> See "Never copy into the mock" in [`CHAT-ARCHITECTURE.md`](./CHAT-ARCHITECTURE.md) §8.

## Status

**Interactive fixture mock** synced to Paper V2 artboards (Motivated quartz /
aomi chat - references). Every primary control drives local simulation state.

Design source: [Paper — aomi chat references](https://app.paper.design/file/01KXV9NTBV7TMYNMXDG9E6HNVA/1-0)

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
- Heroicons (UI chrome) + official Aomi / chain / wallet brand marks

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Layout

```text
CHAT-ARCHITECTURE.md
src/app/page.tsx
src/features/chat/
  chat-view.tsx               # thin renderer of useChatSession
  contracts.ts
  fixtures.ts                 # threads, catalogs, timelines
  hooks/use-chat-session.ts   # theme, overlays, menus, lifecycle timers
  components/                 # sidebar, composer, conversation, settings, overlays
```

## What works (simulation)

- Real composer textarea + Enter / Send ↔ Stop
- `+` quick-access menu → app / network / wallets / settings shortcuts
- App, model, network selectors
- Sidebar collapse + Aomi workspace menu + account menu / wallet picker
- Balance, bridge, deploy, and swap thread fixtures
- Working-trace lifecycle with timed steps
- Wallet approve / reject; **Cancel cancels locally (does not open wallet)**
- Copy / Rerun / Branch feedback toasts
- All six settings tabs + disconnect confirm
- Theme toggle

## Scope

Core journey only (per `CHAT-ARCHITECTURE.md` §7). No deployments, device-auth,
or MCP flows. No invented product features (uploads, thread search/rename, etc.).

# aomi-chat-design

Clickable **design mock** of the Aomi chat journey — a standalone playground
(like Aomi Build) for iterating on the chat experience without the real
portal, auth, backend, or wallet signing.

> **Simulation only.** No real auth, signing, BFF, secrets, or production data.
> See "Never copy into the mock" in [`CHAT-ARCHITECTURE.md`](./CHAT-ARCHITECTURE.md) §8.

## Status

Skeleton scaffold. **Visual design is intentionally not implemented** — it is
waiting on a design reference (sketch / Figma / screenshots). The current UI is
structural placeholders only; do not invent a look before the reference lands.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Layout

```text
CHAT-ARCHITECTURE.md          # journey map, surfaces, state matrix, guardrails
src/app/page.tsx              # thin → ChatMockView
src/features/chat/
  chat-view.tsx               # thin orchestrator (structural placeholders)
  contracts.ts                # typed contracts (surfaces + state matrix)
  fixtures.ts                 # safe-to-fake seed data only
  hooks/use-chat-session.ts   # single simulation driver
  components/                 # surface components — added with the design
```

## Scope

Core journey only (per `CHAT-ARCHITECTURE.md` §7): empty → chat → working trace
→ wallet approval → settings. No deployments, device-auth, or MCP flows.

## Next steps

1. Receive the design reference.
2. Author `CHAT-EXPERIENCE.md` (map, mock-vs-target, phases).
3. Build surface components under `src/features/chat/components/`.
4. Flesh out `use-chat-session` timing with honest simulation labels.

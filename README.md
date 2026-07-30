# Aomi Portal

Interactive front-end prototype of the [Aomi](https://aomi.dev) portal — chat, wallets, settings, billing, and apps store. Real UI architecture and complete user journeys, running locally without production auth or backend dependencies.

Sandbox for what ships at [chat.aomi.dev](https://chat.aomi.dev). Proven surfaces port incrementally into [`aomi-labs/aomi`](https://github.com/aomi-labs/aomi) → `apps/portal`.

> **Simulation only.** No real auth, signing, BFF, or secret storage.

---

## What works

- **Chat shell** — sidebar, threads, composer, working trace, transaction previews (swap, bridge, deploy, balances)
- **Wallet flows** — approve / reject / cancel, plus gate overlays (payment required, secrets missing, disconnect)
- **Settings** — six-tab modal over chat (General, Account, Usage, App Keys, Bots, Secrets)
- **Billing** — usage dashboard and full **`/statement`** view with itemized line items
- **Apps store** — modal overlay with install/uninstall, search, and catalog (matches production Packages pattern)
- **Session controller** — single hook drives overlays, tabs, gates, and thread lifecycle

---

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · `@aomi-labs/design`

---

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Related

- [aomi-labs/aomi](https://github.com/aomi-labs/aomi) — production monorepo
- [aomi-labs/design](https://github.com/aomi-labs/design) — shared design system
- [`CHAT-ARCHITECTURE.md`](./CHAT-ARCHITECTURE.md) — architecture map & production parity checklist

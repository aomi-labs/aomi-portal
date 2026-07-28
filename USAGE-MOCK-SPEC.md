# Usage & Statement — FE mock spec

Build these three views entirely from **`user-fixture.json`** (repo root). Everything is
pre-rolled — no computation beyond reading fields and simple display formatting. All data
is simulation-only (no real auth/secrets). Types live in
`src/features/chat/contracts.ts`; the `usage` block already conforms to `UsageStatement`.

## The model in one line

A user is charged on **three subjects** — `model`, `tool use`, `outcome` — and each charge
is attributed to **the app the activity ran under**. Same three subjects as the builder
statement; this is the user side. Billing rule that drives everything visible:

| App setting | Model billed to user |
|---|---|
| native `default` app | **base cost, no markup** |
| third-party, managed key, not BYOK (`somm`, `meme coin trader`) | **base + 10%** |
| third-party, app brings own key (`foo app`, `appByok:true`) | **$0 — not billed by Aomi** |

The **user never BYOKs** (`account.byok:false`, `usage.byokTurns:0`). "BYOK" only ever
appears as an *app* setting, never the user's.

## Three views, one drill path

```
Settings › Usage  →  [1] SUMMARY (popup)
                          └ "View full statement →"
                             →  DETAIL PAGE, two toggles:
                                  [2] By app   (matrix)
                                  [3] Itemized (full statement)
```

---

## View 1 — Usage summary (popup, in Settings › Usage)

Compact. A table + one status line + a link. Bind to `summary`, `payment`, `period`.

**Header:** `Usage · {period.periodLabel}`  →  "Usage · July 2026"

**Table** (3 rows + total):

| Row | Label | Detail (col 2) | Amount | Binding |
|---|---|---|---|---|
| 1 | AI & tools | `{turns} turns · {toolCalls} calls` | `summary.computeUsd` | see note |
| 2 | On-chain fees | `{txns} transactions` | `summary.onchainUsd` | see note |
| 3 | **Total** | `{period.periodLabel}` | **`summary.totalUsd`** | bold row |

- computeUsd = `$37.04`, onchainUsd = `$46.75`, totalUsd = **`$83.79`**.
- turns = sum of `apps[].model.turns` (188); calls = sum of `apps[].tool.calls` (133);
  txns = sum of `apps[].outcome.txns` (4). (Or hardcode from the fixture; they don't change.)

**Status line** (small, muted): `Credits {payment.allowanceCredits.used}/{included} · paid via {payment.settledVia}`
→ "Credits 500/500 · paid via Coinbase x402"

**Link:** `View full statement →` (opens Detail page).

**Variant** (if room) — swap col 2 for a share bar: `computeUsd/totalUsd` = 44%, `onchainUsd/totalUsd` = 56%.

---

## View 2 — By app (matrix) · Detail page toggle "By app"

The pivot: **rows = apps, columns = the three subjects.** Bind to `byApp[]` + `columnTotals`.

| | model | tool use | outcome | *(app total)* |
|---|--:|--:|--:|--:|
| default | $19.95 | — | — | $19.95 |
| somm | $12.65 | $0.29 | $30.75 | $43.69 |
| foo app | $0.00 | $0.18 | — | $0.18 |
| meme coin trader | $3.85 | $0.12 | $16.00 | $19.97 |
| **Total** | **$36.45** | **$0.59** | **$46.75** | **$83.79** |

Rules:
- A **`null` cell renders as `—`** (em dash, muted) — means "this app doesn't charge that
  subject," which is structural, not $0. (`default` has no tool/outcome; `foo app` no outcome.)
- **`$0.00` is a real charge of zero** (foo app model — app BYOK). Render the number, not a
  dash, and tag it (small "app key" chip) so it's distinct from `—`.
- App-total column and Total row optional (from `byApp[].totalUsd` / `columnTotals`).
- **Hover a value** → tooltip with the count behind it (e.g. somm outcome → "2 transactions
  · 15 bps"). Pull from the matching `apps[]` entry.
- Column headers `model · tool use · outcome` are the fixed subject set; keep this order.

---

## View 3 — Full statement (Detail page toggle "Itemized")

The audit view. Two sections mirroring the two rails. Bind to `apps[]` (primary) or the flat
`usage.aiTools[]` / `usage.onchain[]` (already `UsageStatement`-shaped).

### Statement header

| Field | Binding | Example |
|---|---|---|
| Account | `account.handle` (`account.address` truncated under) | mira.eth · 0x7A3f…9C21 |
| Period | `period.from`–`period.to`, issued `period.issued` | Jul 1–31, 2026 · issued Aug 1 |
| Total | `summary.totalUsd` | **$83.79** |
| Paid via | `payment.settledVia` + on-chain note | Coinbase x402 · on-chain in-token |

### Section A — Compute (off-chain · credits, 1cr=$0.01)

Group by app; under each app, one row per model + the app's tool rows. Iterate `apps[]`
where `model` or `tool` present.

Per app group header: `{name}` + a **settings chip**:
- native → chip "native · base"
- managed, not BYOK → chip "managed · +10%"  (accent)
- app BYOK → chip "app key · model free"

Per-model row (from `apps[].model.byModel[]`):

| col | binding | example |
|---|---|---|
| Model | friendly name of `model` | Opus 4.8 |
| Detail | `in {inputTokens} · out {outputTokens}` (M/k) | in 0.80M · out 0.24M |
| Turns | `turns` | 25 |
| Base | `baseUsd` | $10.00 |
| Charged | `chargedUsd` | $10.00 (somm Opus: $4.40, +10%) |

- For managed apps show **both Base and Charged** so the +10% is visible; put a small `+10%`
  pill on the Charged cell. For `default`, base==charged (no pill).
- For `foo app` (BYOK): show the model row with **Charged = `free`** and a note
  "paid by foo app's own key" (`byModel[].note`). Base may be shown greyed or omitted.

Per-tool row (from `apps[].tool.items[]`):

| Tool | Calls | Unit | Charge |
|---|--:|---|--:|
| `somm.get_quote` | 40 | 0.5 cr | $0.20 |

Section A subtotal = `summary.computeUsd` = **$37.04**.

### Section B — On-chain fees (paid in the flowed token)

One row per fee leg. Iterate `apps[].outcome.items[]` (or flat `usage.onchain[]`).

| col | binding | example |
|---|---|---|
| Date | `date` | Jul 3 |
| App · action | `{app.name} · {action}` | Somm · vault deposit |
| Flow | `flow` | 5.00 ETH |
| Rate | `bps` bps | 15 bps |
| Fee (token) | `feeToken` | 0.0075 ETH |
| Fee ($) | `usd` | $18.75 |
| Chain | `chain` badge | Ethereum |
| Tx | `tx` truncated → block explorer | 0x9c4a…b5c1 |

Section B subtotal = `summary.onchainUsd` = **$46.75**.

### Statement footer — "Where your money went" (optional but recommended)

Three recipients (this is the user-facing version of the fee model's "who gets what"):
- **Aomi** — model compute on managed/native (`default` $19.95 + managed base portions).
- **The apps** — their tool fees + outcome fees (Somm $31.04, meme trader $16.12, foo $0.18).
- **Your model provider** — nothing this period (user never BYOK); would show for BYOK.

Optionally note the mirror: the outcome + tool fees the user paid the apps re-appear on the
*builders'* statements as Aomi's 10%/30% take.

---

## Formatting rules (apply everywhere)

| Thing | Rule | Example |
|---|---|---|
| USD | `$` + 2 decimals | $12.65 |
| Not-applicable cell | em dash, muted | — |
| Zero charge (real) | the number or `free` + chip | $0.00 / free |
| Tokens | M ≥ 1e6, k ≥ 1e3, 2 sig | 1.30M · 320k |
| Credits | 1 cr = $0.01; show cr in tool unit | 0.5 cr |
| Model name | id → friendly (`claude-opus-4-8` → "Opus 4.8") | Sonnet 4.6 |
| Tx hash | first 6 + `…` + last 4, link out | 0x9c4a…b5c1 |
| Chain | pill: Ethereum / Base / Solana | |
| Markup | `+10%` pill on managed model Charged cells | |
| bps | integer + " bps" | 15 bps |

## States & edge cases

- **Over allowance:** `usage.creditsUsed (3704) > creditsIncluded (500)`. Meter caps visually
  at 100% with an "over" style; show `payment.x402SettledUsd` ($32.04) as billed overage
  beside the $5.00 allowance applied. Don't render a >100% bar.
- **`—` vs `$0.00`:** never conflate. `—` = subject not charged by this app; `$0.00` = charged
  zero (BYOK app model). Different glyphs, different meaning.
- **Empty period:** if all subtotals 0, show "No usage this period" not an empty grid.
- **First-party outcome:** not in this fixture, but if an app's outcome beneficiary is Aomi,
  the "goes to" is Aomi, not the app — leave room for that label to differ per row.
- **Chains:** rows can be on different chains (ETH, Base); don't assume one network.

## Data-binding cheat-sheet

| UI element | JSON path |
|---|---|
| Summary totals | `summary.{computeUsd,onchainUsd,totalUsd}` |
| Summary status line | `payment.allowanceCredits`, `payment.settledVia` |
| Matrix rows | `byApp[]` (+ `columnTotals` for the total row) |
| Matrix hover detail | matching `apps[]` entry (`.outcome.txns`, `.tool.calls`) |
| App group + settings chip | `apps[].name`, `apps[].settings` |
| Per-model rows | `apps[].model.byModel[]` (+ `.markupPct`, `.markupUsd`) |
| Per-tool rows | `apps[].tool.items[]` |
| On-chain rows | `apps[].outcome.items[]` (or flat `usage.onchain[]`) |
| Account header | `account.*`, `period.*` |
| Flat statement (drop-in for existing components) | `usage.aiTools[]`, `usage.onchain[]` |

## Copy deck (exact strings)

- Summary header: `Usage · July 2026`
- Summary rows: `AI & tools`, `On-chain fees`, `Total`
- Summary status: `Credits 500/500 · paid via Coinbase x402`
- Link: `View full statement →`
- Matrix columns: `model` · `tool use` · `outcome`
- Section A title: `Compute · off-chain`  · subtitle `AI models + app tool calls, in credits`
- Section B title: `On-chain fees`  · subtitle `paid in the flowed token, on your own transactions`
- Settings chips: `native · base`, `managed · +10%`, `app key · model free`
- BYOK-app model note: `paid by {app} 's own key`
- Empty: `No usage this period`

## Reconciliation (must hold in the mock)

`model $36.45 + tool $0.59 + outcome $46.75 = $83.79`
· compute (model+tool) = `$37.04` · on-chain = `$46.75`
· managed markup passed to user = `$1.50` (somm $1.15 + meme $0.35; default $0, foo $0).
Every column total, app total, and section subtotal is pre-computed in the fixture — the mock
must display these exact numbers.

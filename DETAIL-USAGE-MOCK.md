# Detail usage page — content mock

The fully-rendered detail page, every line from **`user-fixture.json`**. This is the *what
it looks like* companion to `USAGE-MOCK-SPEC.md` (the *how to build it*). Numbers here are
the exact strings the mock must show. Two toggle views: **By app** and **Itemized**.

---

## Page header

> **Account statement**
> `mira.eth` · 0x7A3f…9C21 · Wallet · Pro
> **Jul 1 – 31, 2026** · issued Aug 1, 2026
>
> **Total charged $83.79**  ·  Compute $37.04  ·  On-chain $46.75
> Paid via Coinbase x402 (compute) · on-chain in-token (fees)

Toggle:  **[ By app ]  [ Itemized ]**   ·  Period: ◀ July 2026 ▶

---

## Toggle 1 — By app

| App | model | tool use | outcome | App total |
|---|--:|--:|--:|--:|
| default *(native)* | $19.95 | — | — | **$19.95** |
| somm *(managed · +10%)* | $12.65 | $0.29 | $30.75 | **$43.69** |
| foo app *(app key · model free)* | $0.00 | $0.18 | — | **$0.18** |
| meme coin trader *(managed · +10%)* | $3.85 | $0.12 | $16.00 | **$19.97** |
| **Total** | **$36.45** | **$0.59** | **$46.75** | **$83.79** |

Hover (tooltips):
- default · model → "80 turns · base cost, no markup"
- somm · model → "38 turns · base $11.50 + 10% = $12.65"
- somm · outcome → "2 transactions · 15 bps of flow"
- foo app · model → "20 turns · foo app uses its own key — not billed"
- foo app · tool → "60 calls"
- meme coin trader · outcome → "2 swaps · 10 bps of flow"

`—` = app doesn't charge that subject · `$0.00` = charged zero (BYOK app).

---

## Toggle 2 — Itemized

### Section A — Compute · off-chain
*AI models + app tool calls, billed in credits (1 cr = $0.01).*

#### default  `native · base`

| Model | Detail | Turns | Base | Charged |
|---|---|--:|--:|--:|
| Opus 4.8 | in 0.80M · out 0.24M | 25 | $10.00 | $10.00 |
| Sonnet 4.6 | in 1.30M · out 0.32M | 40 | $8.70 | $8.70 |
| Haiku 4.5 | in 0.50M · out 0.15M | 15 | $1.25 | $1.25 |
| **Models subtotal** | 80 turns | | $19.95 | **$19.95** |

#### somm  `managed · +10%`

| Model | Detail | Turns | Base | Charged |
|---|---|--:|--:|--:|
| Sonnet 4.6 | in 1.00M · out 0.30M | 30 | $7.50 | $8.25 `+10%` |
| Opus 4.8 | in 0.30M · out 0.10M | 8 | $4.00 | $4.40 `+10%` |
| **Models subtotal** | 38 turns · +$1.15 markup | | $11.50 | **$12.65** |

| Tool | Calls | Unit | Charge |
|---|--:|---|--:|
| `somm.get_quote` | 40 | 0.5 cr | $0.20 |
| `somm.deposit` | 3 | 2.0 cr | $0.06 |
| `somm.rebalance` | 2 | 1.5 cr | $0.03 |
| **Tools subtotal** | 45 calls | | **$0.29** |

#### foo app  `app key · model free`

| Model | Detail | Turns | Base | Charged |
|---|---|--:|--:|--:|
| Haiku 4.5 | in 0.60M · out 0.15M | 20 | ~~$1.35~~ | **free** |
| **Models subtotal** | 20 turns · paid by foo app's own key | | | **$0.00** |

| Tool | Calls | Unit | Charge |
|---|--:|---|--:|
| `foo.lookup` | 60 | 0.3 cr | $0.18 |
| **Tools subtotal** | 60 calls | | **$0.18** |

#### meme coin trader  `managed · +10%`

| Model | Detail | Turns | Base | Charged |
|---|---|--:|--:|--:|
| Haiku 4.5 | in 1.50M · out 0.40M | 50 | $3.50 | $3.85 `+10%` |
| **Models subtotal** | 50 turns · +$0.35 markup | | $3.50 | **$3.85** |

| Tool | Calls | Unit | Charge |
|---|--:|---|--:|
| `memetrader.scan` | 20 | 0.2 cr | $0.04 |
| `memetrader.snipe` | 8 | 1.0 cr | $0.08 |
| **Tools subtotal** | 28 calls | | **$0.12** |

> **Section A — Compute subtotal $37.04**  (models $36.45 + tools $0.59)

### Section B — On-chain fees
*Paid in the flowed token, atomically on your own transactions.*

| Date | App · action | Flow | Rate | Fee (token) | Fee ($) | Chain | Tx |
|---|---|--:|--:|--:|--:|---|---|
| Jul 3 | Somm · vault deposit | 5.00 ETH | 15 bps | 0.0075 ETH | $18.75 | Ethereum | 0x9c4a…b5c1 |
| Jul 11 | meme coin trader · swap | 12,000 USDC | 10 bps | 12.00 USDC | $12.00 | Ethereum | 0x3d2f…a8f2 |
| Jul 19 | Somm · rebalance | 3.20 ETH | 15 bps | 0.0048 ETH | $12.00 | Ethereum | 0x7f81…7dd0 |
| Jul 22 | meme coin trader · swap | 4,000 USDC | 10 bps | 4.00 USDC | $4.00 | Base | 0xa15c…9013 |

> **Section B — On-chain subtotal $46.75**

---

## Statement footer — Where your money went

| Recipient | What | Amount |
|---|---|--:|
| **Aomi** | all model compute (managed + native), incl. $1.50 markup | $36.45 |
| **The apps** | Somm $31.04 · meme coin trader $16.12 · foo app $0.18 | $47.34 |
| **Your model provider** | none — you never brought your own key | $0.00 |
| | **Total** | **$83.79** |

> **The mirror:** the $47.34 you paid the apps re-appears on *their* builder statements,
> where Somm and meme coin trader remit Aomi's take — 10% of tool fees + 30% of outcome fees,
> ≈ **$14.08** (reserved). Your statement is the user side of the same three-subject ledger.

---

## Totals & reconciliation (must match exactly)

| | |
|---|--:|
| Model | $36.45 |
| Tool use | $0.59 |
| Outcome | $46.75 |
| **Total** | **$83.79** |
| — of which managed markup passed to you | $1.50 |
| Compute (model + tool, off-chain) | $37.04 |
| On-chain (outcome, in-token) | $46.75 |
| Allowance applied · x402 settled | $5.00 · $32.04 |

Every figure is pre-computed in `user-fixture.json` (`summary`, `columnTotals`, `byApp`,
`apps[].*`). The mock displays these; it does not recompute.

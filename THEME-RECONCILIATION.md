# Chat mock ↔ `@aomi-labs/design` — theme reconciliation

> **Purpose:** Decide how the interactive chat mock (`aomi-portal`) aligns with the
> official design system before any token/CSS apply.  
> **Sources:** `src/app/globals.css` (mock) · `../design/src/tokens/tokens.css` (DS) ·
> live portal on `main` (shadcn zinc + monochrome chat roles)  
> **Last updated:** 2026-07-24  
> **Status:** Draft for review — **no code apply until product signs off**

---

## 1. Executive summary

| Question | Mock today (`aomi-portal`) | `@aomi-labs/design` |
|----------|--------------------------------|---------------------|
| **Chat canvas** | Warm **cream** light stack; cool **zinc** dark stack (layered planes) | **Cool zinc** light + dark; chat surface intentionally **monochrome** |
| **Primary CTA** | **Orange** (light) / **Lemon** (dark) gradient buttons | **Ink** near-black (light) / near-white (dark) via `--aomi-primary` |
| **Interactive accent** | Same as CTA (orange/lemon) | **Sky** `#5288C2` via `--aomi-accent-interactive` |
| **Typography** | **Geist** only (UI + body) | **PT Serif** display + **Geist** body + **Geist Mono** code |
| **Radius** | 8 / 12 / 16 px | Pill-first; composer 30px; cards lg/xl |
| **Elevation** | Composer shadow on dock; mostly flat planes | Deliberately **flat**; optional glass composer |

**Recommendation:** Do **not** replace the mock with raw ink/sky. Adopt **`@aomi-labs/design` semantic roles** as the wiring layer, and register a **`chat-product` theme override** for surfaces + accent that preserves the mock’s conversational feel while staying compatible with the published package.

---

## 2. Why both can be true

The design repo already anticipates **multiple surfaces**:

- **Landing / marketing** — cool white, ink CTAs, sky accents, PT Serif heroes (`--aomi-landing-*`)
- **Portal chat (live)** — monochrome zinc, muted user bubbles, transparent agent (`--aomi-chat-*`)
- **Build (apps/build)** — vendored DS tokens (ink/sky) via `aomi-design-tokens.css`

The mock is a **third lane**: product-dense chat (wallets, tx preview, trace, pickers) with **stronger accent** than live portal. That is valid if named explicitly as a **product theme**, not an accident.

---

## 3. Side-by-side token map

### 3.1 Light theme — surfaces

| Mock role | Mock value | DS semantic role | DS light value | Reconciliation |
|-----------|------------|------------------|----------------|----------------|
| `--background` | `#fafaf9` | `--aomi-bg` | `#ffffff` (cool-0) | **Override:** map mock `--background` → `--aomi-bg-subtle` or new `--aomi-chat-bg-warm` using `--aomi-neutral-50` `#fcf7f6` (closest warm paper in DS) |
| `--surface` | `#f8f7f3` | `--aomi-bg-subtle` | `#f4f4f5` (cool-100) | Use warm neutral ramp for sidebar, not cool-100 |
| `--surface-2` | `#f5f4ef` | `--aomi-state-hover` | `#e4e4e7` (cool-200) | Keep mock chip/hover via warm `--aomi-neutral-100` |
| `--elevated` | `#ffffff` | `--aomi-surface-raised` | `#ffffff` | **Align** |
| `--border` | `rgba(0,0,0,0.1)` | `--aomi-border` | `#e4e4e7` | **Align** (or keep alpha border as chat override) |
| `--fg` | `#201f1c` | `--aomi-text` | `#09090b` | **Close** — mock slightly warmer ink |
| `--muted` | `#79776e` | `--aomi-text-muted` | `#71717a` | **Align** |

### 3.2 Dark theme — surfaces

| Mock role | Mock value | DS dark | Reconciliation |
|-----------|------------|---------|----------------|
| `--background` | `#101013` | `--aomi-bg` → `#09090b` | Mock is **slightly lifted** vs DS cool-950 — keep for depth; document as chat override |
| `--surface` | `#17171b` | `--aomi-bg-subtle` → `#18181b` | **Near-align** (mock +1 step lift for sidebar) |
| `--surface-2` | `#1f1f24` | `--aomi-state-hover` → `#27272a` | Mock between DS subtle and raised — keep for chips |
| `--elevated` | `#27272b` | `--aomi-surface-raised` → `#27272a` | **Align** |
| `--fg` | `#f4f4f5` | `--aomi-text` → `#fafafa` | **Align** |
| `--muted` | `#8b8b96` | `--aomi-text-muted` → `#a1a1aa` | Mock slightly cooler — OK |

### 3.3 Accent & actions

| Mock role | Mock light | Mock dark | DS role | DS value | Reconciliation |
|-----------|------------|-----------|---------|----------|----------------|
| CTA / Send / Approve | `#ff6a00` → `#fa5111` | `#c8f542` → `#b4e62a` | `--aomi-primary` | Ink / inverted ink | **Do not map CTA → primary.** Map to new **`--aomi-chat-accent`** (product override) |
| Selected nav / status dot | accent color | accent color | `--aomi-accent-selected` | Sky-500 | Active thread dot: use **chat-accent**, not sky |
| Links / focus | `--info` `#2f6feb` | — | `--aomi-accent-interactive` | Sky-500 | Secondary interactive: **sky is OK** for links/focus rings |
| Success / Active wallet | `#2f9e44` / `#3fb950` | same | `--aomi-success-500` | `#2e9e6b` | **Align** — status ≠ brand (both systems agree) |

### 3.4 Typography

| Use | Mock | DS | Reconciliation |
|-----|------|-----|----------------|
| UI / body / composer | Geist | `--aomi-font-sans` Geist | **Align** — load via `next/font` in mock |
| Thread title / empty hero | Geist semibold | `--aomi-font-display` PT Serif | **Optional upgrade:** hero greeting only in PT Serif; keep thread UI in Geist |
| Code / addresses / trace | Geist Mono (implicit) | `--aomi-font-mono` | **Add** explicit mono in mock for tx/trace chips |
| Logo wordmark | Aomi mark SVG | `--aomi-font-wordmark` Source Serif 4 | Mark stays SVG; no change |

### 3.5 Radius & motion

| Mock | DS | Reconciliation |
|------|-----|----------------|
| sm/md/lg = 8/12/16 | sm/md/lg = 8/12/16 + pill + composer 30px | Composer → `--aomi-radius-composer` (30px) on apply pass |
| — | `--aomi-duration-*`, easings | Adopt on apply pass for menus/modals |

---

## 4. What stays **Aomi-chat-specific** (do not force into DS defaults)

These are **product patterns**, not generic DS components:

| Pattern | Why chat-specific |
|---------|-------------------|
| **Tx preview card** (You pay → Approve in wallet) | On-chain action surface; gradient CTA, rate/slippage/gas row |
| **Working trace** (steps, tool chips, spinners) | Agent lifecycle UI; not in DS `Button/Card/Input` |
| **Network / model / app pickers** | Catalog popovers with brand marks (chains, vendors, apps) |
| **Manage wallets** (Rainbow-style progressive disclosure) | Wallet connector UX; success green Active ≠ brand accent |
| **Dual accent** (orange light / lemon dark) | Conversational energy; DS uses ink + sky instead |
| **Sidebar session ⋯ menu** | Rename / Move / Stop / Delete thread actions |
| **Delete / disconnect confirm sheets** | Mobile bottom-sheet pattern |
| **Fixture-backed state machine** | Mock-only; not part of DS |

DS should expose **semantic hooks** (`--aomi-chat-accent`, `--aomi-chat-composer-bg`, etc.). Chat-specific **layout/components** stay in the mock (later portal/widget).

---

## 5. Proposed architecture (implementation)

```text
@aomi-labs/design/tokens.css          ← upstream semantic roles + ramps
        ↓
aomi-portal/src/app/
  design-tokens.css                   ← @import DS; chat-product overrides only
  globals.css                         ← mock aliases (--background → semantic)
        ↓
components/*                          ← unchanged IA; class names stable
```

### Chat-product overrides (to add in DS or mock layer)

```css
/* Proposed — not implemented yet */
:root {
  --aomi-chat-bg-warm: var(--aomi-neutral-50);       /* or keep #fafaf9 */
  --aomi-chat-accent: #ff6a00;
  --aomi-chat-accent-strong: #fa5111;
  --aomi-chat-accent-on: #ffffff;
}
.dark {
  --aomi-chat-accent: #c8f542;
  --aomi-chat-accent-strong: #b4e62a;
  --aomi-chat-accent-on: #0a0a0a;
}
```

Wire mock `--accent` → `--aomi-chat-accent` (not `--aomi-primary`).

---

## 6. Three apply modes (pick one with product)

| Mode | Description | Risk | When |
|------|-------------|------|------|
| **A — DS wire only** | Import `@aomi-labs/design/tokens.css`; remap mock vars to DS semantics; **keep** orange/lemon via chat override | Low | **Recommended first** — localhost review |
| **B — Full brand** | CTA → ink; accent → sky; canvas → cool white; PT Serif heroes | High — abandons mock look | Only if product chooses portal-monochrome direction |
| **C — Hybrid** | Surfaces from DS cool zinc; CTAs keep chat-accent; sky for links/focus only | Medium | Compromise if marketing + chat must feel related |

**Default until sign-off:** Mode **A**, then Paper + localhost before portal PR.

---

## 7. Live portal vs mock (main, Jul 2026)

Production portal on `main` already follows **DS chat roles**:

- Monochrome canvas (`--aomi-chat-bg`)
- User bubble = cool-100; agent = no bubble
- Composer = cool-100 background
- No orange/lemon product CTAs in the canonical DS doc

The mock is **ahead visually** and **denser in IA** (tx, wallets, trace). Reconciliation means **naming the gap**, not pretending they match today.

---

## 8. Checklist before code apply

- [x] Mode A spike in `aomi-portal` (`design-tokens.css` + `globals.css` aliases)
- [x] Mode B apply — DS brand tokens, ink CTAs, sky accent, monochrome chat surfaces
- [ ] Product sign-off on Mode B vs reverting to chat-product accent
- [ ] Confirm whether **PT Serif** appears in chat hero only or nowhere
- [ ] Confirm **chat-accent** (orange/lemon) is an official DS extension or mock-only
- [ ] Paper **aomi chat** boards updated to match chosen mode
- [ ] Localhost pass: light + dark × empty + thread + settings + mobile
- [ ] No changes to `product-mono` or BFF routes

---

## 9. Next steps (ordered)

1. **Review this doc** with product (async OK)
2. **Mode A spike** in `aomi-portal`: add `design-tokens.css` importing `@aomi-labs/design/tokens.css` + chat overrides
3. **Side-by-side localhost** — current mock vs wired mock (toggle class or branch)
4. **Paper sync** for token swatches on **aomi chat** page
5. **Later:** thin portal PR mapping widget shell to same chat-product theme (separate from closed PR #365)

---

## 10. References

| Asset | Path |
|-------|------|
| Mock tokens | `aomi-portal/src/app/globals.css` |
| Design system | `design/src/tokens/tokens.css`, `design/docs/tokens.md` |
| DS playground | `design/playground/` (`pnpm dev` → :5173) |
| Build vendored tokens | `aomi/apps/aomi-build/src/app/aomi-design-tokens.css` |
| Chat architecture | `aomi/specs/CHAT-ARCHITECTURE.md` (on main) |
| Session log | `aomi/specs/STATE.md` |

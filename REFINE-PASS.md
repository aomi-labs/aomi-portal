# Design refinement pass — ported product panels

**Status:** In progress · **Do not merge to `main` until this pass is green.**

Product logic and fixture data came from `feat/settings-usage-statement`. Interaction chrome, tokens, and taste are Gordian's (`settings-modal`, sidebar, session, composer). This pass makes every ported panel feel native to the design shell.

---

## Refinement checklist

### Usage (`usage-settings.tsx`, `usage-shared.tsx`)

- [x] Remove double padding (`px-[22px]` vs modal body `sm:p-5`)
- [x] Drop redundant inner "Usage" header (modal title already shows tab)
- [x] Summary rows → match `SettingRow` rhythm (spacing, typography)
- [x] Credits meter + x402 copy → calm muted secondary text
- [x] **View full statement →** muted link (`text-muted hover:text-fg`), not accent orange
- [x] By-app matrix → `rounded-[var(--radius-md)] border border-border` container
- [x] Matrix tooltips → match elevation tokens from overlays
- [x] Tone down accent chips in settings context (managed +10%)

### Account (`account-settings.tsx`)

- [x] Remove source-branch padding; inherit modal scroll body
- [x] Attention banner only when drift exists (no duplicate identity band)
- [x] Wallet rows → `SettingRow` rhythm via `wallet-policy-row.tsx`
- [x] Signing mode → vertical radio list (no icon grid)
- [x] Inline provider grant on auto wallets; grants section removed
- [x] `SettingRow` / `Divider` shared via `settings-rows.tsx`
- [x] Logic extracted to `account-reconcile.ts`
- [x] Fixture trimmed to 4 wallets for demo clarity

### General tab (`general-settings.tsx`)

- [x] Identity card (avatar, handle, auth badge) from product fixture
- [x] Meta grid: Type · Network · member since
- [x] Credits line aligned with Usage tab allowance wording (`formatAllowanceSummary`)
- [x] Manage account → Account tab (already wired)
- [x] Extracted to `general-settings.tsx` with Account/Usage section rhythm
- [x] Billing group: allowance, tokens, meter, View usage link
- [x] Preferences group: theme, network, disconnect

### Statement (`statement-view.tsx`, `app/statement/page.tsx`)

- [x] Page shell → same tokens as chat (`layout`, dark class)
- [x] Back link → muted, not accent
- [x] Month picker → match composer/header pill style
- [x] Stat tiles → match Usage summary card (`bg-background/40`)
- [x] By app | Itemized toggle → settings theme toggle pattern
- [x] Itemized tables → consistent grid typography with usage-shared
- [x] Tx hash links → muted mono, not orange

### Apps modal (`apps-modal.tsx`)

- [x] Overlay elevation → match `settings-modal` / gate overlays
- [x] Search input → match composer/sidebar search styling (minor)
- [x] Category headings → muted uppercase like matrix headers
- [x] Install buttons → `@aomi-labs/design` Button
- [x] Installed strip → match sidebar thread row density (minor)
- [x] Store mode pass: wide layout, 2-col grid, icon dock, `+` install actions

### Shell copy (gates, sidebar, menus)

- [x] Sidebar credits → allowance from fixture (`0 left · 500/500 used`)
- [x] Account menu credits line → same wording as Usage
- [x] Payment gate copy → allowance/x402 (adapter already updated)
- [x] Secret gate → unchanged structure

### QA gate (before merge)

- [x] Settings: all 6 tabs scroll correctly mobile + desktop
- [x] Usage July total = $83.79 (fixture)
- [x] Statement: 3 months, filters work
- [x] Account: drift + re-grant simulation
- [x] Apps modal opens from header, Escape closes
- [x] No panel looks "pasted in" next to General tab

---

## Sprint order

| # | Panel | Files |
|---|-------|-------|
| 1 | Usage | `usage-settings.tsx`, `usage-shared.tsx` |
| 2 | Account | `account-settings.tsx` |
| 3 | General | `settings-modal.tsx` (General tab body) |
| 4 | Statement | `statement-view.tsx`, `app/statement/page.tsx` |
| 5 | Apps | `apps-modal.tsx`, `chat-header.tsx` |
| 6 | Copy + QA | `sidebar.tsx`, `menus.tsx`, `overlays.tsx` |

---

## Out of scope (this pass)

- Delete `billing-fixtures.ts` shim (after all consumers use fixture directly)
- Merge to `main` / push
- Backend / portal integration

# Racer UI

A shadcn-style, themeable **dark/light** developer-tool + infrastructure dashboard. Built as a small, dependency-free component library so the same design system can be dropped into any page.

## Quick start

Serve the static files from any HTTP server:

```bash
python3 -m http.server 8080
```

Open the live preview. No build step, no npm, no frameworks.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell — sidebar, topbar, view container |
| `styles.css` | **Design system** — semantic CSS tokens + themeable components |
| `app.js` | Data layer, reusable render helpers, hash router, interactions |

## Library surface (shadcn-style tokens + components)

Theming is controlled by `data-theme="dark" | "light"` on `<html>`. Every component is
token-driven, so a light mode is a single attribute swap (see `styles.css` `:root` /
`[data-theme="light"]`).

Available CSS components:

- **Buttons** — `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-outline`, `.btn-soft`, `.btn-danger`, `.btn-sm`, `.btn-icon`
- **Badges** — `.badge-success / -warning / -danger / -info / -accent / -outline`
- **Status** — `.status-success / -warning / -danger / -info`
- **Card** — `.card`, `.card-header`, `.card-title`, `.card-desc`, `.card-content`
- **Inputs** — `.input`, `.select`, `textarea`, `.switch` (toggle), `.field`
- **Tabs** — `.tabs` / `.tab`
- **Table** — `.table` + `.table-scroll`
- **KPI / chart** — `.kpi`, `.chart`, `.sparkline` helpers
- **Overlays** — `.dialog` + `.overlay`, `.cmd-overlay` (command palette), `.menu` (dropdown), `.toast`
- **Layout** — `.sidebar`, `.topbar`, `.nav`, `.content`, responsive `.kpis` / `.grid` / `.grid-3`

JS surface (exposed as `window.Racer`): `navigate()`, `toast()`, `toggleTheme()`, `openCommand()`, `state`.

## Pages (hash-routed)

`#/overview` · `#/incidents` · `#/deployments` · `#/services` · `#/logs` · `#/metrics` · `#/alerts` · `#/security` · `#/costs` · `#/components` · `#/settings`

- **Components** — live gallery showcasing every library primitive (buttons, badges, status, forms, progress, skeleton, donut, heatmap, tabs, accordion, avatar stack, dialog, tooltips)
- **Security** — functional API-key manager: generate (one-time secret reveal + copy), copy, reveal, revoke; security posture progress bars
- **Costs** — spend chart, cost-by-service, interactive budget slider with live % tracking, invoices with download

## Interactions

- ⌘K / Ctrl+K **command palette** (navigate, actions, keyboard arrow/enter navigation)
- **`?`** keyboard-shortcuts overlay; **⌘N** new deployment; **T** theme; **G O/S/L/M/I/D/C** quick-jump
- **Theme toggle** (topbar + profile menu + command palette), persisted to localStorage
- **New Deployment** modal with service/tag/strategy/regions — appends to the feed
- **Service detail modal** — click any service name (overview + services tables) for instances, events, quick deploy/nav
- **Export services → CSV** download; copy-to-clipboard via `copyText()` (with fallback)
- **Services page** — text filter, status filter, click-to-sort columns
- **Logs page** — level filter chips, pause/resume, clear, text search, live stream
- **Env switcher** dropdown, **notifications** panel, **profile** menu, toasts everywhere
- Global **tooltips** via `data-tip` attribute
- Responsive: collapsible sidebar / compact grids on smaller screens; shimmer load overlay on navigation

## Design

Near-black canvas with an indigo→blue accent gradient, Inter + JetBrains Mono,
hairline borders, emerald/sky/amber/rose status palette, tabular monospace numerals,
soft glows and 8px–14px radius scale.

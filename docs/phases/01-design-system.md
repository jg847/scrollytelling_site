---
status: pending
phase: 01
title: Design system foundation
depends-on: [00]
---

# Phase 01 — Design system foundation

## Objective
Replace the Tailwind scaffolding with a CSS-Modules + custom-properties design system that mirrors the reference project's token-driven approach. Install the ocean-specific font stack, wire the shared `--depth` theming hook, and ship the first core UI primitives needed by the descent.

## Spec references
- [specs/05-design-system.md](../specs/05-design-system.md) — full token list and decisions.
- [specs/01-architecture.md](../specs/01-architecture.md) §"External dependencies — acceptable / avoid".

## Reference code to port

Read these **in full** before writing anything:

| Reference | Purpose | Target |
|---|---|---|
| `docs/_references/bseai_degree/app/globals.css` | Token set, fluid type, alpha ramps | `src/app/globals.css` (replace) |
| `docs/_references/bseai_degree/app/layout.tsx` | `next/font/google` wiring pattern | `src/app/layout.tsx` (adapt — ocean metadata + three-font stack) |
| `docs/_references/bseai_degree/components/ui/heading.tsx` | `Heading` primitive | `src/components/ui/heading.tsx` |
| `docs/_references/bseai_degree/components/ui/text.tsx` | `Text` primitive | `src/components/ui/text.tsx` |
| `docs/_references/bseai_degree/components/ui/ContextualLink.tsx` | Smart internal/external link, basePath-aware | `src/components/ui/ContextualLink.tsx` |
| `docs/_references/bseai_degree/components/ui/CallToActionGroup.tsx` | CTA layout wrapper | `src/components/ui/CallToActionGroup.tsx` |
| `docs/_references/bseai_degree/lib/site-config.ts` | `url()` / basePath helper used by `ContextualLink` | `src/lib/site-config.ts` |

## Steps

1. **Remove Tailwind wiring.**
   - Uninstall: `npm uninstall tailwindcss @tailwindcss/postcss`.
   - Delete `postcss.config.mjs`.
   - Delete or empty `src/app/globals.css` of the `@import "tailwindcss"` line and any `@theme` / Tailwind-specific rules.
2. **Install design-system deps.**
   - `npm i clsx` (only dependency the UI primitives need).
3. **Port `site-config.ts`.** Keep only what this site uses: `basePath` read from `process.env.NEXT_PUBLIC_BASE_PATH`, and a `url(path)` helper. Drop domain-specific constants (NJIT, Ordo).
4. **Rewrite `src/app/globals.css`** using the full token block from [specs/05-design-system.md](../specs/05-design-system.md) §Tokens. Use the reference `globals.css` for exact alpha/shadow/ease values, but follow the ocean palette and bioluminescent accent decisions from the spec rather than the reference project's warmer tones.
5. **Wire fonts in `src/app/layout.tsx`.** Load Fraunces (`--font-display`), Inter (`--font-sans`), and JetBrains Mono (`--font-mono`) from `next/font/google` with `display: "swap"`. Apply all CSS variable classes to `<body>`. Set ocean-site metadata (`title: "Into The Deep"`, description, `openGraph`).
6. **Add the top-level depth hook.** Introduce the minimal provider or client-side body effect that will own the shared `--depth` custom property. In Phase 01 this can be a thin wrapper mounted from `src/app/layout.tsx`; later phases can consume it without adding new window-level scroll listeners.
7. **Port UI primitives** — `Heading`, `Text`, `ContextualLink`, `CallToActionGroup`, plus the small `DataReadout` and `ZoneNavigator` primitives defined in [../specs/05-design-system.md](../specs/05-design-system.md). Keep their CSS Modules alongside the `.tsx`. `ZoneNavigator` can ship as a styled shell in this phase; repository-driven previous/next lookup can be completed once Phase 02 exposes `descentOrder`.
8. **Smoke page.** Replace `src/app/page.tsx` body with a minimal composition:
   - `<Heading level={1}>Into The Deep</Heading>`
   - `<Text>Begin a scroll-driven descent through the five layers of the ocean.</Text>`
   - `<DataReadout label="Depth">0 m</DataReadout>`
   - `<CallToActionGroup>` with one `<ContextualLink href="/euphotic">Begin your descent</ContextualLink>` (even though the full zone pipeline won't exist until Phase 02 — the link just has to render).
   - Optionally render a non-functional `ZoneNavigator` shell below to prove its styling against the tokens.
9. **Strip the boilerplate** `src/app/page.module.css` if it exists; it's Tailwind-era cruft.

## Files created / modified

- `src/app/globals.css` — replaced
- `src/app/layout.tsx` — rewrite with fonts + ocean-site metadata
- `src/app/page.tsx` — minimal smoke composition
- `src/app/page.module.css` — delete if present
- `postcss.config.mjs` — delete
- `src/components/ui/heading.tsx` + `.module.css`
- `src/components/ui/text.tsx` + `.module.css`
- `src/components/ui/ContextualLink.tsx` + `.module.css`
- `src/components/ui/CallToActionGroup.tsx` + `.module.css`
- `src/components/ui/DataReadout.tsx` + `.module.css`
- `src/components/ui/ZoneNavigator.tsx` + `.module.css`
- `src/components/providers/DepthThemeProvider.tsx` (or equivalent minimal client wrapper)
- `src/lib/site-config.ts`
- `package.json` — Tailwind deps removed, `clsx` added

## Exit checks
- [ ] `grep -r "tailwind" src/ package.json` returns nothing
- [ ] `npm run build` succeeds
- [ ] `npm run dev` shows homepage with Fraunces headings, Inter body text, and JetBrains Mono data readouts at the fluid scale (resize the window to confirm `clamp()`)
- [ ] The page background and accent tokens read as oceanic, not generic light-theme defaults
- [ ] A single shared owner updates `--depth` on `<body>`; no component-local scroll listeners are introduced in this phase
- [ ] No console errors in browser
- [ ] No unused dependencies: `npx depcheck` reports clean (or only false positives are noted)

## Completion notes

<!-- Fill in after execution:
  - What changed vs the plan
  - Any palette decisions made
  - Follow-ups to fold into later phases
-->

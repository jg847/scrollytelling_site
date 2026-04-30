---
status: pending
phase: 04
title: Motion primitives
depends-on: [03]
---

# Phase 04 — Motion primitives

## Objective
Ship the dual-mode scrollytelling primitives. Integrate reveal behavior into `MarkdownRenderer` so the shared renderer works immediately and is ready for the presentation-first ocean pages, while still respecting reduced-motion. Full sticky-slide orchestration lands in Phase 05.

## Spec references
- [specs/03-motion-system.md](../specs/03-motion-system.md) — the canonical contract. Read in full before coding.

## Reference code to port

| Reference | Purpose | Target |
|---|---|---|
| `docs/_references/bseai_degree/components/motion/SlideContext.tsx` | Context carrier for `scrollYProgress` | `src/components/motion/SlideContext.tsx` |
| `docs/_references/bseai_degree/components/motion/Reveal.tsx` | Dual-mode `Reveal` | `src/components/motion/Reveal.tsx` |
| `docs/_references/bseai_degree/components/motion/LayeredRevealGroup.tsx` | Staggered group | `src/components/motion/LayeredRevealGroup.tsx` |
| `docs/_references/bseai_degree/components/motion/DriftMedia.tsx` | Parallax/drift on images | `src/components/motion/DriftMedia.tsx` |
| `docs/_references/bseai_degree/components/motion/SceneCard.tsx` | Scale+opacity container | `src/components/motion/SceneCard.tsx` |
| `docs/_references/bseai_degree/components/motion/ParallaxBackground.tsx` | Window-scroll parallax bg | `src/components/motion/ParallaxBackground.tsx` |

## Steps

1. **Install.** `npm i framer-motion`.
2. **Port `SlideContext`.** Unchanged from spec.
3. **Port `Reveal`.** Keep the dual-mode pattern: `useSlideContext()` decides. Ensure `useReducedMotion()` short-circuits to the "shown" state immediately.
4. **Port `LayeredRevealGroup`.** Maps children → `<Reveal delay={i * stagger}>`.
5. **Port `DriftMedia`, `SceneCard`, `ParallaxBackground`.** Same dual-mode shape. All `"use client"`.
6. **Integrate into `MarkdownRenderer`.**
   - Wrap each top-level block (paragraphs, headings, lists, images) in `<Reveal>` with sensible defaults (`direction="up"`, `sequence="standard"`).
   - One approach: in the `h2`/`h3` handler, render `<Reveal><Heading>...</Heading></Reveal>`. For paragraphs: `<Reveal delay={0.05}><Text>...</Text></Reveal>`.
   - The presentation layout will provide a `SlideContext` later, flipping the same `Reveal`s into slide mode automatically.
7. **Parallax hero (optional polish).** If `frontmatter.heroImage` is set in `StandardLayout`, render a `ParallaxBackground` behind the hero copy.
8. **Accessibility smoke.** Add a `<main>` skip-link (`#main`) in `SiteHeader`; confirm focus order unaffected by motion wrappers.
9. **E2E setup.**
   - `npm i -D @playwright/test`
   - `npx playwright install chromium`
   - Port `docs/_references/bseai_degree/playwright.config.ts` to repo root, pointing `webServer` at `npx serve out -l 4321`.
   - Add `npm run test:e2e` script.
10. **E2E tests.**
   - `tests/browser/standard-reveal.spec.ts` — scroll down `/` or `/euphotic`; an initially off-screen `Reveal` element reaches `opacity: 1`.
   - `tests/browser/reduced-motion.spec.ts` — `emulateMedia({ reducedMotion: "reduce" })`; same element is at `opacity: 1` at rest with no transform.

## Files created / modified

- `src/components/motion/*.tsx` (six files)
- `src/components/markdown/MarkdownRenderer.tsx` — wrap children in `Reveal`
- `src/components/layouts/StandardLayout.tsx` — optional `ParallaxBackground`
- `src/components/site-header.tsx` — skip link
- `playwright.config.ts`
- `tests/browser/standard-reveal.spec.ts`, `reduced-motion.spec.ts`
- `package.json` (deps + scripts)

## Exit checks
- [ ] `/` or `/euphotic` visibly fades sections in on scroll
- [ ] With reduced motion emulated, content is at rest, fully visible
- [ ] `npm run test` passes
- [ ] `npm run build && npm run test:e2e` passes
- [ ] No `useEffect` scroll listeners added; all motion uses framer-motion hooks
- [ ] Inspect DOM: motion wrappers don't break semantic structure (H2s still queryable by `getByRole("heading", { level: 2 })`)

## Completion notes

<!-- Filled in after execution -->

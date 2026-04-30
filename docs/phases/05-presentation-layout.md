---
status: in-progress
phase: 05
title: Legacy presentation deck
depends-on: [04]
---

# Phase 05 — Legacy presentation deck

> Historical note: this phase documents the optional deck-style mode that still exists in the codebase. It is no longer the default direction for the ocean story, which now uses the continuous `standard` layout.

## Objective
Document and preserve the sticky-slide presentation mode as an alternate rendering strategy. Pages that explicitly opt into `layout: "presentation"` split on `---`, and each fragment renders inside a `PresentationSlide` whose `SlideContext` auto-switches nested `Reveal`/`DriftMedia`/`SceneCard` instances into slide mode.

## Spec references
- [specs/04-layouts.md](../specs/04-layouts.md) §`PresentationLayout`
- [specs/03-motion-system.md](../specs/03-motion-system.md) §`PresentationSlide`

## Reference code to port

| Reference | Purpose | Target |
|---|---|---|
| `docs/_references/bseai_degree/components/motion/PresentationSlide.tsx` | Sticky-stage primitive | `src/components/motion/PresentationSlide.tsx` |
| `docs/_references/bseai_degree/components/motion/PresentationProgress.tsx` | Top progress bar | `src/components/motion/PresentationProgress.tsx` |
| `docs/_references/bseai_degree/components/motion/PresentationShortcuts.tsx` | Keyboard overlay | `src/components/motion/PresentationShortcuts.tsx` |
| `docs/_references/bseai_degree/components/motion/PresentationFooterGate.tsx` | End-of-deck gate | `src/components/motion/PresentationFooterGate.tsx` |
| `docs/_references/bseai_degree/components/motion/presentation-nav.ts` | Keyboard nav helpers | `src/components/motion/presentation-nav.ts` |
| `docs/_references/bseai_degree/components/layouts/PresentationLayout.tsx` | Layout that consumes parsed slides | `src/components/layouts/PresentationLayout.tsx` |
| `docs/_references/bseai_degree/tests/browser/presentation.spec.ts` | E2E pattern | `tests/browser/presentation.spec.ts` |

## Steps

1. **Port `PresentationSlide`.** 170vh (plain) / 200vh (bg) section with sticky inner stage. Provides `SlideContext`.
2. **Port slide-kind rendering.** Using the `ParsedSlide` produced by `splitMarkdownIntoSlides` (Phase 02), implement per-kind layouts in `PresentationLayout`:
   - `plain` — center stage, `MarkdownRenderer` inside.
   - `bg` — full-bleed `<img>` with `object-fit: cover; object-position: var(--op)`; content overlay on top (uses `--cream-*` text if needed).
   - `split` / `split-reverse` — two-column grid (image | prose or prose | image). Collapse to stacked below 768px.
3. **Progress, shortcuts, footer gate.** Mount all three in `PresentationLayout`. Suppress `SiteHeader` / `SiteFooter` (pass a `chrome: "bare" | "full"` prop through `PageLayoutFactory` or render conditionally in `layout.tsx`).
4. **Responsive collapse.** Below 768px, change `.presentation-slide__stage { position: static; height: auto; }` via a media query. This prevents broken sticky behavior on mobile.
5. **Keyboard nav.** Port `presentation-nav.ts`: arrow/space/home/end/j/k bindings that call `window.scrollTo` with slide-index math. Respect reduced motion (`behavior: "auto"` when set, `"smooth"` otherwise).
6. **Shortcut overlay.** `?` toggles an overlay listing keys. Focus-trap via `inert` on the rest of the page.
7. **Verify the dual-mode story.** Inside a `PresentationSlide`, a `Reveal` should animate based on scroll position (not viewport entry). Visually confirm and add an E2E check.
8. **E2E tests.**
   - If the presentation mode is exercised, add a dedicated browser suite for that opt-in path.
   - The main ocean regression suite now lives in `zones.spec.ts` because the default experience is no longer a deck.

## Files created / modified

- `src/components/motion/PresentationSlide.tsx`
- `src/components/motion/PresentationProgress.tsx`
- `src/components/motion/PresentationShortcuts.tsx`
- `src/components/motion/PresentationFooterGate.tsx`
- `src/components/motion/presentation-nav.ts`
- `src/components/layouts/PresentationLayout.tsx` (+ `.module.css`)
- `src/components/layouts/PageLayoutFactory.tsx` — finalize presentation branch
- `tests/browser/zones.spec.ts` (main ocean flow)
- `tests/browser/presentation*.spec.ts` only if the legacy deck path is actively supported
- `content/pages/euphotic.md` — expand to demonstrate plain/bg/split variants in the first live zone page

## Exit checks
- [ ] If `layout: "presentation"` is used on a page, that page renders as a vertical deck with progress bar
- [ ] Each slide sticks for ~1 viewport of scroll
- [ ] Nested `Reveal`/`DriftMedia` inside a slide are scrubbed by scroll, not triggered by intersection
- [ ] If the legacy deck path is still exercised, `ArrowDown` / `ArrowUp` advance/retreat one slide
- [ ] If the legacy deck path is still exercised, `?` opens the shortcut overlay; `Esc` closes
- [ ] Resize to 360px wide: slides collapse to normal scroll (no sticking), content readable
- [ ] Reduced-motion: no transforms at rest; keyboard scroll is instant
- [ ] `npm run test:e2e` passes

## Completion notes

- `PresentationLayout`, `PresentationSlide`, progress, shortcuts, footer gate, and presentation-nav helpers were all implemented and remain in the codebase as an alternate rendering path.
- The main ocean experience no longer routes through this mode; zone pages now use the continuous `standard` layout instead.
- Browser coverage for the default ocean flow moved to `tests/browser/zones.spec.ts`, and the old presentation-keyboard coverage was removed when the deck stopped being the primary user path.
- Local verification remains green for the shipped story path (`npm run test && npm run test:e2e && npm run build`).
- What remains unresolved is whether the legacy presentation path should keep dedicated active coverage and a live authored page, or stay as a maintained-but-secondary implementation surface.

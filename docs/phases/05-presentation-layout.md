---
status: pending
phase: 05
title: Presentation layout
depends-on: [04]
---

# Phase 05 — Presentation layout

## Objective
Activate the sticky-slide presentation mode for the ocean descent. Pages with `layout: "presentation"` split on `---`, each fragment renders inside a `PresentationSlide` whose `SlideContext` auto-switches every nested `Reveal`/`DriftMedia`/`SceneCard` into slide mode.

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
   - `presentation.spec.ts` — load `/euphotic`, assert N sections, scroll to end, assert footer gate visible.
   - `presentation-keyboard.spec.ts` — `ArrowDown` advances scroll by ~one viewport; `Home` returns to 0.

## Files created / modified

- `src/components/motion/PresentationSlide.tsx`
- `src/components/motion/PresentationProgress.tsx`
- `src/components/motion/PresentationShortcuts.tsx`
- `src/components/motion/PresentationFooterGate.tsx`
- `src/components/motion/presentation-nav.ts`
- `src/components/layouts/PresentationLayout.tsx` (+ `.module.css`)
- `src/components/layouts/PageLayoutFactory.tsx` — finalize presentation branch
- `tests/browser/presentation.spec.ts`, `presentation-keyboard.spec.ts`
- `content/pages/euphotic.md` — expand to demonstrate plain/bg/split variants in the first live zone page

## Exit checks
- [ ] `/euphotic` renders as a vertical deck with progress bar
- [ ] Each slide sticks for ~1 viewport of scroll
- [ ] Nested `Reveal`/`DriftMedia` inside a slide are scrubbed by scroll, not triggered by intersection
- [ ] `ArrowDown` / `ArrowUp` advance/retreat one slide
- [ ] `?` opens the shortcut overlay; `Esc` closes
- [ ] Resize to 360px wide: slides collapse to normal scroll (no sticking), content readable
- [ ] Reduced-motion: no transforms at rest; keyboard scroll is instant
- [ ] `npm run test:e2e` passes

## Completion notes

<!-- Filled in after execution -->

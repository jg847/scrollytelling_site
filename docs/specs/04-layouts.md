# 04 — Layouts

A **layout** owns the page shell (header, nav, footer) and the rendering strategy for the markdown body. Each page picks a layout via `frontmatter.layout`.

## Two layouts

| Layout | When to use | Body rendering |
|---|---|---|
| `standard` | Essays, glossaries, reference side-pages | One continuous flow; headings/paragraphs rendered sequentially |
| `presentation` | The ocean descent, story decks, step-through explainers | Body split on `---` into sticky slides |

For the ocean site in v1, the homepage and all five zone pages use `presentation`. `standard` remains in the system for auxiliary pages and future expansion, but it is not the primary reading mode for the descent itself.

## Factory

```tsx
// src/components/layouts/PageLayoutFactory.tsx
import { StandardLayout } from "./StandardLayout";
import { PresentationLayout } from "./PresentationLayout";
import type { PageData } from "@/lib/content/repository";

export function PageLayoutFactory({ page }: { page: PageData }) {
  switch (page.frontmatter.layout) {
    case "presentation": return <PresentationLayout page={page} />;
    case "standard":     return <StandardLayout page={page} />;
  }
}
```

Called from both `src/app/page.tsx` and `src/app/[...slug]/page.tsx`.

## `StandardLayout`

Responsibilities:
- Render `<SiteHeader />`, a hero (if `heroImage` present), the markdown body via `<MarkdownRenderer />`, and `<SiteFooter />`.
- Wrap body sections in `<Reveal>` so content fades/slides in as you scroll. Implicit — the renderer decides.
- Provide a sticky table-of-contents sidebar on wide viewports (≥ 1100px), auto-generated from H2s. Hidden below that breakpoint.
- Apply reading-width typography (max-width ≈ 68ch) from tokens.

CSS module: `StandardLayout.module.css`. Uses CSS Grid for the `hero` region (image + title/summary side-by-side), falls back to stacked on narrow viewports.

No `SlideContext` is provided. All `Reveal`s in a standard page run in viewport mode.

In the ocean roadmap, this layout is a support surface, not the headline experience. It exists for reference pages, credits, or future auxiliary material.

## `PresentationLayout`

Responsibilities:
- Parse the body with `splitMarkdownIntoSlides()` from `src/lib/content/parser.ts`.
- Render each slide inside `<PresentationSlide index={i} hasBackground={…}>`, passing the slide's markdown fragment to `<MarkdownRenderer />`.
- Apply image directives (`![bg]`, `![split]`, etc.) resolved during parsing into per-slide metadata: `{ kind: "bg" | "split" | "split-reverse" | "plain", imageUrl?, objectPosition? }`.
- Mount `<PresentationProgress />` at the top, `<PresentationShortcuts />` overlay (J/K or arrow keys scroll slide-by-slide), and `<PresentationFooterGate />` at the end.
- Suppress global header/footer chrome in favor of the progress bar.

Each `PresentationSlide` pushes a `SlideContext`, so `Reveal`/`DriftMedia`/`SceneCard` inside it run in slide mode automatically.

## Keyboard controls (presentation)

| Key | Action |
|---|---|
| `↓` / `j` / `Space` | Scroll to next slide |
| `↑` / `k` | Scroll to previous slide |
| `Home` | Jump to first slide |
| `End` | Jump to last slide |
| `?` | Toggle shortcut overlay |

Implemented in `PresentationShortcuts.tsx` with `window.addEventListener("keydown")`. Respect `prefers-reduced-motion` by using `scrollTo({ behavior: "auto" })` instead of `"smooth"`.

## Slide metadata produced by the parser

```ts
type SlideKind = "plain" | "bg" | "split" | "split-reverse";

interface ParsedSlide {
  kind: SlideKind;
  imageUrl?: string;
  objectPosition?: string;       // e.g. "50% 65%"
  markdown: string;              // body remaining after extracting directive
  raw: string;                   // original fragment (useful for keys)
}

function splitMarkdownIntoSlides(body: string): ParsedSlide[];
```

## Responsive behavior

- Below 768px, `split` slides collapse to stacked (image on top, prose below). Sticky stage height drops to `auto`; slides become a normal vertical scroll without sticking. This keeps mobile reading fast.
- Above 768px, full sticky-stage experience.

Implementation: a `prefers-reduced-data` + `(max-width: 767px)` media query on `.presentation-slide__stage` overrides `position: sticky` → `static`.

## Header / footer

- `SiteHeader` — brand mark (left), link to a small nav (right), fixed at top with backdrop-blur on scroll.
- `SiteFooter` — three columns (nav, credits, links to spec + source repo). Shown in `standard` layout, gated behind the final slide in `presentation` layout.

Both are presentational. No data fetching.

## Do not

- Do not create a third layout in v1. If a page doesn't fit `standard` or `presentation`, revise the content.
- Do not nest `PresentationSlide` inside `PresentationSlide`.
- Do not render `MarkdownRenderer` twice for the same body; split once, render each slide fragment once.

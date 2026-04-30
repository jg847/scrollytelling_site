---
status: completed
phase: 06
title: Visualizations
depends-on: [05]
---

# Phase 06 — Visualizations

## Objective
Enable fenced-code-block dispatch in `MarkdownRenderer`: authors embed interactive components by writing ```` ```stat-grid ```` (etc.). Ship the v1 topic-neutral set. Do **not** port the reference project's domain-specific charts verbatim.

## Spec references
- [specs/06-visualizations.md](../specs/06-visualizations.md)

## Reference code to port (patterns, not content)

| Reference | Purpose | Use |
|---|---|---|
| `docs/_references/bseai_degree/components/markdown/MarkdownRenderer.tsx` | Code-block dispatch pattern | Extend our renderer with same switch structure |
| `docs/_references/bseai_degree/components/visualization/StatGrid.tsx` | Reference StatGrid | Port as-is (already generic) |
| `docs/_references/bseai_degree/components/visualization/ModelProgressResearch.tsx`, `BloomsTaxonomy.tsx`, `FrontierAIIntensityIndex.tsx`, etc. | Domain-specific — **do not port** | Study for structure only |

## Steps

1. **Extend `MarkdownRenderer`** with the `switch (lang)` block from [specs/06-visualizations.md §Renderer wiring](../specs/06-visualizations.md). On unknown tags, fall through to `<code>`.
2. **Contract wrapper.** Create a tiny helper that parses the raw source string and renders either the viz or a visible error card on parse failure. Put it in `src/components/visualization/_shared/`.
3. **Port `StatGrid`.** Generalize: strip any reference-specific styling hooks. Accepts pipe-separated rows.
4. **Build `ScrollDemo`.** The meta-viz. Inside any article, renders its own mini sticky-stage with step markers. Uses the Phase 04 primitives directly. Author source is YAML-ish (parse with a lightweight homegrown parser, not a YAML lib unless already installed). Keep under 200 lines.
5. **Build `Timeline`.** Vertical list of `{ date, label }` pairs. Pure CSS/HTML; no chart lib. Entries animate in via `LayeredRevealGroup`.
6. **Build `ProgressBar`.** Fixed or inline progress tied to window scroll via `useScroll()`. Accepts `label` and optional `tint` from source.
7. **Build `Mermaid`.** Client-only (`"use client"`, dynamic import of `mermaid`, `useEffect` render). `securityLevel: "strict"`. Fallback: show source in a `<pre>` on error.
8. **Build `CodeSample`.** Syntax-highlighted code block with optional title. Use a minimal highlighter — **`shiki` via `@shikijs/rehype` if easy**, otherwise plain `<pre><code>` with a data-lang attribute. Do not add a heavy dep for v1; plain is acceptable.
9. **Content updates.** Add `stat-grid`, `timeline`, `code-sample`, and at least one ocean-specific viz usage to `content/pages/euphotic.md` or `content/pages/dysphotic.md` so the features are exercised on a real zone page.
10. **Unit tests.**
    - Each viz's source parser.
    - Error-card behavior on malformed input.
11. **Bundle check.** Run `npm run build` and inspect the `out/_next/static/chunks/` sizes. Dynamic-import `Mermaid` so it doesn't bloat the main bundle.

## Files created / modified

- `src/components/markdown/MarkdownRenderer.tsx` — viz dispatch
- `src/components/visualization/_shared/VizError.tsx`
- `src/components/visualization/StatGrid.tsx` (+ css)
- `src/components/visualization/ScrollDemo.tsx` (+ css)
- `src/components/visualization/Timeline.tsx` (+ css)
- `src/components/visualization/ProgressBar.tsx` (+ css)
- `src/components/visualization/Mermaid.tsx`
- `src/components/visualization/CodeSample.tsx` (+ css)
- `content/pages/euphotic.md` or `content/pages/dysphotic.md` — expand
- `tests/unit/visualizations.test.tsx`

## Exit checks
- [ ] Each v1 viz renders correctly from a fenced block on a live zone page
- [ ] Bad source in any viz produces a visible red-bordered error card (not a silent empty render)
- [ ] Mermaid chunk is loaded on-demand (confirm via Network tab: absent until a `mermaid` block renders)
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] No viz depends on `window` at module top-level

## Completion notes

- Added a shared visualization parse/error contract in `src/components/visualization/_shared/` and converted the v1 visualization set to use it.
- Replaced placeholder implementations for `StatGrid`, `ScrollDemo`, `Timeline`, `ProgressBar`, `Mermaid`, and `CodeSample` with parser-backed components and live dysphotic-zone content.
- Fixed `MarkdownRenderer` block splitting so fenced code blocks with internal blank lines render correctly.
- Added focused unit coverage for visualization parsers and malformed-input error cards, plus browser coverage for live dysphotic visualization rendering.
- Validation passed with `npm run test`, `npm run build`, and `npm run test:e2e`.

# 09 — Roadmap

Delivery is sliced so that each milestone produces a **shippable static site**. No milestone leaves the build broken.

## Milestone 0 — Scaffold (✅ done)

- Next.js 16 App Router scaffold
- `next.config.ts` configured for static export + basePath
- GitHub Actions workflow stub at `.github/workflows/deploy.yml`

## Milestone 1 — Design system (ocean palette)

Ref: [05-design-system.md](./05-design-system.md)

- Remove Tailwind wiring from `globals.css` and `postcss.config.mjs`.
- Install fonts (Fraunces, Inter, JetBrains Mono) via `next/font/google`.
- Add the full token set, including the `--depth` axis and per-zone overrides keyed on `body[data-zone="…"]`.
- Add a top-level scroll provider that updates `--depth` on `<body>` from a single `useScroll` `MotionValue`.
- Build `Heading`, `Text`, `ContextualLink`, `CallToActionGroup`, `DataReadout`, `ZoneNavigator` in `src/components/ui/`.

**Exit criteria:** `npm run build` green; the homepage renders against a deep blue background; ambient depth tokens respond to scroll without per-component listeners; no Tailwind classes remain.

## Milestone 2 — Content pipeline

Ref: [02-content-model.md](./02-content-model.md)

- Install `gray-matter`, `next-mdx-remote`, `remark-gfm`, `zod`.
- `src/lib/content/schema.ts` — Zod schema with the ocean-specific fields:
  - `zone: "euphotic" | "dysphotic" | "aphotic" | "abyssal" | "hadal" | null`
  - `depthRange: { top: number; bottom: number; unit: "m" }` (required when `zone` is set)
  - `descentOrder: number` (required when `zone` is set; drives `ZoneNavigator` order)
- `src/lib/content/repository.ts` with `getPageBySlug`, `getAllSlugs`, `getAllPages`, plus a `getDescentOrdered()` helper used by the home page and the navigator.
- `src/lib/content/parser.ts` — image-directive parsing for hero / inline figures.
- `src/app/page.tsx` loads `content/home.md`.
- `src/app/[...slug]/page.tsx` with `generateStaticParams` + `dynamicParams = false`.
- Validate that the existing five zone files (`euphotic.md`, `dysphotic.md`, `aphotic.md`, `abyssal.md`, `hadal.md`) parse cleanly under the new schema; fix frontmatter where required.
- Unit tests for schema + parser + repository, including failure cases (missing `depthRange` when `zone` set, invalid zone enum, malformed YAML, duplicate `descentOrder`).

**Exit criteria:** `/`, `/euphotic`, `/dysphotic`, `/aphotic`, `/abyssal`, and `/hadal` all build and render with valid frontmatter; an invalid frontmatter file fails the build with a clear error.

## Milestone 3 — Shared shell + markdown renderer

Ref: [04-layouts.md](./04-layouts.md), [06-visualizations.md](./06-visualizations.md)

- `src/components/layouts/StandardLayout.tsx` — support-page shell for any auxiliary non-descent page.
- `src/components/markdown/MarkdownRenderer.tsx` with the component map (no viz yet — just headings, links, lists, code).
- `src/components/layouts/PageLayoutFactory.tsx` — dispatches by `frontmatter.layout`, with `standard` treated as the primary v1 path for the ocean story.
- `SiteHeader` — minimal, dark-themed; a brand mark and a "return to surface" link.
- `SiteFooter` — credits, source link.

**Exit criteria:** markdown renders through the design system; the shared page chrome is in place; the factory cleanly routes story pages into the continuous standard narrative shell; no viz components are rendered yet.

## Milestone 4 — Motion primitives

Ref: [03-motion-system.md](./03-motion-system.md)

- `SlideContext` (kept as the shared switch that lets the same motion primitives run in viewport mode now and slide mode once the presentation shell is active).
- `Reveal` (dual-mode), `LayeredRevealGroup`, `DriftMedia`, `SceneCard`, `ParallaxBackground`.
- `DepthScene` — a sticky-media-with-scrolling-text scrollytelling primitive used inside zone pages. Wraps a `useScroll` over its own section so a single image / illustration can be pinned while several paragraphs of prose pass alongside.
- Integrate viewport-mode `Reveal` into the standard narrative path, while keeping the same components compatible with the alternate `PresentationLayout` if that mode is used later.
- E2E tests: one reveal/reduced-motion check on the homepage or euphotic page.

**Exit criteria:** scrolling down the early ocean pages shows section fade-ins where appropriate; a `DepthScene` pins an illustration while accompanying paragraphs scroll past; reduced motion disables transforms across the board.

## Milestone 5 — Ocean visualisations

Ref: [06-visualizations.md](./06-visualizations.md)

- Code-block dispatcher in `MarkdownRenderer` for the ocean tags.
- `DepthGauge`, `PressureCard`, `LightScale`, `TemperatureCurve`, `SpeciesCard`, `ZoneStats`, plus the generic `StatGrid` and `CodeSample`.
- `src/lib/oceanography/temperature-profiles.ts` with bundled profiles consumed by `TemperatureCurve`.
- Update one zone page (suggest `dysphotic.md` first; it has the richest light/temperature story) to use one of each visualisation as a smoke test.
- Unit tests for each viz parser, including a parse-failure → error-card test.

**Exit criteria:** every viz tag renders against real data; bad input produces visible error cards; the depth gauge tracks scroll on the test zone page.

## Milestone 6 — All five zones live

The kit works; now the existing zone pages get the full treatment. Each page:

- Opens with `ZoneStats` and a one-sentence definition of the zone in plain language.
- Embeds at least one `DepthScene` for the defining environmental fact (light cutoff, thermocline, pressure crush, snowfall of marine detritus, trench geology).
- Lists 4–6 species via `SpeciesCard` inside a `LayeredRevealGroup`.
- Closes with a `ZoneNavigator` linking back up and continuing the descent.

Pages, in descent order:

1. `content/pages/euphotic.md` — Sunlight Zone (0–200 m)
2. `content/pages/dysphotic.md` — Twilight Zone (200–1000 m)
3. `content/pages/aphotic.md` — Midnight Zone (1000–4000 m, used here for the bathypelagic band; see [00-overview.md](./00-overview.md))
4. `content/pages/abyssal.md` — Abyssal Zone (4000–6000 m)
5. `content/pages/hadal.md` — Hadal Zone (6000–11 000 m)

Plus `content/home.md` — descent overview, summary stats via `StatGrid`, link into the euphotic page as "begin your descent."

Authoring guidelines: every fact gets a citation in a footnote; every species lists scientific name and a sourced depth range; tone stays educational and concrete.

**Exit criteria:** the homepage and all five zone pages render, validate, build, and read coherently end to end. A reader can scroll the homepage, click into the euphotic, and reach the hadal trench by following "Continue descent →" five times.

## Milestone 7 — CI + deploy

Ref: [08-deployment.md](./08-deployment.md)

- Fill out the workflow to verify + build + e2e + deploy jobs.
- Confirm Pages settings on the GitHub repo.
- First green deploy to `https://<user>.github.io/<repo>/`.
- Lighthouse check on the homepage and one zone page: Performance ≥ 90, Accessibility ≥ 95.

**Exit criteria:** a push to `main` results in a live updated site within one workflow run.

## Milestone 8 — Polish pass

Now that the site is deployed and read end-to-end, do a single editorial / accessibility / performance pass:

- Re-shoot any species image that's noisy on the dark background.
- Pass each zone through `prefers-reduced-motion` to confirm it still reads.
- Tighten copy. Cut anything that doesn't earn its space.
- Run Lighthouse against every zone page.

## Out of scope for v1 (explicit)

- Audio / hydrophone soundscapes.
- Search.
- RSS.
- Pagination / tags / categories.
- Comments.
- i18n.
- Per-species deep-dive sub-pages.
- A second, non-ocean narrative track built on the same primitives.

Revisit after v1 ships.
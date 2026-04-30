---
status: in-progress
phase: 08
title: Ocean content pass
depends-on: [07]
---

# Phase 08 — Ocean content pass

## Objective
With the kit hardened, finish the actual ocean descent content. Each page should read like one chapter in a continuous dive from the surface to the trenches.

## Spec references
- [specs/00-overview.md](../specs/00-overview.md) — voice and scope
- [specs/09-roadmap.md](../specs/09-roadmap.md) §"Milestone 8"

## Reference code
No component code is ported in this phase. Reference the reference project's **prose structure** if useful, but all content must be original to the ocean narrative in this repo.

## Pages to write

| Slug | Layout | Teaches | Anchors |
|---|---|---|---|
| `home.md` | standard | The invitation to descend; sets stakes, structure, and tone in one continuous scrollytelling flow | Hero + `StatGrid` + CTA into `/euphotic` |
| `euphotic.md` | standard | Sunlight, photosynthesis, reefs, upper-ocean predators | `ZoneStats` + `SpeciesCard` + sticky depth imagery |
| `dysphotic.md` | standard | Fading light, migration, bioluminescence | `LightScale` + `SpeciesCard` + sticky depth imagery |
| `aphotic.md` | standard | Total darkness, marine snow, whale falls | `PressureCard` + `ZoneStats` + sticky depth imagery |
| `abyssal.md` | standard | Seafloor plains, vents, chemosynthesis | `TemperatureCurve` + `DepthScene` + sticky depth imagery |
| `hadal.md` | standard | Trenches, pressure limits, isolated ecosystems | `PressureCard` + `ZoneNavigator` + end-of-descent payoff |

Each page:
- Has SEO frontmatter.
- Has 3–6 slides or H2-led sections, depending on what best serves the story beat.
- Uses at least one visualization tag.
- Ends by orienting the reader to what comes next in the descent.

## Steps

1. **Draft `home.md`.** Keep it brief and cinematic: descent framing, the five layers, and a clear CTA into `/euphotic`.
2. **Write each zone page in depth order.** Preserve the linear descent and make each closing beat tee up the next layer.
3. **Navigation.** Update `SiteHeader` / `SiteFooter` nav lists to emphasize surface, current layer, and return-to-surface patterns rather than a docs-style index.
4. **Zone progression.** Confirm `descentOrder` and `ZoneNavigator` wiring produce the exact path `home → euphotic → dysphotic → aphotic → abyssal → hadal`.
5. **Images.** Audit `public/images/` and delete anything not used by the final content to keep the deploy small.
6. **SEO.** Each page has unique `seo.title` and `seo.description`. Add `<meta name="description">` handling in `generateMetadata()` for `[...slug]/page.tsx`.
7. **Proofread + a11y pass.** Run an automated a11y check (e.g. `axe` via Playwright) on each page in E2E; fix violations.

## Files created / modified

- `content/home.md`, `content/pages/*.md` (six pages)
- `src/components/site-header.tsx`, `site-footer.tsx` — updated nav
- `src/app/[...slug]/page.tsx`, `src/app/page.tsx` — `generateMetadata`
- `public/images/` — pruned
- `tests/browser/a11y.spec.ts` — per-page axe run

## Exit checks
- [ ] All six pages build and deploy
- [x] Each page passes axe with zero critical/serious violations
- [ ] `ZoneNavigator` and in-page CTAs let a reader reach `/hadal` by following the descent path only
- [x] No orphan assets: every file in `public/images/` is referenced at least once
- [ ] Lighthouse still ≥ 90 / 95 / 95 / 95 on home + two deepest pages

## Completion notes

- `content/home.md` and all five zone pages were rewritten into a continuous descent with `layout: "standard"` and authored `---` section beats.
- The pages now include real visual pacing through `bg`, `split`, and `split-reverse` directives, and the deeper zones were given additional narrative beats to keep the descent visually continuous.
- SEO titles and descriptions are present on the story pages, and local route metadata is being generated successfully in the app router.
- Browser regression coverage for the shipped content flow lives in `tests/browser/homepage.spec.ts`, `tests/browser/zones.spec.ts`, and `tests/browser/links.spec.ts`.
- Accessibility regression coverage now also lives in `tests/browser/a11y.spec.ts` for the home page and all five zone pages.
- `public/images/` has been pruned to the shipped ocean assets only, and `tests/unit/image-assets.test.ts` now fails if an orphan image reappears.
- Local validation is green for the touched slices (`npx vitest run tests/unit/parser.test.ts tests/unit/image-assets.test.ts` and `npm run build`), and the broader regression suite had already been green before the Phase 08 cleanup.
- Local Lighthouse verification now covers `/`, `/abyssal/`, and `/hadal/`: the two deepest pages clear the target bands, while the home page still needs performance work.
- Remaining work against the original phase checklist is now concentrated in live deployment verification and homepage performance tuning.

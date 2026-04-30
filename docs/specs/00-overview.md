# 00 — Overview

## What we are building

A static website that takes the reader on a scroll-driven descent through the five zones of the open ocean. Each zone is its own page; the homepage opens the descent and the reader moves linearly through them — `home → euphotic → dysphotic → aphotic → abyssal → hadal` — until they reach the bottom of the sea.

The site is:

1. A **science-forward narrative** — accurate facts about depth, pressure, light, temperature, and the wildlife at each level.
2. A **scrollytelling experience** — scroll position drives what is visible: the world darkens as you descend, sticky scenes pin while text passes alongside, species fade in as their depth bracket arrives.
3. A **static site** — a single Next.js build that ships to GitHub Pages with no server.

Target audience: curious lay readers and students. Reading level: high-school to early-undergraduate. No marine-biology background assumed; technical terms (euphotic, aphotic, hadal) are introduced in context.

## A note on naming

This site uses a hybrid of the two standard ocean classifications:

- For the upper water column, the **light-zone** taxonomy: *euphotic* (sunlit), *dysphotic* (twilight), *aphotic* (no sunlight).
- For the deepest waters, the **depth-zone** taxonomy: *abyssal* and *hadal*.

Strictly, "aphotic" describes everything below the dysphotic zone, including abyssal and hadal waters. On this site we narrow it to the bathypelagic band (~1000–4000 m) and let *abyssal* and *hadal* cover what lies below. Each zone page opens with a one-sentence definition so the reader is never guessing.

## Non-goals

- Not a marine database. We cover a curated set of species per zone, not an exhaustive catalogue.
- Not a CMS. Content is markdown files in the repo.
- Not server-rendered. Output is static HTML.
- Not a general design framework. Styling is CSS Modules + custom properties, opinionated for this story.

## Guiding principles

1. **Content is markdown.** Each zone page is a `.md` file with YAML frontmatter — depth range, pressure, light level, temperature, key species. No JSX in content.
2. **Depth drives design.** Color, type weight, and ambient motion shift as the reader descends. Tokens are parameterised on a `--depth` scroll variable, not hard-coded per page.
3. **Native browser over libraries.** CSS `position: sticky`, IntersectionObserver, and framer-motion cover everything. No GSAP, no scroll libraries.
4. **Accessibility is baseline.** `prefers-reduced-motion` is honored by every motion primitive. All facts, species, and depth data are readable as static prose if motion is off.
5. **Build-time validation.** Frontmatter is Zod-validated; missing depth ranges or invalid zone names fail the build, not the browser.
6. **Static export only.** Output goes to `out/` and ships to GitHub Pages.

## Scope (v1)

Included:

- A homepage (`content/home.md`) that introduces the descent and links into the five zones.
- Five zone pages, one each, in descent order:
  - `content/pages/euphotic.md` — Sunlight Zone (0–200 m)
  - `content/pages/dysphotic.md` — Twilight Zone (200–1000 m)
  - `content/pages/aphotic.md` — Midnight Zone (1000–4000 m)
  - `content/pages/abyssal.md` — Abyssal Zone (4000–6000 m)
  - `content/pages/hadal.md` — Hadal Zone (6000–11 000 m)
- The `standard` long-scroll layout, used by the homepage and every zone page in v1. The descent is authored as one continuous narrative with sticky media and section-to-section visual transitions.
- A `ZoneNavigator` primitive that renders a "Continue descent →" link to the next zone in the sequence (and a "↑ Back up" link to the previous) at the foot of every zone page. Order is read from a `descentOrder` field in frontmatter, not hard-coded.
- Scrollytelling primitives: dual-mode `Reveal`, `LayeredRevealGroup`, `DriftMedia`, `SceneCard`, `DepthScene` (sticky media + scrolling text), `ParallaxBackground`.
- A depth-aware theming system: tokens shift as the reader descends a zone.
- Ocean-specific visualisation components for embedding in markdown: `DepthGauge`, `PressureCard`, `LightScale`, `TemperatureCurve`, `SpeciesCard`, `ZoneStats`.
- Build-time content validation.
- Unit tests (Vitest) for parsers/repo/schema; E2E tests (Playwright) for scroll behaviour.
- GitHub Pages deploy via Actions.

Deferred to later:

- Audio (ambient ocean / hydrophone recordings).
- Search.
- Multi-language content.
- Comments.
- Per-species deep-dive sub-pages.

## Success criteria

- `npm run build` produces a static `out/` with zero runtime errors.
- A new author can edit a zone page by changing its `.md` file and see the change live after a push.
- Scroll animations run at 60fps on a mid-range laptop; degrade silently to a static layout under reduced motion.
- A Playwright test confirms the depth gauge updates as the reader scrolls into a zone.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on the homepage and on at least one zone page.

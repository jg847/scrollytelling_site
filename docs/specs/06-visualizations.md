# 06 — Visualisations in markdown

Authors need to drop interactive ocean diagrams and data readouts into a zone page without writing JSX. We do it the same way the rest of the site does: **fenced code blocks whose language tag names a component.**

## The pattern

````markdown
The dysphotic zone begins where 1% of surface light remains.

```light-scale
zone: dysphotic
top: 200
bottom: 1000
unit: m
```

Below 1000 m, no sunlight reaches the water column.
````

The MDX renderer intercepts `<code className="language-light-scale">`, parses the body, and renders `<LightScale … />` in its place.

## Renderer wiring

```tsx
// src/components/markdown/MarkdownRenderer.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { DepthGauge }       from "@/components/visualization/DepthGauge";
import { PressureCard }     from "@/components/visualization/PressureCard";
import { LightScale }       from "@/components/visualization/LightScale";
import { TemperatureCurve } from "@/components/visualization/TemperatureCurve";
import { SpeciesCard }      from "@/components/visualization/SpeciesCard";
import { ZoneStats }        from "@/components/visualization/ZoneStats";
import { StatGrid }         from "@/components/visualization/StatGrid";
import { CodeSample }       from "@/components/visualization/CodeSample";

const components = {
  h1: Heading.bind(null, { level: 1 }),
  h2: Heading.bind(null, { level: 2 }),
  a: ContextualLink,
  pre: ({ children }) => children,
  code: ({ className, children }) => {
    const lang = className?.replace("language-", "");
    switch (lang) {
      case "depth-gauge":  return <DepthGauge       source={String(children)} />;
      case "pressure":     return <PressureCard     source={String(children)} />;
      case "light-scale":  return <LightScale       source={String(children)} />;
      case "temperature":  return <TemperatureCurve source={String(children)} />;
      case "species":      return <SpeciesCard      source={String(children)} />;
      case "zone-stats":   return <ZoneStats        source={String(children)} />;
      case "stat-grid":    return <StatGrid         source={String(children)} />;
      case "code-sample":  return <CodeSample       source={String(children)} />;
      default: return <code className={className}>{children}</code>;
    }
  },
};

export function MarkdownRenderer({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );
}
```

## Visualisation component contract

Every viz component must:

1. Accept a single `source: string` prop (the raw code-block body) **or** a typed props object parsed from that source via `zod`.
2. Parse its own source string deterministically; on parse failure render a visible error card, never silent failure.
3. Be server-renderable (no `window` / `document` at module scope). If browser-only behaviour is required, wrap the interactive part in `"use client"` and `useEffect`.
4. Expose explicit `width`/`height` (or `aspect-ratio`) so layout doesn't jump on hydration.
5. Degrade to a static fallback when `prefers-reduced-motion: reduce` — depth gauges still show the right numbers, they just don't animate.
6. Use design-system tokens (`--accent`, `--text`, `--page-background`, etc.); never hard-code colour values.

## Zone enum

Every YAML source that names a zone must use one of these slugs (matching the page filenames in `content/pages/`):

```
euphotic | dysphotic | aphotic | abyssal | hadal
```

Components that accept a `zone:` field validate against this enum with `zod` and render an error card on a typo.

## v1 visualisations

| Tag | Component | Purpose |
|---|---|---|
| `depth-gauge` | `DepthGauge` | Sticky depth meter, pinned to the side of a zone page; the pointer fills as the reader scrolls deeper |
| `pressure` | `PressureCard` | Atmosphere-equivalent pressure readout for a given depth, with a small visual bar |
| `light-scale` | `LightScale` | Vertical bar showing percentage of surface light remaining over a depth range |
| `temperature` | `TemperatureCurve` | A line chart of temperature against depth; highlights the thermocline |
| `species` | `SpeciesCard` | A creature panel: photo, common + scientific name, depth range, key traits |
| `zone-stats` | `ZoneStats` | A grouped readout of depth range, pressure range, light, and temperature for one zone |
| `stat-grid` | `StatGrid` | 2–6 small key-fact tiles; generic, used on the homepage and intros |
| `code-sample` | `CodeSample` | Syntax-highlighted code block with title/caption (kept for the rare technical aside) |

Anything beyond this list earns a new spec entry, not a quiet ship.

## DepthGauge

The most distinctive component on the site. A vertical scale fixed to the side of the reading column on a zone page. It shows:

- The **zone's depth range** (e.g. 200 m – 1000 m for the dysphotic zone).
- A **pointer** that moves as the reader scrolls through the page.
- A **monospace numeric readout** (e.g. `↓ 472 m`) updated continuously.

Author input:

````markdown
```depth-gauge
zone: dysphotic
top: 200
bottom: 1000
unit: m
```
````

Implementation: a sticky `<aside>` whose pointer position reads the same `--depth` custom property that the design system uses for ambient theming. No per-component scroll listener — the value is shared.

## SpeciesCard

Cards a single creature into the page. Author input:

````markdown
```species
name: Vampire Squid
scientific: Vampyroteuthis infernalis
image: /images/species/vampire-squid.webp
zone: aphotic
depth: 600 - 1200 m
traits:
  - Bioluminescent photophores
  - Filter-feeds on marine snow
  - Inverts its cape when threatened
```
````

Card render: image left (or top on narrow viewports), name + scientific name + depth range as a header, a short bullet list of traits, and a quiet line tying the species to the zone's defining condition (low light, high pressure, etc.). Cards stack naturally inside `LayeredRevealGroup` so a list of species fades in one at a time as the reader scrolls.

## LightScale, PressureCard, TemperatureCurve

Each is a small, single-purpose data viz. They share these conventions:

- Source is YAML, parsed by `zod`.
- Rendered as inline-block elements ~360–520 px wide, ~200–320 px tall.
- Use `--accent` for the active value, `--text-muted` for labels.
- All numeric values use the monospace `DataReadout` primitive.

`LightScale` source:

```yaml
zone: aphotic
top: 1000
bottom: 4000
surface_light_percent: 0       # below 1000m, ~0% remains
```

`PressureCard` source:

```yaml
depth: 4000
unit: m
```

The card computes pressure from depth (`atm = 1 + depth_m / 10`) and renders both the figure and a relative-scale bar.

`TemperatureCurve` source:

```yaml
profile: north-atlantic
highlight: thermocline
```

The curve is one of a small set of bundled profiles in `src/lib/oceanography/temperature-profiles.ts`. Authors do not specify raw points.

## ZoneStats

Used at the top of every zone page. Source:

```yaml
zone: aphotic
depth_range: 1000 - 4000 m
pressure_range: 100 - 400 atm
temperature: 4 °C
light: none (apart from bioluminescence)
```

Renders as a 2×2 or 4×1 grid of small readouts, depending on viewport. Driven by the same tokens as `SpeciesCard`, so per-zone accent colour follows automatically.

## StatGrid (generic, retained)

Used on the homepage and intro sections. Source:

````markdown
```stat-grid
71% | of Earth's surface
11 km | deepest known point
~0 °C | average deep-sea temp
```
````

Render: split on newlines, split each line on `|`, trim. Render as `<ul class="stat-grid">…</ul>`.

## Safety

- Parse with `zod` everywhere structure matters.
- Never `eval` or `new Function` user source.
- Every component renders an error card on parse failure with the file path, the line, and the validation error — surfaced in dev only; in production a generic "viz unavailable" card is shown.

## What NOT to do

- Do not invent a new markdown directive syntax (`:::`). Stick to fenced code blocks.
- Do not auto-register components by filename. Whitelist each tag in `MarkdownRenderer`.
- Do not embed raw HTML as a fallback for a failed visualisation.
- Do not hard-code colours; use design-system tokens so visualisations theme correctly per zone.
- Do not duplicate scroll listeners across visualisations. Read the shared `--depth` custom property when scroll-linked behaviour is needed.
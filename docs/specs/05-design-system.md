# 05 — Design system

Token-driven, CSS Modules. No utility-CSS framework. The palette is built around a single idea: **the further down the reader scrolls, the deeper and darker the world becomes.** Tokens are not just static — many of them interpolate against a `--depth` custom property that the page updates as the reader scrolls.

## Decisions

- **No Tailwind.** Remove `tailwindcss`, `@tailwindcss/postcss`, and the `@import "tailwindcss"` line from `globals.css` during the design-system task.
- **No CSS-in-JS.** No styled-components, no Emotion.
- **CSS Modules** per component (`Foo.module.css` co-located with `Foo.tsx`).
- **Design tokens** live as CSS custom properties in `src/app/globals.css`.
- **A scroll-driven `--depth` variable** drives ambient theming. Set on `<body>` from a single window-level `useScroll` hook in a top-level provider.
- **Fluid everything.** Type scales with `clamp()`; spacing uses a 24 px baseline.

## The depth axis

A single unit-interval custom property captures where the reader is in the descent.

```css
:root {
  --depth: 0;            /* 0 at the surface, 1 in the hadal trench */
}
```

Every depth-aware token reads from `--depth`. The value is updated once per frame from a `useScroll` `MotionValue` in a top-level provider; CSS interpolates the rest.

Per-zone pages also set a discrete `--zone` attribute on `<body>`:

```html
<body data-zone="dysphotic">…</body>
```

so tokens can be specialised per zone in addition to the continuous depth interpolation.

## Tokens (globals.css)

```css
:root {
  /* Depth axis — defaulted; overridden per zone & by the scroll provider */
  --depth: 0;

  /* Color — anchor stops along the descent */
  --sea-surface:  #4ea7c8;   /* sunlit blue-cyan */
  --sea-twilight: #1d4f7a;   /* twilight indigo */
  --sea-midnight: #0a1f3d;   /* midnight navy */
  --sea-abyss:    #02060f;   /* near-black with a hint of blue */
  --sea-hadal:    #000000;   /* black */

  /* Background blends along the depth axis */
  --page-background: color-mix(
    in oklab,
    var(--sea-surface)  calc((1 - var(--depth)) * 100%),
    var(--sea-abyss)    calc(var(--depth) * 100%)
  );
  --surface:           rgba(255, 255, 255, 0.04);
  --rule:              rgba(255, 255, 255, 0.10);

  /* Text */
  --text:        #e9f2f7;
  --text-muted:  #9fb3c0;
  --text-strong: #ffffff;

  /* Bioluminescent accents */
  --bio-cyan:    #6ef0ff;
  --bio-green:   #7cf2b0;
  --bio-violet:  #b48cff;
  --bio-magenta: #ff5fb1;
  --accent:      var(--bio-cyan);
  --accent-strong: #b6fbff;

  /* Typography — measured, science-forward */
  --fluid-min-px: 16;
  --fluid-max-px: 19;
  --fluid-scaler: calc(
    var(--fluid-min-px) * 1px
    + (var(--fluid-max-px) - var(--fluid-min-px)) * ((100vw - 360px) / (1280 - 360))
  );
  --text-base:    clamp(16px, var(--fluid-scaler), 19px);
  --text-h4:      calc(var(--text-base) * 1.15);
  --text-h3:      calc(var(--text-base) * 1.4);
  --text-h2:      calc(var(--text-base) * 1.85);
  --text-h1:      calc(var(--text-base) * 2.6);
  --text-display: clamp(2.4rem, 5.4vw, 4.8rem);
  --text-small:   calc(var(--text-base) * 0.86);

  /* Weights */
  --wght-base: 400;
  --wght-h2:   500;
  --wght-h1:   600;

  /* Spacing — 24 px baseline */
  --baseline: 24px;
  --space-0_5x: calc(var(--baseline) * 0.5);
  --space-1x:   var(--baseline);
  --space-2x:   calc(var(--baseline) * 2);
  --space-3x:   calc(var(--baseline) * 3);
  --space-4x:   calc(var(--baseline) * 4);
  --space-5x:   calc(var(--baseline) * 5);

  /* Reading column */
  --read-measure: 64ch;

  /* Glow halos for bioluminescent UI */
  --glow-cyan:    0 0 24px rgba(110, 240, 255, 0.45);
  --glow-violet:  0 0 22px rgba(180, 140, 255, 0.45);

  /* Shadows */
  --shadow-sm: 0 12px 30px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 24px 60px rgba(0, 0, 0, 0.7);

  /* Motion */
  --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-quick:  180ms;
  --dur-base:   380ms;
  --dur-slow:   700ms;

  /* Z-index scale */
  --z-base: 0;
  --z-sticky: 10;
  --z-overlay: 50;
  --z-modal: 100;
}

/* Per-zone overrides — slugs match content/pages/<slug>.md */
body[data-zone="euphotic"]  { --accent: var(--bio-cyan);    --depth-base: 0.05; }
body[data-zone="dysphotic"] { --accent: var(--bio-violet);  --depth-base: 0.30; }
body[data-zone="aphotic"]   { --accent: var(--bio-green);   --depth-base: 0.55; }
body[data-zone="abyssal"]   { --accent: var(--bio-magenta); --depth-base: 0.80; }
body[data-zone="hadal"]     { --accent: #ffffff;            --depth-base: 0.95; }

@media (prefers-reduced-motion: reduce) {
  :root { --dur-quick: 0ms; --dur-base: 0ms; --dur-slow: 0ms; }
}

html, body { background: var(--page-background); color: var(--text); }
body { font-size: var(--text-base); line-height: 1.6; }
```

The combination of a continuous `--depth` and a discrete `data-zone` keeps both per-zone styling (zone-specific accent colours, header treatments) and a global fade-to-black gradient working without conflict.

## Typography

- **Display/headings:** Fraunces (serif, optical sizing), loaded as `--font-display` via `next/font/google`. Cool, slightly modern serif suited to science writing.
- **Body:** Inter (sans-serif), loaded as `--font-sans`. Clear at small sizes against dark backgrounds.
- **Mono (data, depth readouts):** JetBrains Mono, `--font-mono`.

```tsx
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";

const sans    = Inter({          subsets: ["latin"], variable: "--font-sans",    display: "swap" });
const display = Fraunces({       subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono    = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono",    display: "swap" });
```

```css
body         { font-family: var(--font-sans), system-ui, sans-serif; }
h1,h2,h3,h4  { font-family: var(--font-display), Georgia, serif; letter-spacing: -0.01em; }
.depth-readout, .pressure-readout, .temp-readout {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
```

## Component primitives

`src/components/ui/`:

- `Heading` — `level: 1|2|3|4`; applies `--text-h*` and `--wght-h*`.
- `Text` — `variant: "body" | "muted" | "eyebrow" | "small"`.
- `ContextualLink` — internal (`next/link`) vs external (`<a target=_blank>`); adds basePath for internal links. Underline by default; bioluminescent hover glow.
- `CallToActionGroup` — layout wrapper for 1–3 CTAs.
- `DataReadout` — small primitive for monospace numeric data (depth, pressure, temperature). Used by `DepthGauge` and `ZoneStats`.
- `ZoneNavigator` — bottom-of-page "↑ back" / "continue descent →" navigation. Reads `descentOrder` from frontmatter and resolves the previous and next zone slugs at build time.

Each has its own `.module.css`. No `className` props for layout — consumers wrap in their own container.

## Layout CSS modules

- `StandardLayout.module.css` — hero, reading-column max-width, sticky table-of-contents, slot for the `DepthGauge` aside, slot for `ZoneNavigator` at the foot.
- `PresentationLayout.module.css` — kept for portability; not used by any v1 zone page.

Naming: BEM-like inside modules (`.root`, `.hero`, `.hero__copy`, `.hero--dense`). CSS Modules scope the class names; BEM is only for readability.

## Imagery

Most zone pages lean on photography or rendered illustration of marine life and water columns.

- Prefer `.webp` at ≤ 1600 px wide, ≤ 500 KB.
- Hero images: 16:9 or 21:9.
- Species cards: 4:3 or 1:1.
- Rendered abyssal scenes can carry a slight cyan/violet rim light to read against the deep background.
- All `<img>` inside motion components must have explicit `width`/`height` to prevent layout shift.
- Always provide a meaningful `alt` — e.g. *"A bigfin reef squid hovering in the open water column"*, not *"squid"*.

## Icons

SVG only, inline via React components in `src/components/ui/icons/`. No icon font. Bioluminescent accent colour is allowed on icons that represent active state.

## Accessibility tokens

- Minimum body contrast: 7:1 against the **current** `--page-background`. Because background depth-shifts, this is verified at three sample depths (`0.0`, `0.5`, `1.0`) in the design audit.
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 2px; box-shadow: var(--glow-cyan);` on all interactive elements. Never `outline: none` without replacing.
- Touch target ≥ 44×44 px.
- Bioluminescent glow effects (`box-shadow`) are decorative only — never the sole indicator of focus or state.
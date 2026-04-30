# 02 — Content model

Content is authored as Markdown files with YAML frontmatter. Routing is file-system driven.

## File layout

```
content/
├── home.md                        # served at /
└── pages/
  ├── euphotic.md                # → /euphotic
  ├── dysphotic.md               # → /dysphotic
  ├── aphotic.md                 # → /aphotic
  ├── abyssal.md                 # → /abyssal
  ├── hadal.md                   # → /hadal
```

Rules:
- Exactly one Markdown file per URL. No index files, no nesting in v1.
- Slug = filename minus `.md`. Kebab-case only; validated at build time.
- `home.md` is reserved for `/`.

## Frontmatter schema

Every file begins with a YAML block validated by Zod at build time.

```yaml
---
title: "Euphotic Zone"
layout: "presentation"         # "standard" | "presentation"
heroImage: "/images/ocean/euphotic-reef.webp"  # optional
summary: "The sunlit skin of the ocean, where photosynthesis still works."    # optional
seo:
  title: "Euphotic Zone | Into The Deep"
  description: "Surface to 200 meters: light, plankton, reefs, and predators in the ocean's brightest layer."
  openGraphImage: "/images/og/euphotic.png"
order: 1                        # optional; sort key for listings
---
```

Zod schema lives at `src/lib/content/schema.ts`:

```ts
import { z } from "zod";

export const PageFrontmatterSchema = z.object({
  title: z.string().min(1),
  layout: z.enum(["standard", "presentation"]),
  heroImage: z.string().optional(),
  summary: z.string().optional(),
  order: z.number().int().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      openGraphImage: z.string().optional(),
    })
    .optional(),
});

export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>;
```

Build behavior: if validation fails, throw `ContentValidationError` with the file path and the Zod issue list. `next build` must exit non-zero.

## Content body

Markdown body supports:

- CommonMark + GitHub Flavored Markdown (via `remark-gfm`).
- Inline HTML is allowed but discouraged.
- Headings `h2`–`h4` are rendered through the design system (`src/components/ui/heading.tsx`).
- Internal links use `[label](/slug)` and are rewritten with `basePath` at render time.
- External links render as `<a target="_blank" rel="noopener">`.

## Presentation-specific authoring

When `layout: "presentation"`, the parser splits the body on horizontal rules (`---`) into slides. Each slide becomes one `PresentationSlide`.

```markdown
---
title: "How sticky slides work"
layout: "presentation"
---

## The trick

A tall section with a sticky inner stage.

---

![bg](/images/media/modules/generated/era-1-visual-break.webp)

## Background slide

The image fills the viewport; text sits on top.

---

![split](/images/media/modules/portraits/alan-turing.webp)

## Split slide

The image lives on the right, prose on the left.
```

Supported image directives (parsed in `src/lib/content/parser.ts`):

| Alt text | Effect |
|---|---|
| `bg` | Full-bleed background, content overlaid |
| `bg 50% 65%` | Background with CSS `object-position: 50% 65%` |
| `split` | Image right, prose left |
| `split-reverse` | Image left, prose right |

Any other alt text renders a normal inline `<img>` (via `next/image` when possible).

## Content repository API

`src/lib/content/repository.ts` exposes:

```ts
interface PageData {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;          // raw markdown body
}

class ContentRepository {
  constructor(baseDir: string);
  getPageBySlug(slug: string): Promise<PageData>;
  getAllSlugs(): Promise<string[]>;
  getAllPages(): Promise<PageData[]>;   // used for index / nav
}

// Singletons
getHomeRepo(): ContentRepository;   // baseDir = content/
getPagesRepo(): ContentRepository;  // baseDir = content/pages/
```

## Routing

- `src/app/page.tsx` — loads `content/home.md`, dispatches to layout factory.
- `src/app/[...slug]/page.tsx`:
  ```ts
  export const dynamicParams = false;
  export async function generateStaticParams() {
    const slugs = await getPagesRepo().getAllSlugs();
    return slugs.map((slug) => ({ slug: [slug] }));
  }
  ```
  With `dynamicParams = false`, a request for an unknown slug 404s at build time rather than runtime.

## Authoring workflow

1. Create `content/pages/my-new-page.md`.
2. Fill frontmatter (`title`, `layout` required).
3. Write the body. Use `---` between slides if presentation.
4. `npm run dev` — page is immediately reachable at `/my-new-page`.
5. Commit + push. CI rebuilds and deploys.

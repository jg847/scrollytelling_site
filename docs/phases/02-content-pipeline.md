---
status: pending
phase: 02
title: Content pipeline
depends-on: [01]
---

# Phase 02 — Content pipeline

## Objective
Load `.md` files from `content/` with Zod-validated frontmatter and generate static routes for every page. No layout/markdown rendering yet — just wiring and fixtures that prove the pipeline works.

## Spec references
- [specs/02-content-model.md](../specs/02-content-model.md) — schema, routing, repository API.

## Reference code to port

| Reference | Purpose | Target |
|---|---|---|
| `docs/_references/bseai_degree/lib/content/schema.ts` | Zod `PageFrontmatterSchema` | `src/lib/content/schema.ts` |
| `docs/_references/bseai_degree/lib/content/repository.ts` | `ContentRepository`, `getHomeRepo`, `getPagesRepo`, `ContentValidationError` | `src/lib/content/repository.ts` |
| `docs/_references/bseai_degree/lib/content/parser.ts` | `splitMarkdownIntoSlides`, image-directive parsing | `src/lib/content/parser.ts` |
| `docs/_references/bseai_degree/app/page.tsx` | Homepage loader pattern | `src/app/page.tsx` (pattern only; renderer comes in Phase 03) |
| `docs/_references/bseai_degree/app/[...slug]/page.tsx` | `generateStaticParams`, `dynamicParams=false` | `src/app/[...slug]/page.tsx` |
| `docs/_references/bseai_degree/tests/unit/content-repository.test.ts` | Repo test patterns | `tests/unit/content-repository.test.ts` |
| `docs/_references/bseai_degree/tests/unit/markdown-parser.test.ts` | Parser test patterns | `tests/unit/markdown-parser.test.ts` |
| `docs/_references/bseai_degree/tests/unit/setup.ts` | jsdom + RTL setup | `tests/unit/setup.ts` |
| `docs/_references/bseai_degree/vitest.config.ts` | Vitest config | `vitest.config.ts` |

## Steps

1. **Install deps.** `npm i gray-matter zod next-mdx-remote remark-gfm`.
2. **Install dev deps.** `npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/dom`.
3. **Port `vitest.config.ts`** — jsdom environment, setup file, path alias `@/` → `src/`.
4. **Port `tests/unit/setup.ts`.**
5. **Port `schema.ts`.** Keep the fields listed in [specs/02-content-model.md §Frontmatter schema](../specs/02-content-model.md); add optional `summary` and `order` (they are in our spec, not the reference). Drop any reference-only fields.
6. **Port `repository.ts`.** Two singletons:
   - `getHomeRepo()` → `baseDir = <repo>/content`
   - `getPagesRepo()` → `baseDir = <repo>/content/pages`
   Expose `getPageBySlug`, `getAllSlugs`, `getAllPages`. Use `process.cwd()` for `baseDir` resolution.
7. **Port `parser.ts`.** Export `splitMarkdownIntoSlides(body): ParsedSlide[]` plus an image-directive parser supporting `bg`, `bg x% y%`, `split`, `split-reverse`. Keep the reference's logic; we will need it in Phase 05.
8. **Write fixtures.**
   - `content/home.md` — `layout: presentation`, title "Into The Deep", summary, and a short introductory slide sequence.
   - `content/pages/euphotic.md` — `layout: presentation`, zone metadata, and at least three slides separated by `---`.
   - `content/pages/dysphotic.md` — `layout: presentation`, zone metadata, and at least one `![bg](...)` or `![split](...)` directive.
9. **Route wiring (renderer stub).** For now, `src/app/page.tsx` and `src/app/[...slug]/page.tsx` load the page data and render a **placeholder** shell:
   ```tsx
   return (
     <main>
       <Heading level={1}>{page.frontmatter.title}</Heading>
       <pre>{page.content}</pre>
     </main>
   );
   ```
   The real renderer lands in Phase 03. The point of this phase is that routing and validation work.
10. **`[...slug]/page.tsx`** — copy the reference shape: `dynamicParams = false`, `generateStaticParams()` returns slugs from `getPagesRepo().getAllSlugs()` excluding `"home"`.
11. **Write unit tests.**
    - `tests/unit/schema.test.ts` — valid + invalid fixtures.
    - `tests/unit/markdown-parser.test.ts` — slide splitting + each image directive.
    - `tests/unit/content-repository.test.ts` — missing file, malformed YAML, happy path. Point the repo at `tests/__mocks__/content/`.
12. **Mock fixtures.** `tests/__mocks__/content/` with one valid + one invalid-frontmatter file.
13. **npm scripts.** Add to `package.json`:
    ```json
    "test": "vitest run",
    "test:watch": "vitest"
    ```

## Files created / modified

- `src/lib/content/schema.ts`, `repository.ts`, `parser.ts`
- `src/app/page.tsx` (placeholder renderer)
- `src/app/[...slug]/page.tsx` (new)
- `content/home.md`, `content/pages/euphotic.md`, `content/pages/dysphotic.md`
- `tests/unit/setup.ts`, `schema.test.ts`, `markdown-parser.test.ts`, `content-repository.test.ts`
- `tests/__mocks__/content/*.md`
- `vitest.config.ts`
- `package.json` (deps + scripts)

## Exit checks
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds and emits `out/index.html`, `out/euphotic/index.html`, and `out/dysphotic/index.html`
- [ ] Requesting `/does-not-exist` 404s at build time (confirm by deleting a page and observing build failure, then restore)
- [ ] Invalid frontmatter in a fixture makes `npm run build` fail with a readable error mentioning the file path

## Completion notes

<!-- Filled in after execution -->

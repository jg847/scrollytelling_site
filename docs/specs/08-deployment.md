# 08 — Deployment

Target: **GitHub Pages**, static only.

## Next config

```ts
// next.config.ts
import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

Already in place — see [next.config.ts](../next.config.ts).

## basePath semantics

- **Local dev:** `NEXT_PUBLIC_BASE_PATH` unset → basePath = `""`. App serves at `/`.
- **CI / Pages:** `NEXT_PUBLIC_BASE_PATH=/<repo>` → basePath = `/<repo>`. App serves at `https://<user>.github.io/<repo>/`.
- **Custom domain (optional future):** basePath = `""`, add `public/CNAME`.

The value is resolved **at build time** by Next and by our own `src/lib/site-config.ts` helper:

```ts
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function url(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${basePath}${clean}`;
}
```

Use `url("/images/foo.webp")` anywhere an asset path is built manually (outside JSX that Next rewrites automatically).

## GitHub Actions workflow

Already created at [.github/workflows/deploy.yml](../.github/workflows/deploy.yml). The repo now includes the intended four-job local/CI shape; the remaining work is validating it on the actual GitHub Pages environment:

```yaml
name: Deploy Next.js site to Pages
on:
  push: { branches: [main] }
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency: { group: pages, cancel-in-progress: false }

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  build:
    needs: verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - uses: actions/configure-pages@v5
        id: pages
      - run: npm ci
      - run: npx next build
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}
      - run: touch ./out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report
          if-no-files-found: ignore

  deploy:
    needs: [build, e2e]
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Notes:
- `actions/configure-pages@v5` emits `base_path` automatically (e.g. `/scrolly`) for project sites.
- `.nojekyll` prevents GitHub Pages from stripping `_next/` folders.
- E2E runs against a freshly-built `out/` served by Playwright's `webServer`.
- `playwright.config.ts` is CI-aware: `retries: process.env.CI ? 2 : 0` and `reuseExistingServer: !process.env.CI`.
- The remaining manual asset-path surface in app code should use `src/lib/site-config.ts#url()`; the image library page now does.

## Current status

Implemented locally:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`
- four-job workflow shape in `.github/workflows/deploy.yml`
- CI-aware Playwright settings
- `.nojekyll` creation during build job
- orphan-image verification via `tests/unit/image-assets.test.ts`
- local Lighthouse sample on `/`, `/abyssal/`, and `/hadal/` against the exported site

Local Lighthouse snapshot after the latest content/parser cleanup:

- `/` → `51 / 100 / 100 / 100` (performance / accessibility / best-practices / SEO)
- `/abyssal/` → `90 / 100 / 100 / 100`
- `/hadal/` → `91 / 100 / 100 / 100`

Interpretation:
- The deploy-critical quality bars are clean locally for accessibility, best-practices, and SEO on the sampled routes.
- Home-page performance is still below the desired Phase 08 target and remains the main local Lighthouse follow-up item.

Still pending on GitHub:

- first real workflow run on `main`
- Pages source confirmed as GitHub Actions
- deployed-site smoke checks on the real Pages URL
- Lighthouse against the live deployment

## GitHub repo settings to verify

1. **Settings → Pages → Source:** GitHub Actions.
2. **Settings → Actions → General → Workflow permissions:** Read and write; allow GitHub Actions to create PRs (optional).
3. **Environments → github-pages:** auto-created by the `deploy-pages` action.

## First deploy checklist

- [ ] Repo pushed to GitHub with `main` as default branch.
- [ ] Pages set to "GitHub Actions".
- [x] One successful `npm run build` locally (with `NEXT_PUBLIC_BASE_PATH=/scrolly`) producing `out/index.html`.
- [ ] Workflow run green on first push.
- [ ] Site loads at `https://<user>.github.io/scrolly/` with no 404s on `/_next/*`.

## Local preview of the built site

```bash
NEXT_PUBLIC_BASE_PATH=/scrolly npm run build
npx serve out -l 4321
# then visit http://localhost:4321/scrolly/
```

The trailing slash matters because of `trailingSlash: true`.

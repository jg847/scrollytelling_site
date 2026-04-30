---
status: in-progress
phase: 07
title: CI + deploy hardening
depends-on: [06]
---

# Phase 07 — CI + deploy hardening

## Objective
Take the scaffold workflow from Phase 00 to its final shape: lint + unit + build + e2e + deploy, with Playwright report artifacts and basePath correctness verified on a live Pages URL. This phase now serves the continuous standard-layout story path rather than the legacy presentation deck.

## Spec references
- [specs/08-deployment.md](../specs/08-deployment.md)

## Reference code to port

| Reference | Purpose | Target |
|---|---|---|
| `docs/_references/bseai_degree/.github/workflows/pages.yml` | Production workflow | `.github/workflows/deploy.yml` (replace) |

Study but do **not** copy blindly — the reference has a `sed` rewrite step that is obsoleted by Next's `basePath` + `assetPrefix`. Use `NEXT_PUBLIC_BASE_PATH` from `actions/configure-pages` instead.

## Steps

1. **Rewrite workflow** to the four-job shape in [specs/08-deployment.md §GitHub Actions workflow](../specs/08-deployment.md):
   - `verify` — checkout, setup-node, `npm ci`, `npm run lint`, `npm run test`
   - `build` — checkout, setup-node, `npm ci`, `configure-pages`, `npx next build` with `NEXT_PUBLIC_BASE_PATH`, `touch out/.nojekyll`, upload-pages-artifact
   - `e2e` — checkout, setup-node, `npm ci`, `playwright install --with-deps chromium`, `npm run build`, `npm run test:e2e`; uploads the HTML report on failure via `actions/upload-artifact`
   - `deploy` — needs `[build, e2e]`, `actions/deploy-pages@v4`
2. **Playwright config polish.** Set `webServer` to serve `out/` on a fixed port, `reuseExistingServer: !process.env.CI`, `retries: process.env.CI ? 2 : 0`.
3. **Lint script.** Confirm `npm run lint` runs `eslint` across `src/` and `tests/`. Fix any warnings introduced since Phase 01.
4. **basePath helpers audit.** Grep `src/` for any hard-coded `/images/` or `/_next/` references in string concat. Route them through `url()` from `site-config.ts` if they survive the build's automatic rewriting.
5. **`.nojekyll` verified.** `out/.nojekyll` must exist after build (workflow touches it).
6. **First deploy.**
   - `git push` to `main`.
   - In GitHub: Settings → Pages → Source: GitHub Actions.
   - Watch workflow, ensure all four jobs green.
7. **Live checks.** Visit `https://<user>.github.io/scrolly/`:
   - Home loads; no 404s on `/_next/*` or images (DevTools → Network).
   - `/euphotic/` loads.
   - `/hadal/` works; sticky media and zone navigation still function.
   - Reduced-motion in OS settings disables animations.
8. **Lighthouse.** Run against the deployed URL. Target: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Fix regressions.

## Files created / modified

- `.github/workflows/deploy.yml` — full rewrite
- `playwright.config.ts` — CI tuning
- `eslint.config.mjs` — confirm rules; no domain-specific ignores

## Exit checks
- [ ] All four workflow jobs green on a push to `main`
- [ ] Deployed site fully functional, no console errors, no 404s
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95
- [ ] Playwright report uploaded as artifact (manually force a failing run to confirm, then revert)
- [x] `grep -rn "/_next\|/images" src/` finds only JSX attributes Next handles, not manual string concatenation

## Completion notes

- Hardened `.github/workflows/deploy.yml` to the four-job `verify` / `build` / `e2e` / `deploy` shape.
- Updated `playwright.config.ts` for CI-aware retries and `reuseExistingServer` behavior.
- Tightened `npm run lint` to `eslint .` and fixed the pre-existing lint blockers that prevented Phase 07 from being meaningful.
- Routed the image library page through `src/lib/site-config.ts#url()` instead of manual base-path concatenation.
- Local verification is green (`npm run lint && npm run test && npm run test:e2e && npm run build`).
- Remaining work is the real GitHub push, Pages configuration, live smoke checks, and Lighthouse.

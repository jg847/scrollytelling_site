# 07 — Testing

Two test surfaces. Both run in CI; both must pass before a PR merges.

## Testing strategy — the matrix

Cover four axes at three levels. Each cell blocks a specific class of regression.

| Level \ Axis | Positive | Negative | Edge | Golden path |
|---|---|---|---|---|
| **Unit** (Vitest / jsdom) | Function returns the right value for typical input | Throws / returns error for bad input | Empty, zero, unicode, TZ, off-by-one | *(n/a)* |
| **Integration** (Vitest, real modules) | Two modules wire up and produce the expected result | Seam fails safely when one side misbehaves | Concurrency, retries, missing files | *(n/a)* |
| **E2E** (Playwright, built site) | User completes the flow in a real browser | Bad routes / missing content degrade gracefully | Keyboard nav, reduced motion, small screens | The headline user journey for the spec |

**Operational rules** (enforced per phase, not per commit):

1. **Every spec in `docs/specs/` has at least one golden-path e2e test.** If there is no e2e, the spec is not really specified.
2. **Every phase objective has at least one unit or integration test as its exit check**, declared in the phase file's `## Tests required` section.
3. **A failing test is never fixed by deleting the test.** Fix the code, or change the spec and change the test deliberately — and note the change in the phase's Completion notes.
4. **No AI-generated code merges without tests that exercise it.** The test is the durable form of the exit check.

This matrix is referenced from the guide's [Working with AI § Tests as durable exit checks](../guide/03-working-with-ai.md#tests-as-durable-exit-checks) and from the [audit prompts](../guide/07-prompt-templates.md#75-audit-pass).

## Unit — Vitest

- Runner: `vitest` with `environment: "jsdom"`.
- Setup: `tests/unit/setup.ts` imports `@testing-library/jest-dom/vitest`.
- Location: `tests/unit/**/*.test.ts(x)`.
- Command: `npm run test` (alias `vitest run`) and `npm run test:watch`.

### What we test (unit)

| Area | What | Why |
|---|---|---|
| `lib/content/schema.ts` | Valid + invalid frontmatter fixtures | Fail closed on bad content |
| `lib/content/parser.ts` | `splitMarkdownIntoSlides`, image-directive parsing | Parser is hard to debug in the browser |
| `lib/content/repository.ts` | File loading, missing slugs, malformed YAML | Build-time failure clarity |
| `lib/site-config.ts` | basePath URL helpers | Pages sub-path correctness |
| `components/markdown/*` (node-renderable bits) | Code-block → component dispatch | Visualization wiring |
| `components/ui/ContextualLink` | Internal vs external branching | Routing correctness |

### What we do NOT unit-test

- Motion components (`Reveal`, `PresentationSlide`) — jsdom has no layout or scroll; covered by E2E.
- Visual styling.
- Recharts/Mermaid output — library code.

## E2E — Playwright

- Runner: `@playwright/test`, Chromium only.
- Location: `tests/browser/**/*.spec.ts`.
- Base URL: built static site served locally via `npx serve out -l 4321` (Playwright `webServer` config).
- Command: `npm run test:e2e`.

### What we test (E2E)

| Spec | Assertion |
|---|---|
| `homepage.spec.ts` | `/` responds 200, title matches frontmatter, and the first stitched zone heading enters the viewport once scrolled into the descent |
| `standard-reveal.spec.ts` | A `<Reveal>` element starts with `opacity: 0` and reaches `opacity: 1` after scrolling past it |
| `zones.spec.ts` | Each zone page renders as a continuous narrative surface, expected story sections appear, sticky media works on wide screens, and navigation continues the descent |
| `reduced-motion.spec.ts` | With `prefers-reduced-motion: reduce` emulated, animated elements have no non-identity transform at rest |
| `links.spec.ts` | Internal links include basePath; external links have `target="_blank"` and `rel` |

### Patterns

- Use Playwright's `page.emulateMedia({ reducedMotion: "reduce" })` for accessibility tests.
- Use `page.evaluate(() => window.scrollTo(0, y))` rather than mouse wheel for deterministic scroll tests.
- Assert computed style via `page.$eval(selector, el => getComputedStyle(el).opacity)`.

## Fixtures

- `tests/__mocks__/content/` mirrors `content/` with tiny fixtures used by unit tests.
- `tests/fixtures/frontmatter.*.yml` for positive and negative schema cases.

## Coverage targets

- Unit: ≥ 90% statements on `src/lib/**`.
- E2E: one spec per user-facing flow listed above.

## CI integration

The deploy workflow ([08-deployment.md](./08-deployment.md)) runs `npm ci`, then:

```yaml
- run: npm run lint
- run: npm run test
- run: npm run build
- run: npm run test:e2e   # after build, against out/
```

All four must pass. Playwright uploads its HTML report as a workflow artifact on failure.

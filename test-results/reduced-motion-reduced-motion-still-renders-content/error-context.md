# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reduced-motion.spec.ts >> reduced motion still renders content
- Location: tests/browser/reduced-motion.spec.ts:3:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('heading', { level: 1 }).first()
Expected: "Scrolly"
Received: "Into The Deep"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 }).first()
    9 × locator resolved to <h1 class="text-4xl font-semibold tracking-tight sm:text-6xl">Into The Deep</h1>
      - unexpected value "Into The Deep"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - article [ref=e3]:
      - generic [ref=e4]:
        - paragraph [ref=e5]: presentation
        - heading "Into The Deep" [level=1] [ref=e6]
        - paragraph [ref=e7]: A scroll through the five layers of the ocean. From sunlit surface to the dark trenches that crush submarines.
      - generic [ref=e8]:
        - paragraph [ref=e12]: Welcome to the tour. Ready to take a dive into the ocean?
        - paragraph [ref=e16]: Below your feet, the water doesn't just get deeper — it changes. Light fades. Pressure builds. Familiar fish give way to creatures that make their own light, and then to creatures that have never seen any.
        - paragraph [ref=e20]: We'll descend through five zones, one page at a time.
        - heading "The five layers" [level=2] [ref=e24]
        - list [ref=e27]:
          - listitem [ref=e28]: "[Euphotic Zone — Sunlight](/euphotic) — surface to 200 m"
          - listitem [ref=e29]: "[Dysphotic Zone — Twilight](/dysphotic) — 200 to 1,000 m"
          - listitem [ref=e30]: "[Aphotic Zone — Midnight](/aphotic) — 1,000 to 4,000 m"
          - listitem [ref=e31]: "[Abyssal Zone — Abyss](/abyssal) — 4,000 to 6,000 m"
          - listitem [ref=e32]: "[Hadal Zone — Trenches](/hadal) — 6,000 m and below"
        - paragraph [ref=e36]: Start with the Sunlight Zone and keep scrolling.
  - alert [ref=e37]
```

# Test source

```ts
  1 | import { expect, test } from "@playwright/test";
  2 | 
  3 | test("reduced motion still renders content", async ({ page }) => {
  4 |   await page.emulateMedia({ reducedMotion: "reduce" });
  5 |   await page.goto("/");
> 6 |   await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Scrolly");
    |                                                                 ^ Error: expect(locator).toHaveText(expected) failed
  7 | });
  8 | 
```
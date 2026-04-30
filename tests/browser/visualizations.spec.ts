import { expect, test } from "@playwright/test";

test("malformed visualization blocks render visible fallbacks", async ({ page }) => {
  await page.goto("/visualization-fixtures/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Visualization Fixtures");
  await expect(page.locator("[data-viz-error='true']")).toHaveCount(4);
  await expect(page.locator("[data-viz='mermaid-fallback']")).toHaveCount(1);
  await expect(page.getByText("Source shown because diagram rendering failed")).toBeVisible();
});

test("mermaid chunk only loads on a page that renders mermaid", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Euphotic Zone");
  const euphoticScripts = await page.evaluate(() => {
    return performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.includes("/_next/static/chunks/") && name.endsWith(".js"));
  });

  await page.goto("/dysphotic/");
  await expect(page.getByText("Client-rendered after hydration")).toBeVisible();

  const dysphoticScripts = await page.evaluate(() => {
    return performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.includes("/_next/static/chunks/") && name.endsWith(".js"));
  });

  const extraScripts = dysphoticScripts.filter((script) => !euphoticScripts.includes(script));
  expect(extraScripts.length).toBeGreaterThan(0);
});
import { expect, test } from "@playwright/test";

test("story pages render shipped visualizations without fallback errors", async ({ page }) => {
  await page.goto("/dysphotic/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dysphotic Zone");
  await expect(page.locator("[data-viz='stat-grid']")).toHaveCount(1);
  await expect(page.locator("[data-viz='timeline']")).toHaveCount(1);
  await expect(page.locator("[data-viz-error='true']")).toHaveCount(0);
});

test("story pages do not render removed mermaid or demo visualizations", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Euphotic Zone");
  await expect(page.locator("[data-viz='mermaid']")).toHaveCount(0);
  await expect(page.locator("[data-viz='progress-bar']")).toHaveCount(0);
  await expect(page.locator("[data-viz='scroll-demo']")).toHaveCount(0);
  await expect(page.locator("[data-viz='code-sample']")).toHaveCount(0);

  await page.goto("/dysphotic/");
  await expect(page.locator("[data-viz='mermaid']")).toHaveCount(0);
  await expect(page.locator("[data-viz='progress-bar']")).toHaveCount(0);
  await expect(page.locator("[data-viz='scroll-demo']")).toHaveCount(0);
  await expect(page.locator("[data-viz='code-sample']")).toHaveCount(0);
});
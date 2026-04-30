import { expect, test } from "@playwright/test";

test("euphotic zone page loads", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Euphotic Zone");
  await expect(page.locator("[data-standard-story-section='true']")).toHaveCount(5);
  await expect(page.locator("[data-presentation-slide='true']")).toHaveCount(0);
  await expect(page.locator("[data-standard-story-media='true'] img").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Dysphotic Zone/i })).toBeVisible();
});

test("dysphotic zone page loads", async ({ page }) => {
  await page.goto("/dysphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Dysphotic Zone");
  await expect(page.locator("[data-viz='stat-grid']")).toHaveCount(1);
  await expect(page.locator("[data-viz='timeline']")).toHaveCount(1);
  await expect(page.locator("[data-viz='progress-bar']")).toHaveCount(0);
  await expect(page.locator("[data-viz='scroll-demo']")).toHaveCount(0);
  await expect(page.locator("[data-viz='mermaid']")).toHaveCount(0);
  await expect(page.locator("[data-viz='code-sample']")).toHaveCount(0);
});

test("aphotic zone page loads", async ({ page }) => {
  await page.goto("/aphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Aphotic Zone");
});

test("abyssal zone page loads", async ({ page }) => {
  await page.goto("/abyssal/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Abyssal Zone");
});

test("hadal zone page loads", async ({ page }) => {
  await page.goto("/hadal/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Hadal Zone");
});

test("continuous story media sticks beside the text on wide screens", async ({ page }) => {
  await page.goto("/euphotic/");
  const position = await page.locator("[data-standard-story-media='true']").nth(1).evaluate((node) => window.getComputedStyle(node.firstElementChild as Element).position);
  expect(position).toBe("sticky");
});
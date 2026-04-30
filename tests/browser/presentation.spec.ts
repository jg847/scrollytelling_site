import { expect, test } from "@playwright/test";

test("euphotic zone page loads", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Euphotic Zone");
  await expect(page.locator("[data-presentation-slide='true']")).toHaveCount(5);
  await expect(page.locator("[data-presentation-progress='true']").first()).toBeVisible();
  await expect(page.getByAltText("Sunlight scattering through the upper ocean with fish moving through the bright water")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("[data-presentation-footer-gate='true']")).toBeVisible();
});

test("dysphotic zone page loads", async ({ page }) => {
  await page.goto("/dysphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Dysphotic Zone");
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

test("presentation stage collapses on narrow viewports", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/euphotic/");
  const position = await page.locator("[data-presentation-stage='true']").first().evaluate((node) => window.getComputedStyle(node).position);
  expect(position).toBe("static");
});
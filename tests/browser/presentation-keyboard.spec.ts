import { expect, test } from "@playwright/test";

test("ArrowDown and Home navigate the presentation deck", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.locator("[data-presentation-shortcuts-ready='true']")).toHaveCount(1);

  const startY = await page.evaluate(() => window.scrollY);
  expect(startY).toBe(0);

  await page.keyboard.press("ArrowDown");

  await expect.poll(async () => {
    return page.evaluate(() => window.scrollY);
  }).toBeGreaterThan(200);

  await page.keyboard.press("Home");

  await expect.poll(async () => {
    return page.evaluate(() => window.scrollY);
  }).toBe(0);
});

test("question mark opens the shortcut overlay and escape closes it", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.locator("[data-presentation-shortcuts-ready='true']")).toHaveCount(1);

  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", shiftKey: true, bubbles: true }));
  });
  await expect(page.getByRole("dialog", { name: /presentation shortcuts/i })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /presentation shortcuts/i })).toHaveCount(0);
});
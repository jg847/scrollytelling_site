import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Into the Deep — A Tour of the Ocean's Layers");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Into The Deep");

  const firstZoneHeading = page.getByRole("heading", { name: "Euphotic Zone" }).first();
  await expect(firstZoneHeading).not.toBeInViewport();

  await firstZoneHeading.scrollIntoViewIfNeeded();

  await expect(firstZoneHeading).toBeInViewport();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");

  await expect.poll(async () => {
    return page.evaluate(() => document.activeElement?.id ?? "");
  }).toBe("main");
});

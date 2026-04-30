import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Into The Deep");
  await expect(page.getByRole("heading", { name: "Euphotic Zone" })).toHaveCount(1);
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

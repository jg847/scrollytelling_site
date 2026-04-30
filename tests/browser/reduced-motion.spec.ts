import { expect, test } from "@playwright/test";

test("reduced motion still renders content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Euphotic Zone");
  await expect.poll(async () => {
    return page.evaluate(() => window.getComputedStyle(document.documentElement).scrollBehavior);
  }).toBe("auto");
  const sectionHeading = page.getByRole("heading", { level: 3, name: "Where the light still reaches" });
  await expect(sectionHeading).toBeVisible();
});

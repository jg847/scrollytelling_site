import { expect, test } from "@playwright/test";

test("euphotic zone page loads", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Euphotic Zone");
});
import { expect, test } from "@playwright/test";

test("euphotic zone page loads", async ({ page }) => {
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Euphotic Zone");
});

test("dysphotic zone page loads", async ({ page }) => {
  await page.goto("/dysphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Dysphotic Zone");
});
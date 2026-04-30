import { expect, test } from "@playwright/test";

test("standard page loads", async ({ page }) => {
  await page.goto("/getting-started/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Getting Started");
  await expect(page.getByRole("link", { name: "What this page demonstrates" })).toHaveAttribute("href", "#what-this-page-demonstrates");
  await expect(page.getByRole("heading", { level: 2, name: "What this page demonstrates" })).toHaveAttribute("id", "what-this-page-demonstrates");
});

import { expect, test } from "@playwright/test";

test("internal story links point at generated zone routes", async ({ page }) => {
  await page.goto("/euphotic/");

  const descentLink = page.locator("a[href='/dysphotic/']").first();
  await expect(descentLink).toHaveAttribute("href", /\/dysphotic\/?$/);

  await descentLink.click();
  await expect(page).toHaveURL(/\/dysphotic\/?$/);
});

test("external links open safely in a new tab", async ({ page }) => {
  await page.goto("/getting-started/");

  const noaaLink = page.getByRole("link", { name: "NOAA Ocean Service" });
  await expect(noaaLink).toHaveAttribute("href", "https://oceanservice.noaa.gov/");
  await expect(noaaLink).toHaveAttribute("target", "_blank");
  await expect(noaaLink).toHaveAttribute("rel", /noopener noreferrer/);
});
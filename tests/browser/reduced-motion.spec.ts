import { expect, test, type Locator } from "@playwright/test";

test("reduced motion still renders content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/euphotic/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Euphotic Zone");
  await expect.poll(async () => {
    return page.evaluate(() => window.getComputedStyle(document.documentElement).scrollBehavior);
  }).toBe("auto");
  const sectionHeading = page.getByRole("heading", { level: 2, name: "Where the light still reaches" });
  await expect(sectionHeading).toBeVisible();
  const motionStyles = await readNearestMotionWrapper(sectionHeading);
  expect(motionStyles).toBeNull();
});

async function readNearestMotionWrapper(locator: Locator) {
  return locator.evaluate((node) => {
    let current = node.parentElement;

    while (current) {
      const style = current.getAttribute("style") ?? "";
      if (style.includes("opacity") || style.includes("transform")) {
        const computed = window.getComputedStyle(current);
        return {
          opacity: computed.opacity,
          transform: computed.transform,
        };
      }

      current = current.parentElement;
    }

    return null;
  });
}

import { expect, test, type Locator } from "@playwright/test";

test("standard layout reveals off-screen content on scroll", async ({ page }) => {
  await page.goto("/getting-started/");

  const content = page.getByText("This page exists so the content repository has at least one generated standard-layout slug.");
  const initialStyles = await readNearestMotionWrapper(content);

  expect(initialStyles).not.toBeNull();
  expect(Number(initialStyles?.opacity ?? 1)).toBeLessThan(1);

  await content.scrollIntoViewIfNeeded();

  await expect.poll(async () => {
    const styles = await readNearestMotionWrapper(content);
    return styles?.opacity ?? "0";
  }).toBe("1");

  await expect.poll(async () => {
    const styles = await readNearestMotionWrapper(content);
    return styles?.transform ?? "matrix(0, 0, 0, 0, 0, 0)";
  }).toBe("none");
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
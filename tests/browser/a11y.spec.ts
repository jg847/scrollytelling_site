import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const storyPages = [
  { path: "/", title: "home" },
  { path: "/euphotic/", title: "euphotic" },
  { path: "/dysphotic/", title: "dysphotic" },
  { path: "/aphotic/", title: "aphotic" },
  { path: "/abyssal/", title: "abyssal" },
  { path: "/hadal/", title: "hadal" },
];

for (const storyPage of storyPages) {
  test(`${storyPage.title} page has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(storyPage.path);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blockingViolations = accessibilityScanResults.violations.filter((violation) => {
      return violation.impact === "serious" || violation.impact === "critical";
    });

    expect(blockingViolations).toEqual([]);
  });
}
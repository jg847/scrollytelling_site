import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { splitMarkdownIntoSlides } from "@/lib/content/parser";

describe("presentation slide parsing", () => {
  it("detects background image directives", () => {
    const slides = splitMarkdownIntoSlides("![bg 50% 65%](/image.webp)\n\n## Title");
    expect(slides[0]?.kind).toBe("bg");
    expect(slides[0]?.imageUrl).toBe("/image.webp");
    expect(slides[0]?.objectPosition).toBe("50% 65%");
  });

  it("detects split directives", () => {
    const slides = splitMarkdownIntoSlides("![split](/portrait.webp)\n\n## Title");
    expect(slides[0]?.kind).toBe("split");
  });

  it("renders markdown links inside list items", () => {
    const html = renderToStaticMarkup(
      createElement(MarkdownRenderer, null, "- [Euphotic Zone](/euphotic)"),
    );

    expect(html).toContain('href="/euphotic"');
    expect(html).toContain("Euphotic Zone");
  });
});

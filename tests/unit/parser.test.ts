import { describe, expect, it } from "vitest";
import { splitMarkdownIntoSlides } from "@/lib/content/parser";

describe("splitMarkdownIntoSlides", () => {
  it("splits on horizontal rules", () => {
    const slides = splitMarkdownIntoSlides("# One\n\n---\n\n# Two");
    expect(slides).toHaveLength(2);
    expect(slides[0]?.markdown).toContain("# One");
    expect(slides[1]?.markdown).toContain("# Two");
  });

  it("parses background directives without object position", () => {
    const [slide] = splitMarkdownIntoSlides("![bg](/reef.webp)\n\n## Reef");

    expect(slide).toMatchObject({
      kind: "bg",
      imageUrl: "/reef.webp",
      objectPosition: undefined,
      markdown: "## Reef",
    });
  });

  it("parses background directives with object position", () => {
    const [slide] = splitMarkdownIntoSlides("![bg 50% 65%](/reef.webp)\n\n## Reef");

    expect(slide).toMatchObject({
      kind: "bg",
      imageUrl: "/reef.webp",
      objectPosition: "50% 65%",
      markdown: "## Reef",
    });
  });

  it("parses split directives", () => {
    const [slide] = splitMarkdownIntoSlides("![split](/angler.webp)\n\n## Anglerfish");

    expect(slide).toMatchObject({
      kind: "split",
      imageUrl: "/angler.webp",
      markdown: "## Anglerfish",
    });
  });

  it("parses reverse split directives", () => {
    const [slide] = splitMarkdownIntoSlides("![split-reverse](/snailfish.webp)\n\n## Snailfish");

    expect(slide).toMatchObject({
      kind: "split-reverse",
      imageUrl: "/snailfish.webp",
      markdown: "## Snailfish",
    });
  });
});

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

  it("parses descriptive alt text from slide directives", () => {
    const [slide] = splitMarkdownIntoSlides("![split | A lanternfish suspended in dim blue water](/lanternfish.webp)\n\n## Lanternfish");

    expect(slide).toMatchObject({
      kind: "split",
      imageUrl: "/lanternfish.webp",
      imageAlt: "A lanternfish suspended in dim blue water",
      markdown: "## Lanternfish",
    });
  });

  it("parses background object position and alt text together", () => {
    const [slide] = splitMarkdownIntoSlides("![bg 50% 35% | Sunbeams breaking across the ocean surface](/reef.webp)\n\n## Reef");

    expect(slide).toMatchObject({
      kind: "bg",
      imageUrl: "/reef.webp",
      imageAlt: "Sunbeams breaking across the ocean surface",
      objectPosition: "50% 35%",
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

  it("ignores duplicate leading directives after the first recognized one", () => {
    const [slide] = splitMarkdownIntoSlides(
      "![bg 50% 58% | A wide abyssal plain](/abyssal.jpg)\n\n![split | Duplicate directive should not leak into markdown](/abyssal.jpg)\n\n## What lives here",
    );

    expect(slide).toMatchObject({
      kind: "bg",
      imageUrl: "/abyssal.jpg",
      imageAlt: "A wide abyssal plain",
      objectPosition: "50% 58%",
      markdown: "## What lives here",
    });
  });

  it("leaves ordinary markdown images untouched", () => {
    const [slide] = splitMarkdownIntoSlides("![Lanternfish](/lanternfish.webp)\n\n## Caption");

    expect(slide).toMatchObject({
      kind: "plain",
      markdown: "![Lanternfish](/lanternfish.webp)\n\n## Caption",
    });
  });
});

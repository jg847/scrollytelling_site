export interface ParsedSlide {
  kind: "plain" | "bg" | "split" | "split-reverse";
  imageUrl?: string;
  imageAlt?: string;
  objectPosition?: string;
  markdown: string;
  raw: string;
}

function parseDirective(markdown: string): Pick<ParsedSlide, "kind" | "imageUrl" | "imageAlt" | "objectPosition" | "markdown"> {
  const imageMatch = markdown.match(/^!\[(.*?)\]\((.*?)\)\s*\n?/m);
  if (!imageMatch) {
    return { kind: "plain", markdown };
  }

  const rawAlt = imageMatch[1].trim();
  const imageUrl = imageMatch[2].trim();
  const [directive, ...altParts] = rawAlt.split("|").map((part) => part.trim()).filter(Boolean);
  const imageAlt = altParts.join(" | ") || undefined;
  const objectPositionMatch = directive?.match(/^bg\s+(.+)$/);
  const kind: ParsedSlide["kind"] = directive === "bg" || objectPositionMatch ? "bg" : directive === "split" ? "split" : directive === "split-reverse" ? "split-reverse" : "plain";
  const markdownWithoutImage = markdown.replace(imageMatch[0], "").trim();

  return {
    kind,
    imageUrl,
    imageAlt,
    objectPosition: objectPositionMatch?.[1],
    markdown: markdownWithoutImage,
  };
}

export function splitMarkdownIntoSlides(body: string): ParsedSlide[] {
  return body
    .split(/^---$/m)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => ({ raw, ...parseDirective(raw) }));
}

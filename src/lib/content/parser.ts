export interface ParsedSlide {
  kind: "plain" | "bg" | "split" | "split-reverse";
  imageUrl?: string;
  imageAlt?: string;
  objectPosition?: string;
  markdown: string;
  raw: string;
}

function parseDirectiveAlt(rawAlt: string) {
  const [directive, ...altParts] = rawAlt.split("|").map((part) => part.trim()).filter(Boolean);
  const objectPositionMatch = directive?.match(/^bg\s+(.+)$/);
  const kind: ParsedSlide["kind"] | undefined =
    directive === "bg" || objectPositionMatch
      ? "bg"
      : directive === "split"
        ? "split"
        : directive === "split-reverse"
          ? "split-reverse"
          : undefined;

  if (!kind) {
    return null;
  }

  return {
    kind,
    imageAlt: altParts.join(" | ") || undefined,
    objectPosition: objectPositionMatch?.[1],
  };
}

function parseDirective(markdown: string): Pick<ParsedSlide, "kind" | "imageUrl" | "imageAlt" | "objectPosition" | "markdown"> {
  const lines = markdown.split("\n");
  let lineIndex = 0;
  let parsedDirective: { kind: ParsedSlide["kind"]; imageAlt?: string; objectPosition?: string; imageUrl: string } | null = null;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex]?.trim();
    if (!line) {
      lineIndex += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (!imageMatch) {
      break;
    }

    const directive = parseDirectiveAlt(imageMatch[1].trim());
    if (!directive) {
      break;
    }

    if (!parsedDirective) {
      parsedDirective = {
        ...directive,
        imageUrl: imageMatch[2].trim(),
      };
    }

    lineIndex += 1;
  }

  if (!parsedDirective) {
    return { kind: "plain", markdown };
  }

  const markdownWithoutImage = lines.slice(lineIndex).join("\n").trim();

  return {
    kind: parsedDirective.kind,
    imageUrl: parsedDirective.imageUrl,
    imageAlt: parsedDirective.imageAlt,
    objectPosition: parsedDirective.objectPosition,
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

export interface HeadingAnchor {
  id: string;
  level: number;
  text: string;
}

export function slugifyHeading(text: string) {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "section";
}

export function createHeadingIdFactory() {
  const seen = new Map<string, number>();

  return (text: string) => {
    const base = slugifyHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function collectHeadingAnchors(markdown: string, levels: number[] = [2]) {
  const nextId = createHeadingIdFactory();

  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{1,4})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      level: match[1].length,
      text: match[2].trim(),
    }))
    .filter((heading) => levels.includes(heading.level))
    .map((heading) => ({
      ...heading,
      id: nextId(heading.text),
    }));
}
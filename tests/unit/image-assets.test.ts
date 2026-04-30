import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workspaceRoot = process.cwd();
const contentRoot = path.join(workspaceRoot, "content");
const imageRoot = path.join(workspaceRoot, "public", "images");
const imagePattern = /\/images\/[\w./-]+/g;
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]);

describe("image assets", () => {
  it("references every public image from authored content", async () => {
    const referencedImages = await collectReferencedImages(contentRoot);
    const publicImages = await collectPublicImages(imageRoot);

    expect(publicImages).toEqual(referencedImages);
  });
});

async function collectReferencedImages(root: string) {
  const references = new Set<string>();
  const files = await walkFiles(root);

  for (const filePath of files) {
    if (!filePath.endsWith(".md")) {
      continue;
    }

    const source = await readFile(filePath, "utf8");
    const matches = source.match(imagePattern) ?? [];
    for (const match of matches) {
      references.add(match);
    }
  }

  return [...references].sort();
}

async function collectPublicImages(root: string) {
  const files = await walkFiles(root);

  return files
    .filter((filePath) => imageExtensions.has(path.extname(filePath).toLowerCase()))
    .map((filePath) => filePath.slice(root.length).replace(/\\/g, "/"))
    .map((relativePath) => `/images${relativePath}`)
    .sort();
}

async function walkFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}
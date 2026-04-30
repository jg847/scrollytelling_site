import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ContentRepository, ContentValidationError } from "@/lib/content/repository";

describe("ContentRepository", () => {
  it("loads markdown content and frontmatter", async () => {
    const dir = await fsTempDir();
    await writeFile(
      path.join(dir, "sample.md"),
      `---\ntitle: Sample\nlayout: standard\n---\n\nHello`,
    );

    const repo = new ContentRepository(dir);
    const page = await repo.getPageBySlug("sample");
    expect(page.frontmatter.title).toBe("Sample");
    expect(page.content.trim()).toBe("Hello");
  });

  it("rejects invalid slugs before reading the filesystem", async () => {
    const repo = new ContentRepository("/tmp/content");

    await expect(repo.getPageBySlug("not/valid")).rejects.toMatchObject({
      filePath: "/tmp/content/not/valid.md",
      issues: ["slug: must be kebab-case"],
    } satisfies Partial<ContentValidationError>);
  });

  it("surfaces missing files as filesystem errors", async () => {
    const dir = await fsTempDir();
    const repo = new ContentRepository(dir);

    await expect(repo.getPageBySlug("missing")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("wraps invalid frontmatter in a content validation error", async () => {
    const dir = await fsTempDir();
    await writeFile(
      path.join(dir, "broken.md"),
      `---\nlayout: standard\n---\n\nHello`,
    );

    const repo = new ContentRepository(dir);

    await expect(repo.getPageBySlug("broken")).rejects.toMatchObject({
      filePath: path.join(dir, "broken.md"),
      issues: [expect.stringContaining("title")],
    });
  });

  it("wraps malformed yaml in a content validation error", async () => {
    const dir = await fsTempDir();
    await writeFile(
      path.join(dir, "malformed.md"),
      `---\ntitle: Sample\nlayout: [standard\n---\n\nHello`,
    );

    const repo = new ContentRepository(dir);

    await expect(repo.getPageBySlug("malformed")).rejects.toMatchObject({
      filePath: path.join(dir, "malformed.md"),
      issues: [expect.stringContaining("frontmatter:")],
    });
  });
});

async function fsTempDir() {
  const dir = await mkdir(path.join(os.tmpdir(), `scrolly-${Date.now()}`), { recursive: true });
  return dir;
}

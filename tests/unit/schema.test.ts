import { readFile } from "node:fs/promises";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { PageFrontmatterSchema } from "@/lib/content/schema";

async function readFixture(name: string) {
  const source = await readFile(`tests/fixtures/${name}`, "utf8");
  return matter(`---\n${source}\n---`).data;
}

describe("PageFrontmatterSchema", () => {
  it("accepts valid frontmatter fixtures", async () => {
    const result = PageFrontmatterSchema.safeParse(await readFixture("frontmatter.valid.yml"));
    expect(result.success).toBe(true);
  });

  it("rejects invalid frontmatter fixtures", async () => {
    const result = PageFrontmatterSchema.safeParse(await readFixture("frontmatter.invalid.yml"));
    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { mergeDepth, normalizePathname, resolveZone } from "@/components/providers/DepthThemeProvider";

describe("DepthThemeProvider helpers", () => {
  it("strips the configured base path before zone resolution", () => {
    expect(normalizePathname("/scrollytelling/euphotic", "/scrollytelling")).toBe("/euphotic");
    expect(resolveZone("/scrollytelling/hadal", "/scrollytelling")).toBe("hadal");
  });

  it("treats the bare base path as the homepage", () => {
    expect(normalizePathname("/scrollytelling", "/scrollytelling")).toBe("/");
    expect(resolveZone("/scrollytelling", "/scrollytelling")).toBeUndefined();
  });

  it("merges zone baseline depth with scroll progress", () => {
    expect(mergeDepth(0.55, 0)).toBe(0.55);
    expect(mergeDepth(0.55, 0.5)).toBe(0.775);
    expect(mergeDepth(0.95, 1)).toBe(1);
  });
});
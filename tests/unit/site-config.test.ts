import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("site-config", () => {
  it("prefixes relative paths with the configured basePath", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/scrolly");

    const { basePath, url } = await import("@/lib/site-config");

    expect(basePath).toBe("/scrolly");
    expect(url("euphotic")).toBe("/scrolly/euphotic");
    expect(url("/dysphotic")).toBe("/scrolly/dysphotic");
  });

  it("defaults to root-relative urls when no basePath is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");

    const { basePath, url } = await import("@/lib/site-config");

    expect(basePath).toBe("");
    expect(url("aphotic")).toBe("/aphotic");
  });
});
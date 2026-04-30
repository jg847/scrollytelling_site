import type { ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("ContextualLink", () => {
  it("prefixes internal links with the configured basePath", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/scrolly");

    const { ContextualLink } = await import("@/components/ui/ContextualLink");

    render(<ContextualLink href="/euphotic">Euphotic Zone</ContextualLink>);

    expect(screen.getByRole("link", { name: "Euphotic Zone" })).toHaveAttribute("href", "/scrolly/euphotic");
  });

  it("renders external links with safe new-tab attributes", async () => {
    const { ContextualLink } = await import("@/components/ui/ContextualLink");

    render(<ContextualLink href="https://oceanservice.noaa.gov/">NOAA Ocean Service</ContextualLink>);

    expect(screen.getByRole("link", { name: "NOAA Ocean Service" })).toHaveAttribute(
      "href",
      "https://oceanservice.noaa.gov/",
    );
    expect(screen.getByRole("link", { name: "NOAA Ocean Service" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "NOAA Ocean Service" })).toHaveAttribute("rel", "noopener noreferrer");
  });
});

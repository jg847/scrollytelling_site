import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { CodeSample, parseCodeSampleSource } from "@/components/visualization/CodeSample";
import { ProgressBar, parseProgressBarSource } from "@/components/visualization/ProgressBar";
import { ScrollDemo, parseScrollDemoSource } from "@/components/visualization/ScrollDemo";
import { StatGrid, parseStatGridSource } from "@/components/visualization/StatGrid";
import { Timeline, parseTimelineSource } from "@/components/visualization/Timeline";

describe("visualization parsers", () => {
  it("parses stat-grid rows", () => {
    expect(parseStatGridSource("90% | marine biomass\n4 C | deep water")).toEqual([
      { value: "90%", label: "marine biomass" },
      { value: "4 C", label: "deep water" },
    ]);
  });

  it("parses timeline rows", () => {
    expect(parseTimelineSource("Dusk | Rise\nDawn | Sink")).toEqual([
      { time: "Dusk", label: "Rise" },
      { time: "Dawn", label: "Sink" },
    ]);
  });

  it("parses scroll-demo settings", () => {
    expect(parseScrollDemoSource([
      "title: Twilight descent",
      "intro: Descend through the layer.",
      "steps: Glow | Haze | Dark",
    ].join("\n"))).toEqual({
      title: "Twilight descent",
      intro: "Descend through the layer.",
      steps: ["Glow", "Haze", "Dark"],
    });
  });

  it("parses progress-bar settings", () => {
    expect(parseProgressBarSource("label: Reader descent\ntint: var(--accent)")).toEqual({
      label: "Reader descent",
      tint: "var(--accent)",
    });
  });

  it("parses code-sample metadata", () => {
    expect(parseCodeSampleSource("title: Sample\nlang: ts\n\nconst depth = 200;")).toEqual({
      title: "Sample",
      language: "ts",
      code: "const depth = 200;",
    });
  });

  it("keeps ordinary colon-prefixed code as code", () => {
    expect(parseCodeSampleSource("status: ok\n\nnext line")).toEqual({
      code: "status: ok\n\nnext line",
    });
  });
});

describe("visualization error rendering", () => {
  it("renders a visible error card for malformed stat-grid input", () => {
    const html = renderToStaticMarkup(createElement(StatGrid, { source: "only one cell" }));
    expect(html).toContain("Visualization unavailable");
    expect(html).toContain("data-viz-error=\"true\"");
  });

  it("renders a visible error card for malformed timeline input", () => {
    const html = renderToStaticMarkup(createElement(Timeline, { source: "bad line" }));
    expect(html).toContain("Visualization unavailable");
  });

  it("renders a visible error card for malformed scroll-demo input", () => {
    const html = renderToStaticMarkup(createElement(ScrollDemo, { source: "title: Missing steps" }));
    expect(html).toContain("Visualization unavailable");
  });

  it("renders a visible error card for malformed progress-bar input", () => {
    const html = renderToStaticMarkup(createElement(ProgressBar, { source: "label: Reader descent\ntint: violet" }));
    expect(html).toContain("Visualization unavailable");
  });

  it("renders code-sample metadata when present", () => {
    const html = renderToStaticMarkup(createElement(CodeSample, { source: "title: Log extract\nlang: txt\n\nline" }));
    expect(html).toContain("Log extract");
    expect(html).toContain("data-lang=\"txt\"");
  });

  it("dispatches fenced code-sample blocks that contain internal blank lines", () => {
    const html = renderToStaticMarkup(
      createElement(
        MarkdownRenderer,
        null,
        "```code-sample\ntitle: Log extract\nlang: txt\n\nline\n```",
      ),
    );

    expect(html).toContain("data-viz=\"code-sample\"");
    expect(html).toContain("Log extract");
  });

  it("dispatches code-sample blocks wrapped in longer fences", () => {
    const html = renderToStaticMarkup(
      createElement(
        MarkdownRenderer,
        null,
        "````code-sample\ntitle: Fence demo\nlang: md\n\n```timeline\nDusk | Rise\n```\n````",
      ),
    );

    expect(html).toContain("data-viz=\"code-sample\"");
    expect(html).toContain("```timeline");
  });
});
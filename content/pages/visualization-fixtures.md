---
title: "Visualization Fixtures"
layout: "standard"
summary: "A harness page for validating successful and failed markdown visualizations through the real content pipeline."
seo:
  title: "Visualization Fixtures"
  description: "Internal fixture page for visualization rendering and error-state checks."
---

## Error-card fixtures

The blocks below are intentionally malformed so browser tests can verify that the shared visualization contract produces visible error cards instead of silent failures.

```stat-grid
missing separator row
```

```timeline
not a timeline row
```

```progress-bar
label: Fixture progress
tint: violet
```

```scroll-demo
title: Broken demo
intro: This should fail because the steps field is missing.
```

## Mermaid fallback fixture

This diagram is intentionally invalid so the client renderer falls back to the source block instead of leaving an empty shell.

```mermaid
flowchart TD
  A -->
```
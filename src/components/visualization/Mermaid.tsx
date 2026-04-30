"use client";

import { useEffect, useId, useState } from "react";
import styles from "./VisualizationPrimitives.module.css";

export function Mermaid({ source }: { source: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const id = useId().replace(/:/g, "-");

  useEffect(() => {
    let isCancelled = false;

    async function renderDiagram() {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
        });

        const result = await mermaid.render(`mermaid-${id}`, source);
        if (!isCancelled) {
          setSvg(result.svg);
          setHasError(false);
        }
      } catch {
        if (!isCancelled) {
          setHasError(true);
          setSvg(null);
        }
      }
    }

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [id, source]);

  if (hasError) {
    return (
      <figure className={styles.mermaidCard} data-viz="mermaid-fallback">
        <figcaption className={styles.mermaidHeader}>
          <span className={styles.vizEyebrow}>Mermaid fallback</span>
          <span className={styles.mermaidStatus}>Source shown because diagram rendering failed</span>
        </figcaption>
        <pre className={styles.mermaidBlock}>
          <code>{source}</code>
        </pre>
      </figure>
    );
  }

  if (!svg) {
    return (
      <figure className={styles.mermaidCard} data-viz="mermaid">
        <figcaption className={styles.mermaidHeader}>
          <span className={styles.vizEyebrow}>Mermaid diagram</span>
          <span className={styles.mermaidStatus}>Rendering diagram…</span>
        </figcaption>
        <div className={styles.mermaidShell}>
          <div className={styles.mermaidLoading} aria-hidden="true" />
        </div>
      </figure>
    );
  }

  return (
    <figure className={styles.mermaidCard} data-viz="mermaid">
      <figcaption className={styles.mermaidHeader}>
        <span className={styles.vizEyebrow}>Mermaid diagram</span>
        <span className={styles.mermaidStatus}>Client-rendered after hydration</span>
      </figcaption>
      <div className={styles.mermaidShell} dangerouslySetInnerHTML={{ __html: svg }} />
    </figure>
  );
}

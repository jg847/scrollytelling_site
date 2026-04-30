"use client";

import styles from "./VisualizationPrimitives.module.css";

export function Mermaid({ source }: { source: string }) {
  return (
    <pre className={styles.mermaidBlock}>
      {source}
    </pre>
  );
}

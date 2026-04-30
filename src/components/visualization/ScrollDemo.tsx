"use client";

import { useMemo } from "react";
import styles from "./VisualizationPrimitives.module.css";

export function ScrollDemo({ source }: { source: string }) {
  const text = useMemo(() => source.trim(), [source]);
  return (
    <div className={styles.surfaceCard}>
      <pre className={styles.preWrap}>{text || "ScrollDemo parse error"}</pre>
    </div>
  );
}

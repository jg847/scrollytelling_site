"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import styles from "./VisualizationPrimitives.module.css";
import { VizParseError, parseKeyValueSource, parseRequiredValue, renderVizWithContract } from "./_shared/viz-contract";

type ProgressBarModel = {
  label: string;
  tint?: string;
};

export function parseProgressBarSource(source: string): ProgressBarModel {
  const values = parseKeyValueSource(source);
  const label = parseRequiredValue(values.label, "label");
  const tint = values.tint?.trim();
  if (tint && !/^var\(--[\w-]+\)$/.test(tint)) {
    throw new VizParseError("Tint must be a CSS variable like var(--accent).");
  }

  return { label, tint };
}

export function ProgressBar({ source }: { source: string }) {
  return renderVizWithContract(source, parseProgressBarSource, (progress) => <ProgressBarBody progress={progress} />);
}

function ProgressBarBody({ progress }: { progress: ProgressBarModel }) {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const springScaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const scaleX = reducedMotion ? scrollYProgress : springScaleX;
  const style = progress.tint ? ({ "--viz-tint": progress.tint } as CSSProperties) : undefined;

  return (
    <section className={styles.progressCard} data-viz="progress-bar" style={style}>
      <div className={styles.progressHeader}>
        <p className={styles.vizEyebrow}>Page progress</p>
        <p className={styles.progressLabel}>{progress.label}</p>
      </div>
      <div className={styles.progressShell}>
        <motion.div className={styles.progressBar} style={{ scaleX }} />
      </div>
    </section>
  );
}

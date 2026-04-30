"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import styles from "./VisualizationPrimitives.module.css";
import { VizParseError, parseKeyValueSource, parseRequiredValue, renderVizWithContract } from "./_shared/viz-contract";

type ScrollDemoModel = {
  title: string;
  intro: string;
  steps: string[];
};

export function parseScrollDemoSource(source: string): ScrollDemoModel {
  const values = parseKeyValueSource(source);
  const title = parseRequiredValue(values.title, "title");
  const intro = parseRequiredValue(values.intro, "intro");
  const steps = parseRequiredValue(values.steps, "steps")
    .split("|")
    .map((step) => step.trim())
    .filter(Boolean);

  if (steps.length < 2) {
    throw new VizParseError("Provide at least two steps separated by \"|\".");
  }

  return { title, intro, steps };
}

export function ScrollDemo({ source }: { source: string }) {
  return renderVizWithContract(source, parseScrollDemoSource, (demo) => <ScrollDemoBody demo={demo} />);
}

function ScrollDemoBody({ demo }: { demo: ScrollDemoModel }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, demo.steps.length - 1]);
  const activeProgress = useTransform(scrollYProgress, [0, 1], [4, 100]);

  return (
    <section className={styles.scrollDemo} data-viz="scroll-demo" ref={ref}>
      <div className={styles.scrollDemoStage}>
        <div className={styles.scrollDemoCard}>
          <div className={styles.scrollDemoBackdrop} aria-hidden="true" />
          <div className={styles.scrollDemoHeader}>
            <div>
              <p className={styles.vizEyebrow}>Scroll demo</p>
              <h3 className={styles.vizTitle}>{demo.title}</h3>
            </div>
            <motion.div className={styles.scrollDemoReadout}>
              <span className={styles.scrollDemoReadoutLabel}>Depth cue</span>
              <motion.span>{useTransform(activeProgress, (value) => `${Math.round(value)}%`)}</motion.span>
            </motion.div>
          </div>
          <p className={styles.vizCopy}>{demo.intro}</p>
          <div className={styles.scrollDemoRail}>
            <div className={styles.scrollDemoSpine} aria-hidden="true" />
            {demo.steps.map((step, index) => (
              <ScrollDemoStep
                key={step}
                activeIndex={activeIndex}
                index={index}
                label={step}
                total={demo.steps.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollDemoStep({
  activeIndex,
  index,
  label,
  total,
}: {
  activeIndex: MotionValue<number>;
  index: number;
  label: string;
  total: number;
}) {
  const opacity = useTransform(activeIndex, [index - 0.55, index, index + 0.55], [0.45, 1, 0.45], {
    clamp: true,
  });
  const scale = useTransform(activeIndex, [index - 0.55, index, index + 0.55], [0.96, 1, 0.96], {
    clamp: true,
  });
  const y = useTransform(activeIndex, [index - 0.55, index, index + 0.55], [12, 0, -12], {
    clamp: true,
  });
  const fill = useTransform(activeIndex, [index - 0.5, index], [0, 1], { clamp: true });

  return (
    <motion.div className={styles.scrollDemoStep} style={{ opacity, scale, y }}>
      <div className={styles.scrollDemoMarker}>
        <motion.div className={styles.scrollDemoMarkerFill} style={{ scaleY: fill }} />
      </div>
      <div className={styles.scrollDemoStepBody}>
        <div className={styles.timelineTime}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
        <div className={styles.timelineLabel}>{label}</div>
      </div>
    </motion.div>
  );
}

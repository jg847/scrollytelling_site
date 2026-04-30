"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./PresentationProgress.module.css";

export function PresentationProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div aria-hidden="true" className={styles.root} data-presentation-progress="true">
      <motion.div className={styles.bar} data-presentation-progress="true" style={{ scaleX }} />
    </div>
  );
}
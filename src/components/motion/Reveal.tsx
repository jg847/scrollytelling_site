"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useSlideContext } from "./SlideContext";

export function Reveal({ children }: { children: React.ReactNode }) {
  const slide = useSlideContext();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();

  if (slide?.scrollYProgress) {
    return <div>{children}</div>;
  }

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

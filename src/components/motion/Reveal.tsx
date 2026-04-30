"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useSlideContext } from "./SlideContext";

type Direction = "up" | "down" | "left" | "right" | "none";
type Sequence = "standard" | "delayed";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  sequence?: Sequence;
  className?: string;
}

export function Reveal(props: RevealProps) {
  const slide = useSlideContext();

  if (slide?.scrollYProgress) {
    return <SlideReveal {...props} scrollYProgress={slide.scrollYProgress} />;
  }

  return <ViewportReveal {...props} />;
}

function ViewportReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const [x, y] = offsets(direction);
  const hidden = { opacity: 0, x, y };
  const shown = { opacity: 1, x: 0, y: 0 };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={hidden}
        animate={inView ? shown : hidden}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function SlideReveal({
  children,
  delay = 0,
  direction = "up",
  sequence = "standard",
  className = "",
  scrollYProgress,
}: RevealProps & { scrollYProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const start = sequence === "delayed" ? 0.5 + delay * 0.1 : Math.min(delay * 0.5, 0.5);
  const end = sequence === "delayed" ? 0.9 : 0.8;
  const [xDistance, yDistance] = offsets(direction);

  const opacity = useTransform(smooth, [start, end], [0, 1], { clamp: true });
  const x = useTransform(smooth, [start, end], [xDistance, 0], { clamp: true });
  const y = useTransform(smooth, [start, end], [yDistance, 0], { clamp: true });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      <motion.div style={{ opacity, x, y }}>{children}</motion.div>
    </div>
  );
}

function offsets(direction: Direction): [number, number] {
  if (direction === "left") return [-40, 0];
  if (direction === "right") return [40, 0];
  if (direction === "up") return [0, 30];
  if (direction === "down") return [0, -30];

  return [0, 0];
}

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

type SceneCardVariant = "section" | "emphasis" | "cta";

interface SceneCardProps {
  children: React.ReactNode;
  variant?: SceneCardVariant;
  className?: string;
}

export function SceneCard(props: SceneCardProps) {
  const slide = useSlideContext();

  if (slide?.scrollYProgress) {
    return <SlideSceneCard {...props} scrollYProgress={slide.scrollYProgress} />;
  }

  return <ViewportSceneCard {...props} />;
}

function ViewportSceneCard({ children, variant = "section", className }: SceneCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const profile = sceneProfile(variant);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref}>
      <motion.div
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: profile.yStart, scale: profile.scaleStart }}
        className={className}
        initial={{ opacity: 0, y: profile.yStart, scale: profile.scaleStart }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function SlideSceneCard({
  children,
  variant = "section",
  className,
  scrollYProgress,
}: SceneCardProps & { scrollYProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const profile = sceneProfile(variant);
  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const opacity = useTransform(smooth, [0.1, 0.7], [0, 1], { clamp: true });
  const y = useTransform(smooth, [0.1, 0.7], [profile.yStart, 0], { clamp: true });
  const scale = useTransform(smooth, [0.1, 0.7], [profile.scaleStart, 1], { clamp: true });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ opacity, y, scale, willChange: "transform, opacity" }}>
      {children}
    </motion.div>
  );
}

function sceneProfile(variant: SceneCardVariant) {
  if (variant === "emphasis") {
    return { yStart: 22, scaleStart: 0.98 };
  }

  if (variant === "cta") {
    return { yStart: 28, scaleStart: 0.975 };
  }

  return { yStart: 34, scaleStart: 0.965 };
}
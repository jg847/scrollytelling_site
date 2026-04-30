"use client";

import Image from "next/image";
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

type DriftIntensity = "soft" | "medium";

interface DriftMediaProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  intensity?: DriftIntensity;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function DriftMedia(props: DriftMediaProps) {
  const slide = useSlideContext();

  if (slide?.scrollYProgress) {
    return <SlideDriftMedia {...props} scrollYProgress={slide.scrollYProgress} />;
  }

  return <ViewportDriftMedia {...props} />;
}

function ViewportDriftMedia({
  src,
  alt,
  width,
  height,
  intensity = "soft",
  className,
  priority = false,
  sizes = "(min-width: 1024px) 48rem, 100vw",
}: DriftMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const profile = driftProfile(intensity);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        <Image alt={alt} height={height} loading={priority ? "eager" : "lazy"} priority={priority} sizes={sizes} src={src} width={width} />
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ y: profile.distance, scale: profile.scale }}
        animate={inView ? { y: 0, scale: 1 } : { y: profile.distance, scale: profile.scale }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <Image alt={alt} height={height} loading={priority ? "eager" : "lazy"} priority={priority} sizes={sizes} src={src} width={width} />
      </motion.div>
    </div>
  );
}

function SlideDriftMedia({
  src,
  alt,
  width,
  height,
  intensity = "soft",
  className,
  priority = false,
  sizes = "(min-width: 1024px) 48rem, 100vw",
  scrollYProgress,
}: DriftMediaProps & { scrollYProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const profile = driftProfile(intensity);
  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const y = useTransform(smooth, [0, 1], [profile.distance, -profile.distance], { clamp: true });
  const scale = useTransform(smooth, [0, 1], [profile.scale, 1], { clamp: true });

  if (reduced) {
    return (
      <div className={className}>
        <Image alt={alt} height={height} loading={priority ? "eager" : "lazy"} priority={priority} sizes={sizes} src={src} width={width} />
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div style={{ y, scale, willChange: "transform" }}>
        <Image alt={alt} height={height} loading={priority ? "eager" : "lazy"} priority={priority} sizes={sizes} src={src} width={width} />
      </motion.div>
    </div>
  );
}

function driftProfile(intensity: DriftIntensity) {
  if (intensity === "medium") {
    return { distance: 28, scale: 1.08 };
  }

  return { distance: 18, scale: 1.04 };
}
"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

interface ParallaxBackgroundProps {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export function ParallaxBackground({
  src,
  alt = "",
  className,
  priority = false,
}: ParallaxBackgroundProps) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    restDelta: 0.001,
  });
  const y = useTransform(smooth, [0, 1], [-32, 32], { clamp: false });

  if (reduced) {
    return (
      <div aria-hidden={alt === ""} className={className}>
        <Image alt={alt} fill priority={priority} sizes="100vw" src={src} style={{ objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div aria-hidden={alt === ""} className={className}>
      <motion.div style={{ position: "absolute", inset: 0, y, willChange: "transform" }}>
        <Image alt={alt} fill priority={priority} sizes="100vw" src={src} style={{ objectFit: "cover" }} />
      </motion.div>
    </div>
  );
}
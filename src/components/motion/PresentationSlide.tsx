"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { SlideContext } from "./SlideContext";
import styles from "./PresentationSlide.module.css";

export function PresentationSlide({
  children,
  index,
  hasBackground = false,
  backgroundColor,
}: {
  children: React.ReactNode;
  index: number;
  hasBackground?: boolean;
  backgroundColor?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  return (
    <SlideContext.Provider value={{ scrollYProgress }}>
      <section
        className={[styles.section, hasBackground ? styles.background : styles.content].join(" ")}
        data-presentation-slide="true"
        data-presentation-slide-index={index}
        ref={ref}
        style={{
          zIndex: index,
          backgroundColor,
        }}
      >
        <div className={styles.stage} data-presentation-stage="true">
          {children}
        </div>
      </section>
    </SlideContext.Provider>
  );
}

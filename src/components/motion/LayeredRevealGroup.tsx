import React from "react";
import { Reveal } from "./Reveal";

export function LayeredRevealGroup({
  children,
  direction = "up",
  sequence = "standard",
  stagger = 0.08,
  className,
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  sequence?: "standard" | "delayed";
  stagger?: number;
  className?: string;
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className={className}>
      {items.map((child, index) => (
        <Reveal key={index} delay={index * stagger} direction={direction} sequence={sequence}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

import React from "react";
import { Reveal } from "./Reveal";

export function LayeredRevealGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div>
      {items.map((child, index) => (
        <Reveal key={index}>{child}</Reveal>
      ))}
    </div>
  );
}

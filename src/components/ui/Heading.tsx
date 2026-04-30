import type { ReactNode } from "react";
import styles from "./Heading.module.css";

type HeadingLevel = 1 | 2 | 3 | 4;

const tagByLevel = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

export function Heading({ children, id, level }: { children: ReactNode; id?: string; level: HeadingLevel }) {
  const Tag = tagByLevel[level];
  return (
    <Tag className={styles[`level${level}`]} id={id}>
      {children}
    </Tag>
  );
}
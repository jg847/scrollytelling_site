import type { ReactNode } from "react";
import styles from "./Text.module.css";

type TextVariant = "body" | "muted" | "eyebrow" | "small";

export function Text({ children, variant = "body" }: { children: ReactNode; variant?: TextVariant }) {
  return <p className={styles[variant]}>{children}</p>;
}
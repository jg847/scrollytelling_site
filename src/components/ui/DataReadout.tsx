import type { ReactNode } from "react";
import styles from "./DataReadout.module.css";

export function DataReadout({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{children}</span>
    </div>
  );
}
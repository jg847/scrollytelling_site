import type { ReactNode } from "react";
import styles from "./CallToActionGroup.module.css";

export function CallToActionGroup({ children }: { children: ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}
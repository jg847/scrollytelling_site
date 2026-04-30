import styles from "./VisualizationPrimitives.module.css";

export function ProgressBar({ source }: { source: string }) {
  const value = Math.max(0, Math.min(100, Number(source.trim()) || 0));
  return (
    <div className={styles.progressShell}>
      <div className={styles.progressBar} style={{ width: `${value}%` }} />
    </div>
  );
}

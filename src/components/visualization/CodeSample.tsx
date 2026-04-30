import styles from "./VisualizationPrimitives.module.css";

export function CodeSample({ source }: { source: string }) {
  return (
    <pre className={styles.codeBlock}>
      <code>{source}</code>
    </pre>
  );
}

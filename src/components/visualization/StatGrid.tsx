import styles from "./VisualizationPrimitives.module.css";

export function StatGrid({ source }: { source: string }) {
  const rows = source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^[-|\s]+$/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()));

  if (!rows.length || rows.some((row) => row.length < 2)) {
    return <div className={styles.errorCard}>StatGrid parse error</div>;
  }

  return (
    <ul className={styles.statGrid}>
      {rows.map(([value, label], index) => (
        <li key={index} className={styles.statTile}>
          <div className={styles.statValue}>{value}</div>
          <div className={styles.statLabel}>{label}</div>
        </li>
      ))}
    </ul>
  );
}

import styles from "./VisualizationPrimitives.module.css";

export function Timeline({ source }: { source: string }) {
  const events = source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [time, label] = line.split("|").map((cell) => cell.trim());
      return { time, label };
    });

  return (
    <ol className={styles.timeline}>
      {events.map((event, index) => (
        <li key={index}>
          <div className={styles.timelineTime}>{event.time}</div>
          <div className={styles.timelineLabel}>{event.label}</div>
        </li>
      ))}
    </ol>
  );
}

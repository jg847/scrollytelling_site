import styles from "./VisualizationPrimitives.module.css";
import { VizParseError, renderVizWithContract } from "./_shared/viz-contract";

type StatGridRow = {
  value: string;
  label: string;
};

export function parseStatGridSource(source: string) {
  const rows = source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^[-|\s]+$/.test(line))
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
      if (cells.length !== 2) {
        throw new VizParseError(`Expected \"value | label\" but received \"${line}\".`);
      }

      return {
        value: cells[0],
        label: cells[1],
      } satisfies StatGridRow;
    });

  if (!rows.length) {
    throw new VizParseError("Add at least one stat row.");
  }

  return rows;
}

export function StatGrid({ source }: { source: string }) {
  return renderVizWithContract(source, parseStatGridSource, (rows) => (
    <ul className={styles.statGrid} data-viz="stat-grid">
      {rows.map((row, index) => (
        <li key={index} className={styles.statTile}>
          <div className={styles.statValue}>{row.value}</div>
          <div className={styles.statLabel}>{row.label}</div>
        </li>
      ))}
    </ul>
  ));
}

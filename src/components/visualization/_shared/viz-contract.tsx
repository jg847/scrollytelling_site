import type { ReactNode } from "react";
import styles from "../VisualizationPrimitives.module.css";

export class VizParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VizParseError";
  }
}

export function parseRequiredValue(value: string | undefined, label: string) {
  if (!value) {
    throw new VizParseError(`Missing ${label}.`);
  }

  return value.trim();
}

export function parseKeyValueSource(source: string) {
  const entries = source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex < 0) {
        throw new VizParseError(`Expected \"key: value\" but received \"${line}\".`);
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      if (!key || !value) {
        throw new VizParseError(`Expected \"key: value\" but received \"${line}\".`);
      }

      return [key, value] as const;
    });

  return Object.fromEntries(entries);
}

export function renderVizWithContract<T>(
  source: string,
  parser: (raw: string) => T,
  render: (parsed: T) => ReactNode,
) {
  try {
    return render(parser(source));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Visualization unavailable.";
    return <VizError message={message} />;
  }
}

export function VizError({ message }: { message: string }) {
  return (
    <div className={styles.errorCard} data-viz-error="true" role="status">
      <strong className={styles.errorTitle}>Visualization unavailable</strong>
      <div>{message}</div>
    </div>
  );
}
import { LayeredRevealGroup } from "@/components/motion/LayeredRevealGroup";
import styles from "./VisualizationPrimitives.module.css";
import { VizParseError, renderVizWithContract } from "./_shared/viz-contract";

type TimelineEvent = {
  time: string;
  label: string;
};

export function parseTimelineSource(source: string) {
  const events = source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
      if (cells.length !== 2) {
        throw new VizParseError(`Expected \"time | label\" but received \"${line}\".`);
      }

      return {
        time: cells[0],
        label: cells[1],
      } satisfies TimelineEvent;
    });

  if (!events.length) {
    throw new VizParseError("Add at least one timeline entry.");
  }

  return events;
}

export function Timeline({ source }: { source: string }) {
  return renderVizWithContract(source, parseTimelineSource, (events) => (
    <LayeredRevealGroup className={styles.timeline}>
      {events.map((event) => (
        <article key={`${event.time}-${event.label}`} className={styles.timelineEvent} data-viz={event === events[0] ? "timeline" : undefined}>
          <div className={styles.timelineTime}>{event.time}</div>
          <div className={styles.timelineLabel}>{event.label}</div>
        </article>
      ))}
    </LayeredRevealGroup>
  ));
}

import styles from "./ZoneNavigator.module.css";
import { ContextualLink } from "./ContextualLink";

export function ZoneNavigator({
  nextHref,
  nextLabel = "Continue descent",
  previousHref,
  previousLabel = "Back up",
}: {
  nextHref?: string;
  nextLabel?: string;
  previousHref?: string;
  previousLabel?: string;
}) {
  return (
    <nav aria-label="Zone navigation" className={styles.root}>
      {previousHref ? (
        <ContextualLink href={previousHref}>↑ {previousLabel}</ContextualLink>
      ) : (
        <span className={styles.placeholder}>↑ {previousLabel}</span>
      )}
      {nextHref ? (
        <ContextualLink href={nextHref}>{nextLabel} →</ContextualLink>
      ) : (
        <span className={styles.placeholder}>{nextLabel} →</span>
      )}
    </nav>
  );
}
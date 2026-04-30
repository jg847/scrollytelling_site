import { ContextualLink } from "@/components/ui/ContextualLink";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import styles from "./PresentationFooterGate.module.css";

export function PresentationFooterGate({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <section className={styles.root} data-presentation-footer-gate="true">
      <div className={styles.card}>
        <p className={styles.eyebrow}>End of deck</p>
        <Heading level={2}>You have reached the end of this segment.</Heading>
        <Text variant="muted">Keep descending, or head back up and revisit the layers above.</Text>
        <div className={styles.actions}>
          <ContextualLink href={href}>{label}</ContextualLink>
        </div>
      </div>
    </section>
  );
}
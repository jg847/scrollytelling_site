import type { PageData } from "@/lib/content/repository";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import styles from "./PresentationLayout.module.css";

export function PresentationLayout({ page }: { page: PageData }) {
  return (
    <main className={styles.root}>
      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{page.frontmatter.layout}</p>
          <Heading level={1}>{page.frontmatter.title}</Heading>
          {page.frontmatter.summary ? (
            <Text variant="muted">{page.frontmatter.summary}</Text>
          ) : null}
        </header>
        <MarkdownRenderer>{page.content}</MarkdownRenderer>
      </article>
    </main>
  );
}
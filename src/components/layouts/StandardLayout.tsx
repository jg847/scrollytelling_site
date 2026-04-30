import type { PageData } from "@/lib/content/repository";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { collectHeadingAnchors } from "@/components/markdown/headings";
import { ParallaxBackground } from "@/components/motion/ParallaxBackground";
import { SceneCard } from "@/components/motion/SceneCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ZoneNavigator } from "@/components/ui/ZoneNavigator";
import styles from "./StandardLayout.module.css";

const descentOrder = ["euphotic", "dysphotic", "aphotic", "abyssal", "hadal"];

export function StandardLayout({ page }: { page: PageData }) {
  const tocHeadings = collectHeadingAnchors(page.content, [2]);
  const currentZoneIndex = descentOrder.indexOf(page.slug);
  const previousHref = currentZoneIndex > 0 ? `/${descentOrder[currentZoneIndex - 1]}` : undefined;
  const nextHref = currentZoneIndex >= 0 && currentZoneIndex < descentOrder.length - 1 ? `/${descentOrder[currentZoneIndex + 1]}` : undefined;

  return (
    <main className={styles.root} id="main" tabIndex={-1}>
      {page.frontmatter.heroImage ? (
        <section className={styles.hero}>
          <ParallaxBackground className={styles.heroBackground} priority src={page.frontmatter.heroImage} />
          <SceneCard className={styles.heroCard} variant="emphasis">
            <header className={styles.heroHeader}>
              <p className={styles.eyebrow}>{page.frontmatter.layout}</p>
              <Heading level={1}>{page.frontmatter.title}</Heading>
              {page.frontmatter.summary ? (
                <Text variant="muted">{page.frontmatter.summary}</Text>
              ) : null}
            </header>
          </SceneCard>
        </section>
      ) : null}
      <article className={styles.article}>
        {page.frontmatter.heroImage ? null : (
          <SceneCard className={styles.headerCard} variant="section">
            <header className={styles.header}>
              <p className={styles.eyebrow}>{page.frontmatter.layout}</p>
              <Heading level={1}>{page.frontmatter.title}</Heading>
              {page.frontmatter.summary ? (
                <Text variant="muted">{page.frontmatter.summary}</Text>
              ) : null}
            </header>
          </SceneCard>
        )}
        <div className={styles.contentGrid}>
          {tocHeadings.length ? (
            <aside aria-label="On this page" className={styles.sidebar}>
              <p className={styles.sidebarEyebrow}>On this page</p>
              <nav>
                <ul className={styles.tocList}>
                  {tocHeadings.map((heading) => (
                    <li key={heading.id}>
                      <a className={styles.tocLink} href={`#${heading.id}`}>
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : null}
          <div className={styles.mainColumn}>
            <SceneCard className={styles.contentCard} variant="section">
              <MarkdownRenderer>{page.content}</MarkdownRenderer>
            </SceneCard>
            {currentZoneIndex >= 0 ? (
              <div className={styles.navigatorWrap}>
                <ZoneNavigator nextHref={nextHref} previousHref={previousHref} />
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </main>
  );
}
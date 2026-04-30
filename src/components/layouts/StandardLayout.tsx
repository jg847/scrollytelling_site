import type { PageData } from "@/lib/content/repository";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { collectHeadingAnchors } from "@/components/markdown/headings";
import { ParallaxBackground } from "@/components/motion/ParallaxBackground";
import { SceneCard } from "@/components/motion/SceneCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ZoneNavigator } from "@/components/ui/ZoneNavigator";
import { splitMarkdownIntoSlides } from "@/lib/content/parser";
import { url } from "@/lib/site-config";
import styles from "./StandardLayout.module.css";

const descentOrder = ["euphotic", "dysphotic", "aphotic", "abyssal", "hadal"];
const storySlugs = ["home", ...descentOrder];

function getSectionLabel(markdown: string, fallback: string) {
  const headingMatch = markdown.match(/^#{2,3}\s+(.+)$/m);
  return headingMatch?.[1]?.trim() || fallback;
}

export function StandardLayout({ page }: { page: PageData }) {
  const tocLevels = page.slug === "home" ? [2] : storySlugs.includes(page.slug) ? [2, 3] : [2];
  const tocHeadings = collectHeadingAnchors(page.content, tocLevels);
  const currentZoneIndex = descentOrder.indexOf(page.slug);
  const previousHref = currentZoneIndex > 0 ? `/${descentOrder[currentZoneIndex - 1]}` : undefined;
  const nextHref = currentZoneIndex >= 0 && currentZoneIndex < descentOrder.length - 1 ? `/${descentOrder[currentZoneIndex + 1]}` : undefined;
  const sections = splitMarkdownIntoSlides(page.content);
  const useNarrativeSections = storySlugs.includes(page.slug) && sections.length > 0;
  const layoutLabel = storySlugs.includes(page.slug) ? "continuous scrollytelling" : page.frontmatter.layout;
  const sidebarTitle = page.slug === "home" ? "Descent map" : storySlugs.includes(page.slug) ? "Chapter guide" : "On this page";
  const heroImageSrc = page.frontmatter.heroImage ? url(page.frontmatter.heroImage) : undefined;

  function renderNarrativeSection() {
    return (
      <div className={styles.storySections}>
        {sections.map((section, index) => {
          const sectionIndex = String(index + 1).padStart(2, "0");
          const sectionLabel = getSectionLabel(section.markdown, `Section ${sectionIndex}`);
          const sectionClassName = [
            styles.storySection,
            section.kind === "bg" ? styles.storySectionBackground : "",
            section.kind === "split" ? styles.storySectionSplit : "",
            section.kind === "split-reverse" ? styles.storySectionSplitReverse : "",
          ].filter(Boolean).join(" ");

          const marker = (
            <div aria-hidden="true" className={styles.storyMarker}>
              <span className={styles.storyMarkerIndex}>{sectionIndex}</span>
              <span className={styles.storyMarkerRule} />
              <span className={styles.storyMarkerLabel}>{sectionLabel}</span>
            </div>
          );

          const media = section.imageUrl ? (
            <div className={styles.storyMediaWrap} data-standard-story-media="true">
              <div className={styles.storyMediaSticky}>
                <div className={styles.storyMediaFrame}>
                  <Image
                    alt={section.imageAlt ?? ""}
                    aria-hidden={section.imageAlt ? undefined : true}
                    className={styles.storyMediaImage}
                    fill
                    sizes={section.kind === "bg" ? "100vw" : "(min-width: 1100px) 38vw, 100vw"}
                    src={url(section.imageUrl)}
                    style={section.objectPosition ? { objectPosition: section.objectPosition } : undefined}
                  />
                </div>
              </div>
            </div>
          ) : null;

          const body = (
            <div className={styles.storyBodyColumn}>
              {marker}
              <SceneCard className={styles.storyBodyCard} variant="section">
                <div className={styles.storyBodyInner}>
                  <MarkdownRenderer>{section.markdown}</MarkdownRenderer>
                </div>
              </SceneCard>
            </div>
          );

          if (section.kind === "bg") {
            return (
              <section className={sectionClassName} data-standard-story-section="true" key={`${page.slug}-${index}`}>
                {media}
                <div className={styles.storyBackdrop} />
                <div className={styles.storyForeground}>
                  {body}
                </div>
              </section>
            );
          }

          if (section.kind === "split-reverse") {
            return (
              <section className={sectionClassName} data-standard-story-section="true" key={`${page.slug}-${index}`}>
                <div className={styles.storyTextColumn}>{body}</div>
                {media}
              </section>
            );
          }

          if (section.kind === "split") {
            return (
              <section className={sectionClassName} data-standard-story-section="true" key={`${page.slug}-${index}`}>
                {media}
                <div className={styles.storyTextColumn}>{body}</div>
              </section>
            );
          }

          return (
            <section className={sectionClassName} data-standard-story-section="true" key={`${page.slug}-${index}`}>
              <div className={styles.storyTextColumn}>{body}</div>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <main className={styles.root} id="main" tabIndex={-1}>
      {heroImageSrc ? (
        <section className={styles.hero}>
          <ParallaxBackground className={styles.heroBackground} priority src={heroImageSrc} />
          <SceneCard className={styles.heroCard} variant="emphasis">
            <header className={styles.heroHeader}>
              <p className={styles.eyebrow}>{layoutLabel}</p>
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
              <p className={styles.eyebrow}>{layoutLabel}</p>
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
              <p className={styles.sidebarEyebrow}>{sidebarTitle}</p>
              <nav>
                <ul className={styles.tocList}>
                  {tocHeadings.map((heading) => (
                    <li className={heading.level === 3 ? styles.tocItemNested : styles.tocItem} key={heading.id}>
                      <a className={styles.tocLink} data-level={heading.level} href={`#${heading.id}`}>
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : null}
          <div className={styles.mainColumn}>
            {useNarrativeSections ? renderNarrativeSection() : (
              <SceneCard className={styles.contentCard} variant="section">
                <MarkdownRenderer>{page.content}</MarkdownRenderer>
              </SceneCard>
            )}
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
import type { PageData } from "@/lib/content/repository";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PresentationFooterGate } from "@/components/motion/PresentationFooterGate";
import { PresentationProgress } from "@/components/motion/PresentationProgress";
import { PresentationSlide } from "@/components/motion/PresentationSlide";
import { PresentationShortcuts } from "@/components/motion/PresentationShortcuts";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { splitMarkdownIntoSlides } from "@/lib/content/parser";
import styles from "./PresentationLayout.module.css";

const descentOrder = ["euphotic", "dysphotic", "aphotic", "abyssal", "hadal"];

export function PresentationLayout({ page }: { page: PageData }) {
  const slides = splitMarkdownIntoSlides(page.content);
  const currentZoneIndex = descentOrder.indexOf(page.slug);
  const footerHref = currentZoneIndex >= 0 && currentZoneIndex < descentOrder.length - 1 ? `/${descentOrder[currentZoneIndex + 1]}` : "/";
  const footerLabel = currentZoneIndex >= 0 && currentZoneIndex < descentOrder.length - 1 ? "Continue to the next zone" : "Return to the surface";

  return (
    <main className={styles.root} id="main" tabIndex={-1}>
      <PresentationProgress />
      <PresentationShortcuts inertTargetId="presentation-deck-content" />
      <article className={styles.article} id="presentation-deck-content">
        <header className={styles.header}>
          <p className={styles.eyebrow}>{page.frontmatter.layout}</p>
          <Heading level={1}>{page.frontmatter.title}</Heading>
          {page.frontmatter.summary ? (
            <Text variant="muted">{page.frontmatter.summary}</Text>
          ) : null}
        </header>
        <div className={styles.slides}>
          {slides.map((slide, index) => (
            <PresentationSlide key={`${page.slug}-${index}`} index={index + 1} hasBackground={slide.kind === "bg"}>
              <div
                className={[
                  slide.kind === "bg" ? styles.slideBackgroundFrame : styles.slide,
                  slide.kind === "split" ? styles.slideSplit : "",
                  slide.kind === "split-reverse" ? styles.slideSplitReverse : "",
                ].filter(Boolean).join(" ")}
              >
                {slide.kind === "split-reverse" ? (
                  <>
                    <div className={styles.slideBody}>
                      <MarkdownRenderer>{slide.markdown}</MarkdownRenderer>
                    </div>
                    {slide.imageUrl ? (
                      <div className={styles.inlineImageWrap}>
                        <Image
                          alt={slide.imageAlt ?? ""}
                          aria-hidden={slide.imageAlt ? undefined : true}
                          className={styles.inlineImage}
                          fill
                          sizes="(min-width: 1024px) 48rem, 100vw"
                          src={slide.imageUrl}
                          style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    {slide.imageUrl ? (
                      slide.kind === "bg" ? (
                        <div className={styles.backgroundImageWrap}>
                          <Image
                            alt={slide.imageAlt ?? ""}
                            aria-hidden={slide.imageAlt ? undefined : true}
                            className={styles.backgroundImage}
                            fill
                            sizes="100vw"
                            src={slide.imageUrl}
                            style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                          />
                        </div>
                      ) : (
                        <div className={styles.inlineImageWrap}>
                          <Image
                            alt={slide.imageAlt ?? ""}
                            aria-hidden={slide.imageAlt ? undefined : true}
                            className={styles.inlineImage}
                            fill
                            sizes="(min-width: 1024px) 48rem, 100vw"
                            src={slide.imageUrl}
                            style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                          />
                        </div>
                      )
                    ) : null}
                    <div className={styles.slideBody}>
                      <MarkdownRenderer>{slide.markdown}</MarkdownRenderer>
                    </div>
                  </>
                )}
              </div>
            </PresentationSlide>
          ))}
        </div>
        <PresentationFooterGate href={footerHref} label={footerLabel} />
      </article>
    </main>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import {
  scrollToFirstPresentationSlide,
  scrollToLastPresentationSlide,
  scrollToNextPresentationSlide,
  scrollToPreviousPresentationSlide,
  shouldIgnorePresentationKeydown,
} from "./presentation-nav";
import styles from "./PresentationShortcuts.module.css";

export function PresentationShortcuts({ inertTargetId }: { inertTargetId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = "presentation-shortcuts-title";

  useEffect(() => {
    const target = document.getElementById(inertTargetId);
    if (!target) {
      return;
    }

    if (isOpen) {
      target.setAttribute("inert", "");
      requestAnimationFrame(() => dialogRef.current?.focus());
      return () => {
        target.removeAttribute("inert");
      };
    }

    target.removeAttribute("inert");
  }, [inertTargetId, isOpen]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (isOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          setIsOpen(false);
        }
        return;
      }

      if (shouldIgnorePresentationKeydown(event)) {
        return;
      }

      if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "j" || event.key === "J" || event.key === " " || event.code === "Space") {
        event.preventDefault();
        scrollToNextPresentationSlide();
        return;
      }

      if (event.key === "ArrowUp" || event.key === "k" || event.key === "K") {
        event.preventDefault();
        scrollToPreviousPresentationSlide();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        scrollToFirstPresentationSlide();
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        scrollToLastPresentationSlide();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isOpen]);

  return (
    <>
      <button
        aria-label="Open presentation shortcuts"
        className={styles.toggle}
        data-presentation-shortcuts-ready="true"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        ?
      </button>
      {isOpen ? (
        <div className={styles.backdrop}>
          <div aria-labelledby={headingId} aria-modal="true" className={styles.dialog} ref={dialogRef} role="dialog" tabIndex={-1}>
            <div className={styles.header}>
              <Heading id={headingId} level={2}>Presentation shortcuts</Heading>
              <button aria-label="Close presentation shortcuts" className={styles.close} type="button" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            <Text variant="muted">Use the keyboard to move through the deck one slide at a time.</Text>
            <ul className={styles.list}>
              <li className={styles.item}><span className={styles.keys}>↓ / j / Space</span><span>Next slide</span></li>
              <li className={styles.item}><span className={styles.keys}>↑ / k</span><span>Previous slide</span></li>
              <li className={styles.item}><span className={styles.keys}>Home</span><span>Jump to the first slide</span></li>
              <li className={styles.item}><span className={styles.keys}>End</span><span>Jump to the last slide</span></li>
              <li className={styles.item}><span className={styles.keys}>Esc</span><span>Close this overlay</span></li>
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
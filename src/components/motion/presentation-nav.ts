export const presentationSlideSelector = "[data-presentation-slide='true']";

function clampIndex(index: number, max: number) {
  return Math.min(Math.max(index, 0), max);
}

export function getPresentationSlides() {
  return Array.from(document.querySelectorAll<HTMLElement>(presentationSlideSelector));
}

export function getPresentationScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function getCurrentPresentationSlideIndex(slides = getPresentationSlides()) {
  if (!slides.length) {
    return 0;
  }

  const threshold = window.scrollY + window.innerHeight * 0.35;
  let currentIndex = 0;

  slides.forEach((slide, index) => {
    if (slide.offsetTop <= threshold) {
      currentIndex = index;
    }
  });

  return currentIndex;
}

export function scrollToPresentationSlide(index: number, behavior = getPresentationScrollBehavior()) {
  const slides = getPresentationSlides();
  if (!slides.length) {
    return 0;
  }

  const clampedIndex = clampIndex(index, slides.length - 1);
  window.scrollTo({ top: slides[clampedIndex].offsetTop, behavior });
  return clampedIndex;
}

export function scrollToNextPresentationSlide() {
  const slides = getPresentationSlides();
  return scrollToPresentationSlide(getCurrentPresentationSlideIndex(slides) + 1);
}

export function scrollToPreviousPresentationSlide() {
  const slides = getPresentationSlides();
  return scrollToPresentationSlide(getCurrentPresentationSlideIndex(slides) - 1);
}

export function scrollToFirstPresentationSlide() {
  window.scrollTo({ top: 0, behavior: getPresentationScrollBehavior() });
  return 0;
}

export function scrollToLastPresentationSlide() {
  const slides = getPresentationSlides();
  return scrollToPresentationSlide(slides.length - 1);
}

export function shouldIgnorePresentationKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;

  if (!target) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName);
}
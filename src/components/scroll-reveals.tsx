"use client";

import { useEffect } from "react";

/** Progressive enhancement: content stays visible without JS or with reduced motion. */
export function ScrollReveals() {
  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(entries => {
      if (reduced.matches) return;
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting && entry.intersectionRatio >= .18) {
          if (element.dataset.revealState === "pending") element.dataset.revealState = "entered";
        } else if (!entry.isIntersecting && entry.boundingClientRect.top >= innerHeight
          && !element.contains(document.activeElement)) {
          // Re-arm only below the viewport: revisiting a section from above
          // replays its entrance without hiding content already scrolled past.
          element.dataset.revealState = "pending";
        }
      });
    }, { threshold: [0, .18] });
    function configure() {
      observer.disconnect();
      elements.forEach(element => {
        // Only stage content below the fold, avoiding a flash on initial load.
        if (!reduced.matches && element.getBoundingClientRect().top >= innerHeight) {
          element.dataset.revealState = "pending";
        } else delete element.dataset.revealState;
        if (!reduced.matches) observer.observe(element);
      });
    }
    function showFocused(event: FocusEvent) {
      const target = event.target as HTMLElement;
      const element = target.closest<HTMLElement>("[data-reveal]");
      // Mouse focus must not move a control between pointerdown and pointerup.
      if (target.matches(":focus-visible") && element?.dataset.revealState === "pending") {
        delete element.dataset.revealState; observer.unobserve(element);
      }
    }
    configure();
    reduced.addEventListener("change", configure);
    document.addEventListener("focusin", showFocused);
    return () => {
      observer.disconnect(); reduced.removeEventListener("change", configure);
      document.removeEventListener("focusin", showFocused);
      elements.forEach(element => { delete element.dataset.revealState; });
    };
  }, []);
  return null;
}

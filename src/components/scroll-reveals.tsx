"use client";

import { useEffect } from "react";

/** Progressive enhancement: content stays visible without JS or with reduced motion. */
export function ScrollReveals() {
  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.dataset.revealState = "entered";
        observer.unobserve(element);
      });
    }, { rootMargin: "0px 0px -35px 0px", threshold: 0 });
    function configure() {
      observer.disconnect();
      elements.forEach(element => {
        // Only stage content below the fold, avoiding a flash on initial load.
        if (!reduced.matches && element.getBoundingClientRect().top >= innerHeight - 35) {
          element.dataset.revealState = "pending";
          observer.observe(element);
        } else delete element.dataset.revealState;
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

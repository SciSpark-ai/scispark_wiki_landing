"use client";

import { useEffect, type RefObject } from "react";

// Scale the complete product surface, so the app layout and aspect ratio stay
// unchanged. The wrapper follows its visible height, keeping controls nearby.
export function useDemoScale(stage: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const controls = element.parentElement?.querySelector<HTMLElement>(".tour-controls");
    const desktop = matchMedia("(min-width: 1024px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastWidth = 0;
    let lastControlsHeight = 0;
    function update() {
      frame = 0;
      if (!element) return;
      if (!desktop.matches) {
        element.style.removeProperty("--demo-scale");
        element.style.removeProperty("--demo-base-height");
        element.parentElement?.style.removeProperty("--demo-display-width");
        return;
      }
      const width = element.clientWidth;
      const height = width * 10 / 16;
      const viewport = window.innerHeight;
      // Reserve the measured control bar as well as the header clearance. The
      // whole presentation fits together, including translated/wrapped controls.
      const topInset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 96;
      const controlsHeight = controls?.offsetHeight ?? 64;
      const controlsGap = parseFloat(getComputedStyle(controls ?? element).marginTop) || 8;
      const availableHeight = Math.max(180, viewport - topInset - controlsHeight - controlsGap - 16);
      const fitted = Math.min(1, 1280 / width, availableHeight / height);
      const top = element.getBoundingClientRect().top;
      const start = viewport * .78;
      const progress = Math.max(0, Math.min(1, (start - top) / Math.max(1, start - topInset)));
      const eased = progress * progress * (3 - 2 * progress);
      const scale = reduced.matches ? fitted : 1 + (fitted - 1) * eased;
      element.style.setProperty("--demo-base-height", `${height}px`);
      element.style.setProperty("--demo-scale", `${scale}`);
      element.parentElement?.style.setProperty("--demo-display-width", `${width * scale}px`);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element && entry.contentRect.width !== lastWidth) {
          lastWidth = entry.contentRect.width; schedule();
        } else if (entry.target === controls && controls.offsetHeight !== lastControlsHeight) {
          lastControlsHeight = controls.offsetHeight; schedule();
        }
      }
    });
    observer.observe(element);
    if (controls) observer.observe(controls);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    update();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule); reduced.removeEventListener("change", schedule);
    };
  }, [stage]);
}

"use client";

import { useEffect, useRef } from "react";

/** Decorative canvas, isolated from React updates and all product interactions. */
export function HeroField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const host = element.parentElement!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0, height = 0, frame = 0, visible = true, elapsed = 0, last = 0;
    // Fixed seeds avoid hydration differences and random layout changes on resize.
    const dots = Array.from({ length: 112 }, (_, i) => ({
      x: Math.abs((Math.sin(i * 127.1 + 31) * 43758.5453) % 1),
      y: Math.abs((Math.sin(i * 311.7 + 93) * 19642.349) % 1),
      phase: i * 1.73,
    }));
    let ink = "", accent = "";
    function colors() { const css = getComputedStyle(host); ink = css.getPropertyValue("--text-muted").trim(); accent = css.getPropertyValue("--accent").trim(); }
    function draw(time = 0) {
      frame = 0;
      if (!visible || document.hidden) { last = 0; return; }
      if (last) elapsed += Math.min(time - last, 40);
      last = time;
      context!.clearRect(0, 0, width, height);
      const points = dots.slice(0, Math.min(dots.length, Math.max(30, Math.round(width * height / 6500)))).map(dot => {
        const baseX = dot.x * width, baseY = dot.y * height;
        const dx = baseX - pointer.x, dy = baseY - pointer.y, distance = Math.hypot(dx, dy);
        const force = !reduced.matches && fine.matches ? Math.max(0, 1 - distance / 190) : 0;
        const drift = reduced.matches ? 0 : Math.sin(elapsed / 3500 + dot.phase) * 6;
        return { x: baseX + dx / (distance || 1) * force * 23 + drift, y: baseY + dy / (distance || 1) * force * 23 + drift / 2, force };
      });
      points.forEach((point, i) => {
        // Keep the center quieter, with the brighter constellations on the edges.
        const center = point.x > width * .23 && point.x < width * .77 && point.y > height * .12 && point.y < height * .79;
        context!.globalAlpha = center ? .08 : .3 + point.force * .55;
        context!.fillStyle = point.force > .1 ? accent : ink;
        context!.beginPath(); context!.arc(point.x, point.y, point.force > .1 ? 2.1 : 1.3, 0, Math.PI * 2); context!.fill();
        points.slice(i + 1).forEach(other => {
          const distance = Math.hypot(other.x - point.x, other.y - point.y);
          if (distance > 135 || (point.force < .05 && other.force < .05 && distance > 75)) return;
          context!.strokeStyle = point.force > .05 ? accent : ink;
          context!.globalAlpha = (1 - distance / 135) * (center ? .035 : .14 + point.force * .4);
          context!.lineWidth = .7;
          context!.beginPath(); context!.moveTo(point.x, point.y); context!.lineTo(other.x, other.y); context!.stroke();
        });
      });
      context!.globalAlpha = 1;
      if (!reduced.matches && fine.matches) frame = requestAnimationFrame(draw);
    }
    function wake() { if (!frame) frame = requestAnimationFrame(draw); }
    function resize() {
      const bounds = host.getBoundingClientRect(); width = bounds.width; height = bounds.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      element!.width = width * ratio; element!.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0); colors(); wake();
    }
    function move(event: PointerEvent) { const bounds = host.getBoundingClientRect(); pointer.x = event.clientX - bounds.left; pointer.y = event.clientY - bounds.top; }
    function leave() { pointer.x = pointer.y = -1000; }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
    const themeObserver = new MutationObserver(() => { colors(); wake(); }); themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ["data-theme"]});
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }); visibilityObserver.observe(host);
    host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", wake); reduced.addEventListener("change", wake); fine.addEventListener("change", wake);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); themeObserver.disconnect(); visibilityObserver.disconnect(); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); document.removeEventListener("visibilitychange", wake); reduced.removeEventListener("change", wake); fine.removeEventListener("change", wake); };
  }, []);
  return <canvas className="hero-field" ref={canvas} aria-hidden="true" />;
}

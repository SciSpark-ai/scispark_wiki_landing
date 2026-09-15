"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sparky } from "../brand";

// Local playback of public demo content, following the product's StreamingReply.
// No model call or invented reasoning trace; statuses describe the visible workflow.
export function useResponsePlayback(requestId: string | null, texts: string[]) {
  const locale = useLocale();
  const content = JSON.stringify(texts);
  const blocks = useMemo(() => {
    const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    return (JSON.parse(content) as string[]).map(text => [...segmenter.segment(text)].map(part => part.segment));
  }, [content, locale]);
  const total = blocks.reduce((sum, block) => sum + block.length, 0);
  const duration = Math.min(2800, Math.max(1700, total * 24));
  const key = `${requestId}:${content}`;
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState({ key: "", elapsed: 0 });

  useEffect(() => {
    if (!requestId) return;
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let elapsed = 0, last = performance.now(), visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);
    function tick() {
      const now = performance.now();
      if (!reduced.matches && (!visible || document.hidden)) { last = now; return; }
      if (reduced.matches) elapsed = 1200 + duration;
      else elapsed += Math.min(now - last, 100);
      last = now;
      setProgress({ key, elapsed });
      if (elapsed >= 1200 + duration) clearInterval(timer);
    }
    const timer = setInterval(tick, 40);
    reduced.addEventListener("change", tick);
    return () => { clearInterval(timer); observer.disconnect(); reduced.removeEventListener("change", tick); };
  }, [requestId, key, duration]);

  const elapsed = requestId ? (progress.key === key ? progress.elapsed : 0) : Infinity;
  const phase = elapsed < 1200 ? "thinking" : elapsed < 1200 + duration ? "streaming" : "complete";
  const count = Math.max(0, Math.floor(total * Math.min(1, (elapsed - 1200) / duration)));
  return { root, phase, busy: phase !== "complete", reading: elapsed >= 550,
    text: (index: number) => {
      const offset = blocks.slice(0, index).reduce((sum, block) => sum + block.length, 0);
      return blocks[index]?.slice(0, Math.max(0, count - offset)).join("") ?? "";
    },
  };
}

export function ResponseFrame({ playback, kind = "chat", children }: {
  playback: ReturnType<typeof useResponsePlayback>;
  kind?: "chat" | "search" | "review" | "idea" | "digest";
  children: ReactNode;
}) {
  const t = useTranslations("Experience");
  const { root, phase, busy, reading } = playback;
  const label = phase === "complete" ? "responseDone" : phase === "streaming" ? "responding"
    : reading ? (kind === "search" || kind === "review" ? "searchingPapers" : "readingSources") : "understanding";
  return <div ref={root} className="p-response" data-response-state={phase} aria-busy={busy}>
    <div className={busy ? "p-response-status" : "sr-only"} role="status">
      {busy && <Sparky />}<span>{t(label)}</span>
      {phase === "thinking" && <span className="p-thinking-dots" aria-hidden="true"><i/><i/><i/></span>}
    </div>
    {phase !== "thinking" && <div className="p-response-content">{children}{phase === "streaming" && <span className="p-stream-caret" aria-hidden="true"/>}</div>}
  </div>;
}

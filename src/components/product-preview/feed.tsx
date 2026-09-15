"use client";

// Adapted from scispark_wiki HomePage, RealFeedCard, PaperSaveButton, and
// PaperFeedback. Product layout/styles retained; vault/model calls use fixtures.
import { useState } from "react";
import { Bookmark, ThumbsDown, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDemo } from "../providers";
import { papers, feedPapers, type PaperId } from "@/lib/papers";

const categories: Record<PaperId, string> = { attention: "methods", rag: "methods", graphcast: "findings", pangu: "methods", learning: "review", mind: "findings", qwen3: "methods", deepseekr1: "methods", s1: "methods", deepseekv3: "methods", olmo2: "methods", llama3: "methods", regionalweather: "methods", seasonalweather: "findings", efficientweather: "methods", aurora: "methods", ace2: "methods", continuousweather: "methods", behaviorprediction: "findings", cognitionai: "review", multihuman: "methods", socialsimulation: "findings", centaur: "methods", generativepeople: "methods" };

export function SavePaper({ id }: { id: PaperId }) {
  const t = useTranslations("Product");
  const { state, dispatch } = useDemo();
  const saved = state.saved.includes(id);
  return <button className="p-icon" aria-label={t(saved ? "saved" : "save")} aria-pressed={saved} onClick={event => { event.stopPropagation(); dispatch({ type: "save", paper: id, stay: true }); }}><Bookmark size={17} fill={saved ? "currentColor" : "none"} /></button>;
}

export function ProductFeed({ openPaper }: { openPaper: (id: PaperId) => void }) {
  const t = useTranslations("Product");
  const p = useTranslations("Papers");
  const topic = useTranslations("Topics");
  const d = useTranslations("Demo");
  const { state: { interest } } = useDemo();
  const [reversed, setReversed] = useState(false);
  const [votes, setVotes] = useState<Partial<Record<PaperId, "up" | "down">>>({});
  const [notice, setNotice] = useState("");
  const ids = reversed ? [...feedPapers[interest]].reverse() : feedPapers[interest];
  return <div className="p-page p-feed">
    <h3 className="p-page-title">{t("greeting")}</h3>
    <div className="p-feed-toolbar"><span>{t("updated")}</span><button className="p-button p-primary" onClick={() => { setReversed(!reversed); setNotice(t("refreshed")); }}>{t("refresh")}</button></div>
    <p className="p-window">{t("publicationWindow", { start: Math.min(...ids.map(id => Number(papers[id].year))), end: Math.max(...ids.map(id => Number(papers[id].year))) })}</p>
    <h4 className="p-shelf-title">{t("recentPapers")}</h4>
    <div className="p-feed-grid">
      {ids.map((id, index) => <article key={id} className={`p-feed-card ${index === 0 ? "featured-paper" : "supporting-paper"}`}>
        <div className={`p-category p-category-${categories[id]}`}><span>{t(categories[id])}</span><span className="p-publication">arXiv</span></div>
        <div className="p-card-body">
          <h4><button onClick={() => openPaper(id)}>{p(`${id}Title`)}</button></h4>
          <p className="p-tldr">{p(`${id}Summary`)}</p>
          <details className="p-recommendation"><summary>{d("why")}</summary><p>{topic(`${interest}Why`)}</p></details>
          <div className="p-tags"><span>{topic(`${interest}Tag`)}</span></div>
          <div className="p-paper-footer">
            <div><p>arXiv · {papers[id].year}</p><p>{papers[id].author}</p></div>
            <div className="p-feedback"><SavePaper id={id} />{(["up", "down"] as const).map(direction => { const Icon = direction === "up" ? ThumbsUp : ThumbsDown; return <button className="p-icon" key={direction} aria-label={t(direction === "up" ? "moreLike" : "lessLike")} aria-pressed={votes[id] === direction} onClick={() => { setVotes(previous => ({ ...previous, [id]: previous[id] === direction ? undefined : direction })); setNotice(t("feedbackSaved")); }}><Icon size={17} /></button>; })}</div>
          </div>
        </div>
      </article>)}
    </div>
    <p className="p-feedback-notice" role="status">{notice}</p>
  </div>;
}

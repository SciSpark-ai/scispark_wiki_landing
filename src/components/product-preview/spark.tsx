"use client";

// Source: product SparkPage, SparkPanel, SeedCard, and IdeaGallery.
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDemo } from "../providers";
import { interests, papers, topicPapers, type Interest } from "@/lib/papers";

export function ProductSpark({ openIdea }: { openIdea: (interest: Interest) => void }) {
  const t = useTranslations("Product");
  const d = useTranslations("Demo");
  const topic = useTranslations("Topics");
  const { state: { interest }, kept, keep } = useDemo();
  const [direction, setDirection] = useState(topic(`${interest}Question`));
  const [result, setResult] = useState<"quick" | "deep" | null>(null);
  const [selected, setSelected] = useState<Interest>(interest);
  return <div className="p-page p-spark-page">
    <h3 className="p-page-title">{t("spark")}</h3><p className="p-page-description">{t("sparkDescription")}</p>
    <textarea className="p-direction" aria-label={t("direction")} value={direction} onChange={event => setDirection(event.target.value)} />
    <div className="p-action-row"><button data-tour="quick-spark" className="p-button p-primary" disabled={!direction.trim()} onClick={() => { setSelected(interest); setResult("quick"); }}>{t("quickSpark")}</button><button className="p-button" disabled={!direction.trim()} onClick={() => { setSelected(interest); setResult("deep"); }}>{t("deepSpark")}</button></div>
    {result && <section className="p-spark-result p-card"><p className="p-muted">{t("preparedResult")}</p><h4>{topic(`${selected}Question`)}</h4><p>{topic(`${selected}Note`)}</p>{result === "deep" && <><h5>{d("startingPoint")}</h5><p>{topic(`${selected}Method`)}</p></>}<div className="p-spark-sources">{topicPapers[selected].map(id => <a href={papers[id].url} key={id}>{papers[id].author}, {papers[id].year}</a>)}</div><div className="p-action-row"><button data-tour="save-idea" className="p-button" disabled={kept.includes(selected)} onClick={() => keep(selected)}>{t(kept.includes(selected) ? "saved" : "save")}</button>{result === "quick" && <button className="p-button p-primary" onClick={() => setResult("deep")}>{t("develop")}</button>}<button className="p-link" onClick={() => openIdea(selected)}>{t("viewIdea")}<ArrowRight /></button></div></section>}
    <h4 className="p-shelf-title p-gallery-heading">{t("ideaGallery")}</h4>
    <div className="p-idea-gallery">{interests.map(value => <button key={value} className="p-card p-idea-card" onClick={() => { setSelected(value); setResult("quick"); }}><h4>{topic(`${value}Question`)}</h4><div className="p-tags"><span>{t(kept.includes(value) ? "saved" : "sparked")}</span><span className="p-chip p-outline">{t("quick")}</span></div><p>{t("sourcesCount", { count: topicPapers[value].length })}</p></button>)}</div>
    <p className="p-spark-disclaimer">{d("ideaDisclaimer")}</p>
  </div>;
}

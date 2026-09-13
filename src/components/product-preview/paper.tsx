"use client";

// Source: product PaperHeader, PaperActions, PaperDigestView, RelatedInWiki.
import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { papers, type Stage } from "@/lib/papers";
import { useDemo } from "../providers";
import { SavePaper } from "./feed";

export function ProductPaper({ navigate }: { navigate: (stage: Stage) => void }) {
  const t = useTranslations("Product");
  const d = useTranslations("Demo");
  const p = useTranslations("Papers");
  const topic = useTranslations("Topics");
  const { state: { paper, interest }, dispatch } = useDemo();
  const [digest, setDigest] = useState(false);
  const source = papers[paper];
  return <div className="p-page p-paper-page">
    <button className="p-link p-back" onClick={() => navigate("feed")}><ArrowLeft />{d("back")}</button>
    <h3 className="p-paper-title">{p(`${paper}Title`)}</h3>
    <p className="p-author">{source.author}</p>
    <div className="p-paper-meta"><span>arXiv · {source.year}</span><a className="p-chip" href={source.url}>{source.url.split("/abs/")[1]}<ExternalLink size={12} /></a></div>
    <div className="p-card p-abstract"><span className="p-field-label">{t("summary")}</span><p>{p(`${paper}Summary`)}</p></div>
    <div className="p-action-row"><SavePaper id={paper} /><button className="p-button p-primary" disabled={digest} onClick={() => setDigest(true)}>{t(digest ? "digestDone" : "digest")}</button><button data-tour="save-wiki" className="p-button" onClick={() => dispatch({ type: "save" })}>{t("addKnowledge")}</button><a className="p-button" href={source.url.replace("/abs/", "/pdf/")}>{t("readFull")}</a></div>
    <details className="p-recommendation p-paper-why" open><summary>{d("why")}</summary><p>{topic(`${interest}Why`)}</p></details>
    {digest && <section className="p-card p-digest"><h4>{t("digestDone")}</h4><p>{topic(`${interest}Note`)}</p><span className="p-muted">{t("preparedResult")}</span></section>}
    <section className="p-related"><h4>{t("relatedWiki")}</h4><button className="p-link" onClick={() => navigate("wiki")}>{topic(`${interest}Name`)}</button></section>
  </div>;
}

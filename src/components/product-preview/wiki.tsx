"use client";

// Source: product /wiki/[...id], PageEditor, Backlinks, and dashboard shelves.
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { papers, topicPapers, type Interest, type Stage } from "@/lib/papers";
import { useDemo } from "../providers";

export function ProductWiki({ navigate, idea }: { navigate: (stage: Stage) => void; idea?: Interest }) {
  const t = useTranslations("Product");
  const d = useTranslations("Demo");
  const p = useTranslations("Papers");
  const topic = useTranslations("Topics");
  const { state, dispatch, notes, saveNote } = useDemo();
  const { paper, saved } = state;
  const interest = idea ?? state.interest;
  const [dashboard, setDashboard] = useState(false);
  const [edit, setEdit] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [notice, setNotice] = useState("");
  const title = topic(`${interest}${idea ? "Question" : "Name"}`);
  const noteKey = `${interest}-${idea ? "idea" : "concept"}`;
  const initialBody = `# ${title}\n\n${topic(`${interest}Note`)}\n\n## ${t("workingQuestions")}\n\n- ${topic(`${interest}Question`)}\n\n## ${t("connections")}\n\n${[0, 1, 2, 3].map(index => `- [[${topic(`${interest}Concept${index}`)}]]`).join("\n")}`;
  const [body, setBody] = useState(notes[noteKey] ?? initialBody);
  if (dashboard) return <div className="p-page p-wiki-dashboard"><div className="p-title-row"><h3 className="p-page-title">{d("wiki")}</h3><span className="p-chip">{t("dashboard")}</span><button className="p-button p-primary" onClick={() => { setRemoved(false); setDashboard(false); setEdit(true); }}>{t("newNote")}</button></div><div className="p-wiki-stats"><span>{t("papersCount", { count: saved.length })}</span><span>{t("conceptsCount", { count: removed ? 0 : 1 })}</span></div><h4 className="p-shelf-title">{t("concepts")}</h4>{!removed && <button className="p-card p-shelf-note" onClick={() => setDashboard(false)}><h4>{title}</h4><span>{topic(`${interest}Note`)}</span><span className="p-chip">{t("concept")}</span></button>}<h4 className="p-shelf-title">{t("savedPapers")}</h4>{saved.length === 0 ? <p className="p-muted">{t("emptySaved")}</p> : <div className="p-wiki-paper-list">{saved.map(id => <button key={id} className="p-card" onClick={() => dispatch({ type: "paper", paper: id })}>{p(`${id}Title`)}</button>)}</div>}</div>;
  return <div className="p-wiki-layout">
    <div className="p-page p-wiki-main">
      <div className="p-title-row"><button className="p-link" onClick={() => setDashboard(true)}><ArrowLeft />{d("wiki")}</button><div className="p-action-row"><button className="p-button p-primary" onClick={() => { dispatch({ type: "save", stay: true }); saveNote(noteKey, body); setNotice(t("noteSaved")); setEdit(false); }}>{t("save")}</button><button className="p-button" onClick={() => { setRemoved(true); setDashboard(true); setNotice(t("noteDeleted")); }}>{t("delete")}</button></div></div>
      <h3 className="p-page-title">{title}</h3>
      <div className="p-wiki-meta"><span className="p-chip">{t(idea ? "ideaType" : "concept")}</span><span className="p-chip p-outline">#{topic(`${interest}Tag`)}</span><span>{t("sourcesCount", { count: topicPapers[interest].length })}</span>{saved.includes(paper) && <span className="saved-label">{t("saved")}</span>}</div>
      <div className="p-editor">
        <div className="p-editor-tabs"><button aria-pressed={edit} onClick={() => setEdit(true)}>{t("edit")}</button><button aria-pressed={!edit} onClick={() => setEdit(false)}>{t("preview")}</button></div>
        {edit ? <textarea aria-label={t("editNote")} value={body} maxLength={20000} onChange={event => setBody(event.target.value)} spellCheck={false} /> : <div className="p-markdown">
          {body !== initialBody ? <div className="p-edited-body">{body.split("\n").map((line, index) => line.startsWith("# ") ? <h4 key={index}>{line.slice(2)}</h4> : line.startsWith("## ") ? <h5 key={index}>{line.slice(3)}</h5> : line.startsWith("- ") ? <ul key={index}><li>{line.slice(2)}</li></ul> : line ? <p key={index}>{line}</p> : null)}</div> : <><h4>{title}</h4><p>{topic(`${interest}Note`)}</p><h5>{t("workingQuestions")}</h5><ul><li>{topic(`${interest}Question`)}</li><li>{topic(`${interest}Method`)}</li></ul><h5>{t("connections")}</h5><ul>{[0, 1, 2, 3].map(index => <li key={index}><button className="p-link" onClick={() => { dispatch({ type: "concept", concept: index }); navigate("graph"); }}>{topic(`${interest}Concept${index}`)}</button></li>)}</ul><h5>{t("readingNotes")}</h5><p>{t("readingNoteBody")}</p></>}
        </div>}
      </div>
      <div className="p-action-row p-wiki-next"><button className="p-link" onClick={() => navigate("graph")}>{d("toGraph")}<ArrowRight /></button><span role="status" className="p-muted">{notice}</span></div>
    </div>
    <aside className="p-backlinks"><h4>{t("backlinks")}</h4>{topicPapers[interest].map(id => <a key={id} href={papers[id].url}>{p(`${id}Title`)}</a>)}<button className="p-link" onClick={() => navigate("graph")}>{d("graph")}</button></aside>
  </div>;
}

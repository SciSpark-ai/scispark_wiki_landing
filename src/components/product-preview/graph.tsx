"use client";

// Source: product VizWorkspace, VizTabs, GraphView, FilterBar, and Inspector.
// The demo plots explicit prepared wiki links; positions are deterministic.
import { useState, type CSSProperties } from "react";
import { ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { papers, interests, topicPapers, type Stage } from "@/lib/papers";
import { useDemo } from "../providers";

type Node = { id: string; label: string; type: "paper" | "concept" | "idea"; color: number; x: number; y: number; concept?: number };
const positions = [[25, 28], [61, 16], [40, 46], [76, 40], [19, 62], [61, 67], [43, 79], [48, 21], [83, 59], [35, 60], [66, 35], [27, 44], [73, 80], [53, 53], [17, 80], [79, 22], [47, 9], [39, 34], [64, 86], [17, 15], [84, 75]];

export function ProductGraph({ navigate }: { navigate: (stage: Stage) => void }) {
  const t = useTranslations("Product");
  const d = useTranslations("Demo");
  const topic = useTranslations("Topics");
  const p = useTranslations("Papers");
  const { state: { interest }, dispatch } = useDemo();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [mode, setMode] = useState("graph");
  const [rotate, setRotate] = useState(false);
  const nodes: Node[] = interests.flatMap((name, community) => [
    ...topicPapers[name].map(id => ({ id, label: p(`${id}Title`), type: "paper" as const, color: community, concept: undefined })),
    ...[0, 1, 2, 3].map(index => ({ id: `${name}-${index}`, label: topic(`${name}Concept${index}`), type: "concept" as const, color: community, concept: index })),
    { id: `${name}-idea`, label: topic(`${name}Question`), type: "idea" as const, color: community, concept: undefined },
  ]).map((node, index) => ({ ...node, x: rotate ? 100 - positions[index][0] : positions[index][0], y: positions[index][1] }));
  const edges = nodes.flatMap((node, index) => nodes.slice(index + 1).filter(other => other.color === node.color || (node.type === "concept" && other.type === "concept" && node.concept === other.concept)).map(other => ({ source: node, target: other })));
  const visible = nodes.filter(node => !filter || node.type === filter);
  const visibleIds = new Set(visible.map(node => node.id));
  const visibleEdges = edges.filter(edge => visibleIds.has(edge.source.id) && visibleIds.has(edge.target.id));
  const current = nodes.find(node => node.id === selected);
  const connected = current ? edges.flatMap(edge => edge.source.id === current.id ? [edge.target] : edge.target.id === current.id ? [edge.source] : []) : [];
  function select(node: Node) { setSelected(node.id); if (node.concept !== undefined) dispatch({ type: "concept", concept: node.concept }); }
  return <div className="p-viz" onKeyDown={event => { if (event.key === "Escape") setSelected(null); }}>
    <div className="p-viz-toolbar"><div className="p-action-row" role="group" aria-label={t("graphViews")}>{["graph", "timeline", "citations", "authors"].map(value => <button key={value} className={`p-button ${mode === value ? "p-primary" : ""}`} aria-pressed={mode === value} onClick={() => { setMode(value); setSelected(null); }}>{t(value)}</button>)}</div><div className="p-graph-filters" role="group" aria-label={t("filterTypes")}>{["paper", "concept", "ideaType"].map(value => { const type = value === "ideaType" ? "idea" : value; return <button key={value} className="p-button" aria-pressed={filter === type} onClick={() => { setFilter(filter === type ? null : type); setSelected(null); }}>{t(value)}</button>; })}<button className="p-button" onClick={() => { setRotate(!rotate); setSelected(null); }}>{t("recompute")}</button></div></div>
    <div className="p-viz-body">
      <div className="p-viz-main">
        {mode === "graph" && <><p className="p-graph-stats">{t("graphStats", { nodes: visible.length, edges: visibleEdges.length, communities: new Set(visible.map(node => node.color)).size })}</p><div className="p-graph-canvas" role="group" aria-label={d("graphAlt")}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{visibleEdges.map(edge => <line key={`${edge.source.id}-${edge.target.id}`} x1={edge.source.x} y1={edge.source.y} x2={edge.target.x} y2={edge.target.y} opacity={!hovered || edge.source.id === hovered || edge.target.id === hovered ? 1 : .12} />)}</svg>
          {visible.map(node => <button key={node.id} className={`p-graph-node p-community-${node.color} ${node.type === "concept" ? `node-${node.concept}` : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` } as CSSProperties} aria-pressed={selected === node.id} aria-label={node.label} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} onClick={() => select(node)}><span className={`p-node-point p-node-${node.type}`} /><span className="p-node-label">{node.label}</span></button>)}
        </div><p className="p-graph-help">{t("graphHelp")}</p></>}
        {mode === "timeline" && <div className="p-timeline"><h3>{t("timeline")}</h3>{Object.entries(papers).sort((a, b) => Number(a[1].year) - Number(b[1].year)).map(([id, paper]) => <button key={id} onClick={() => select(nodes.find(node => node.id === id)!)}><time>{paper.year}</time><span>{p(`${id}Title`)}</span></button>)}</div>}
        {mode === "citations" && <div className="p-page"><h3 className="p-page-title">{t("citations")}</h3><p className="p-muted">{t("citationEmpty")}</p>{Object.entries(papers).map(([id, paper]) => <a className="p-citation-source" key={id} href={paper.url}>{p(`${id}Title`)}<ArrowRight /></a>)}</div>}
        {mode === "authors" && <div className="p-page"><h3 className="p-page-title">{t("authors")}</h3><div className="p-author-grid">{Object.entries(papers).map(([id, paper]) => <button className="p-card" key={id} onClick={() => select(nodes.find(node => node.id === id)!)}><h4>{paper.author}</h4><span>{p(`${id}Title`)}</span></button>)}</div></div>}
      </div>
      {current && <aside className="p-graph-inspector"><div className="p-title-row"><h4>{current.label}</h4><button className="p-icon" aria-label={t("closeInspector")} onClick={() => setSelected(null)}><X /></button></div><span className="p-chip">{t(current.type === "idea" ? "ideaType" : current.type)}</span><p>{topic(`${interests[current.color]}Note`)}</p><h5>{t("connections")}</h5>{connected.slice(0, 5).map(node => <button className="p-link" key={node.id} onClick={() => select(node)}>{node.label}</button>)}<div className="p-inspector-actions"><button className="p-link" onClick={() => navigate("wiki")}>{d("toWiki")}<ArrowRight /></button><button className="p-link" onClick={() => navigate("idea")}>{d("toIdea")}<ArrowRight /></button></div></aside>}
    </div>
    <div className="p-viz-footer"><button className="p-link" onClick={() => { select(nodes.find(node => node.id === `${interest}-0`)!); }}>{d("conceptLabel")}</button><button className="p-link" onClick={() => navigate("idea")}>{d("toIdea")}<ArrowRight /></button></div>
  </div>;
}

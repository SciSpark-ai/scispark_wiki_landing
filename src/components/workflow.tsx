"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { CompassIcon, BooksIcon, HighlighterIcon, MagnifyingGlassIcon, ArchiveIcon, GraphIcon, SparkleIcon, FolderIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";

// Relationships follow SciSpark README, Product framework, lines 180–200.
const nodes = [
  {id:"q", x:430, y:55, icon:CompassIcon, tone:"discovery"},
  {id:"f", x:150, y:210, icon:BooksIcon, tone:"discovery"},
  {id:"r", x:150, y:385, icon:HighlighterIcon, tone:"discovery"},
  {id:"d", x:480, y:210, icon:MagnifyingGlassIcon, tone:"discovery"},
  {id:"w", x:480, y:385, icon:ArchiveIcon, tone:"knowledge"},
  {id:"g", x:300, y:570, icon:GraphIcon, tone:"knowledge"},
  {id:"s", x:710, y:570, icon:SparkleIcon, tone:"knowledge"},
  {id:"p", x:855, y:155, icon:FolderIcon, tone:"support"},
  {id:"h", x:900, y:355, icon:ClockCounterClockwiseIcon, tone:"support"},
] as const;
const mobilePositions: Record<string, [number,number]> = {q:[180,35],f:[85,145],r:[85,245],d:[275,145],w:[180,335],g:[85,440],s:[275,440],p:[85,550],h:[275,550]};
const mobilePaths = [
  "M140 66 C140 88 85 88 85 107", "M225 66 C225 88 275 88 275 107",
  "M85 183 L85 207", "M85 283 C85 295 125 295 135 304", "M275 183 C275 265 255 285 235 304",
  "M135 366 C135 388 85 383 85 405", "M225 366 C225 388 275 383 275 405",
  "M85 475 L85 493 L275 493 L275 475", "M347 440 C365 380 370 35 322 35",
  "M65 512 C5 490 5 335 39 335", "M45 512 C2 480 2 80 180 80 C220 80 202 145 203 145",
  "M295 512 C350 490 350 335 321 335", "M315 512 C360 460 360 145 347 145",
];
const edges = [
  {from:"q",to:"f",d:"M 360 100 C 360 145 150 120 150 165"},
  {from:"q",to:"d",d:"M 460 100 C 460 130 480 135 480 165"},
  {from:"f",to:"r",d:"M 150 255 L 150 340"},
  {from:"r",to:"w",d:"M 260 385 L 370 385"},
  {from:"d",to:"w",d:"M 480 255 L 480 340"},
  {from:"w",to:"g",d:"M 425 430 C 425 478 300 476 300 525"},
  {from:"w",to:"s",d:"M 535 430 C 535 480 710 470 710 525"},
  {from:"g",to:"s",d:"M 410 570 L 600 570"},
  {from:"s",to:"q",d:"M 820 570 C 1070 570 1090 55 540 55", loop:true},
  {from:"p",to:"w",d:"M 805 200 C 805 285 665 305 590 370", support:true},
  {from:"p",to:"d",d:"M 745 155 C 680 155 660 210 590 210", support:true},
  {from:"h",to:"w",d:"M 790 365 L 590 385", support:true},
  {from:"h",to:"d",d:"M 900 310 C 900 260 690 245 590 225", support:true},
];

export function Workflow() {
  const t = useTranslations("Experience");
  const [active, setActive] = useState<string | null>(null);
  const map = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const element = map.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden && !reduced.matches);
    const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; sync();}, {threshold:.15});
    observer.observe(element);
    document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync);
    return () => {observer.disconnect(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync);};
  }, []);
  return <section className="workflow-section shell section-space" aria-labelledby="workflow-heading">
    <div className="workflow-heading" data-reveal><p className="workflow-kicker">{t("workflowIntro")}</p><h2 id="workflow-heading">{t("workflowTitle")}</h2><p>{t("workflowHelp")}</p></div>
    <div className="workflow-map" data-reveal ref={map} data-animated={running} onPointerLeave={() => setActive(null)}>
      <svg className="workflow-lines" viewBox="0 0 1100 670" fill="none" aria-hidden="true">
        <defs><marker id="workflow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7" fill="var(--flow-line)" /></marker></defs>
        {edges.map(edge => <path key={edge.from+edge.to} d={edge.d} pathLength="1" className={`${"loop" in edge ? "flow-loop" : ""} ${active === edge.from || active === edge.to ? "is-connected" : ""}`} markerEnd={"support" in edge ? undefined : "url(#workflow-arrow)"} />)}
        <g className="workflow-edge-labels"><text x="490" y="300">{t("saveEdge")}</text><text x="455" y="558">{t("clusterEdge")}</text><text x="925" y="555">{t("nextEdge")}</text></g>
        {running && <g className="flow-travelers"><circle className="flow-traveler" r="3"><animateMotion dur="13s" repeatCount="indefinite" path={[0,2,3,5,7,8].map(i=>edges[i].d).join(' ')}/></circle><circle className="flow-traveler" r="2.5"><animateMotion dur="7s" repeatCount="indefinite" path={[1,4,6].map(i=>edges[i].d).join(' ')}/></circle></g>}
      </svg>
      <svg className="workflow-mobile-lines" viewBox="0 0 360 600" fill="none" aria-hidden="true">
        <defs><marker id="workflow-mobile-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7" fill="var(--flow-line)" /></marker></defs>
        {edges.map((edge,index) => <path key={edge.from+edge.to} d={mobilePaths[index]} className={`${"loop" in edge ? "flow-loop" : ""} ${"support" in edge ? "flow-support" : ""}`} markerEnd={"support" in edge ? undefined : "url(#workflow-mobile-arrow)"}/>) }
        <g className="workflow-edge-labels"><text x="218" y="268">{t("saveEdge")}</text><text x="120" y="488">{t("clusterEdge")}</text><text x="353" y="295" transform="rotate(-90 353 295)">{t("nextEdge")}</text></g>
        {running && <circle className="flow-traveler" r="2"><animateMotion dur="13s" repeatCount="indefinite" path={[0,2,3,5,7,8].map(i=>mobilePaths[i]).join(' ')}/></circle>}
      </svg>
      <ol className="workflow-nodes">{nodes.map(node => { const Icon = node.icon; return <li key={node.id} className={`workflow-node flow-${node.tone}`} style={{"--node-x":`${node.x/11}%`,"--node-y":`${node.y/6.7}%`,"--mobile-x":`${mobilePositions[node.id][0]/3.6}%`,"--mobile-y":`${mobilePositions[node.id][1]/6}%`} as CSSProperties}>
        <button type="button" onClick={() => setActive(node.id)} onPointerEnter={() => setActive(node.id)} onFocus={() => setActive(node.id)} onBlur={() => setActive(null)} aria-expanded={active === node.id} aria-controls={`flow-hint-${node.id}`} aria-describedby={`flow-hint-${node.id}`}><Icon size={23} weight="light" /><span>{t(node.id)}</span></button>
        <span id={`flow-hint-${node.id}`} className="flow-hint">{t(`${node.id}Hint`)}</span>
      </li>; })}</ol>
    </div>
  </section>;
}

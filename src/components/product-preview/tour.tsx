"use client";

import { useEffect, useRef, useState, type RefObject, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { MousePointer2, Pause, Play, RotateCcw } from 'lucide-react';
import type { Stage } from '@/lib/papers';

type Mode = 'idle'|'playing'|'paused'|'manual'|'finished';
const steps: {stage:Stage; target:string; caption:string; click?:boolean}[] = [
  {stage:'feed',target:'.featured-paper .p-recommendation summary',caption:'tourFeed',click:true},
  {stage:'feed',target:'.featured-paper h4 button',caption:'tourRead',click:true},
  {stage:'reader',target:'[data-nav="chat"]',caption:'tourAsk',click:true},
  {stage:'chat',target:'[data-tour="chat-example"]',caption:'tourAsk',click:true},
  {stage:'chat',target:'[data-tour="chat-send"]',caption:'tourAsk',click:true},
  {stage:'reader',target:'[data-tour="save-wiki"]',caption:'tourWiki',click:true},
  {stage:'wiki',target:'.p-markdown',caption:'tourWiki'},
  {stage:'wiki',target:'[data-nav="graph"]',caption:'tourGraph',click:true},
  {stage:'graph',target:'.p-graph-node.node-0',caption:'tourGraph',click:true},
  {stage:'graph',target:'[data-nav="idea"]',caption:'tourIdea',click:true},
  {stage:'idea',target:'[data-tour="quick-spark"]',caption:'tourIdea',click:true},
  {stage:'idea',target:'[data-tour="save-idea"]',caption:'tourIdea',click:true},
];
const chapters = [0,1,2,5,7,9];

export function useGuidedTour(root: RefObject<HTMLDivElement|null>, prepare: (stage:Stage,index:number) => void) {
  const [mode,setMode] = useState<Mode>('idle'), [step,setStep]=useState(0);
  const [cursor,setCursor]=useState<{x:number;y:number;click:boolean;left:boolean;above:boolean}|null>(null);
  const [inside,setInside]=useState(false), [onscreen,setOnscreen]=useState(false);
  const modeRef=useRef<Mode>('idle'), visible=useRef(false), manual=useRef(false), hover=useRef(false), prepareRef=useRef(prepare);
  useEffect(() => {prepareRef.current=prepare;});
  function change(next:Mode) {modeRef.current=next;setMode(next);}
  function takeControl() {manual.current=true;change('manual');setCursor(null);}
  function play(index=step) {manual.current=false;setStep(index);change('playing');}
  useEffect(() => {
    const element=root.current; if (!element) return;
    const media=matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const observer=new IntersectionObserver(([entry]) => {
      visible.current=entry.isIntersecting;setOnscreen(entry.isIntersecting);
      if (entry.isIntersecting && modeRef.current==='idle' && !manual.current && !hover.current && media.matches) {modeRef.current='playing';setMode('playing');}
    },{threshold:.4});observer.observe(element);
    function visibility() {if(document.hidden){setOnscreen(false);}else setOnscreen(visible.current);}
    function external() {manual.current=true;modeRef.current='manual';setMode('manual');setCursor(null);}
    window.addEventListener('scispark-manual',external);document.addEventListener('visibilitychange',visibility);
    // A restored language transfer represents a visitor already in control.
    if (document.documentElement.dataset.previewControlled==='true') external();
    return () => {observer.disconnect();window.removeEventListener('scispark-manual',external);document.removeEventListener('visibilitychange',visibility);};
  },[root]);
  useEffect(() => {
    if (mode!=='playing' || !onscreen || inside) return;
    let cancelled=false;const timers=new Set<ReturnType<typeof setTimeout>>();
    const wait=(ms:number)=>new Promise<void>(resolve=>{const id=setTimeout(()=>{timers.delete(id);resolve();},ms);timers.add(id);});
    async function run() {
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      await wait(450);if(cancelled)return;
      const current=steps[step];prepareRef.current(current.stage,step);
      await wait(300);if(cancelled)return;
      const element=root.current;if(!element)return;
      let target=element.querySelector<HTMLElement>(current.target);
      // Mobile uses the same chapter/action, with its drawer explicitly opened.
      if(target?.closest('.p-sidebar') && getComputedStyle(target.closest('.p-sidebar')!).visibility==='hidden') {
        element.querySelector<HTMLButtonElement>('.p-mobile-nav button')?.click();await wait(100);
      }
      if(cancelled)return;
      target=element.querySelector<HTMLElement>(current.target);
      if(!target) {change('paused');return;}
      const pane=target.closest<HTMLElement>('.p-screen');
      if(pane) {const tr=target.getBoundingClientRect(), pr=pane.getBoundingClientRect();if(tr.bottom>pr.bottom-50||tr.top<pr.top+30)pane.scrollTop+=tr.top-pr.top-90;}
      const bounds=element.getBoundingClientRect(), rect=target.getBoundingClientRect();
      const scale=element.clientWidth / bounds.width;
      const x=(rect.left-bounds.left+Math.min(rect.width/2,180))*scale;
      const y=(rect.top-bounds.top+Math.min(rect.height/2,70))*scale;
      const placement = {left:x > element.clientWidth - 280, above:y > element.clientHeight - 100};
      if(!reduced)setCursor({x,y,click:false,...placement});
      await wait(reduced?500:950);if(cancelled)return;
      if(current.click && !(target instanceof HTMLButtonElement && target.disabled)) {if(!reduced)setCursor({x,y,click:true,...placement});target.click();}
      await wait(2300);if(cancelled)return;
      // AI playback owns its timing; let the answer finish before the next tab.
      let awaitedResponse = false;
      while (element.querySelector('[data-response-state="thinking"], [data-response-state="streaming"]')) {
        awaitedResponse = true;
        await wait(100); if (cancelled) return;
      }
      if (awaitedResponse) { await wait(1200); if (cancelled) return; }
      setCursor(previous=>previous?{...previous,click:false}:null);
      if(step===steps.length-1){change('finished');setCursor(null);}else setStep(step+1);
    }
    void run();
    return () => {cancelled=true;timers.forEach(clearTimeout);};
  },[mode,step,onscreen,inside,root]);
  return {mode,step,cursor:mode==='playing'&&onscreen&&!inside?cursor:null,takeControl,
    enter:()=>{hover.current=true;setInside(true);},leave:()=>{hover.current=false;setInside(false);},
    pause:()=>change('paused'),play,replay:()=>play(0),jump:(index:number)=>play(index)};
}

export function TourCursor({cursor,step}: {cursor:ReturnType<typeof useGuidedTour>['cursor'];step:number}) {
  const t=useTranslations('Experience');
  if(!cursor)return null;
  return <div className={`tour-cursor ${cursor.click?'is-clicking':''} ${cursor.left?'caption-left':''} ${cursor.above?'caption-above':''}`} aria-hidden="true" style={{transform:`translate3d(${cursor.x}px,${cursor.y}px,0)`}}><MousePointer2 size={27} fill="var(--bg-page)" strokeWidth={1.6}/><i/><span className="tour-cursor-caption">{t(`cursor${step}`)}</span></div>;
}
export function TourControls({tour,children}: {tour:ReturnType<typeof useGuidedTour>;children:ReactNode}) {
  const t=useTranslations('Experience');
  const caption=tour.mode==='manual'?t('manual'):tour.mode==='finished'?t('tourDone'):t(steps[tour.step].caption);
  const activeChapter=chapters.findLastIndex(index=>index<=tour.step);
  return <div className="tour-controls" aria-label={t('tour')} data-tour-mode={tour.mode}>
    <div className="tour-caption"><span>{t('tour')}</span><p>{caption}</p></div>
    <div className="tour-actions"><div className="tour-chapters" role="group" aria-label={t('tour')}>{chapters.map((index,i)=><button key={index} aria-label={`${i+1}. ${t(steps[index].caption)}`} aria-pressed={i===activeChapter} onClick={()=>tour.jump(index)}><span>{i+1}</span></button>)}</div>
    <button className="tour-play" onClick={tour.mode==='playing'?tour.pause:()=>tour.play(tour.mode==='finished'?0:chapters[activeChapter])}>{tour.mode==='playing'?<Pause size={14}/>:<Play size={14}/>}<span>{t(tour.mode==='playing'?'pause':tour.mode==='idle'||tour.mode==='finished'?'play':'resume')}</span></button><button className="tour-replay" aria-label={t('replay')} title={t('replay')} onClick={tour.replay}><RotateCcw size={15}/></button>{children}</div>
  </div>;
}

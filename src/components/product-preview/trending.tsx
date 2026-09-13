"use client";
// Fixture adapter for TrendingWorkspace/Leaderboard. Activity is explicitly illustrative.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { interests, topicPapers, type Interest, type PaperId } from '@/lib/papers';

export function ProductTrending({openPaper}: {openPaper: (id: PaperId) => void}) {
  const t=useTranslations('Experience'), p=useTranslations('Product'), d=useTranslations('Demo'), topic=useTranslations('Topics'), titles=useTranslations('Papers');
  const [field,setField]=useState<Interest|'all'>('all'), [expanded,setExpanded]=useState<string>();
  const fields = field === 'all' ? interests : [field];
  return <div className="p-page p-trending-page"><h3 className="p-page-title">{p('trending')}</h3><p className="p-page-description">{t('trendingBody')}</p><div className="p-trend-overview"><span><TrendingUp size={18}/>{t('trendPeriod')}</span><span>{t('trendNote')}</span></div>
    <div className="p-action-row p-field-filters" role="group" aria-label={t('included')}>{(['all',...interests] as const).map(value => <button key={value} className="p-button" aria-pressed={field===value} onClick={() => {setField(value);setExpanded(undefined);}}>{value==='all' ? t('allFields') : d(value)}</button>)}</div><details className="p-source-options"><summary>{t('included')}</summary>{fields.map(value => <p key={value}>{d(value)} · {topic(`${value}Concept0`)} · {topic(`${value}Concept1`)}</p>)}</details>
    <h4 className="p-shelf-title">{t('activity')}</h4><div className="p-trend-table">{fields.map((value,index) => <article key={value}><button className="p-trend-row" aria-expanded={expanded===value} onClick={() => setExpanded(expanded===value ? undefined : value)}><span className="p-trend-rank">{index+1}</span><span><strong>{topic(`${value}Name`)}</strong><small>{d(value)}</small></span><svg viewBox="0 0 140 45" aria-hidden="true"><path d={value === 'ai' ? 'M0 37 L18 32 L36 36 L54 20 L72 23 L90 12 L108 17 L140 3' : value==='climate' ? 'M0 39 L20 29 L40 31 L60 25 L80 15 L100 20 L120 7 L140 10' : 'M0 30 L20 33 L40 23 L60 26 L80 12 L100 15 L120 8 L140 2'} fill="none" stroke="currentColor" strokeWidth="2"/></svg><ChevronDown size={16}/></button>{expanded===value && <div className="p-trend-detail"><p>{topic(`${value}Note`)}</p><h5>{t('relatedPapers')}</h5>{topicPapers[value].map(id => <button className="p-link" key={id} onClick={() => openPaper(id)}>{titles(`${id}Title`)}</button>)}</div>}</article>)}</div>
  </div>;
}

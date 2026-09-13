"use client";
// Fixture adapter for HistoryPageClient. Undo checks the current value first.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, MessageSquare } from 'lucide-react';
import { useDemo } from '../providers';

export function ProductHistory({openConversation}: {openConversation: (id?: string) => void}) {
  const t = useTranslations('Experience'), p = useTranslations('Product'), titles = useTranslations('Papers');
  const {state, dispatch, session, notes, undoNote} = useDemo();
  const [tab,setTab] = useState<'conversations'|'changes'>('conversations');
  const [removed,setRemoved] = useState<string[]>([]);
  return <div className="p-page p-history-page"><h3 className="p-page-title">{p('history')}</h3><p className="p-page-description">{t('historyBody')}</p><nav className="p-detail-tabs" aria-label={p('history')}>{(['conversations','changes'] as const).map(value => <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>{t(value)}</button>)}</nav>
    {tab === 'conversations' ? <div className="p-history-list"><p className="p-muted">{t('thisPreview')}</p>{session.conversations.length ? [...session.conversations].reverse().map(item => <button key={item.id} onClick={() => openConversation(item.id)}><MessageSquare size={16}/><span>{item.question}</span><span className="p-chip">{t(item.mode)}</span></button>) : <button onClick={() => openConversation()}><MessageSquare size={16}/>{t('question')}</button>}</div> : <div className="p-changes-list">
      {!state.saved.length && !session.changes.length && !removed.length && <p className="p-empty">{t('emptyChanges')}</p>}
      {[...state.saved,...removed.filter(id => !state.saved.includes(id as typeof state.paper))].map(id => <article className="p-card" key={id}><div className="p-title-row"><div><strong>{t('savedPaper')}</strong><p>{titles(`${id}Title`)}</p></div><button className="p-button" disabled={removed.includes(id) && !state.saved.includes(id as typeof state.paper)} onClick={() => {dispatch({type:'remove',paper:id as typeof state.paper});setRemoved(previous => [...new Set([...previous,id])]);}}><RotateCcw size={13}/>{state.saved.includes(id as typeof state.paper) ? t('undo') : t('undone')}</button></div></article>)}
      {[...session.changes].reverse().map(change => <article className="p-card" key={change.id}><div className="p-title-row"><span>{t('edit')}</span><span className="p-chip">{t(change.undone ? 'undone' : 'applied')}</span><button className="p-button" disabled={change.undone || notes[change.key] !== change.after} onClick={() => undoNote(change.id)}><RotateCcw size={13}/>{t('undo')}</button></div><details><summary>{change.key}</summary><div className="p-change-diff"><div><h4>{t('before')}</h4><pre>{change.before ?? t('empty')}</pre></div><div><h4>{t('after')}</h4><pre>{change.after}</pre></div></div></details></article>)}
    </div>}
  </div>;
}

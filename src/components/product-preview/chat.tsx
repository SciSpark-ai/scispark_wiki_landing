"use client";

// Fixture adapter for product ChatWorkspace, Composer, SourcesToggle and ReviewReport.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUp, MessageSquare, Search, Telescope, Plus, BookOpen } from 'lucide-react';
import { useDemo } from '../providers';
import { papers, topicPapers, type PaperId, type Stage } from '@/lib/papers';
import type { ChatMode } from '@/lib/preview-session';
import { ResponseFrame, useResponsePlayback } from './response-playback';

export function ProductChat({mode, setMode, conversationId, setConversationId, openPaper, navigate}: {
  mode: ChatMode; setMode: (mode: ChatMode) => void; conversationId?: string; setConversationId: (id?: string) => void;
  openPaper: (id: PaperId) => void; navigate: (stage: Stage) => void;
}) {
  const t = useTranslations('Experience'), p = useTranslations('Product'), titles = useTranslations('Papers'), topics = useTranslations('Topics');
  const {state, session, addConversation, saveNote} = useDemo();
  const [question, setQuestion] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const conversation = session.conversations.find(item => item.id === conversationId);
  const interest = conversation?.interest ?? state.interest;
  const ids = topicPapers[interest];
  const response = useResponsePlayback(conversation?.id === requestId ? requestId : null,
    [conversation?.mode === 'review' ? t('reportBody') : topics(`${interest}Note`)]);
  function submit() {
    if (!question.trim() || response.busy) return;
    const id = crypto.randomUUID();
    addConversation({id, question:question.trim(), mode, interest:state.interest}); setRequestId(id); setConversationId(id); setQuestion('');
  }
  return <div className={`p-page p-chat-workspace ${conversation ? 'has-conversation' : ''}`}>
    {conversation && <div className="p-title-row"><h3 className="p-page-title">Sparky</h3><button className="p-button" onClick={() => {setConversationId(); setQuestion('');}}><Plus size={14}/>{t('newChat')}</button></div>}
    {!conversation && <div className="p-chat-welcome"><h3>{t('welcome')}</h3></div>}
    {conversation && <div className="p-conversation"><div className="p-user-message">{conversation.question}</div><article className="p-assistant-message"><ResponseFrame playback={response} kind={conversation.mode}><h4>{conversation.mode === 'review' ? t('report') : topics(`${interest}Name`)}</h4><p>{response.text(0)}</p>
      {!response.busy && <><div className="p-chat-sources"><span>{t('sources')}</span>{ids.map((id,index) => <button key={id} className="p-link" onClick={() => openPaper(id)}>{index+1}. {titles(`${id}Title`)}</button>)}</div>
      {conversation.mode === 'search' && <div className="p-search-results">{ids.map(id => <button key={id} className="p-card" onClick={() => openPaper(id)}><h4>{titles(`${id}Title`)}</h4><p>{papers[id].author} · {papers[id].year}</p></button>)}</div>}
      {conversation.mode === 'review' && <button className="p-button" onClick={() => {saveNote(`${interest}-concept`, `# ${t('report')}\n\n${t('reportBody')}\n\n${ids.map(id => `${papers[id].originalTitle}: ${papers[id].url}`).join('\n')}`); navigate('wiki');}}><BookOpen size={14}/>{t('saveReport')}</button>}
      </>}</ResponseFrame></article></div>}
    <form className="p-composer" onSubmit={event => {event.preventDefault();submit();}}><textarea data-tour="chat-input" aria-label={p('askSparky')} placeholder={p('askSparky')} value={question} maxLength={5000} onChange={event => setQuestion(event.target.value)} /><button className="p-icon" data-tour="chat-send" disabled={!question.trim() || response.busy} aria-label={t('send')}><ArrowUp size={20}/></button></form>
    <div className="p-chat-modes" role="group" aria-label={t('researchOptions')}>{(['chat','search','review'] as const).map(value => { const Icon = value === 'chat' ? MessageSquare : value === 'search' ? Search : Telescope; return <button key={value} className="p-button" aria-pressed={mode === value} onClick={() => {setMode(value);setConversationId();}}><Icon size={14}/>{t(value)}</button>; })}</div>
    {!conversation && <button className="p-suggested" data-tour="chat-example" onClick={() => setQuestion(t('question'))}><span>{t('suggested')}</span>{t('question')}</button>}
    <details className="p-source-options"><summary>{t('sourceScope')}</summary><p>{t('allSources')}</p>{ids.map(id => <a className="p-link" href={papers[id].url} key={id}>{papers[id].originalTitle}</a>)}</details>
  </div>;
}

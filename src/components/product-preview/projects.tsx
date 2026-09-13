"use client";

// Fixture adapter for product Projects page and project detail tabs.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, FolderOpen, Plus, Search, FileText } from 'lucide-react';
import { useDemo } from '../providers';
import { interests, topicPapers, type PaperId, type Interest, type Stage } from '@/lib/papers';

export function ProductProjects({openPaper, navigate}: {openPaper: (id: PaperId) => void; navigate: (stage: Stage) => void}) {
  const t = useTranslations('Experience'), p = useTranslations('Product'), topic = useTranslations('Topics'), d = useTranslations('Demo'), titles = useTranslations('Papers');
  const {session, state, dispatch, addProject, notes, saveNote} = useDemo();
  const [selected, setSelected] = useState<string>();
  const [tab, setTab] = useState<'overview'|'notes'|'pages'|'conversations'>('overview');
  const [search, setSearch] = useState(''), [creating, setCreating] = useState(false), [title, setTitle] = useState(''), [draft, setDraft] = useState(''), [saved,setSaved] = useState(false);
  const projects = [...interests.map(interest => ({id:interest, title:topic(`${interest}Name`), interest})), ...session.projects];
  const project = projects.find(item => item.id === selected);
  const selectProject = (id: string) => {setSelected(id);setTab('overview');setDraft(notes[`project-${id}`] ?? '');setSaved(false);};
  const newProject = () => { if (!title.trim()) return; const id = crypto.randomUUID();addProject({id,title:title.trim(),interest:state.interest});setCreating(false);setTitle('');selectProject(id); };
  const matching = projects.filter(item => `${item.title} ${topic(`${item.interest}Note`)}`.toLowerCase().includes(search.toLowerCase()));
  const papersFor = (interest: Interest) => topicPapers[interest];
  if (project) return <div className="p-page p-project-detail"><button className="p-link p-back" onClick={() => setSelected(undefined)}><ArrowLeft/>{t('backProjects')}</button><h3 className="p-page-title">{project.title}</h3><p className="p-page-description">{topic(`${project.interest}Note`)}</p><nav className="p-detail-tabs" aria-label={p('projects')}>{(['overview','pages','notes','conversations'] as const).map(value => <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>{t(value)}</button>)}</nav>
    {tab === 'overview' && <article className="p-project-overview"><h4>{t('q')}</h4><p>{topic(`${project.interest}Question`)}</p><button className="p-link" onClick={() => {dispatch({type:'interest',interest:project.interest}); navigate('chat');}}>{t('openChat')}</button></article>}
    {tab === 'pages' && <div className="p-project-paper-list">{papersFor(project.interest).map(id => <button className="p-card" key={id} onClick={() => openPaper(id)}><FileText size={18}/><span>{titles(`${id}Title`)}</span></button>)}<button className="p-link" onClick={() => {dispatch({type:'interest',interest:project.interest});navigate('wiki');}}>{p('wiki')}</button></div>}
    {tab === 'notes' && <div><textarea className="p-direction" aria-label={t('projectNote')} placeholder={t('projectNote')} value={draft} maxLength={20000} onChange={event => {setDraft(event.target.value);setSaved(false);}}/><button className="p-button p-primary" onClick={() => {saveNote(`project-${project.id}`,draft);setSaved(true);}}>{saved ? p('saved') : p('save')}</button><span className="sr-only" role="status">{saved ? p('saved') : ''}</span></div>}
    {tab === 'conversations' && <div className="p-project-overview"><p>{t('question')}</p><button className="p-button" onClick={() => {dispatch({type:'interest',interest:project.interest});navigate('chat');}}>{t('openChat')}</button></div>}
  </div>;
  return <div className="p-page p-projects-page"><div className="p-title-row"><h3 className="p-page-title">{p('projects')}</h3><button className="p-button p-primary" onClick={() => setCreating(!creating)}><Plus size={14}/>{t('newProject')}</button></div><p className="p-page-description">{t('projectsBody')}</p>
    {creating && <form className="p-project-create p-card" onSubmit={event => {event.preventDefault();newProject();}}><label>{t('projectTitle')}<input autoFocus value={title} maxLength={100} onChange={event => setTitle(event.target.value)}/></label><div className="p-action-row"><button type="button" className="p-button" onClick={() => setCreating(false)}>{t('cancel')}</button><button className="p-button p-primary" disabled={!title.trim()}>{t('create')}</button></div></form>}
    <label className="p-search"><Search size={16}/><input type="search" aria-label={t('searchProjects')} placeholder={t('searchProjects')} value={search} onChange={event => setSearch(event.target.value)}/></label>
    <div className="p-project-grid">{matching.map(item => <button key={item.id} className="p-project-card" onClick={() => selectProject(item.id)}><div><FolderOpen size={22}/><h4>{item.title}</h4></div><p>{topic(`${item.interest}Question`)}</p><footer><span>{papersFor(item.interest).length} {t('papers')}</span><span>{d(item.interest)}</span></footer></button>)}</div>{!matching.length && <p className="p-empty">{t('noProjects')}</p>}
  </div>;
}

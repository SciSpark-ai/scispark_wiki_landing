import { interests, type Interest } from './papers';
export type ChatMode = 'chat' | 'search' | 'review';
export type Conversation = {id: string; question: string; mode: ChatMode; interest: Interest};
export type Project = {id: string; title: string; interest: Interest};
export type Change = {id: string; key: string; before?: string; after: string; undone: boolean};
export type PreviewSession = { conversations: Conversation[]; projects: Project[]; changes: Change[] };
export const emptySession: PreviewSession = {conversations: [], projects: [], changes: []};
export function parseSession(raw: unknown): PreviewSession {
  if (!raw || typeof raw !== 'object') return emptySession;
  const value = raw as PreviewSession;
  const text = (v: unknown) => typeof v === 'string' && v.length <= 20000;
  return {
    conversations: Array.isArray(value.conversations) ? value.conversations.filter(v => v && text(v.id) && text(v.question) && ['chat','search','review'].includes(v.mode) && interests.includes(v.interest)).slice(-30) : [],
    projects: Array.isArray(value.projects) ? value.projects.filter(v => v && text(v.id) && text(v.title) && interests.includes(v.interest)).slice(-30) : [],
    changes: Array.isArray(value.changes) ? value.changes.filter(v => v && text(v.id) && text(v.key) && text(v.after) && (v.before === undefined || text(v.before)) && typeof v.undone === 'boolean').slice(-30) : [],
  };
}

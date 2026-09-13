"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { demoReducer, initialDemo, parseDemoState, type DemoAction, type DemoState, type Interest } from "@/lib/papers";
import { emptySession, parseSession, type PreviewSession, type Conversation, type Project } from "@/lib/preview-session";
import type { Locale } from "@/lib/site";

const transferKey = "scispark-preview-language-transfer";
type ContextValue = {
  session: PreviewSession;
  addConversation: (conversation: Conversation) => void;
  addProject: (project: Project) => void;
  undoNote: (id: string) => void;
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  kept: Interest[];
  keep: (interest: Interest) => void;
  reset: () => void;
  transfer: () => void;
  notes: Record<string, string>;
  saveNote: (key: string, body: string) => void;
};
const DemoContext = createContext<ContextValue | null>(null);
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider is required");
  return value;
}

export function Providers({ locale, messages, children }: { locale: Locale; messages: AbstractIntlMessages; children: ReactNode }) {
  const [state, dispatchInternal] = useReducer((state: DemoState, action: DemoAction | { type: "restore"; state: DemoState }) =>
    action.type === "restore" ? action.state : demoReducer(state, action), initialDemo);
  const [kept, setKept] = useState<Interest[]>([]);
  const [session, setSession] = useState<PreviewSession>(emptySession);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(transferKey);
      sessionStorage.removeItem(transferKey);
      if (!raw) return;
      document.documentElement.dataset.previewControlled = "true";
      window.dispatchEvent(new Event("scispark-manual"));
      const transfer = JSON.parse(raw);
      // Restore explicit browser navigation state after the server render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(parseSession(transfer.session));
      const restored = parseDemoState(JSON.stringify(transfer.state));
      if (restored) dispatchInternal({ type: "restore", state: restored });
      if (Array.isArray(transfer.kept)) {
        // Restore an explicit language-navigation transfer after SSR hydration.
        setKept(transfer.kept.filter((value: unknown) => ["ai", "climate", "mind"].includes(value as string)));
      }
      if (transfer.notes && typeof transfer.notes === "object" && !Array.isArray(transfer.notes)) {
        // Restore only bounded, plain Markdown values from this preview.
        setNotes(Object.fromEntries(Object.entries(transfer.notes).filter(([key, value]) =>
          /^(?:ai|climate|mind)-(?:concept|idea|report)$|^project-[a-zA-Z0-9-]+$/.test(key) && typeof value === "string" && value.length <= 20000)) as Record<string, string>);
      }
    } catch { /* Storage may be unavailable; the preview still works. */ }
  }, []);

  function transfer() {
    try { sessionStorage.setItem(transferKey, JSON.stringify({ state, kept, notes, session })); } catch { /* Optional continuity only. */ }
  }

  return <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
    <DemoContext.Provider value={{ session,
      addConversation: conversation => setSession(previous => ({ ...previous, conversations: [...previous.conversations, conversation].slice(-30) })),
      addProject: project => setSession(previous => ({...previous, projects:[...previous.projects,project].slice(-30)})),
      undoNote: id => {
        const change = session.changes.find(item => item.id === id);
        if (!change || change.undone || notes[change.key] !== change.after) return;
        setNotes(previous => { const next = {...previous}; if (change.before === undefined) delete next[change.key]; else next[change.key] = change.before; return next; });
        setSession(previous => ({...previous, changes:previous.changes.map(item => item.id === id ? {...item,undone:true} : item)}));
      }, state, dispatch: dispatchInternal, kept,
      keep: interest => setKept(previous => previous.includes(interest) ? previous : [...previous, interest]),
      reset: () => { dispatchInternal({ type: "reset" }); setKept([]); setNotes({}); setSession(emptySession); }, transfer, notes,
      saveNote: (key, body) => {
        if (notes[key] === body) return;
        setSession(previous => ({ ...previous, changes: [...previous.changes, {id:crypto.randomUUID(),key,before:notes[key],after:body,undone:false}].slice(-30) }));
        setNotes(previous => ({ ...previous, [key]: body }));
      } }}>
      {children}
    </DemoContext.Provider>
  </NextIntlClientProvider>;
}

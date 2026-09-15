"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, X } from "lucide-react";
import { Sparky } from "../brand";
import { useDemo } from "../providers";
import { papers } from "@/lib/papers";
import { ResponseFrame, useResponsePlayback } from "./response-playback";

export function ProductQuickChat({ close }: { close: () => void }) {
  const t = useTranslations("Product"), d = useTranslations("Demo"), topic = useTranslations("Topics");
  const { state } = useDemo();
  const [question, setQuestion] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const response = useResponsePlayback(requestId, [topic(`${state.interest}Note`)]);
  return <div className="p-quick-chat" role="dialog" aria-label={t("quickChat")}>
    <div className="p-title-row"><span>Sparky</span><button className="p-icon" aria-label={t("closeChat")} onClick={close}><X /></button></div>
    <div className="p-chat-body"><Sparky /><p>{t("chatPrompt")}</p>{requestId && <div className="p-chat-answer"><ResponseFrame playback={response}><p>{response.text(0)}</p>{!response.busy && <a className="p-link" href={papers[state.paper].url}>{d("source")}</a>}</ResponseFrame></div>}</div>
    <form onSubmit={event => { event.preventDefault(); if (question.trim() && !response.busy) {setRequestId(crypto.randomUUID()); input.current?.focus();} }}><input ref={input} aria-label={t("askSparky")} placeholder={t("askSparky")} value={question} onChange={event => setQuestion(event.target.value)} /><button className="p-icon" aria-label={t("send")} disabled={!question.trim() || response.busy}><ArrowUp /></button></form>
  </div>;
}

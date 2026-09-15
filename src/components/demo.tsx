"use client";

// Faithful fixture adapter for SciSpark's AppShell/Sidebar/MobileNav (4e122b3).
// Presentation follows product source; only storage/network behavior is replaced.
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Home, TrendingUp, BookOpen, Network, FolderOpen, Sparkles, MessageSquarePlus, Clock, PanelLeftClose, Menu, X, Moon, Sun, Cpu, Leaf, Brain } from "lucide-react";
import { Brand, Sparky } from "./brand";
import { useDemo } from "./providers";
import { interests, paperInterest, type Interest, type PaperId, type Stage } from "@/lib/papers";
import { ProductFeed } from "./product-preview/feed";
import { ProductPaper } from "./product-preview/paper";
import { ProductWiki } from "./product-preview/wiki";
import { ProductGraph } from "./product-preview/graph";
import { ProductSpark } from "./product-preview/spark";
import { ProductQuickChat } from "./product-preview/quick-chat";

import { ProductChat } from "./product-preview/chat";
import { ProductProjects } from "./product-preview/projects";
import { ProductHistory } from "./product-preview/history";
import { ProductTrending } from "./product-preview/trending";
import { useGuidedTour, TourCursor, TourControls } from "./product-preview/tour";
import { useDemoScale } from "./product-preview/use-demo-scale";
import type { ChatMode } from "@/lib/preview-session";

const interestIcons = { ai: Cpu, climate: Leaf, mind: Brain };
const groups = [
  { label: "discover", items: [{ label: "home", icon: Home, stage: "feed" }, { label: "sparky", icon: MessageSquarePlus, stage: "chat" }, { label: "trending", icon: TrendingUp, stage: "trending" }] },
  { label: "knowledge", items: [{ label: "wiki", icon: BookOpen, stage: "wiki" }, { label: "graph", icon: Network, stage: "graph" }, { label: "projects", icon: FolderOpen, stage: "projects" }] },
  { label: "tools", items: [{ label: "idea", icon: Sparkles, stage: "idea" }] },
] as const;

export function Demo() {
  const d = useTranslations("Demo");
  const e = useTranslations("Experience");
  const t = useTranslations("Product");
  const { state, dispatch, reset } = useDemo();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useDemoScale(stage);
  const [chatMode, setChatMode] = useState<ChatMode>("chat");
  const [conversationId, setConversationId] = useState<string>();
  const [wikiIdea, setWikiIdea] = useState<Interest | undefined>();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [demoTheme, setDemoTheme] = useState<"light" | "dark" | undefined>();
  const [chat, setChat] = useState(false);
  const [status, setStatus] = useState("");
  const [revision, setRevision] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const chatButton = useRef<HTMLButtonElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const selectedTab = state.stage === "reader" ? "feed" : state.stage;
  function closeMenu() { setMobileMenu(false); menuButton.current?.focus(); }
  function navigate(stage: Stage) { setWikiIdea(undefined); dispatch({ type: "stage", stage }); setMobileMenu(false); setChat(false); screen.current?.scrollTo({ top: 0 }); }
  function openPaper(id: PaperId) { const interest = paperInterest(id); if (interest !== state.interest) dispatch({type:"interest",interest}); dispatch({ type: "paper", paper: id }); screen.current?.scrollTo({ top: 0 }); }
  function changeTheme() { setDemoTheme(previous => (previous ?? document.documentElement.dataset.theme) === "dark" ? "light" : "dark"); }
  const tour = useGuidedTour(root, (stage, index) => {
    navigate(stage);
    if (index === 2) { setConversationId(undefined); setChatMode("chat"); }
  });
  useEffect(() => {
    const setMode = (event: Event) => {setChatMode((event as CustomEvent<ChatMode>).detail);setConversationId(undefined);};
    window.addEventListener("scispark-chat-mode",setMode);
    return () => window.removeEventListener("scispark-chat-mode",setMode);
  }, []);
  useEffect(() => {screen.current?.scrollTo({top:0});}, [state.stage]);
  const currentLabel = selectedTab === "feed" ? t("home") : selectedTab === "chat" ? t("sparky") : t(selectedTab);
  return <section className="demo-section product-demo" aria-label={d("preview")}>
    <h2 className="sr-only">{d("preview")}</h2>
    <p className="p-preview-description">{e("caption")}</p>
    <div className="interest-bar"><span className="interest-label" id="interest-label">{d("interestLabel")}</span><div className="interest-options" role="group" aria-labelledby="interest-label">{interests.map(interest => { const Icon = interestIcons[interest]; return <button key={interest} className="interest-button" aria-pressed={interest === state.interest} onClick={() => { tour.takeControl(); dispatch({ type: "interest", interest }); setRevision(revision + 1); setStatus(""); }}><Icon />{d(interest)}</button>; })}</div></div>
    <div className="demo-presentation" id="product-showcase">
    <div className="demo-stage" ref={stage}><div className="mac-window" ref={root} onPointerEnter={tour.enter} onPointerLeave={tour.leave}
      onFocusCapture={event => {if(event.isTrusted) tour.takeControl();}}
      onPointerDownCapture={event => {if(event.isTrusted) tour.takeControl();}}
      onKeyDownCapture={event => {if(event.isTrusted) tour.takeControl();}}>
      <div className="mac-titlebar"><div className="mac-lights" aria-hidden="true"><i/><i/><i/></div><span>SciSpark</span><span className="mac-preview-label">{d("preview")}</span></div>
    <div className={`product-window ${collapsed ? "p-collapsed" : ""} ${mobileMenu ? "p-menu-open" : ""}`} data-theme={demoTheme} onKeyDown={event => { if (event.key === "Escape") { if (mobileMenu) closeMenu(); if (chat) { setChat(false); chatButton.current?.focus(); } } }}>
      <div className="p-mobile-nav"><button ref={menuButton} className="p-icon" aria-label={t("openMenu")} aria-expanded={mobileMenu} aria-controls="product-sidebar" onClick={() => setMobileMenu(true)}><Menu /></button><Brand compact /><button className="p-icon" aria-label={t("toggleTheme")} onClick={changeTheme}><Moon className="p-light-icon" /><Sun className="p-dark-icon" /></button></div>
      {mobileMenu && <button className="p-menu-backdrop" aria-label={t("closeMenu")} onClick={closeMenu} />}
      <aside className="p-sidebar" id="product-sidebar">
        <div className="p-sidebar-header"><button className="p-icon p-collapse-toggle" aria-label={t(collapsed ? "expandSidebar" : "collapseSidebar")} onClick={() => setCollapsed(!collapsed)}><PanelLeftClose size={18} /></button><Brand compact /><button className="p-icon p-sidebar-theme" aria-label={t("toggleTheme")} onClick={changeTheme}><Moon className="p-light-icon" size={16} /><Sun className="p-dark-icon" size={16} /></button><button className="p-icon p-drawer-close" aria-label={t("closeMenu")} onClick={closeMenu}><X /></button></div>
        <nav className="p-navigation" aria-label={t("navigation")}>{groups.map(group => <div className="p-nav-group" key={group.label}><span className="p-group-label">{t(group.label)}</span>{group.items.map(item => {const Icon=item.icon;return <button className="p-nav-item" data-nav={item.stage} key={item.label} aria-current={selectedTab===item.stage ? "page" : undefined} onClick={() => navigate(item.stage)} title={t(item.label)}><Icon size={18} strokeWidth={1.8}/><span>{t(item.label)}</span>{item.stage === "wiki" && state.saved.length>0 && <span className="p-nav-count saved-count">{state.saved.length}</span>}</button>;})}</div>)}<div className="p-history-link"><button className="p-nav-item" data-nav="history" aria-current={selectedTab === "history" ? "page" : undefined} onClick={() => navigate("history")} title={t("history")}><Clock size={18}/><span>{t("history")}</span></button></div></nav>
        <div className="p-user"><span className="p-avatar">A</span><div><strong>Alex</strong><span>{t("localProfile")}</span></div></div>
      </aside>
      <div className="p-screen" id="demo-panel" role="region" aria-label={currentLabel} tabIndex={0} ref={screen}>
        <div key={`${state.interest}-${revision}-${state.stage}`} className="p-screen-content" data-page={state.stage}>
          {state.stage === "chat" && <ProductChat mode={chatMode} setMode={setChatMode} conversationId={conversationId} setConversationId={setConversationId} openPaper={openPaper} navigate={navigate} />}
          {state.stage === "trending" && <ProductTrending openPaper={openPaper}/>}
          {state.stage === "projects" && <ProductProjects openPaper={openPaper} navigate={navigate}/>}
          {state.stage === "history" && <ProductHistory openConversation={id => {setConversationId(id);navigate("chat");}}/>}
          {state.stage === "feed" && <ProductFeed openPaper={openPaper} />}
          {state.stage === "reader" && <ProductPaper key={state.paper} navigate={navigate} />}
          {state.stage === "wiki" && <ProductWiki key={wikiIdea ?? "concept"} navigate={navigate} idea={wikiIdea} />}
          {state.stage === "graph" && <ProductGraph navigate={navigate} />}
          {state.stage === "idea" && <ProductSpark openIdea={interest => { navigate("wiki"); setWikiIdea(interest); }} />}
        </div>
      </div>
      {chat && <ProductQuickChat key={state.interest} close={() => { setChat(false); chatButton.current?.focus(); }} />}
      <button className="p-companion" ref={chatButton} aria-label={t("quickChat")} aria-expanded={chat} onClick={() => setChat(!chat)}><Sparky /></button>
    </div>
    <TourCursor cursor={tour.cursor} step={tour.step}/></div></div>
    <TourControls tour={tour}><button className="tour-reset" onClick={() => { tour.takeControl(); reset(); setConversationId(undefined); setRevision(revision + 1); setChat(false); setStatus(d("resetDone")); }}>{d("reset")}</button></TourControls>
    </div>
    <div className="sr-only" role="status">{status}</div>
  </section>;
}

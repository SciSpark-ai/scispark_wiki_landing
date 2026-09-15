"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GithubLogoIcon, ListIcon, XIcon, SunIcon, MoonIcon, GlobeIcon } from "@phosphor-icons/react";
import { Brand, SparkIcon } from "./brand";
import { useDemo } from "./providers";
import { localePath, site, type Locale } from "@/lib/site";

export function Header() {
  const t = useTranslations("Site");
  const locale = useLocale() as Locale;
  const { transfer } = useDemo();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("system");
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = document.documentElement.dataset.preference || "system";
    // The initial selection follows the pre-hydration theme script.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      if (document.documentElement.dataset.preference === "system") document.documentElement.dataset.theme = media.matches ? "dark" : "light";
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);

  function changeTheme(value: string) {
    setTheme(value);
    document.documentElement.dataset.preference = value;
    document.documentElement.dataset.theme = value === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : value;
    try { localStorage.setItem("scispark-theme", value); } catch { /* Theme remains usable without storage. */ }
  }

  return <header className="site-header" ref={header}>
    <div className="header-inner shell">
      <a className="home-link" href={localePath(locale)} aria-label={t("home")}><Brand /></a>
      <button className="icon-button menu-toggle" ref={toggle} aria-label={open ? t("closeMenu") : t("menu")} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <XIcon /> : <ListIcon />}</button>
      <nav id="main-navigation" aria-label={t("nav")} className={`navigation ${open ? "is-open" : ""}`}>
        <div className="nav-links">
          <a href="#product-showcase" onClick={() => setOpen(false)}>{t("explore")}</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>{t("start")}</a>
          <a href={site.github}><GithubLogoIcon size={16} aria-hidden="true" />GitHub</a>
        </div>
        <div className="nav-tools">
          <button className="nav-tool language-toggle" aria-label={`${t("language")}: ${({en: "EN", zh: "中文", ja: "日本語"})[locale]}`} title={t("language")} onClick={() => {
            transfer(); const next = ({en: "zh", zh: "ja", ja: "en"} as const)[locale];
            window.location.assign(localePath(next) + window.location.hash);
          }}><GlobeIcon aria-hidden="true" /><span lang={locale === "zh" ? "zh-Hans" : locale}>{({en: "EN", zh: "中文", ja: "日本語"})[locale]}</span></button>
          <button className="nav-tool theme-toggle" aria-label={t("theme")} title={t("theme")} onClick={() => changeTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")}>
            <SunIcon className="site-sun" aria-hidden="true" /><MoonIcon className="site-moon" aria-hidden="true" /><span className="sr-only">{t(theme === "system" ? "system" : theme === "dark" ? "dark" : "light")}</span>
          </button>
        </div>
        <a className="button button-primary nav-cta" href={site.signup}><SparkIcon /><span className="button-label">{t("try")}</span></a>
      </nav>
    </div>
  </header>;
}

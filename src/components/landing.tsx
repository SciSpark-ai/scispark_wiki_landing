import Image from "next/image";
import { createTranslator } from "next-intl";
import { ArrowUpRightIcon, BookOpenIcon, BooksIcon, SparkleIcon, TerminalWindowIcon, CloudIcon, CodeIcon, GithubLogoIcon, DiscordLogoIcon, LinkedinLogoIcon, XLogoIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import { getMessages } from "@/lib/messages";
import { installCommand, site, type Locale } from "@/lib/site";
import { CopyCommands, DemoLink } from "./actions";
import { Brand, SparkIcon } from "./brand";
import { Demo } from "./demo";
import { HeroField } from "./hero-field";
import { Workflow } from "./workflow";
import { DemoBoundary } from "./demo-boundary";
import { ScrollReveals } from "./scroll-reveals";

export function Landing({ locale }: { locale: Locale }) {
  const t = createTranslator({ locale, messages: getMessages(locale), namespace: "Site" });
  return <>
    <ScrollReveals />
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <HeroField /><div className="hero-content shell">
        <h1 id="hero-title">{t("headline")}</h1>
        <p className="hero-intro">{t("intro")}</p>
        <div className="hero-actions"><a className="button button-primary" href={site.signup}><SparkIcon /><span className="button-label">{t("try")}</span></a><a className="button button-secondary" href="#install"><TerminalWindowIcon aria-hidden="true" /><span className="button-label">{t("install")}</span></a></div>
        </div>
      </section>
      <DemoBoundary><Demo /></DemoBoundary>
      <Workflow />
      <section className="benefits section-space shell" id="use-cases" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading">{t("benefitTitle")}</h2>
        <div className="benefits-grid">
          <article className="discovery-benefit" data-reveal>
            <BooksIcon className="benefit-icon" aria-hidden="true" /><h3>{t("discoverTitle")}</h3><p>{t("discoverBody")}</p><DemoLink stage="feed">{t("discoverAction")}</DemoLink>
          </article>
          <article className="knowledge-benefit" data-reveal><BookOpenIcon className="benefit-icon" aria-hidden="true" /><h3>{t("wikiTitle")}</h3><p>{t("wikiBody")}</p><DemoLink stage="wiki">{t("wikiAction")}</DemoLink></article>
          <article className="idea-benefit" data-reveal><SparkleIcon className="benefit-icon" aria-hidden="true" /><h3>{t("ideaTitle")}</h3><p>{t("ideaBody")}</p><DemoLink stage="idea">{t("ideaAction")}</DemoLink></article>
        </div>
      </section>
      <section className="setup-region section-space" id="how-it-works" aria-labelledby="setup-heading">
        <div className="shell"><h2 id="setup-heading" data-reveal>{t("setupTitle")}</h2>
          <div className="setup-grid">
            <article className="hosted-setup" data-reveal><CloudIcon className="setup-icon" /><h3>{t("hostedTitle")}</h3><p>{t("hostedBody")}</p><p className="allowance">{t("allowance")}</p><a className="button button-primary" href={site.signup}><SparkIcon /><span className="button-label">{t("try")}</span></a><p className="sign-in">{t("hostedNote")} <a href={site.login}>{t("signIn")}</a></p></article>
            <article className="local-setup" id="install" data-reveal><CodeIcon className="setup-icon" /><h3>{t("localTitle")}</h3><p>{t("localBody")}</p><p className="requirements">{t("requirements")}</p>
              <div className="install-code"><div className="code-toolbar"><span>{t("terminal")}</span><CopyCommands /></div><pre tabIndex={0} aria-label={t("codeLabel")}><code>{installCommand}</code></pre></div>
              <p className="local-address">{t("openLocal")} <a href="http://127.0.0.1:3000">127.0.0.1:3000<ArrowUpRightIcon /></a></p><p className="provider-note">{t("provider")}</p><a className="text-link" href={site.setup}>{t("setupGuide")}<ArrowUpRightIcon /></a>
            </article>
          </div>
        </div>
      </section>
      <section className="faq section-space shell" id="faq" aria-labelledby="faq-heading"><h2 id="faq-heading" data-reveal>{t("faqTitle")}</h2>
        <div className="faq-list">{([1, 2, 3, 4, 5] as const).map(index => <details key={index} data-reveal><summary>{t(`faq${index}Q`)}<PlusIcon /></summary><p>{t(`faq${index}A`)}</p></details>)}</div>
      </section>
      <section className="closing shell" id="final-cta" data-reveal><Image src="/brand/spark.svg" className="closing-spark" alt="" width={44} height={44} /><h2>{t("closingTitle")}</h2><p>{t("closingBody")}</p><a className="button button-primary" href={site.signup}><SparkIcon /><span className="button-label">{t("try")}</span></a></section>
    </main>
    <footer className="site-footer shell" data-reveal><div className="footer-brand"><Brand /><p>{t("footerLine")}</p></div><nav aria-label={t("community")}><a href={site.github}><GithubLogoIcon />GitHub<ArrowUpRightIcon size={14} /></a>{site.social.discord && <a href={site.social.discord}><DiscordLogoIcon />Discord</a>}{site.social.linkedin && <a href={site.social.linkedin}><LinkedinLogoIcon />LinkedIn</a>}{site.social.x && <a href={site.social.x}><XLogoIcon />X</a>}</nav><span className="copyright">© {new Date().getFullYear()} {t("copyright")}</span></footer>
  </>;
}

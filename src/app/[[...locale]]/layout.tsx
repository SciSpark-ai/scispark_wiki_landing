import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";
import { geist, halant, mono } from "@/lib/fonts";
import { getMessages } from "@/lib/messages";
import { languageTag, resolveLocale } from "@/lib/site";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import "../globals.css";
import "../product-preview.css";
import "../experience.css";

const themeScript = `(function(){var p='system';try{var s=localStorage.getItem('scispark-theme');if(['light','dark','system'].includes(s))p=s}catch(e){}document.documentElement.dataset.preference=p;document.documentElement.dataset.theme=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p})()`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale?: string[] }> }) {
  const locale = resolveLocale((await params).locale);
  if (!locale) notFound();
  const messages = getMessages(locale);
  const t = createTranslator({ locale, messages, namespace: "Site" });
  return <html lang={languageTag(locale)} className={`${geist.variable} ${halant.variable} ${mono.variable}`} suppressHydrationWarning>
    <head>
      {locale !== "en" && <>
        <link rel="preload" href={`/fonts/noto-serif-${locale}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`/fonts/noto-sans-${locale}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
      </>}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </head>
    <body><Providers locale={locale} messages={messages}><a className="skip-link" href="#main-content">{t("skip")}</a><Header />{children}</Providers></body>
  </html>;
}

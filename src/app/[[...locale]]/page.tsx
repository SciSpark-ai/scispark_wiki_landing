import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/landing";
import { getMessages } from "@/lib/messages";
import { localePath, resolveLocale, site } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: [] }, { locale: ["zh"] }, { locale: ["ja"] }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale?: string[] }> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  if (!locale) notFound();
  const copy = getMessages(locale).Site;
  const url = site.url + localePath(locale);
  return {
    metadataBase: new URL(site.url), title: copy.title, description: copy.description,
    alternates: { canonical: url, languages: { en: site.url + "/", "zh-Hans": site.url + "/zh", ja: site.url + "/ja", "x-default": site.url + "/" } },
    openGraph: { title: "SciSpark", description: copy.intro, url, siteName: "SciSpark", locale: { en: "en_US", zh: "zh_CN", ja: "ja_JP" }[locale], type: "website", images: [{ url: "/og/share-icon-v2.png", width: 600, height: 600, type: "image/png", alt: "SciSpark" }] },
    twitter: { card: "summary_large_image", title: "SciSpark", description: copy.intro, images: [{ url: `/og/${locale}-v2.png`, width: 1200, height: 630, alt: `SciSpark — ${copy.closingTitle}` }] },
    icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ locale?: string[] }> }) {
  const locale = resolveLocale((await params).locale);
  if (!locale) notFound();
  return <Landing locale={locale} />;
}

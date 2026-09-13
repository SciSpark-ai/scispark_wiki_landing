import type { MetadataRoute } from "next";
import { locales, localePath, site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map(locale => ({ url: site.url + localePath(locale), alternates: { languages: { en: site.url + "/", "zh-Hans": site.url + "/zh", ja: site.url + "/ja", "x-default": site.url + "/" } } }));
}

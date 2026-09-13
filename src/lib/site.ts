export const site = {
  url: "https://landing.scispark.ai",
  signup: "https://beta.scispark.ai/signup",
  login: "https://beta.scispark.ai/login",
  github: "https://github.com/SciSpark-ai/scispark_wiki",
  setup: "https://github.com/SciSpark-ai/scispark_wiki#getting-started",
  // Add verified destinations here when supplied. Empty entries are never rendered.
  social: { discord: "", linkedin: "", x: "" },
};

export const locales = ["en", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];
export const localePath = (locale: Locale) => locale === "en" ? "/" : `/${locale}`;
export const languageTag = (locale: Locale) => locale === "zh" ? "zh-Hans" : locale;
export function resolveLocale(parts?: string[]): Locale | undefined {
  if (!parts?.length) return "en";
  if (parts.length === 1 && (parts[0] === "zh" || parts[0] === "ja")) return parts[0];
}

export const installCommand = `git clone https://github.com/SciSpark-ai/scispark_wiki.git
cd scispark_wiki
npm install
npm run dev`;

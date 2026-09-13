import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import ja from "@/messages/ja.json";
import type { Locale } from "./site";

export const messages = { en, zh, ja };
export const getMessages = (locale: Locale) => messages[locale];

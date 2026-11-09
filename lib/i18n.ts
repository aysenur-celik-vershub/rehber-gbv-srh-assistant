import tr from "@/locales/tr.json";
import ar from "@/locales/ar.json";
import type { Language } from "@/lib/types";

// All user-facing strings live in locales/*.json. Turkish is the reference
// locale; its key set defines the type so a missing Arabic key is a compile
// error when accessed through t() with a literal, and a runtime fallback
// otherwise.
export type TranslationKey = keyof typeof tr;

const dictionaries: Record<Language, Record<string, string>> = { tr, ar };

const warned = new Set<string>();

export function t(
  key: TranslationKey,
  lang: Language,
  vars?: Record<string, string | number>,
): string {
  let value = dictionaries[lang][key];
  if (value === undefined) {
    value = dictionaries.tr[key];
    if (process.env.NODE_ENV !== "production" && !warned.has(`${lang}:${key}`)) {
      warned.add(`${lang}:${key}`);
      console.warn(`[i18n] missing key "${key}" for "${lang}", falling back to tr`);
    }
  }
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
  }
  return value;
}

export function dirOf(lang: Language): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function languageName(lang: Language): "Turkish" | "Arabic" {
  return lang === "ar" ? "Arabic" : "Turkish";
}

import type { Language } from "@/lib/types";

// Turkish case folding must use the tr-TR locale: plain toLowerCase() maps
// "İ" to "i̇" (i + combining dot) and "I" to "i" instead of "ı", so keyword
// matches would silently fail.
export function normalizeTr(s: string): string {
  return s.normalize("NFC").toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
}

export function normalizeAr(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[ً-ٰٟ]/g, "") // strip diacritics (harakat)
    .replace(/ـ/g, "") // strip tatweel (kashida)
    .replace(/[إأآٱ]/g, "ا") // unify alef forms
    .replace(/ى/g, "ي") // alef maqsura -> ya
    .replace(/ة/g, "ه") // ta marbuta -> ha
    .replace(/\s+/g, " ")
    .trim();
}

export function normalize(s: string, lang: Language): string {
  return lang === "tr" ? normalizeTr(s) : normalizeAr(s);
}

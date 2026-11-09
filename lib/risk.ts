import keywordConfig from "@/config/risk_keywords.json";
import { normalizeAr, normalizeTr } from "@/lib/normalize";
import type { Risk } from "@/lib/types";

const ORDER: Record<Risk, number> = { low: 0, medium: 1, high: 2 };

type KeywordLists = { tr: string[]; ar: string[] };

// The lists are normalised once at module load, so the maintainer can add
// entries in natural spelling (with diacritics, hamza forms, capitals).
function loadLists(raw: { tr: string[]; ar: string[] }): KeywordLists {
  return {
    tr: raw.tr.map(normalizeTr).filter((k) => k.length > 0),
    ar: raw.ar.map(normalizeAr).filter((k) => k.length > 0),
  };
}

const KW: Record<"high" | "medium", KeywordLists> = {
  high: loadLists(keywordConfig.high),
  medium: loadLists(keywordConfig.medium),
};

function matchAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

// Keyword layer: instant, deterministic, no AI involved. The user may write
// in a language other than the one selected, so both normalisations are
// applied and both lists are searched. Matching is substring-based on
// purpose (Turkish stems catch inflected forms); false positives are
// accepted in favour of caution.
export function keywordRisk(text: string): Risk {
  const tr = normalizeTr(text);
  const ar = normalizeAr(text);
  if (matchAny(tr, KW.high.tr) || matchAny(ar, KW.high.ar)) return "high";
  if (matchAny(tr, KW.medium.tr) || matchAny(ar, KW.medium.ar)) return "medium";
  return "low";
}

// The higher of the two layers always wins.
export function combineRisk(a: Risk, b: Risk): Risk {
  return ORDER[a] >= ORDER[b] ? a : b;
}

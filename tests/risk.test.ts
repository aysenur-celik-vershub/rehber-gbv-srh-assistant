import { describe, expect, it } from "vitest";
import { normalizeAr, normalizeTr } from "@/lib/normalize";
import { combineRisk, keywordRisk } from "@/lib/risk";
import type { Risk } from "@/lib/types";

describe("normalizeTr", () => {
  it("lower-cases with Turkish rules (İ→i, I→ı)", () => {
    expect(normalizeTr("İSTANBUL")).toBe("istanbul");
    expect(normalizeTr("ILIK")).toBe("ılık");
    expect(normalizeTr("KİLİTLEDİ")).toBe("kilitledi");
  });
  it("collapses whitespace", () => {
    expect(normalizeTr("  beni   kilitledi \n")).toBe("beni kilitledi");
  });
});

describe("normalizeAr", () => {
  it("strips diacritics and unifies letter forms", () => {
    expect(normalizeAr("يُهَدِّدُنِي بِالقَتْلِ")).toBe("يهددني بالقتل");
    expect(normalizeAr("أريد")).toBe("اريد");
    expect(normalizeAr("خائفة")).toBe("خائفه");
    expect(normalizeAr("مستشفى")).toBe("مستشفي");
    expect(normalizeAr("سـلاح")).toBe("سلاح");
  });
});

describe("keywordRisk – high", () => {
  it.each([
    "Beni öldürmekle tehdit ediyor",
    "Kocam beni eve kilitledi",
    "Şu an evde ve elinde bıçak var",
    "يهددني بالقتل",
    "زوجي يحبسني في البيت",
    "انا في خطر الآن",
  ])("%s → high", (text) => {
    expect(keywordRisk(text)).toBe("high");
  });

  it("matches Turkish text with dotted/dotless i in capitals", () => {
    expect(keywordRisk("BENİ KİLİTLEDİ, ÇIKAMIYORUM")).toBe("high");
    expect(keywordRisk("İNTİHAR etmeyi düşünüyorum")).toBe("high");
  });

  it("matches fully vocalised Arabic", () => {
    expect(keywordRisk("زَوْجِي يُهَدِّدُنِي بِالقَتْلِ الآنَ")).toBe("high");
  });

  it("matches Arabic written while Turkish is selected (both lists searched)", () => {
    expect(keywordRisk("مرحبا، يقتلني")).toBe("high");
  });
});

describe("keywordRisk – medium", () => {
  it.each([
    "Eşim bana sürekli bağırıyor ve dışarı çıkmama izin vermiyor",
    "Beni dövüyor ama kimseye söyleyemiyorum",
    "Ailem beni zorla evlendirmek istiyor",
    "زوجي لا يسمح لي بالخروج من البيت ويأخذ هاتفي",
    "يضربني كل يوم",
    "أنا خائفة منه",
  ])("%s → medium", (text) => {
    expect(keywordRisk(text)).toBe("medium");
  });
});

describe("keywordRisk – low", () => {
  it.each([
    "Regl ne zaman başlar?",
    "Regl dönemimde hijyen için nelere dikkat etmeliyim?",
    "ما الذي يجب أن أنتبه له للنظافة أثناء الدورة الشهرية؟",
    "Bugün dolar kuru kaç?",
  ])("%s → low", (text) => {
    expect(keywordRisk(text)).toBe("low");
  });
});

describe("combineRisk", () => {
  const levels: Risk[] = ["low", "medium", "high"];
  const order: Record<Risk, number> = { low: 0, medium: 1, high: 2 };
  it("returns the higher of the two in all 9 combinations", () => {
    for (const a of levels) {
      for (const b of levels) {
        const expected = order[a] >= order[b] ? a : b;
        expect(combineRisk(a, b)).toBe(expected);
        expect(combineRisk(b, a)).toBe(expected);
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { getContentDocs, getGroundingContent } from "@/lib/content";

describe("content loader", () => {
  it("loads 7 documents per language with matching ids", () => {
    const tr = getContentDocs("tr");
    const ar = getContentDocs("ar");
    expect(tr).toHaveLength(7);
    expect(ar).toHaveLength(7);
    expect(tr.map((d) => d.id)).toEqual(ar.map((d) => d.id));
  });

  it("builds grounding text as '## title' sections", () => {
    const text = getGroundingContent("tr");
    expect(text).toContain("## Regl sağlığı");
    expect(text).toContain("Ped: En az 4–6 saatte bir");
    expect(getGroundingContent("ar")).toContain("## صحة الدورة الشهرية");
  });

  it("keeps review status from the frontmatter", () => {
    // Turkish texts are approved; Arabic machine translations are not yet reviewed.
    expect(getContentDocs("tr").every((d) => d.reviewed)).toBe(true);
    expect(getContentDocs("ar").every((d) => !d.reviewed)).toBe(true);
  });

  it("contains no placeholders any more", () => {
    const all = getGroundingContent("tr") + getGroundingContent("ar");
    expect(all).not.toContain("YER TUTUCU");
    expect(all).not.toContain("نص مؤقت");
  });
});

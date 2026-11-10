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
    expect(text).toContain("## Regl ve regl hijyeni");
    expect(text).toContain("Pedi en az 4–6 saatte bir değiştirin");
    expect(getGroundingContent("ar")).toContain("## الدورة الشهرية والنظافة أثناءها");
  });

  it("keeps review status from the frontmatter", () => {
    const doc = getContentDocs("tr").find((d) => d.id === "menstrual-hygiene");
    expect(doc?.reviewed).toBe(false);
  });
});

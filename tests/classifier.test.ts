import { describe, expect, it } from "vitest";
import { parseClassifierRisk } from "@/lib/classifier";

describe("parseClassifierRisk", () => {
  it("reads a clean JSON object", () => {
    expect(parseClassifierRisk('{"risk":"high","category":"self_harm"}')).toBe("high");
    expect(parseClassifierRisk('{"risk":"low","category":"none"}')).toBe("low");
  });
  it("tolerates code fences and surrounding prose", () => {
    expect(parseClassifierRisk('Sure:\n```json\n{"risk": "medium", "category": "controlling_behaviour"}\n```')).toBe("medium");
    expect(parseClassifierRisk('Here is the result {"risk":"high"} as requested')).toBe("high");
  });
  it("falls back to medium on garbage or unknown levels", () => {
    expect(parseClassifierRisk("")).toBe("medium");
    expect(parseClassifierRisk("not json")).toBe("medium");
    expect(parseClassifierRisk('{"risk":"critical"}')).toBe("medium");
    expect(parseClassifierRisk('{"category":"none"}')).toBe("medium");
    expect(parseClassifierRisk("{broken")).toBe("medium");
  });
});

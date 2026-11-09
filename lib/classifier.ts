import { isRisk, type Risk } from "@/lib/types";

// Brief 8.3: the classifier may wrap its JSON in prose or code fences.
// Anything unparseable or out of range is treated as "medium" (cautious
// default). The "category" field is for demo testing only; it is never shown
// or stored.
export function parseClassifierRisk(raw: string): Risk {
  const cleaned = raw.replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return "medium";
  try {
    const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
    if (typeof parsed === "object" && parsed !== null && "risk" in parsed) {
      const risk = (parsed as { risk: unknown }).risk;
      if (isRisk(risk)) return risk;
    }
  } catch {
    // fall through to the cautious default
  }
  return "medium";
}

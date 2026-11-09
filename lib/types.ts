// Shared types used by both the browser and the API route.
// Keeping them in one place means a wrong value (e.g. an unknown risk level
// that would skip the emergency card) is caught at compile time.

export type Language = "tr" | "ar";

export const LANGUAGES: readonly Language[] = ["tr", "ar"] as const;

export type Risk = "low" | "medium" | "high";

export type ChatRole = "user" | "assistant";

export type ChatMessage = { role: ChatRole; content: string };

export type ChatRequest = {
  language: Language;
  messages: ChatMessage[];
};

export type ChatResponse = {
  reply: string;
  risk: Risk;
  showEmergency: boolean;
  showSupportOffer: boolean;
};

export type ServiceType = "psychosocial" | "legal" | "health" | "shelter";

export type SampleService = {
  id: string;
  name_tr: string;
  name_ar: string;
  city: string; // a province name or "online"
  types: ServiceType[];
  languages: Language[];
  hours_tr: string;
  hours_ar: string;
  phone: string; // deliberately fake, never rendered as a tel: link
};

export type EmergencyContact = {
  id: string;
  number: string | null;
  // International format without "+" (for a wa.me link), or null.
  whatsapp: string | null;
  name_tr: string;
  name_ar: string;
  desc_tr: string;
  desc_ar: string;
};

export function isLanguage(value: unknown): value is Language {
  return value === "tr" || value === "ar";
}

export function isRisk(value: unknown): value is Risk {
  return value === "low" || value === "medium" || value === "high";
}

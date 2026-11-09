import { isLanguage, type ChatMessage, type ChatRequest } from "@/lib/types";

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY = 10;
export const MAX_BODY_BYTES = 20 * 1024;

export type ValidationResult =
  | { ok: true; value: ChatRequest }
  | { ok: false; status: 400 | 413 };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseMessage(v: unknown): ChatMessage | null {
  if (!isRecord(v)) return null;
  const { role, content } = v;
  // Clients may only send user/assistant turns; "system" is rejected so the
  // prompt cannot be overridden from the browser.
  if (role !== "user" && role !== "assistant") return null;
  if (typeof content !== "string") return null;
  if (content.length === 0 || content.length > MAX_MESSAGE_CHARS) return null;
  return { role, content };
}

// Validates a parsed JSON body against the API contract (brief 7.2).
// Never echoes user text back and never logs it.
export function validateChatRequest(body: unknown): ValidationResult {
  if (!isRecord(body)) return { ok: false, status: 400 };
  if (!isLanguage(body.language)) return { ok: false, status: 400 };
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { ok: false, status: 400 };
  }

  const messages: ChatMessage[] = [];
  for (const raw of body.messages) {
    const m = parseMessage(raw);
    if (!m) return { ok: false, status: 400 };
    messages.push(m);
  }

  if (messages[messages.length - 1].role !== "user") {
    return { ok: false, status: 400 };
  }

  // Only the most recent turns are used; older ones are dropped silently.
  const trimmed = messages.slice(-MAX_HISTORY);

  return { ok: true, value: { language: body.language, messages: trimmed } };
}

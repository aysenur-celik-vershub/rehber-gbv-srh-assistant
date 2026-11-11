import type { ChatMessage } from "@/lib/types";

// Single entry point for every model call. Provider-specific code lives only
// here, so the assistant can move to another provider (including a
// self-hosted open-weight model) without touching the rest of the app.
//
// Configuration comes from environment variables only; no model name or key
// is ever embedded in code:
//   LLM_PROVIDER  "anthropic" (default) | "openai" (any OpenAI-compatible API)
//   LLM_MODEL     model identifier for that provider
//   LLM_API_KEY   secret key
//   LLM_BASE_URL  optional override, e.g. for an OpenAI-compatible gateway
//
// Privacy rule: request and response contents are never logged. On error,
// only the error kind and HTTP status are logged.

export type { ChatMessage };

export const LLM_TIMEOUT_MS = 20_000;

export class LlmError extends Error {
  constructor(
    public readonly kind: "config" | "http" | "timeout" | "network" | "parse",
    public readonly status?: number,
  ) {
    super(`llm_${kind}`);
    this.name = "LlmError";
  }
}

type CompleteParams = {
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
  temperature?: number;
};

type Provider = "anthropic" | "openai";

function getProvider(): Provider {
  const p = (process.env.LLM_PROVIDER ?? "anthropic").toLowerCase();
  if (p === "anthropic" || p === "openai") return p;
  throw new LlmError("config");
}

function getConfig(): { provider: Provider; model: string; apiKey: string; baseUrl: string } {
  const provider = getProvider();
  const model = process.env.LLM_MODEL;
  const apiKey = process.env.LLM_API_KEY;
  if (!model || !apiKey) throw new LlmError("config");
  const baseUrl =
    process.env.LLM_BASE_URL ??
    (provider === "anthropic" ? "https://api.anthropic.com" : "https://api.openai.com");
  return { provider, model, apiKey, baseUrl: baseUrl.replace(/\/+$/, "") };
}

async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  signal: AbortSignal,
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw new LlmError("timeout");
    throw new LlmError("network");
  }
  if (!res.ok) throw new LlmError("http", res.status);
  try {
    return await res.json();
  } catch {
    throw new LlmError("parse");
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

async function completeAnthropic(p: CompleteParams, signal: AbortSignal): Promise<string> {
  const { model, apiKey, baseUrl } = getConfig();
  const data = await postJson(
    `${baseUrl}/v1/messages`,
    { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    {
      model,
      system: p.system,
      messages: p.messages,
      max_tokens: p.maxTokens,
      // Current Anthropic models think before answering by default and the
      // thinking tokens count against max_tokens; "between_tools" turns that
      // off for plain chat so the whole budget goes to the visible reply.
      thinking: { type: "between_tools" },
      // `temperature` is intentionally not sent: current Anthropic models
      // reject it ("temperature is deprecated for this model", HTTP 400).
      // The classifier's determinism comes from its strict JSON instruction
      // and the cautious parser (lib/classifier.ts), not from sampling.
    },
    signal,
  );
  // Response shape: { content: [{ type: "text", text: "..." }, ...] }
  if (!isRecord(data) || !Array.isArray(data.content)) throw new LlmError("parse");
  const text = data.content
    .filter((b): b is { type: string; text: string } => isRecord(b) && b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("");
  return text;
}

async function completeOpenAi(p: CompleteParams, signal: AbortSignal): Promise<string> {
  const { model, apiKey, baseUrl } = getConfig();
  const data = await postJson(
    `${baseUrl}/v1/chat/completions`,
    { authorization: `Bearer ${apiKey}` },
    {
      model,
      messages: [{ role: "system", content: p.system }, ...p.messages],
      max_tokens: p.maxTokens,
      ...(p.temperature !== undefined ? { temperature: p.temperature } : {}),
    },
    signal,
  );
  // Response shape: { choices: [{ message: { content: "..." } }] }
  if (!isRecord(data) || !Array.isArray(data.choices)) throw new LlmError("parse");
  const first: unknown = data.choices[0];
  if (!isRecord(first) || !isRecord(first.message) || typeof first.message.content !== "string") {
    throw new LlmError("parse");
  }
  return first.message.content;
}

export async function complete(params: CompleteParams): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
  try {
    const provider = getProvider();
    return provider === "anthropic"
      ? await completeAnthropic(params, controller.signal)
      : await completeOpenAi(params, controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

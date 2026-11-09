import { NextResponse } from "next/server";
import { t } from "@/lib/i18n";
import { complete } from "@/lib/llm";
import {
  ANSWER_PARAMS,
  CLASSIFIER_PARAMS,
  CLASSIFIER_PROMPT,
  buildAnswerPrompt,
} from "@/lib/prompts";
import { parseClassifierRisk } from "@/lib/classifier";
import { combineRisk, keywordRisk } from "@/lib/risk";
import type { ChatResponse, Risk } from "@/lib/types";
import { MAX_BODY_BYTES, validateChatRequest } from "@/lib/validate";

// Node.js runtime: the content loader reads files from disk.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(status: 400 | 413 | 415) {
  // Never echo the request back. No logging of the body.
  return NextResponse.json({ error: "invalid_request" }, { status, headers: NO_STORE });
}

export async function POST(req: Request): Promise<NextResponse> {
  const lengthHeader = req.headers.get("content-length");
  if (lengthHeader && Number(lengthHeader) > MAX_BODY_BYTES) return errorResponse(413);

  let rawText: string;
  try {
    rawText = await req.text();
  } catch {
    return errorResponse(400);
  }
  if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) return errorResponse(413);

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return errorResponse(400);
  }

  const validated = validateChatRequest(body);
  if (!validated.ok) return errorResponse(validated.status);
  const { language, messages } = validated.value;

  const lastUser = messages[messages.length - 1];

  // Layer 1: keyword check on the latest user message only. Instant, no AI.
  const kwRisk = keywordRisk(lastUser.content);

  // Layer 2 (classifier) and the answer run in parallel.
  const classifierContext = messages.slice(-3);
  const [classification, answer] = await Promise.allSettled([
    complete({
      system: CLASSIFIER_PROMPT,
      messages: classifierContext,
      maxTokens: CLASSIFIER_PARAMS.maxTokens,
      temperature: CLASSIFIER_PARAMS.temperature,
    }),
    complete({
      system: buildAnswerPrompt(language),
      messages,
      maxTokens: ANSWER_PARAMS.maxTokens,
      temperature: ANSWER_PARAMS.temperature,
    }),
  ]);

  // Fail safe: a failed classifier counts as "medium"; the keyword layer can
  // still raise it to "high". If both AI calls fail and no keyword matched,
  // the result is still "medium" so the user is offered support.
  let aiRisk: Risk;
  if (classification.status === "fulfilled") {
    aiRisk = parseClassifierRisk(classification.value);
  } else {
    logLlmFailure("classifier", classification.reason);
    aiRisk = "medium";
  }

  let reply: string;
  if (answer.status === "fulfilled" && answer.value.trim().length > 0) {
    reply = answer.value.trim();
  } else {
    if (answer.status === "rejected") logLlmFailure("answer", answer.reason);
    reply = t("error_generic", language);
  }

  const risk = combineRisk(kwRisk, aiRisk);

  const response: ChatResponse = {
    reply,
    risk,
    showEmergency: risk === "high",
    showSupportOffer: risk === "medium" || risk === "high",
  };

  return NextResponse.json(response, { headers: NO_STORE });
}

// Only the error kind and status are logged: never any message content.
function logLlmFailure(call: "classifier" | "answer", reason: unknown): void {
  const kind = reason instanceof Error ? reason.message : "llm_unknown";
  const status =
    typeof reason === "object" && reason !== null && "status" in reason
      ? (reason as { status?: number }).status
      : undefined;
  console.error("llm_error", call, kind, status ?? "");
}

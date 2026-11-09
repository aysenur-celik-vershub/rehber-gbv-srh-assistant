"use client";

import { useEffect, useRef, useState } from "react";
import EmergencyCard from "@/components/EmergencyCard";
import MessageBubble from "@/components/MessageBubble";
import ReferralFlow from "@/components/ReferralFlow";
import SupportOffer from "@/components/SupportOffer";
import TopicButtons from "@/components/TopicButtons";
import { t } from "@/lib/i18n";
import type { ChatMessage, ChatResponse, Language, Risk } from "@/lib/types";
import { MAX_MESSAGE_CHARS } from "@/lib/validate";

type Entry = {
  id: number;
  role: "user" | "assistant";
  content: string;
  // Fixed UI text (the welcome message) is never sent to the API. It keeps
  // the language it was shown in; switching language mid-chat keeps the
  // history and only affects subsequent replies.
  local?: boolean;
  risk?: Risk;
  showEmergency?: boolean;
  showSupportOffer?: boolean;
  offerDismissed?: boolean;
};

type Props = {
  lang: Language;
  onChangeLanguage: () => void;
};

let nextId = 1;

// The conversation lives only in this component's state: closing the tab
// deletes it. Nothing is written to the URL, cookies or storage.
export default function Chat({ lang, onChangeLanguage }: Props) {
  const [entries, setEntries] = useState<Entry[]>(() => [
    { id: nextId++, role: "assistant", content: t("welcome_message", lang), local: true },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries, sending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sending || content.length > MAX_MESSAGE_CHARS) return;

    const userEntry: Entry = { id: nextId++, role: "user", content };
    const history: ChatMessage[] = [...entries, userEntry]
      .filter((e) => !e.local)
      .map((e) => ({ role: e.role, content: e.content }));

    setEntries((prev) => [...prev, userEntry]);
    setInput("");
    setSending(true);

    let result: ChatResponse;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ language: lang, messages: history }),
      });
      if (!res.ok) throw new Error("request_failed");
      result = (await res.json()) as ChatResponse;
    } catch {
      // Fail safe: show the generic error and still offer support.
      result = {
        reply: t("error_generic", lang),
        risk: "medium",
        showEmergency: false,
        showSupportOffer: true,
      };
    }

    setEntries((prev) => [
      ...prev,
      {
        id: nextId++,
        role: "assistant",
        content: result.reply,
        risk: result.risk,
        showEmergency: result.showEmergency,
        showSupportOffer: result.showSupportOffer,
      },
    ]);
    setSending(false);
    inputRef.current?.focus();
  }

  function dismissOffer(id: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, offerDismissed: true } : e)));
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const remaining = MAX_MESSAGE_CHARS - input.length;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 pe-28">
          <h1 className="text-xl font-bold text-brand">{t("app_name", lang)}</h1>
          <button
            type="button"
            onClick={onChangeLanguage}
            className="min-h-[44px] rounded-lg px-3 text-sm font-medium text-muted underline underline-offset-4 hover:text-ink"
          >
            {t("change_language", lang)}
          </button>
        </div>
      </header>

      <main
        className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-4"
        role="log"
        aria-label={t("chat_region_label", lang)}
        aria-live="polite"
      >
        {entries.map((e) => (
          <div key={e.id} className="space-y-3">
            {e.role === "assistant" && e.showEmergency && <EmergencyCard lang={lang} />}
            <MessageBubble
              role={e.role}
              content={e.content}
              roleLabel={t(e.role === "user" ? "you_label" : "assistant_label", lang)}
            />
            {e.role === "assistant" && e.showSupportOffer && !e.offerDismissed && e.risk && (
              <SupportOffer
                lang={lang}
                risk={e.risk}
                onYes={() => setReferralOpen(true)}
                onNotNow={() => dismissOffer(e.id)}
              />
            )}
          </div>
        ))}

        {sending && (
          <p className="text-base text-muted" aria-live="assertive">
            {t("typing", lang)}
          </p>
        )}

        {entries.length === 1 && (
          <TopicButtons lang={lang} disabled={sending} onPick={(p) => void send(p)} />
        )}
        <div ref={bottomRef} />
      </main>

      <footer className="sticky bottom-0 border-t border-line bg-canvas px-4 pb-3 pt-2">
        <form
          className="mx-auto flex max-w-2xl items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            {t("message_input_label", lang)}
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_CHARS))}
            onKeyDown={onKeyDown}
            maxLength={MAX_MESSAGE_CHARS}
            rows={1}
            placeholder={t("input_placeholder", lang)}
            aria-describedby="char-counter"
            className="max-h-40 min-h-[48px] flex-1 resize-y rounded-xl border border-line bg-surface px-3 py-3 text-base"
          />
          <button
            type="submit"
            disabled={sending || input.trim().length === 0}
            aria-label={t("send", lang)}
            className="min-h-[48px] rounded-xl bg-brand px-5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {t("send", lang)}
          </button>
        </form>
        <div className="mx-auto flex max-w-2xl items-center justify-between pt-1 text-xs text-muted">
          <span id="char-counter" aria-live="polite">
            {remaining < 200 ? `${input.length} / ${MAX_MESSAGE_CHARS}` : t("char_limit", lang)}
          </span>
          <span>{t("footer_emergency", lang)}</span>
        </div>
      </footer>

      {referralOpen && <ReferralFlow lang={lang} onClose={() => setReferralOpen(false)} />}
    </div>
  );
}

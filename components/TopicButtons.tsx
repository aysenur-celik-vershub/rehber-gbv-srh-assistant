"use client";

import { t, type TranslationKey } from "@/lib/i18n";
import type { Language } from "@/lib/types";

type Props = {
  lang: Language;
  disabled: boolean;
  onPick: (prompt: string) => void;
};

const TOPICS: { label: TranslationKey; prompt: TranslationKey }[] = [
  { label: "topic_violence", prompt: "topic_violence_prompt" },
  { label: "topic_srh", prompt: "topic_srh_prompt" },
  { label: "topic_menstrual", prompt: "topic_menstrual_prompt" },
  { label: "topic_support", prompt: "topic_support_prompt" },
];

// Four ready-made questions; clicking one sends it as a user message.
export default function TopicButtons({ lang, disabled, onPick }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {TOPICS.map((topic) => (
        <button
          key={topic.label}
          type="button"
          disabled={disabled}
          onClick={() => onPick(t(topic.prompt, lang))}
          className="min-h-[48px] rounded-xl border border-brand/40 bg-brand-soft px-4 py-2 text-start text-base font-medium text-brand-dark hover:bg-brand/15 disabled:opacity-50"
        >
          {t(topic.label, lang)}
        </button>
      ))}
    </div>
  );
}

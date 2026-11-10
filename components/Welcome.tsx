"use client";

import LanguageSelect from "@/components/LanguageSelect";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";

type Props = {
  lang: Language | null;
  onSelectLanguage: (lang: Language) => void;
  onOpenPrivacy: () => void;
  onStart: () => void;
};

export default function Welcome({
  lang,
  onSelectLanguage,
  onOpenPrivacy,
  onStart,
}: Props) {
  // Before a language is chosen, show the prompt in both languages.
  const uiLang: Language = lang ?? "tr";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-20">
      <h1 className="mb-8 text-center text-3xl font-bold text-brand">
        {lang ? t("app_name", lang) : "Wellspring"}
      </h1>

      <LanguageSelect
        value={lang}
        onChange={onSelectLanguage}
        legend={lang ? t("choose_language", lang) : "Dil seçin · اختاري اللغة"}
      />

      {lang && (
        <section className="mt-8 space-y-4" aria-live="polite">
          <p className="rounded-xl border border-warn/30 bg-warn-soft p-4 text-base text-warn">
            {t("disclaimer_emergency", uiLang)}
          </p>
          <p className="rounded-xl bg-brand-soft p-4 text-base">
            {t("privacy_summary", uiLang)}
          </p>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full rounded-lg px-2 text-center text-base font-medium text-brand underline underline-offset-4"
          >
            {t("privacy_link", uiLang)}
          </button>
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-xl bg-brand px-4 py-4 text-xl font-bold text-white hover:bg-brand-dark"
          >
            {t("start", uiLang)}
          </button>
        </section>
      )}
    </main>
  );
}

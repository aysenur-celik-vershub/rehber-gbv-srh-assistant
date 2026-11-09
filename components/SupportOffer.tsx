"use client";

import { t } from "@/lib/i18n";
import type { Language, Risk } from "@/lib/types";

type Props = {
  lang: Language;
  risk: Risk;
  onYes: () => void;
  onNotNow: () => void;
};

// Medium risk: "Would you like to talk to a trained specialist?"
// High risk: the consent question for referral.
export default function SupportOffer({ lang, risk, onYes, onNotNow }: Props) {
  const question = risk === "high" ? t("consent_question", lang) : t("support_offer_question", lang);
  return (
    <section
      aria-label={question}
      className="rounded-2xl border border-brand/40 bg-brand-soft p-4"
    >
      <p className="mb-3 text-base font-medium">{question}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onYes}
          className="min-h-[44px] flex-1 rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
        >
          {t("yes", lang)}
        </button>
        <button
          type="button"
          onClick={onNotNow}
          className="min-h-[44px] flex-1 rounded-xl border border-line bg-surface px-4 font-semibold hover:bg-canvas"
        >
          {t("not_now", lang)}
        </button>
      </div>
    </section>
  );
}

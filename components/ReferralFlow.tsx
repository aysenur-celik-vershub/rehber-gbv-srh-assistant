"use client";

import { useMemo, useState } from "react";
import sampleServices from "@/data/sample-services.json";
import EmergencyCard from "@/components/EmergencyCard";
import ServiceCard from "@/components/ServiceCard";
import { t, type TranslationKey } from "@/lib/i18n";
import type { Language, SampleService, ServiceType } from "@/lib/types";

type Props = {
  lang: Language;
  onClose: () => void;
};

const CITIES = [
  "Ankara",
  "İstanbul",
  "İzmir",
  "Gaziantep",
  "Hatay",
  "Şanlıurfa",
  "Adana",
  "Mersin",
  "Konya",
  "Kayseri",
] as const;

const NEED_TYPES: { value: ServiceType; label: TranslationKey }[] = [
  { value: "psychosocial", label: "need_psychosocial" },
  { value: "legal", label: "need_legal" },
  { value: "health", label: "need_health" },
  { value: "shelter", label: "need_shelter" },
];

// Three-step, consent-based referral panel (brief section 4, screen 4).
// Everything here runs in the browser: the selections are React state only
// and are never sent to the server (verify in the Network tab).
export default function ReferralFlow({ lang, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [city, setCity] = useState<string>(""); // "" = prefer not to say
  const [needs, setNeeds] = useState<ServiceType[]>([]);
  const [prefLang, setPrefLang] = useState<Language | "">("");

  const services = sampleServices as SampleService[];

  const results = useMemo(() => {
    let list = services;
    if (city) list = list.filter((s) => s.city === city || s.city === "online");
    if (needs.length > 0) list = list.filter((s) => s.types.some((ty) => needs.includes(ty)));
    if (prefLang) {
      // Services in the preferred language first; the rest still shown.
      list = [...list].sort(
        (a, b) => Number(b.languages.includes(prefLang)) - Number(a.languages.includes(prefLang)),
      );
    }
    return list;
  }, [services, city, needs, prefLang]);

  const toggleNeed = (value: ServiceType) =>
    setNeeds((prev) => (prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]));

  return (
    <section
      aria-labelledby="referral-title"
      className="fixed inset-0 z-[80] overflow-y-auto bg-canvas"
    >
      <div className="mx-auto w-full max-w-md px-4 pb-10 pt-20">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
          {t("referral_step_of", lang, { step })}
        </p>

        {step === 1 && (
          <div>
            <h2 id="referral-title" className="mb-4 text-xl font-bold">
              {t("consent_question", lang)}
            </h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="min-h-[48px] rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
              >
                {t("yes_continue", lang)}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] rounded-xl border border-line bg-surface px-4 font-semibold hover:bg-canvas"
              >
                {t("no_go_back", lang)}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="space-y-5"
          >
            <h2 id="referral-title" className="text-xl font-bold">
              {t("referral_note", lang)}
            </h2>

            <div>
              <label htmlFor="referral-city" className="mb-1 block text-base font-medium">
                {t("referral_city", lang)}
              </label>
              <select
                id="referral-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 text-base"
              >
                <option value="">{t("prefer_not_say", lang)}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="mb-1 text-base font-medium">{t("referral_need", lang)}</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {NEED_TYPES.map((n) => {
                  const checked = needs.includes(n.value);
                  return (
                    <label
                      key={n.value}
                      className={
                        "flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3 text-base " +
                        (checked ? "border-brand bg-brand-soft" : "border-line bg-surface")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleNeed(n.value)}
                        className="h-5 w-5 min-h-0 accent-brand"
                      />
                      {t(n.label, lang)}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1 text-base font-medium">{t("referral_language", lang)}</legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "", label: "prefer_not_say" },
                    { value: "tr", label: "language_tr" },
                    { value: "ar", label: "language_ar" },
                  ] as { value: Language | ""; label: TranslationKey }[]
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={
                      "flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 text-base " +
                      (prefLang === opt.value ? "border-brand bg-brand-soft" : "border-line bg-surface")
                    }
                  >
                    <input
                      type="radio"
                      name="pref-lang"
                      value={opt.value}
                      checked={prefLang === opt.value}
                      onChange={() => setPrefLang(opt.value)}
                      className="h-5 w-5 min-h-0 accent-brand"
                    />
                    {t(opt.label, lang)}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="min-h-[48px] rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
              >
                {t("show_options", lang)}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] rounded-xl border border-line bg-surface px-4 font-semibold hover:bg-canvas"
              >
                {t("back_to_chat", lang)}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p
              role="note"
              className="rounded-xl border-2 border-warn bg-warn-soft p-3 text-base font-bold text-warn"
            >
              {t("sample_data_label", lang)}
            </p>
            <h2 id="referral-title" className="sr-only">
              {t("show_options", lang)}
            </h2>

            {results.length === 0 ? (
              <div className="space-y-4">
                <p className="text-base">{t("no_results", lang)}</p>
                <EmergencyCard lang={lang} />
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((s) => (
                  <ServiceCard key={s.id} lang={lang} service={s} />
                ))}
              </div>
            )}

            <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand-dark">
              {t("handoff_simulated", lang)}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] w-full rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
            >
              {t("back_to_chat", lang)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

import { t, type TranslationKey } from "@/lib/i18n";
import type { Language, SampleService, ServiceType } from "@/lib/types";

type Props = { lang: Language; service: SampleService };

const TYPE_LABEL: Record<ServiceType, TranslationKey> = {
  psychosocial: "need_psychosocial",
  legal: "need_legal",
  health: "need_health",
  shelter: "need_shelter",
};

// Fictional sample data. The phone number is deliberately NOT a tel: link.
export default function ServiceCard({ lang, service }: Props) {
  const name = lang === "ar" ? service.name_ar : service.name_tr;
  const hours = lang === "ar" ? service.hours_ar : service.hours_tr;
  const city =
    service.city === "online"
      ? t("service_city_online", lang)
      : t(`city_${service.city}` as TranslationKey, lang);
  const languages = service.languages.map((l) => t(l === "ar" ? "language_ar" : "language_tr", lang));

  return (
    <article className="rounded-2xl border border-line bg-surface p-4">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-base text-muted">{city}</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-base">
        <dt className="text-muted">{t("service_types", lang)}</dt>
        <dd>{service.types.map((ty) => t(TYPE_LABEL[ty], lang)).join(", ")}</dd>
        <dt className="text-muted">{t("service_languages", lang)}</dt>
        <dd>{languages.join(", ")}</dd>
        <dt className="text-muted">{t("service_hours", lang)}</dt>
        <dd>{hours}</dd>
        <dt className="text-muted">{t("service_phone", lang)}</dt>
        <dd dir="ltr" className="text-start">
          {service.phone}
        </dd>
      </dl>
    </article>
  );
}

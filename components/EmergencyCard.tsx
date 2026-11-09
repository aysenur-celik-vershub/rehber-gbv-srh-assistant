import emergencyContacts from "@/config/emergency_contacts.json";
import { t } from "@/lib/i18n";
import type { EmergencyContact, Language } from "@/lib/types";

type Props = { lang: Language };

// A UI component fed by config/emergency_contacts.json. It does not depend on
// any AI output: when the keyword layer says "high", this card is shown even
// if every model call failed.
export default function EmergencyCard({ lang }: Props) {
  const contacts = emergencyContacts as EmergencyContact[];
  return (
    <section
      role="alert"
      aria-label={t("emergency_title", lang)}
      className="rounded-2xl border-2 border-alert bg-alert-soft p-4"
    >
      <h2 className="mb-3 text-xl font-bold text-alert">{t("emergency_title", lang)}</h2>
      <ul className="space-y-3">
        {contacts.map((c) => {
          const name = lang === "ar" ? c.name_ar : c.name_tr;
          const desc = lang === "ar" ? c.desc_ar : c.desc_tr;
          return (
            <li key={c.id} className="flex items-start gap-3">
              {c.number ? (
                <a
                  href={`tel:${c.number}`}
                  className="inline-flex min-h-[44px] min-w-[72px] shrink-0 items-center justify-center rounded-lg bg-alert px-3 text-xl font-bold text-white"
                  aria-label={`${c.number} ${name}`}
                >
                  {c.number}
                </a>
              ) : (
                <span className="inline-flex min-h-[44px] min-w-[72px] shrink-0 items-center justify-center rounded-lg bg-alert/15 px-3 text-base font-bold text-alert">
                  App
                </span>
              )}
              <div>
                <div className="text-base font-semibold">{name}</div>
                <div className="text-sm text-muted">{desc}</div>
                {c.whatsapp && (
                  <a
                    href={`https://wa.me/${c.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-[44px] items-center rounded-lg border border-alert/40 px-3 text-base font-semibold text-alert"
                    aria-label={`WhatsApp ${name}`}
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

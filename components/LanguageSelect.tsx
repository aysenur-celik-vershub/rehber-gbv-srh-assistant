"use client";

import type { Language } from "@/lib/types";

type Props = {
  value: Language | null;
  onChange: (lang: Language) => void;
  legend: string;
};

// Both buttons are always labelled in their own language, so a user who has
// not chosen yet can still read them.
export default function LanguageSelect({ value, onChange, legend }: Props) {
  const options: { lang: Language; label: string; dir: "ltr" | "rtl" }[] = [
    { lang: "tr", label: "Türkçe", dir: "ltr" },
    { lang: "ar", label: "العربية", dir: "rtl" },
  ];

  return (
    <fieldset className="w-full">
      <legend className="mb-3 text-center text-base text-muted">{legend}</legend>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const selected = value === o.lang;
          return (
            <button
              key={o.lang}
              type="button"
              lang={o.lang}
              dir={o.dir}
              aria-pressed={selected}
              onClick={() => onChange(o.lang)}
              className={
                "min-h-[56px] rounded-xl border-2 px-4 text-xl font-semibold " +
                (selected
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-surface text-ink hover:border-brand")
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";

type Props = {
  lang: Language;
  open: boolean;
  onClose: () => void;
};

// Closes with the X button or a click on the backdrop. Deliberately NOT on
// Escape: Esc is reserved for quick exit everywhere in the app.
export default function PrivacyModal({ lang, open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const paragraphs = [
    "privacy_p1",
    "privacy_p2",
    "privacy_p3",
    "privacy_p4",
    "privacy_p5",
    "privacy_p6",
  ] as const;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id="privacy-title" className="text-xl font-bold">
            {t("privacy_title", lang)}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("close", lang)}
            className="-me-2 -mt-2 min-h-[44px] min-w-[44px] rounded-lg text-2xl leading-none hover:bg-canvas"
          >
            ×
          </button>
        </div>
        <ul className="space-y-2 text-base">
          {paragraphs.map((key) => (
            <li key={key} className="flex gap-2">
              <span aria-hidden="true" className="text-brand">
                •
              </span>
              <span>{t(key, lang)}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          {t("close", lang)}
        </button>
      </div>
    </div>
  );
}

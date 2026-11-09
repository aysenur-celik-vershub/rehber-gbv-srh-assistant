"use client";

import { useEffect } from "react";

// A neutral, unrelated destination. location.replace() swaps the current
// history entry, so the browser's back button does not return to this app.
const EXIT_URL = "https://www.google.com/search?q=hava+durumu";

export function quickExit(): void {
  // Hide everything instantly, then leave without a history trace.
  document.title = " ";
  document.body.style.visibility = "hidden";
  window.location.replace(EXIT_URL);
}

export default function QuickExitButton({ label }: { label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") quickExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={quickExit}
      aria-label={label}
      className="fixed top-3 end-3 z-[100] min-h-[44px] min-w-[44px] rounded-lg bg-neutral-800 px-4 text-base font-semibold text-white shadow-md hover:bg-neutral-900"
    >
      {label}
    </button>
  );
}

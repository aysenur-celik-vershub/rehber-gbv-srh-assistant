"use client";

import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import PrivacyModal from "@/components/PrivacyModal";
import QuickExitButton from "@/components/QuickExitButton";
import Welcome from "@/components/Welcome";
import { dirOf, t } from "@/lib/i18n";
import type { Language } from "@/lib/types";

type Screen = "welcome" | "chat";

// Single page, single route. Screens are switched with state, never with the
// router, so the browser history has one neutral entry and the back button
// cannot bring a user back into the app after quick exit.
export default function Page() {
  const [lang, setLang] = useState<Language | null>(null);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Reflect the chosen language on <html lang dir>; nothing is persisted.
  useEffect(() => {
    const effective: Language = lang ?? "tr";
    document.documentElement.lang = effective;
    document.documentElement.dir = dirOf(effective);
  }, [lang]);

  const uiLang: Language = lang ?? "tr";

  return (
    <>
      <QuickExitButton label={lang ? t("quick_exit", lang) : "Hızlı Çıkış · خروج سريع"} />

      {screen === "welcome" && (
        <Welcome
          lang={lang}
          onSelectLanguage={setLang}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onStart={() => setScreen("chat")}
        />
      )}

      {screen === "chat" && lang && (
        <Chat
          lang={lang}
          onChangeLanguage={() => setLang(lang === "tr" ? "ar" : "tr")}
        />
      )}

      <PrivacyModal lang={uiLang} open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}

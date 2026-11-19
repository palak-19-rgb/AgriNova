
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import pa from "./locales/pa.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      pa: { translation: pa }
    },

    lng: localStorage.getItem("agrinova_language") || "en",
    fallbackLng: "en",

    supportedLngs: ["en", "hi", "pa"],

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

i18n.on("languageChanged", (language) => {
  localStorage.setItem("agrinova_language", language);
});

export default i18n;

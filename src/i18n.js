// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/setting.json";
import vi from "./locales/vi/setting.json";
import enHome from "./locales/en/home.json";
import viHome from "./locales/vi/home.json";
import viLesson from "./locales/vi/lesson.json";
import enLesson from "./locales/en/lesson.json";
import viCommon from "./locales/vi/common.json";
import enCommon from "./locales/en/common.json";
import viProfile from "./locales/vi/profile.json";
import enProfile from "./locales/en/profile.json";
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      setting: en,
      home: enHome,
      lesson: enLesson,
      common: enCommon,
      profile: enProfile,
    },
    vi: {
      setting: vi,
      home: viHome,
      lesson: viLesson,
      common: viCommon,
      profile: viProfile,
    },
  },

  interpolation: { escapeValue: false },
});

export default i18n;

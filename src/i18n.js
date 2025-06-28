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
import viExercise from "./locales/vi/exercise.json";
import enExercise from "./locales/en/exercise.json";
import viStatistic from "./locales/vi/statistic.json";
import enStatistic from "./locales/en/statistic.json";
import viPrivacy from "./locales/vi/privacy.json";
import enPrivacy from "./locales/en/privacy.json";
import viVerify from "./locales/vi/verify.json";
import enVerify from "./locales/en/verify.json";
import viLogin from "./locales/vi/login.json";
import enLogin from "./locales/en/login.json";
import viAccount from "./locales/vi/account.json";
import enAccount from "./locales/en/account.json";
import viRegister from "./locales/vi/register.json";
import enRegister from "./locales/en/register.json";
import viStepByStep from "./locales/vi/stepbystep.json";
import enStepByStep from "./locales/en/stepbystep.json";
import vidivision from "./locales/vi/division.json";
import endivision from "./locales/en/division.json";
import viaddition from "./locales/vi/addition.json";
import enaddition from "./locales/en/addition.json";

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
      exercise: enExercise,
      statistic: enStatistic,
      privacy: enPrivacy,
      verify: enVerify,
      login: enLogin,
      account: enAccount,
      register: enRegister,
      stepbystep: enStepByStep,
      division: endivision,
      addition: enaddition,
    },
    vi: {
      setting: vi,
      home: viHome,
      lesson: viLesson,
      common: viCommon,
      profile: viProfile,
      exercise: viExercise,
      statistic: viStatistic,
      privacy: viPrivacy,
      verify: viVerify,
      login: viLogin,
      account: viAccount,
      register: viRegister,
      stepbystep: viStepByStep,
      division: vidivision,
      addition: viaddition,
    },
  },

  interpolation: { escapeValue: false },
});

export default i18n;

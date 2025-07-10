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
import viGoal from "./locales/vi/goal.json";
import enGoal from "./locales/en/goal.json";
import viNotification from "./locales/vi/notification.json";
import enNotification from "./locales/en/notification.json";
import viSideBar from "./locales/vi/sidebar.json";
import enSideBar from "./locales/en/sidebar.json";
import viSkill from "./locales/vi/skill.json";
import enSkill from "./locales/en/skill.json";
import viTest from "./locales/vi/test.json";
import enTest from "./locales/en/test.json";
import viMultiplicationTable from "./locales/vi/multiplicationtable.json";
import enMultiplicationTable from "./locales/en/multiplicationtable.json";
import viLoading from "./locales/vi/loading.json";
import enLoading from "./locales/en/loading.json";
import viAssessment from "./locales/vi/assessment.json";
import enAssessment from "./locales/en/assessment.json";
import viTarget from "./locales/vi/target.json";
import enTarget from "./locales/en/target.json";
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
      goal: enGoal,
      notification: enNotification,
      sidebar: enSideBar,
      skill: enSkill,
      test: enTest,
      multiplicationtable: enMultiplicationTable,
      loading: enLoading,
      assessment: enAssessment,
      target: enTarget,
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
      goal: viGoal,
      notification: viNotification,
      sidebar: viSideBar,
      skill: viSkill,
      test: viTest,
      multiplicationtable: viMultiplicationTable,
      loading: viLoading,
      assessment: viAssessment,
      target: viTarget,
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;

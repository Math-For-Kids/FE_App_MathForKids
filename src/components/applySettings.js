export const applySettings = ({
  theme,
  mode,
  language,
  volume,
  switchThemeKey,
  toggleThemeMode,
  isDarkMode,
  setVolume,
  i18n,
}) => {
  const themeKey =
    theme === 1
      ? "theme1"
      : theme === 2
      ? "theme2"
      : theme === 3
      ? "theme3"
      : "theme1";
  switchThemeKey(themeKey);

  if ((mode === "dark") !== isDarkMode) toggleThemeMode();

  if (language && i18n.language !== language) {
    i18n.changeLanguage(language);
  }

  if (typeof volume === "number") {
    setVolume(volume / 100);
  }
};

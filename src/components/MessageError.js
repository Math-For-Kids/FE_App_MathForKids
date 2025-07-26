import React from "react";
import BaseMessage from "./BaseMessage";
import { useTheme } from "../themes/ThemeContext";

import { useTranslation } from "react-i18next";
export default function MessageError({ visible, title, description, onClose }) {
  const { theme } = useTheme();
  const { t } = useTranslation("loading");
  return (
    <BaseMessage
      visible={visible}
      image={theme.icons.error}
      title={title}
      description={description}
      onClose={onClose}
      themeColor="#e9584dff"
      borderColor="#e9584dff"
      buttonText={t("again")}
    />
  );
}

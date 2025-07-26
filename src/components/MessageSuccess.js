import React from "react";
import BaseMessage from "./BaseMessage";
import { useTheme } from "../themes/ThemeContext";
import { useTranslation } from "react-i18next";
export default function MessageSuccess({
  visible,
  title,
  description,
  onClose,
}) {
  const { theme } = useTheme();
  const { t } = useTranslation("loading");
  return (
    <BaseMessage
      visible={visible}
      image={theme.icons.ticksuccess} // hoặc hình success từ CDN
      title={title}
      description={description}
      onClose={onClose}
      themeColor="#4CAF50"
      borderColor="#4CAF50"
      buttonText={t("ok")}
    />
  );
}

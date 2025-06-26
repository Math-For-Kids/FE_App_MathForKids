import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useTranslation } from "react-i18next"; // Đảm bảo import đúng

export default function StepExplanationBox({
  stepIndex,
  currentStep,
  styles,
  getGradient,
  theme,
  t,
}) {
  const { i18n } = useTranslation(); // Đảm bảo lấy i18n từ hook useTranslation

  return (
    <View style={styles.titleContainer}>
      <LinearGradient colors={getGradient()} style={styles.soundContainer}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();

            if (stepIndex === 0) {
              Speech.speak(t("instruction.enter_numbers"), {
                language: i18n.language === "vi" ? "vi-VN" : "en-US",
                pitch: 1,
                rate: 0.9,
              });
            } else if (currentStep?.title || currentStep?.description) {
              const speechText = `${currentStep.title || ""}. ${
                currentStep.description || ""
              }`;

              Speech.speak(speechText, {
                language: i18n.language === "vi" ? "vi-VN" : "en-US",
                pitch: 1,
                rate: 0.9,
              });
            }
          }}
        >
          <Ionicons name="volume-medium" size={30} color={theme.colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {stepIndex === 0 ? (
        <Text style={styles.title}>{t("instruction.enter_numbers")}</Text>
      ) : (
        currentStep?.title && (
          <Text
            style={styles.title}
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {currentStep.title}
            {"\n"}
            {currentStep.description}
          </Text>
        )
      )}
    </View>
  );
}

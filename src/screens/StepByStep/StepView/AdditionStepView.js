import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";
import { useTranslation } from "react-i18next";

export const AdditionStepView = ({
  steps,
  placeLabels,
  skillName,
  columnStepIndex,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation("stepbystep");

  const currentStep = columnStepIndex ?? 0;
  if (!steps[2]?.digitSums) return null;
  // console.log("currentStep", currentStep);
  const totalSteps = steps[2].digitSums.length + 1;
  const labels = placeLabels.slice(0, steps[2].digitSums.length);
  const subTextLines = Array.isArray(steps[2].subText) ? steps[2].subText : [];

  const activeColor = theme.colors.orangeDark;
  const defaultColor = theme.colors.black;
  const carryColor = theme.colors.blueGray;

  const getSkillColor = () => {
    switch (skillName) {
      case "Addition":
        return theme.colors.GreenDark;
      case "Subtraction":
        return theme.colors.purpleDark;
      case "Multiplication":
        return theme.colors.orangeDark;
      case "Division":
        return theme.colors.redDark;
      default:
        return theme.colors.pinkDark;
    }
  };

  useEffect(() => {
    const line = subTextLines[Math.max(0, currentStep)];
    if (line) {
      const lang = i18n.language === "vi" ? "vi-VN" : "en-US";
      Speech.stop();
      Speech.speak(line, { language: lang });
    }
  }, [currentStep]);

  const speakCurrentLine = (stepIndex) => {
    const line = subTextLines[Math.max(0, stepIndex)];
    if (line) {
      const lang = i18n.language === "vi" ? "vi-VN" : "en-US";
      Speech.stop();
      Speech.speak(line, { language: lang });
    }
  };

  useEffect(() => {
    speakCurrentLine(currentStep);
  }, [currentStep]);

  const styles = StyleSheet.create({
    container: { alignItems: "center" },
    row: { flexDirection: "row-reverse", marginBottom: 4 },
    labelText: {
      width: 50, textAlign: "center", fontSize: 8,
      fontFamily: Fonts.NUNITO_BLACK, color: theme.colors.grayDark,
    },
    carryText: {
      width: 50, textAlign: "center", fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    num1Text: {
      width: 50, textAlign: "center", fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    num2Text: {
      width: 50, textAlign: "center", fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    lineRow: { marginTop: 2 },
    resultText: {
      width: 50, textAlign: "center", fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    explanationText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
      marginTop: 8,
      marginHorizontal: 12,
      textAlign: "center",
    },
    finalResultText: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BLACK,
      color: "red",
      marginTop: 10,
    },
    line: {
      height: 2,
      backgroundColor: theme.colors.grayDark,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      {/* Explanation text (intro or step) */}
      {currentStep >= -1 && currentStep < totalSteps && (
        <>
          <Text style={styles.explanationText}>
            {subTextLines[Math.max(0, currentStep)]}
          </Text>
        </>
      )}

      {/* Row 1: Place Labels */}
      <View style={styles.row}>
        {labels.map((label, i) => (
          <Text key={`label-${i}`} style={styles.labelText}>
            {label}
          </Text>
        ))}
      </View>

      {/* Row 2: Carry Digits */}
      <View style={styles.row}>
        {steps[2].carryDigits
          .slice()
          .reverse()
          .map((carry, i) => {
            const highlight = carry > 0 && currentStep >= i;
            return (
              <Text
                key={`carry-${i}`}
                style={[
                  styles.carryText,
                  { color: highlight ? activeColor : carryColor },
                ]}
              >
                {highlight ? carry : " "}
              </Text>
            );
          })}
      </View>

      {/* Row 3: Number 1 Digits */}
      <View style={styles.row}>
        {steps[2].digits1
          .slice()
          .reverse()
          .map((digit, i) => (
            <Text
              key={`num1-${i}`}
              style={[
                styles.num1Text,
                {
                  color:
                    currentStep >= 1 && currentStep - 1 === i
                      ? getSkillColor()
                      : defaultColor,
                },
              ]}
            >
              {digit}
            </Text>
          ))}
      </View>

      {/* Row 4: + symbol spacer */}
      <View style={styles.row}>
        {steps[2].digits2
          .slice()
          .reverse()
          .map((_, i) => (
            <Text
              key={`spacer-${i}`}
              style={[
                styles.num2Text,
                i === steps[2].digits2.length - 1 && { marginRight: 50 },
              ]}
            >
              {i === steps[2].digits2.length - 1 ? "+" : " "}
            </Text>
          ))}
      </View>

      {/* Row 5: Number 2 Digits */}
      <View style={styles.row}>
        {steps[2].digits2
          .slice()
          .reverse()
          .map((digit, i) => (
            <Text
              key={`num2-${i}`}
              style={[
                styles.num2Text,
                {
                  color:
                    currentStep >= 1 && currentStep - 1 === i
                      ? getSkillColor()
                      : defaultColor,
                },
              ]}
            >
              {digit}
            </Text>
          ))}
      </View>

      {/* Row 6: Line */}
      <View style={styles.row}>
        <View
          style={[styles.line, { width: 50 * steps[2].digitSums.length }]}
        />
      </View>

      {/* Row 7: Result Sums */}
      <View style={styles.row}>
        {steps[2].digitSums
          .slice()
          .reverse()
          .map((digit, i) => (
            <TouchableOpacity
              key={`sum-${i}`}
              onPress={() => {
                const toSpeak = subTextLines[i + 1];
                if (toSpeak) {
                  const lang = i18n.language === "vi" ? "vi-VN" : "en-US";
                  Speech.speak(toSpeak, { language: lang });
                }
              }}
            >
              <Text
                style={[
                  styles.resultText,
                  {
                    color:
                      currentStep >= 1 && currentStep - 1 === i
                        ? getSkillColor()
                        : theme.colors.black,
                  },
                ]}
              >
                {currentStep > i ? digit : "?"}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* Final result */}
      {currentStep === totalSteps && (
        <>
          <Text style={styles.explanationText}>{steps[3].subText}</Text>
          <Text style={styles.finalResultText}>
            {steps[2].digitSums.join("")}
          </Text>
        </>
      )}
    </View>
  );
};
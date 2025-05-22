import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";

export const SubtractionStepView = ({ steps, placeLabels, skillName }) => {
  const { theme } = useTheme();
  if (!steps[2]?.resultDigits) return null;

  const speakLine = (i) => {
    const lines = steps[2].subText.split("\n");
    const toSpeak = lines[steps[2].resultDigits.length - 1 - i];
    if (toSpeak) {
      Speech.speak(toSpeak, { language: "en-US" });
    }
  };

  const reversedLabels = [...placeLabels]
    .slice(0, steps[2].resultDigits.length)
    .reverse();

  const getSkillColor = () => {
    if (skillName === "Addition") return theme.colors.GreenDark;
    if (skillName === "Subtraction") return theme.colors.purpleDark;
    if (skillName === "Multiplication") return theme.colors.orangeDark;
    if (skillName === "Division") return theme.colors.redDark;
    return theme.colors.pinkDark;
  };
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: 10,
    },
    row: {
      flexDirection: "row",
      marginBottom: 4,
    },
    labelText: {
      width: 60,
      textAlign: "center",
      fontSize: 10,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    paybackText: {
      width: 60,
      textAlign: "center",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    minuendText: {
      width: 60,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    subtrahendText: {
      width: 60,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    lineRow: {
      marginTop: 2,
    },
    lineText: {
      width: 60,
      textAlign: "center",
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    resultText: {
      width: 60,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: getSkillColor(),
    },
  });
  return (
    <View style={styles.container}>
      {/* Hàng nhãn đơn vị */}
      <View style={styles.row}>
        {steps[2].resultDigits.map((_, i) => (
          <Text key={`label-sub-${i}`} style={styles.labelText}>
            {reversedLabels[i] || `10^${i}`}
          </Text>
        ))}
      </View>

      {/* Dòng hoàn trả */}
      <View style={styles.row}>
        {steps[2].payBackFlags?.map((pay, i) => (
          <Text key={`payback-${i}`} style={styles.paybackText}>
            {pay ? "1" : " "}
          </Text>
        ))}
      </View>

      {/* Số bị trừ */}
      <View style={styles.row}>
        {steps[2].digits1.map((digit, i) => (
          <Text key={`minuend-${i}`} style={styles.minuendText}>
            {digit}
          </Text>
        ))}
      </View>

      {/* Số trừ */}
      <View style={styles.row}>
        {steps[2].digits2.map((digit, i) => (
          <Text key={`subtrahend-${i}`} style={styles.subtrahendText}>
            {digit}
          </Text>
        ))}
      </View>

      {/* Gạch ngang */}
      <View style={[styles.row, styles.lineRow]}>
        {steps[2].digits1.map((_, i) => (
          <Text key={`line-sub-${i}`} style={styles.lineText}>
            ―
          </Text>
        ))}
      </View>

      {/* Kết quả */}
      <View style={styles.row}>
        {steps[2].resultDigits.map((digit, i) => (
          <TouchableOpacity
            key={`result-digit-${i}`}
            onPress={() => speakLine(i)}
          >
            <Text style={styles.resultText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

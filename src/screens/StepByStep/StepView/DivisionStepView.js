import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";
export const AdditionStepView = ({ steps, placeLabels, skillName }) => {
  const { theme } = useTheme();
  if (!steps[2]?.digitSums) return null;
  const labels = [...placeLabels].slice(-steps[2].digitSums.length);
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
      width: 50,
      textAlign: "center",
      fontSize: 8,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    carryText: {
      width: 50,
      textAlign: "center",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.blueGray,
    },
    num1Text: {
      width: 50,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    num2Text: {
      width: 50,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    lineRow: {
      marginTop: 2,
    },
    lineText: {
      width: 50,
      textAlign: "center",
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    resultText: {
      width: 50,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: getSkillColor(),
    },
  });

  return (
    <View style={styles.container}>
      {/* Cột tên đơn vị */}
      <View style={styles.row}>
        {labels.map((label, i) => (
          <Text key={`label-${i}`} style={styles.labelText}>
            {label}
          </Text>
        ))}
      </View>

      {/* Dòng số nhớ */}
      <View style={styles.row}>
        {steps[2].carryDigits.map((carry, i) => (
          <Text key={`carry-${i}`} style={styles.carryText}>
            {carry > 0 ? carry : " "}
          </Text>
        ))}
      </View>

      {/* Số thứ nhất */}
      <View style={styles.row}>
        {steps[2].digits1.map((digit, i) => (
          <Text key={`num1-${i}`} style={styles.num1Text}>
            {digit}
          </Text>
        ))}
      </View>

      {/* Số thứ hai */}
      <View style={styles.row}>
        {steps[2].digits2.map((digit, i) => (
          <Text key={`num2-${i}`} style={styles.num2Text}>
            {digit}
          </Text>
        ))}
      </View>
{/* Gạch ngang */}
      <View style={[styles.row, styles.lineRow]}>
        {steps[2].digitSums.map((_, i) => (
          <Text key={`line-${i}`} style={styles.lineText}>
            ―
          </Text>
        ))}
      </View>

      {/* Kết quả */}
      <View style={styles.row}>
        {steps[2].digitSums.map((digit, i) => (
          <TouchableOpacity
            key={`sum-${i}`}
            onPress={() => {
              const lines = steps[2].subText?.split("\n") || [];
              const toSpeak = lines[lines.length - 1 - i];
              if (toSpeak) {
                Speech.speak(toSpeak, { language: "en-US" });
              }
            }}
          >
            <Text style={styles.resultText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";

export const SubtractionStepView = ({
  steps,
  placeLabels,
  skillName,
  revealedResultDigits,
  setRevealedResultDigits,
  subStepIndex,
  t,
}) => {
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
  const getPlaceColor = (indexFromRight) => {
    switch (indexFromRight) {
      case 0:
        return theme.colors.red;
      case 1:
        return theme.colors.orangeLight;
      case 2:
        return theme.colors.greenDark;
      case 3:
        return theme.colors.blueDark;
      case 4:
        return theme.colors.yellowLight;
      default:
        return theme.colors.black;
    }
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
      width: 55,
      textAlign: "center",
      fontSize: 10,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    paybackText: {
      width: 55,
      textAlign: "center",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    minuendText: {
      width: 55,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    subtrahendText: {
      width: 55,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    lineRow: {
      marginTop: 2,
    },
    lineText: {
      width: 55,
      textAlign: "center",
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
    },
    resultText: {
      width: 55,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: getSkillColor(),
    },
    operatorSymbol: {
      fontSize: 24,
      textAlign: "left",
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
  });
  return (
    <View style={styles.container}>
      {/* Hàng nhãn đơn vị */}
      <View style={styles.row}>
        {steps[2].resultDigits.map((_, i) => {
          const indexFromRight = steps[2].resultDigits.length - 1 - i;
          return (
            <Text
              key={`label-sub-${i}`}
              style={[
                styles.labelText,
                { color: getPlaceColor(indexFromRight) },
              ]}
            >
              {reversedLabels[i] || `10^${i}`}
            </Text>
          );
        })}
      </View>

      {/* Dòng hoàn trả */}
      <View style={styles.row}>
        {steps[2].payBackFlags?.map((pay, i) => {
          const indexFromRight = steps[2].payBackFlags.length - 1 - i;
          const shouldReveal =
            i + 1 >= steps[2].payBackFlags.length - subStepIndex; // Bấm Next mới hiện từng ô
          return (
            <Text
              key={`payback-${i}`}
              style={[
                styles.paybackText,
                {
                  color: getPlaceColor(indexFromRight),
                  opacity: shouldReveal ? 1 : 0, // Ẩn hoàn toàn khi chưa tới lượt
                },
              ]}
            >
              {pay ? "1" : " "}
            </Text>
          );
        })}
      </View>

      {/* Số bị trừ */}
      <View style={styles.row}>
        {steps[2].digits1.map((digit, i) => {
          const indexFromRight = steps[2].digits1.length - 1 - i;
          return (
            <Text
              key={`minuend-${i}`}
              style={[
                styles.minuendText,
                { color: getPlaceColor(indexFromRight) },
              ]}
            >
              {digit}
            </Text>
          );
        })}
      </View>
      {/* Dòng chứa dấu "-" */}
      <View style={styles.row}>
        <Text
          style={[
            styles.operatorSymbol,
            {
              width: steps[2].digits1.length * 55,
              color: theme.colors.black,
            },
          ]}
        >
          -
        </Text>
      </View>
      {/* Số trừ */}
      <View style={styles.row}>
        {steps[2].digits2.map((digit, i) => {
          const indexFromRight = steps[2].digits2.length - 1 - i;
          return (
            <Text
              key={`subtrahend-${i}`}
              style={[
                styles.subtrahendText,
                { color: getPlaceColor(indexFromRight) },
              ]}
            >
              {digit}
            </Text>
          );
        })}
      </View>

      {/* Gạch ngang */}
      <View
        style={{
          height: 2,
          backgroundColor: theme.colors.grayDark,
          width: steps[2].digits1.length * 55, // hoặc maxLen * 55 nếu cần
          marginVertical: 6,
        }}
      />

      {/* Kết quả */}
      <View style={styles.row}>
        {steps[2].resultDigits.map((digit, i) => {
          const indexFromRight = steps[2].resultDigits.length - 1 - i;
          const shouldReveal =
            i >= steps[2].resultDigits.length - revealedResultDigits;
          return (
            <TouchableOpacity
              key={`result-digit-${i}`}
              onPress={() => {
                const lines = steps[2].subText.split("\n");
                const toSpeak = lines[subStepIndex]; // dùng subStepIndex
                if (
                  i === steps[2].resultDigits.length - revealedResultDigits &&
                  toSpeak
                ) {
                  Speech.speak(toSpeak, { language: "en-US" });
                }
              }}
            >
              <Text
                style={[
                  styles.resultText,
                  { color: getPlaceColor(indexFromRight) },
                ]}
              >
                {shouldReveal ? digit : "?"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";
import { useTranslation } from "react-i18next";
export const SubtractionStepView = ({
  steps,
  placeLabels,
  skillName,
  revealedResultDigits,
  subStepIndex,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation("stepbystep");
  if (!steps[2]?.resultDigits) return null;
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
  const getActiveColor = (indexFromRight) => {
    const activeColumnIndex = steps[2].subStepsMeta?.[subStepIndex] ?? -2;
    return indexFromRight === activeColumnIndex
      ? getSkillColor()
      : theme.colors.grayDark;
  };
  useEffect(() => {
    const currentText = steps[2].subSteps?.[subStepIndex];
    if (currentText) {
      const lang = i18n.language;
      let toSpeakClean = currentText;
      if (lang === "vi") {
        toSpeakClean = toSpeakClean
          .replace(/ - /g, " trừ ")
          .replace(/ = /g, " bằng ");
      } else if (lang === "en") {
        toSpeakClean = toSpeakClean
          .replace(/ - /g, " minus ")
          .replace(/ = /g, " equals ");
      }
      Speech.speak(toSpeakClean, {
        language: lang === "vi" ? "vi-VN" : "en-US",
      });
    }
  }, [subStepIndex]);
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
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.grayDark,
    },
    paybackText: {
      width: 55,
      textAlign: "center",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    minuendText: {
      width: 55,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    subtrahendText: {
      width: 55,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    resultText: {
      width: 55,
      textAlign: "center",
      fontSize: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    operatorSymbol: {
      fontSize: 24,
      textAlign: "left",
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
    },
  });
  return (
    <View style={styles.container}>
      {/* Giải thích bước hiện tại */}
      {steps[2].subSteps?.[subStepIndex] && (
        <View style={{ marginVertical: 8, paddingHorizontal: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.NUNITO_MEDIUM,
              color: getSkillColor(),
              textAlign: "center",
            }}
          >
            {steps[2].subSteps[subStepIndex]}
          </Text>
        </View>
      )}
      {/* Hàng nhãn vị trí */}
      <View style={styles.row}>
        {steps[2].resultDigits.map((_, i) => {
          const indexFromRight = steps[2].resultDigits.length - 1 - i;
          return (
            <Text key={`label-sub-${i}`} style={styles.labelText}>
              {reversedLabels[i] || `10^${i}`}
            </Text>
          );
        })}
      </View>
      {/* Dòng số bị trừ (minuend) */}
      <View style={styles.row}>
        {steps[2].digits1.map((digit, i) => {
          const indexFromRight = steps[2].digits1.length - 1 - i;
          return (
            <Text
              key={`minuend-${i}`}
              style={[
                styles.minuendText,
                { color: getActiveColor(indexFromRight) },
              ]}
            >
              {digit}
            </Text>
          );
        })}
      </View>
      {/* Dấu trừ */}
      <View style={styles.row}>
        <Text
          style={[
            styles.operatorSymbol,
            { width: steps[2].digits1.length * 55 },
          ]}
        >
          -
        </Text>
      </View>
      {/* Dòng hoàn trả nếu có */}
      <View style={styles.row}>
        {steps[2].payBackFlags?.map((pay, i) => {
          const indexFromRight = steps[2].payBackFlags.length - 1 - i;

          // Tìm bước cuối cùng (subStepIndex) của cột TRƯỚC ĐÓ
          const previousColumn = indexFromRight - 2;
          const previousMeta = steps[2].subStepsMeta
            .map((colIndex, idx) => ({ idx, colIndex }))
            .filter((m) => m.colIndex === previousColumn)
            .map((m) => m.idx)
            .pop(); //Bước cuối cùng của cột trước đó

          //Chỉ hiển thị nếu đã vượt qua bước cuối cùng của cột trước đó
          const shouldReveal =
            previousMeta !== undefined && subStepIndex > previousMeta;

          return (
            <Text
              key={`payback-${i}`}
              style={[
                styles.paybackText,
                {
                  color: theme.colors.grayDark,
                  opacity: shouldReveal ? 1 : 0,
                },
              ]}
            >
              {pay ? "1" : " "}
            </Text>
          );
        })}
      </View>

      {/* Dòng số trừ (subtrahend) */}
      <View style={styles.row}>
        {steps[2].digits2.map((digit, i) => {
          const indexFromRight = steps[2].digits2.length - 1 - i;
          return (
            <Text
              key={`subtrahend-${i}`}
              style={[
                styles.subtrahendText,
                { color: getActiveColor(indexFromRight) },
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
          width: steps[2].digits1.length * 55,
          marginVertical: 6,
        }}
      />
      <View style={styles.row}>
        {steps[2].resultDigits.map((digit, i) => {
          const indexFromRight = steps[2].resultDigits.length - 1 - i;
          const shouldReveal =
            i >= steps[2].resultDigits.length - revealedResultDigits;
          return (
            <TouchableOpacity
              key={`result-digit-${i}`}
              onPress={() => {
                const toSpeak = steps[2].subSteps?.[subStepIndex];
                if (
                  i === steps[2].resultDigits.length - revealedResultDigits &&
                  toSpeak
                ) {
                  Speech.speak(toSpeak, { language: "vi-VN" });
                }
              }}
            >
              <Text
                style={[
                  styles.resultText,
                  { color: getActiveColor(indexFromRight) },
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

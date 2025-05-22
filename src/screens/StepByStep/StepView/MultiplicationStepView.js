import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";

export const MultiplicationStepView = ({ steps, stepIndex, skillName }) => {
  const { theme } = useTheme();
  if (!(stepIndex === 2 && steps[2]?.partials)) return null;

  const maxRowLength = Math.max(
    ...steps[2].partials.map((p) => p.length),
    steps[2].carryRows.map((r) => r.length).reduce((a, b) => Math.max(a, b), 0),
    steps[2].digits.length + 1,
    steps[2].multiplierDigits.length + 1
  );

  const maxLen = maxRowLength;
  const digits = steps[2].digits;
  const multiplierDigits = steps[2].multiplierDigits;
  const carryRows = steps[2].carryRows;

  const getSkillColor = () => {
    if (skillName === "Addition") return theme.colors.GreenDark;
    if (skillName === "Subtraction") return theme.colors.purpleDark;
    if (skillName === "Multiplication") return theme.colors.orangeDark;
    if (skillName === "Division") return theme.colors.redDark;
    return theme.colors.pinkDark;
  };
  const getPartialRowColor = () => {
    if (skillName === "Addition") return theme.colors.greenLight;
    if (skillName === "Subtraction") return theme.colors.purpleLight;
    if (skillName === "Multiplication") return theme.colors.orangeLight;
    if (skillName === "Division") return theme.colors.redLight;
    return theme.colors.pinkLight;
  };
  const renderRow = (
    values,
    pad,
    onPressRow = null,
    offsetLeft = 0,
    style = styles.defaultText
  ) => {
    const rowContent = (
      <View style={[styles.rowContainer, { left: offsetLeft }]}>
        {Array.from({ length: pad }).map((_, i) => (
          <Text key={`pad-${i}`} style={styles.charWidth} />
        ))}
        {values.map((val, i) => (
          <Text key={`val-${i}`} style={[styles.textBase, style]}>
            {val}
          </Text>
        ))}
      </View>
    );

    return onPressRow ? (
      <TouchableOpacity onPress={onPressRow}>{rowContent}</TouchableOpacity>
    ) : (
      rowContent
    );
  };
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: 10,
    },
    rowContainer: {
      flexDirection: "row",
    },
    multiplicandRow: {
      marginBottom: 8,
    },
    charWidth: {
      width: 16,
    },
    textBase: {
      width: 16,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_BLACK,
    },
    digitsRow: {
      fontSize: 22,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    carryRow: {
      fontSize: 14,
      color: theme.colors.blueGray,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    partialRow: {
      fontSize: 22,
      color: getPartialRowColor(),
      fontFamily: Fonts.NUNITO_BLACK,
    },
    resultRow: {
      fontSize: 22,
      color: "#d35400",
      color: getSkillColor(),
      fontFamily: Fonts.NUNITO_BLACK,
    },
    multiplySign: {
      width: 16,
      textAlign: "center",
      fontSize: 22,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    multiplierDigit: {
      width: 16,
      textAlign: "center",
      fontSize: 22,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    divider: {
      height: 2,
      backgroundColor: theme.colors.grayDark,
      marginVertical: 4,
    },
    defaultText: {
      fontSize: 22,
      color: getSkillColor(),
      fontFamily: Fonts.NUNITO_BLACK,
    },
  });
  return (
    <View style={styles.container}>
      {/* Số bị nhân */}
      <View style={styles.multiplicandRow}>
        {renderRow(digits, maxLen - digits.length, null, 0, styles.digitsRow)}
      </View>

      {/* Số nhân */}
      <View style={styles.rowContainer}>
        {Array.from({ length: maxLen - multiplierDigits.length - 1 }).map(
          (_, i) => (
            <Text key={`pad-x-${i}`} style={styles.charWidth} />
          )
        )}
        <Text style={styles.multiplySign}>×</Text>
        {multiplierDigits.map((d, i) => (
          <Text key={`mul-${i}`} style={styles.multiplierDigit}>
            {d}
          </Text>
        ))}
      </View>

      {/* Gạch ngang */}
      <View style={[styles.divider, { width: maxLen * 16 }]} />

      {/* Các dòng nhân */}
      {steps[2].partials.map((partial, i) => {
        const partialChars = partial.toString().split("");
        const padPartial = maxLen - partialChars.length;
        const offsetCarryLeft = (maxLen - carryRows[i].length - 1) * 16;
        const subSteps = steps[2]?.subSteps || [];

        return (
          <View key={`line-${i}`}>
            {/* Dòng số nhớ */}
            {carryRows[i] &&
              renderRow(
                carryRows[i],
                0,
                null,
                offsetCarryLeft,
                styles.carryRow
              )}

            {/* Dòng kết quả tạm */}
            {renderRow(
              partialChars,
              padPartial,
              () => {
                const stepToRead = subSteps[i];
                if (stepToRead) {
                  Speech.speak(stepToRead, {
                    language: "en-US",
                    pitch: 1.2,
                    rate: 0.8,
                  });
                }
              },
              0,
              styles.partialRow
            )}
          </View>
        );
      })}

      {/* Kết quả cuối */}
      {steps[2].partials.length > 1 && (
        <>
          <View style={[styles.divider, { width: maxLen * 16 }]} />
          {renderRow(steps[3].result.split(""), 0, null, 0, styles.resultRow)}
        </>
      )}
    </View>
  );
};

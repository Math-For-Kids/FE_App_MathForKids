import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";

export const MultiplicationStepView = ({
  steps,
  stepIndex,
  skillName,
  currentRowIndex,
  setCurrentRowIndex,
  revealedDigits,
  setRevealedDigits,
  revealedResultDigits,
  setRevealedResultDigits,
  multiplier1,
  multiplier2,
}) => {
  const { theme } = useTheme();
  const positionLabels = steps[2]?.positionLabels || [];
  const resultChars = steps[3].result.split("");
  const len1 = multiplier1?.length || 1;
  const len2 = multiplier2?.length || 1;
  const maxLength = Math.max(len1, len2);
  // Tính margin dựa vào số dài hơn
  const dynamicMarginRight = Math.min(150, 20 + maxLength * 40);
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

  if (!(stepIndex === 2 && steps[2]?.partials)) return null;

  const maxRowLength = Math.max(
    ...steps[2].partials.map((p) => p.length),
    steps[2].carryRows.map((r) => r.length).reduce((a, b) => Math.max(a, b), 0),
    steps[2].digits.length + 1,
    steps[2].multiplierDigits.length + 1
  );

  const allRowLengths = [
    ...(steps[2]?.partials?.map((p) => p.length) ?? []),
    ...(steps[2]?.carryRows?.map((r) => r.length) ?? []),
    steps[2]?.digits?.length ?? 0,
    steps[2]?.multiplierDigits?.length ?? 0,
    steps[3]?.result?.length ?? 0,
  ];

  const maxLen = Math.max(...allRowLengths);
  const digits = steps[2].digits;
  const multiplierDigits = steps[2].multiplierDigits;
  const carryRows = steps[2].carryRows;
  const padResult = Math.max(maxLen - resultChars.length, 0);
  console.log("maxLen", maxLen);
  console.log("resultLen", steps[3].result.length);
  console.log("padResult", padResult);
  console.log("maxRowLength", maxRowLength);
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
        {values.map((val, i) => {
          const indexFromRight = values.length - 1 - i;
          const digitColor = getPlaceColor(indexFromRight);
          return (
            <Text
              key={`val-${i}`}
              style={[styles.textBase, style, { color: digitColor }]}
            >
              {val}
            </Text>
          );
        })}
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
    charWidth: {
      width: 65,
    },
    textBase: {
      width: 65,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_BLACK,
    },
    digitsRow: {
      width: 65,
      textAlign: "center",
      fontSize: 22,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    carryRow: {
      fontSize: 12,
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
      color: getSkillColor(),
      fontFamily: Fonts.NUNITO_BLACK,
    },
    multiplySign: {
      fontSize: 20,
      textAlign: "left",
      marginRight: dynamicMarginRight,
      width: 65,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    multiplierDigit: {
      width: 65,
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
    navButtonText: {
      fontSize: 16,
      color: theme.colors.blueDark,
      marginTop: 12,
    },
    positionLabel: {
      width: 65, // hoặc tính toán theo max label length * 8
      textAlign: "center",
      fontSize: 12,
      fontFamily: Fonts.NUNITO_BLACK,
    },
  });

  return (
    <View style={styles.container}>
      {/* Hàng label vị trí chữ số (hiển thị phía trên) */}
      <View style={styles.rowContainer}>
        {Array.from({ length: maxLen - steps[3].result.length }).map((_, i) => (
          <Text key={`pad-label-${i}`} style={styles.charWidth} />
        ))}
        {steps[3].result.split("").map((_, i) => {
          const labelIndex = positionLabels.length - steps[3].result.length + i;
          const label =
            positionLabels[labelIndex] ||
            `10^${steps[3].result.length - 1 - i}`;
          const labelColor = getPlaceColor(steps[3].result.length - 1 - i);
          return (
            <Text
              key={`label-${i}`}
              style={[styles.positionLabel, { color: labelColor }]}
            >
              {label}
            </Text>
          );
        })}
      </View>

      {/* Dòng 1: Số bị nhân */}
      <View style={styles.rowContainer}>
        {Array.from({ length: maxLen - digits.length }).map((_, i) => (
          <Text key={`pad-digit-${i}`} style={styles.charWidth} />
        ))}
        {digits.map((d, i) => (
          <Text key={`digit-${i}`} style={styles.digitsRow}>
            {d}
          </Text>
        ))}
      </View>

      {/* Dòng 2: dấu × */}
      <View style={{ width: maxLen * 65 }}>
        <Text style={styles.multiplySign}>×</Text>
      </View>

      {/* Dòng 3: Số nhân */}
      <View style={styles.rowContainer}>
        {Array.from({ length: maxLen - multiplierDigits.length }).map(
          (_, i) => (
            <Text key={`pad-mul-${i}`} style={styles.charWidth} />
          )
        )}
        {multiplierDigits.map((d, i) => (
          <Text key={`mul-${i}`} style={styles.multiplierDigit}>
            {d}
          </Text>
        ))}
      </View>

      <View style={[styles.divider, { width: maxLen * 65 }]} />

      {/* Các dòng nhân và số nhớ */}
      {steps[2].partials.map((partial, i) => {
        const fullChars = partial.split("");
        const subSteps = steps[2]?.subText || [];
        const shiftLeft = 1;
        const padPartial = Math.max(
          0,
          maxLen -
            fullChars.length -
            (steps[2].partials.length - 1 - i) -
            shiftLeft
        );

        const offsetCarryLeft =
          (maxLen - carryRows[i].length - 1 - shiftLeft) * 65;

        console.log("Dòng:", i);
        console.log("fullChars", fullChars);
        console.log("padPartial", padPartial);
        console.log("carryRowLen", carryRows[i].length);
        console.log("offsetCarryLeft", offsetCarryLeft);

        const partialChars =
          i < currentRowIndex
            ? fullChars
            : i === currentRowIndex
            ? fullChars.map((char, idx) =>
                idx >= fullChars.length - revealedDigits ? char : "?"
              )
            : fullChars.map(() => "?");

        const carryRow = carryRows[i].map((val, idx) => {
          const digitIndexFromRight = carryRows[i].length - 1 - idx;
          const isVisible =
            i < currentRowIndex ||
            (i === currentRowIndex && digitIndexFromRight < revealedDigits);
          return val !== " " && Number(val) > 0 && isVisible ? val : " ";
        });

        return (
          <View key={`line-${i}`}>
            {/* HÀNG CARRY */}
            <View
              style={{
                width: maxLen * 65,
                alignItems: "flex-end",
                marginLeft: -65 * shiftLeft,
              }}
            >
              {renderRow(carryRow, padPartial, null, 0, styles.carryRow)}
            </View>

            {/* HÀNG PARTIAL */}
            <View style={{ width: maxLen * 65, alignItems: "flex-end" }}>
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

            {/* DẤU + */}
            {i < steps[2].partials.length - 1 && (
              <View style={{ width: maxLen * 65 }}>
                <Text style={styles.multiplySign}>+</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Dòng tổng kết quả */}
      {steps[2].partials.length > 1 && (
        <>
          <View style={[styles.divider, { width: maxLen * 65 }]} />

          {renderRow(
            resultChars.map((char, idx) =>
              idx >= resultChars.length - revealedResultDigits ? char : "?"
            ),
            padResult,
            null,
            0,
            styles.resultRow
          )}
        </>
      )}
    </View>
  );
};

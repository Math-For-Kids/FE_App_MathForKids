import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";
function getVisibleCharsFromRight(paddedChars, revealCount) {
  const visibleChars = [...paddedChars];
  let revealed = 0;

  for (let j = paddedChars.length - 1; j >= 0; j--) {
    const char = paddedChars[j];
    if (char.trim() === "") continue;

    if (revealed < revealCount) {
      revealed++;
    } else {
      visibleChars[j] = "?";
    }
  }

  return visibleChars;
}

export const MultiplicationStepView = ({
  subStepIndex,
  steps,
  visibleDigitsMap = {},
  visibleCarryMap = {},
  currentRowIndex,
  revealedDigits,
  skillName,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation("stepbystep");
  const subSteps = steps?.[2]?.subSteps || [];
  const subStepsMeta = steps?.[2]?.subStepsMeta || [];
  const explanation = subSteps[subStepIndex] || "";
  const meta = subStepsMeta[subStepIndex] || {};
  const digits = steps?.[2]?.digits || [];
  const multiplierDigits = steps?.[2]?.multiplierDigits || [];
  const partials = steps?.[2]?.partials || [];
  const carryRows = steps?.[2]?.carryRows || [];
  const result = steps?.[3]?.result || "";

  const maxLen = Math.max(
    digits.length,
    multiplierDigits.length + 1,
    ...partials.map((p) => p.length),
    result.length
  );
  const padLeft = (arr, length) => {
    const pad = Array(length - arr.length).fill(" ");
    return pad.concat(arr);
  };
  const getHighlightValueIndexes = () => {
    const indexes = {
      digits: [],
      multiplier: [],
      result: [],
      column: [],
    };

    if (typeof meta.d1 === "number") {
      const digitIndexFromRight = meta.colIndex ?? 0;
      const digitHighlightIdx = maxLen - 1 - digitIndexFromRight;
      indexes.digits.push(digitHighlightIdx);
    }

    if (typeof meta.d2 === "number") {
      const multiplierIndexFromRight = meta.rowIndex ?? 0;
      const multiplierHighlightIdx = maxLen - 1 - multiplierIndexFromRight;
      indexes.multiplier.push(multiplierHighlightIdx);
    }

    const originalPartialStr = partials[meta.rowIndex] || "";

    const displayStr =
      meta.type === "carry_add" && typeof meta.product === "number"
        ? String(meta.product).padStart(originalPartialStr.length, "0")
        : originalPartialStr;

    const paddedPartial = padLeft(displayStr.split(""), maxLen);
    const partialLen = displayStr.length;

    if (typeof meta.product === "number") {
      if (meta.type === "detail" || meta.type === "detail_final_digit") {
        const idxFromRight = (meta.colIndex ?? 0) + (meta.rowIndex ?? 0);
        const idx = maxLen - partialLen + (partialLen - 1 - idxFromRight);
        if (idx >= 0 && idx < maxLen) {
          indexes.result.push(idx);
        }
      }

      if (meta.type === "reveal_digits") {
        const digitsToReveal =
          meta.digitsToReveal || String(meta.product).length;
        for (let i = 0; i < digitsToReveal; i++) {
          const idxFromRight = (meta.colIndex ?? 0) + (meta.rowIndex ?? 0) + i;
          const idx = maxLen - partialLen + (partialLen - 1 - idxFromRight);
          if (idx >= 0 && idx < maxLen) {
            indexes.result.push(idx);
          }
        }
      }
    }

    if (meta.type === "zero_rule" || meta.type === "shift") {
      const lastZeroIndex = paddedPartial.lastIndexOf("0");
      if (lastZeroIndex !== -1) {
        indexes.result.push(lastZeroIndex);
      }
    }
    // Highlight cho bước cộng dọc
    if (meta.type === "vertical_add" && typeof meta.column === "number") {
      const colFromRight = meta.column; // ví dụ: 2 → cột trăm
      const colIdx = maxLen - 1 - colFromRight;
      // Partial rows
      partials.forEach((partial, i) => {
        const padded = padLeft(partial.split(""), maxLen);
        if (padded[colIdx] !== " ") {
          indexes.result.push(colIdx);
        }
      });
      // Carry rows
      carryRows.forEach((carryRow, i) => {
        const padded = padLeft(carryRow, maxLen);
        if (padded[colIdx] !== " ") {
          indexes.result.push(colIdx);
        }
      });
      // Final result
      const paddedResult = padLeft(result.split(""), maxLen);
      if (paddedResult[colIdx] !== " ") {
        indexes.result.push(colIdx);
      }
      indexes.columnHighlights = [colIdx];
    }

    return indexes;
  };
  useEffect(() => {
    const explanation = subSteps[subStepIndex];
    if (!explanation) {
      // console.log(" Không có explanation để đọc");
      return;
    }
    Speech.stop();
    Speech.speak(explanation, {
      language: i18n.language === "vi" ? "vi-VN" : "en-US",
      pitch: 1,
      rate: 0.9,
    });
  }, [subStepIndex, i18n.language]);
  const {
    digits: digitHighlights,
    multiplier: multiplierHighlights,
    result: resultHighlights,
    columnHighlights,
  } = getHighlightValueIndexes();

  // console.log("[DEBUG] highlightValueIndexes:", {
  //   digitHighlights,
  //   multiplierHighlights,
  //   resultHighlights,
  //   columnHighlights,
  // });

  const renderRow = (
    label,
    arr,
    highlightIdx = [],
    type = "normal",
    colHighlights = []
  ) => (
    <View style={styles.rowContainer}>
      <Text style={styles.label}>{label}</Text>
      {arr.map((char, i) => {
        const isCellHighlighted =
          (highlightIdx.includes(i) || colHighlights.includes(i)) &&
          char !== " ";
        return (
          <Text
            key={i}
            style={[
              styles.cell,
              isCellHighlighted && styles.highlight, //dùng cho cả row và col
              type === "carry" && styles.carryText,
              type === "result" && styles.resultText,
              type === "multiplier" &&
                highlightIdx.includes(i) &&
                styles.highlightOrange,
            ]}
          >
            {char}
          </Text>
        );
      })}
    </View>
  );
  const getBorderBox = () => {
    if (skillName === "Addition") return theme.colors.GreenDark;
    if (skillName === "Subtraction") return theme.colors.purpleDark;
    if (skillName === "Multiplication") return theme.colors.orangeDark;
    if (skillName === "Division") return theme.colors.redDark;
    return theme.colors.pinkDark;
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.cardBackground,
    },
    explanationBox: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      maxHeight: 140,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
    },
    explanationText: {
      fontSize: 17,
      lineHeight: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: getBorderBox(),
    },
    rowsBox: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 3,
    },
    label: {
      width: 24,
      fontFamily: Fonts.NUNITO_BOLD,
      fontSize: 18,
      textAlign: "center",
      color: theme.colors.grayDark,
    },
    cell: {
      width: 28,
      textAlign: "center",
      fontSize: 20,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.grayDark,
    },
    carryText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.grayDark,
    },
    resultText: {
      fontFamily: Fonts.NUNITO_BOLD,
    },
    highlight: {
      backgroundColor: getBorderBox(),
      borderRadius: 6,
      color: theme.colors.white,
    },
    highlightOrange: {
      backgroundColor: getBorderBox(),
      borderRadius: 6,
      color: theme.colors.white,
    },
    colHighlight: {
      backgroundColor: getBorderBox(),
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.white,
      color: theme.colors.white,
    },
    divider: (maxLen) => ({
      alignSelf: "center",
      width: maxLen * 30,
      height: 2,
      backgroundColor: theme.colors.grayDark,
      marginVertical: 6,
    }),
  });
  return (
    <View style={styles.container}>
      <ScrollView style={styles.explanationBox}>
        <Text style={styles.explanationText}>{explanation}</Text>
      </ScrollView>

      <View style={styles.rowsBox}>
        {renderRow(
          " ",
          padLeft(digits, maxLen),
          digitHighlights,
          "normal",
          " "
        )}
        {renderRow(
          "×",
          padLeft([" ", ...multiplierDigits], maxLen),
          multiplierHighlights,
          "multiplier",
          " "
        )}
        <View style={styles.divider(maxLen)} />

        {partials.map((partial, i) => (
          <React.Fragment key={i}>
            {carryRows[i] &&
              renderRow(
                " ",
                (() => {
                  const rawCarryRow = carryRows[i] ?? [];
                  //Chuẩn hóa carryArray rồi pad trái ===
                  const carryArray =
                    typeof rawCarryRow === "string"
                      ? rawCarryRow.split("")
                      : [...rawCarryRow];
                  // Đảm bảo độ dài chuẩn rồi thêm " " vào cuối cho dời trái
                  const padSize = maxLen - carryArray.length;
                  const paddedLeft = [
                    ...Array(padSize).fill(" "),
                    ...carryArray,
                  ];
                  const padded = [...paddedLeft.slice(1), " "]; // shift left 1 ô
                  const revealCount = visibleCarryMap[`carry_${i}`] ?? 0;
                  // Dùng lại function
                  const visibleChars = getVisibleCharsFromRight(
                    padded,
                    revealCount
                  );
                  return visibleChars;
                })(),
                [],
                "carry"
              )}

            {(() => {
              const rawChars = partial.split("");
              const padded = padLeft(rawChars, maxLen); // đảm bảo length = maxLen
              const visibleChars = padded.map((char, idx) => {
                const isZeroRuleStep =
                  meta.type === "zero_rule" || meta.type === "shift";
                const isVisible =
                  i < currentRowIndex ||
                  (i === currentRowIndex && idx >= maxLen - revealedDigits) ||
                  (typeof visibleDigitsMap[`row_${i}`] === "number" &&
                    idx >= maxLen - visibleDigitsMap[`row_${i}`]) ||
                  (isZeroRuleStep &&
                    typeof meta.rowIndex === "number" &&
                    i === meta.rowIndex &&
                    resultHighlights.includes(idx));

                const displayChar = isVisible
                  ? char
                  : char.trim() === ""
                  ? " "
                  : "?";
                return displayChar;
              });
              return renderRow(
                i === 0 ? " " : "+",
                visibleChars,
                i === meta.rowIndex ? resultHighlights : [],
                "normal",
                columnHighlights
              );
            })()}
          </React.Fragment>
        ))}
        {partials.length >= 2 && (
          <>
            <View style={styles.divider(maxLen)} />

            {(() => {
              const paddedResult = padLeft(result.split(""), maxLen);
              const revealCount = visibleDigitsMap["result"] ?? 0;
              const startRevealIdx = maxLen - revealCount;
              const visibleChars = paddedResult.map((char, idx) => {
                const isVisible = idx >= startRevealIdx && char !== " ";
                return isVisible ? char : "?";
              });

              return renderRow(
                " ",
                visibleChars,
                [], // Nếu muốn highlight, truyền resultHighlights
                "result",
                columnHighlights
              );
            })()}
          </>
        )}
      </View>
    </View>
  );
};

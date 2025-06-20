import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";

export const DivisionStepView = ({ steps, skillName }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps[2]?.divisionSteps) return null;

  const divisionSteps = steps[2].divisionSteps;
  const subSteps = steps[2].subSteps || [];
  const quotientDigits = steps[2].quotient?.split("") || [];
  const totalSteps = divisionSteps.length;

  const CELL_WIDTH = 20;

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: 20,
    },
    divisionContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginVertical: 20,
      paddingHorizontal: 10,
    },
    dividendColumn: {
      alignItems: "flex-start",
      marginRight: 10,
    },
    divisorText: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      marginLeft: 20,
    },
    divisionBracket: {
      position: "relative",
      width: 80,
      height: 90,
      marginTop: -25,
    },
    verticalLine: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 3,
      height: "100%",
      backgroundColor: "black",
    },
    horizontalLine: {
      position: "absolute",
      left: 0,
      top: 20,
      width: "100%",
      height: 3,
      backgroundColor: "black",
    },
    dividendText: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    quotientRow: {
      position: "absolute",
      top: 35,
      left: 20,
      flexDirection: "row",
    },
    cell: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      minWidth: CELL_WIDTH,
      textAlign: "right",
    },
    minusLine: {
      height: 2,
      backgroundColor: "black",
      width: 52,
      marginVertical: 2,
    },
    explanationText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark,
      marginTop: 10,
      marginHorizontal: 12,
      textAlign: "center",
    },
    navButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal: 8,
    },
    navButtonText: {
      color: "white",
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
    },
  });

  return (
    <View style={styles.container}>
      {currentStep > 0 && currentStep <= subSteps.length && (
        <Text style={styles.explanationText}>{subSteps[currentStep - 1]}</Text>
      )}

      <View style={styles.divisionContainer}>
        {/* Cột số bị chia + các bước chia */}
        <View style={styles.dividendColumn}>
          <Text style={styles.dividendText}>{steps[2].dividend}</Text>

          {divisionSteps.map((step, index) => {
            const isVisible = index < currentStep;

            const displayValue = step.afterBringDown !== undefined
              ? step.afterBringDown
              : step.remainder;

            const displayDigits = isVisible
              ? displayValue.split("")
              : displayValue.split("").map(() => "?");

            const minusValue = isVisible
              ? step.minus
              : step.minus.replace(/./g, "?");

            return (
              <View key={index}>
                {/* Số trừ */}
                {step.minus !== "" && (
                  <View style={{ flexDirection: "row" }}>
                    {Array(step.indent).fill().map((_, i) => (
                      <Text key={`indent-minus-${i}`} style={styles.cell}> </Text>
                    ))}
                    <Text
                      style={[
                        styles.cell,
                        {
                          color:
                            index === currentStep - 1
                              ? theme.colors.redDark
                              : theme.colors.black,
                        },
                      ]}
                    >
                      {minusValue}
                    </Text>
                  </View>
                )}

                {/* Gạch dưới */}
                <View>
                  <View style={styles.minusLine} />
                </View>

                {/* Remainder hoặc số mới sau khi kéo xuống */}
                <View style={{ flexDirection: "row" }}>
                  {Array(step.indent).fill().map((_, i) => (
                    <Text key={`indent-rem-${i}`} style={styles.cell}> </Text>
                  ))}
                  {displayDigits.map((char, i) => (
                    <Text
                      key={`digit-${i}`}
                      style={[
                        styles.cell,
                        {
                          color:
                            index === currentStep - 1
                              ? theme.colors.redDark
                              : theme.colors.black,
                        },
                      ]}
                    >
                      {char}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Cột chia: số chia + thương */}
        <View>
          <Text style={styles.divisorText}>{steps[2].divisor}</Text>
          <View style={styles.divisionBracket}>
            <View style={styles.verticalLine} />
            <View style={styles.horizontalLine} />
          </View>

          <View style={styles.quotientRow}>
            {quotientDigits.map((digit, index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  {
                    marginLeft:
                      index === 0
                        ? steps[2].divisionSteps[0].indent * CELL_WIDTH * 2
                        : 0,
                    color:
                      index === currentStep - 1
                        ? theme.colors.redDark
                        : theme.colors.black,
                  },
                ]}
              >
                {index < currentStep ? digit : "?"}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Nút điều hướng */}
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#f44336" }]}
            onPress={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          >
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < totalSteps && (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

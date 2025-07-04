import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../themes/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Fonts } from "../../../../constants/Fonts";
import * as Speech from "expo-speech";

export const DivisionStepView = ({ steps, columnStepIndex, onGoBack }) => {
  const { theme } = useTheme?.() || {
    theme: { text: "#000", background: "#fff" },
  };
  const { t, i18n } = useTranslation("stepbystep") || {
    t: (key, params) => key,
  };

  const subSteps = steps[2]?.subSteps || [];
  const dividend = steps[2]?.dividend ?? "";
  const divisor = steps[2]?.divisor ?? "";
  const quotient = steps[2]?.quotient ?? "";
  const baseIndentOffset = steps[2]?.baseIndentOffset ?? 0;

  const currentStep = columnStepIndex ?? 0;
  const step = subSteps[currentStep];


  const divideStepIndices = subSteps
    .map((s, i) => (s.key === "step_divide" ? i : null))
    .filter((i) => i !== null);

  const currentDivideIndex = divideStepIndices.findIndex(
    (i) => i === currentStep
  );

  const divideStepsDone = subSteps.filter(
    (s, i) => s.key === "step_divide" && i <= currentStep
  ).length;

  const indentSpacing = 15;

  const renderExplanation = (step) => {
    if (!step) return null;
    const product =
      step.params?.product ??
      (step.params?.result != null && step.params?.divisor != null
        ? step.params.result * step.params.divisor
        : undefined);

    if (
      step.key === "step_bring_down" &&
      step.params?.explanationKey === "after_subtract"
    ) {
      return t("step_bring_down_after_subtract", {
        ...step.params,
        product,
        remainder: step.params.remainder,
      });
    }

    if (step.key === "step_choose_number" && step.params?.comparisonKey) {
      const explanation = t(`explanation.${step.params.comparisonKey}`);
      return t(step.key, {
        ...step.params,
        comparison: t(`comparison.${step.params.comparisonKey}`),
        explanation,
        product,
      });
    }

    return t(step.key, { ...step.params, product });
  };

  const renderMaskedValue = (
    value,
    maxVisibleDigits,
    currentQuotientIndex
  ) => {
    return value
      .toString()
      .split("")
      .map((char, i) => {
        let color = "#ccc";
        if (i < maxVisibleDigits) color = "#000";
        if (i === currentQuotientIndex) color = "#FD8550";

        return (
          <Text key={i} style={{ color }}>
            {i < maxVisibleDigits ? char : "?"}
          </Text>
        );
      });
  };

  useEffect(() => {
    const step = subSteps[columnStepIndex];
    const text = renderExplanation(step, t);
    if (!text) return;
    const lang = i18n.language;
    Speech.speak(text, {
      language: lang === "vi" ? "vi-VN" : "en-US",
    });
  }, [columnStepIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>{renderExplanation(step)}</Text>
      </View>

      <View style={styles.divisionBox}>
        {/* CỘT TRÁI */}
        <View
          style={[
            styles.leftBox,
            { marginLeft: 100 + baseIndentOffset * indentSpacing },
          ]}
        >
          <Text style={styles.dividend}>{dividend}</Text>

          {subSteps
            .filter((s, i) =>
              ["step_multiply", "step_subtract", "step_bring_down"].includes(
                s.key
              )
            )
            .map((s, idx) => {
              const isVisible = subSteps.indexOf(s) <= currentStep;
              const stepIndex = subSteps.indexOf(s);
              const isCurrent = stepIndex === currentStep;

              const indent =
                typeof s.params?.visualIndent === "number"
                  ? s.params.visualIndent
                  : s.params?.indent ?? 0;

              let value = "?";
              if (s.key === "step_multiply") value = s.params.product;
              if (s.key === "step_subtract") value = s.params.remainder;
              if (s.key === "step_bring_down") value = s.params.afterBringDown;

              return (
                <View key={`${s.key}-${idx}`} style={{ position: "relative" }}>
                  <Text
                    style={[
                      styles.lineText,
                      {
                        color: isCurrent
                          ? "#FD8550"
                          : isVisible
                            ? "#000"
                            : "#ccc",
                        marginLeft: indent * indentSpacing,
                      },
                    ]}
                  >
                    {isVisible ? value : "?"}
                  </Text>

                  {s.key === "step_multiply" && isVisible && (
                    <Text
                      style={{
                        position: "absolute",
                        left: -15,
                        top: -15,
                        fontSize: 24,
                        color: "#000",
                      }}
                    >
                      -
                    </Text>
                  )}

                  {s.key === "step_multiply" && isVisible && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#000",
                        marginVertical: 2,
                        width: `${(value || "").toString().length * 14}px`,
                      }}
                    />
                  )}
                </View>
              );
            })}
        </View>

        {/* CỘT PHẢI */}
        <View style={styles.rightBox}>
          <Text style={styles.divisor}>{divisor}</Text>
          <Text style={styles.quotient}>
            {renderMaskedValue(quotient, divideStepsDone, currentDivideIndex)}
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text
          onPress={onGoBack}
          style={{
            fontSize: 16,
            color: "#1976D2",
            fontWeight: "bold",
            padding: 8,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#1976D2",
            textAlign: "center",
            width: 100,
          }}
        >
          ◀ Quay lại
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  divisionBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 25,
  },
  leftBox: {
    borderRightWidth: 2,
    borderRightColor: "#000",
    paddingRight: 15,
  },
  rightBox: {
    flex: 1,
  },
  dividend: {
    fontSize: 24,
    fontFamily: Fonts.NUNITO_MEDIUM,
  },
  quotient: {
    fontSize: 24,
    color: "#4CAF50",
    paddingLeft: 15,
    fontFamily: Fonts.NUNITO_MEDIUM,
  },
  divisor: {
    fontSize: 24,
    paddingLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    width: 70,
    fontFamily: Fonts.NUNITO_MEDIUM,
  },
  lineText: {
    fontSize: 24,
    fontFamily: Fonts.NUNITO_MEDIUM,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 14,
    fontFamily: Fonts.NUNITO_MEDIUM,
    color: "#5F5F5F",
    marginTop: 8,
    marginHorizontal: 12,
    textAlign: "center",
  },
});

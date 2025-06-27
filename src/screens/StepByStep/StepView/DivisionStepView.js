import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../themes/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import * as Speech from "expo-speech";
export const DivisionStepView = ({ steps, columnStepIndex }) => {
  const { theme } = useTheme?.() || {
    theme: { text: "#000", background: "#fff" },
  };
  const { t, i18n } = useTranslation("stepbystep") || {
    t: (key, params) => key,
  };

  const subSteps = steps[2]?.subSteps || [];
  const divisionSteps = steps[2]?.divisionSteps || [];

  const dividend = steps[2]?.dividend ?? "";
  const divisor = steps[2]?.divisor ?? "";
  const quotient = steps[2]?.quotient ?? "";
  const baseIndentOffset = steps[2]?.baseIndentOffset ?? 0;

  const currentStep = columnStepIndex ?? 0;
  const step = subSteps[currentStep];

  const renderExplanation = (step) => {
    if (!step) return null;
    const product =
      step.params?.product ??
      (step.params?.result != null && step.params?.divisor != null
        ? step.params.result * step.params.divisor
        : undefined);

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

  const renderMaskedValue = (value, maxVisibleDigits) => {
    return value
      .toString()
      .split("")
      .map((char, i) => (
        <Text key={i} style={{ color: i < maxVisibleDigits ? "#000" : "#ccc" }}>
          {i < maxVisibleDigits ? char : "?"}
        </Text>
      ));
  };
  const divideStepsDone = subSteps.filter(
    (s, i) => s.key === "step_divide" && i <= currentStep
  ).length;
  const indentSpacing = 15;
  const charWidth = 14;
  useEffect(() => {
    const step = subSteps[columnStepIndex];
    const text = renderExplanation(step, t);
    if (!text) return;
    const lang = i18n.language;
    const spokenText = text;
    Speech.speak(spokenText, {
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
            { marginLeft: 110 + baseIndentOffset * indentSpacing },
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
                        marginLeft: indent * indentSpacing,
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
            {renderMaskedValue(quotient, divideStepsDone)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  divisionBox: {
    flexDirection: "row",
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
  },
  quotient: {
    fontSize: 24,
    color: "#4CAF50",
    paddingLeft: 15,
  },
  divisor: {
    fontSize: 24,
    paddingLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    width: 70,
  },
  lineText: {
    fontSize: 24,
  },
  stepContainer: {
    minHeight: 80,
    marginTop: 12,
  },
  stepText: {
    fontSize: 16,
    color: "#444",
  },
});

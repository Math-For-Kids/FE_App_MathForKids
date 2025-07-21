import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../themes/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Fonts } from "../../../../constants/Fonts";
import * as Speech from "expo-speech";

export const DivisionStepView = ({ steps, columnStepIndex, skillName }) => {
  const { theme } = useTheme?.();
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

  const getSkillColor = () => {
    switch (skillName) {
      case "Addition":
        return theme.colors.GreenDark;
      case "Subtraction":
        return theme.colors.purpleDark;
      case "Multiplication":
        return theme.colors.orangeDark;
      case "Division":
        return theme.colors.redDark;
      default:
        return theme.colors.pinkDark;
    }
  };
  const divideStepIndices = subSteps
    .map((s, i) => (["step_divide", "less_then_bring_down"].includes(s.key)
      ? i : null))
    .filter((i) => i !== null);

  const currentDivideIndex = divideStepIndices.findIndex(
    (i) => i === currentStep
  );

  const divideStepsDone = subSteps.filter(
    (s, i) => ["step_divide", "less_then_bring_down"].includes(s.key)
      && i <= currentStep
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

  const renderMaskedValue = (value, maxVisibleDigits, currentQuotientIndex) => {
    return value
      .toString()
      .split("")
      .map((char, i) => {
        let color = theme.colors.text;
        if (i === currentQuotientIndex) color = getSkillColor();

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

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    divisionBox: {
      flexDirection: "row",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      marginTop: 15,
      marginLeft: 16,
      marginRight: 16,
      padding: 10,
      borderWidth: 1,
      width: 300,
      borderColor: getSkillColor(),
      alignItems: "center",
    },
    innerBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    leftBox: {
      borderRightWidth: 2,
      borderRightColor: theme.colors.text,
      paddingRight: 15,

    },
    rightBox: {

    },
    dividend: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.text,
    },
    quotient: {
      paddingLeft: 15,
      fontSize: 24,
      color: theme.colors.text,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    divisor: {
      paddingLeft: 15,
      fontSize: 24,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.text,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.text,
    },
    lineText: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    stepText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: getSkillColor(),
      marginHorizontal: 12,
      textAlign: "center",
    },
    explanationBox: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 10,
      marginLeft: 16,
      marginRight: 16,
      maxHeight: 140,
      width: 300,
      borderWidth: 1,
      borderColor: getSkillColor(),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.centeredBox}>
        <View style={styles.explanationBox}>
          <Text style={styles.stepText}>{renderExplanation(step)}</Text>
        </View>

        <View style={styles.divisionBox}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.innerBox}>
              {/* LEFT COLUMN */}
              <View
                style={styles.leftBox}
              >
                <Text style={styles.dividend}>{dividend}</Text>

                {subSteps
                  .filter((s, i) =>
                    ["step_multiply", "step_subtract", "step_bring_down", "step_bring_down_extra"].includes(
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
                    if (s.key === "step_bring_down" || s.key === "step_bring_down_extra") {
                      value = s.params.afterBringDown;
                    }


                    return (
                      <View key={`${s.key}-${idx}`} style={{ position: "relative" }}>
                        <Text
                          style={[
                            styles.lineText,
                            {
                              color: isCurrent ? getSkillColor() : theme.colors.text,
                              paddingLeft: indent * indentSpacing,
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
                              color: theme.colors.text,
                            }}
                          >
                            -
                          </Text>
                        )}

                        {s.key === "step_multiply" && isVisible && (
                          <View
                            style={{
                              height: 2,
                              backgroundColor: theme.colors.text,
                              marginVertical: 2,
                              width: `${(value || "").toString().length * 14}px`,
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
              </View>

              {/* RIGHT COLUMN */}
              <View style={styles.rightBox}>
                <Text style={styles.divisor}>{divisor}</Text>
                <Text style={styles.quotient}>
                  {renderMaskedValue(quotient, divideStepsDone, currentDivideIndex)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useTheme } from "../../../themes/ThemeContext";
import { Fonts } from "../../../../constants/Fonts";


export const AdditionStepView = ({ steps, placeLabels, skillName }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps[2]?.digitSums) return null;

  const totalSteps = steps[2].digitSums.length + 1; // Chỉ +1 để có bước final result
  const labels = placeLabels.slice(0, steps[2].digitSums.length).reverse();

  const getSkillColor = () => {
    switch (skillName) {
      case "Addition": return theme.colors.GreenDark;
      case "Subtraction": return theme.colors.purpleDark;
      case "Multiplication": return theme.colors.orangeDark;
      case "Division": return theme.colors.redDark;
      default: return theme.colors.pinkDark;
    }
  };

  const subTextLines = Array.isArray(steps[2].subText)
    ? steps[2].subText.slice().reverse()
    : [];

  const styles = StyleSheet.create({
    container: { alignItems: "center", marginTop: 10 },
    row: { flexDirection: "row-reverse", marginBottom: 4 },
    labelText: {
      width: 50, textAlign: "center", fontSize: 8,
      fontFamily: Fonts.NUNITO_BLACK, color: theme.colors.grayDark,
    },
    carryText: {
      width: 50, textAlign: "center", fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK, color: theme.colors.blueGray,
    },
    num1Text: {
      width: 50, textAlign: "center", fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK, color: theme.colors.black,
    },
    num2Text: {
      width: 50, textAlign: "center", fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK, color: theme.colors.black,
    },
    lineRow: { marginTop: 2 },
    lineText: {
      width: 50, textAlign: "center", fontSize: 20,
      fontFamily: Fonts.NUNITO_BLACK, color: theme.colors.grayDark,
    },
    resultText: {
      width: 50, textAlign: "center", fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK, color: getSkillColor(),
    },
    explanationText: {
      fontSize: 14, fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.grayDark, marginTop: 8,
      marginHorizontal: 12, textAlign: "center",
    },
    finalResultText: {
      fontSize: 32, fontFamily: Fonts.NUNITO_BLACK,
      color: "red", marginTop: 10,
    },
    plusOverlay: {
      position: "absolute", left: 120, top: 60,
      fontSize: 20, fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black, zIndex: 10,
      width: 30, textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {labels.map((label, i) => (
          <Text key={`label-${i}`} style={styles.labelText}>{label}</Text>
        ))}
      </View>

      <View style={styles.row}>
        {steps[2].carryDigits.slice().reverse().map((carry, i) => (
          <Text key={`carry-${i}`} style={styles.carryText}>
            {carry > 0 && currentStep > i + 1 ? carry : " "}
          </Text>
        ))}
      </View>

      <View style={styles.row}>
        {steps[2].digits1.slice().reverse().map((digit, i) => (
          <Text key={`num1-${i}`} style={styles.num1Text}>{digit}</Text>
        ))}
      </View>

      <View style={styles.row}>
        {steps[2].digits2.slice().reverse().map((_, i) => (
          <Text
            key={`spacer-${i}`}
            style={[
              styles.num2Text,
              i === steps[2].digits2.length - 1 && { marginRight: 50 }  
            ]}
          >
            {i === steps[2].digits2.length - 1 ? '+' : ' '}
          </Text>
        ))}
      </View>


      <View style={styles.row}>
        {steps[2].digits2.slice().reverse().map((digit, i) => (
          <Text key={`num2-${i}`} style={styles.num2Text}>{digit}</Text>
        ))}
      </View>



      <View style={[styles.row, styles.lineRow]}>
        {steps[2].digitSums.map((_, i) => (
          <Text key={`line-${i}`} style={styles.lineText}>―</Text>
        )).reverse()}
      </View>

      <View style={styles.row}>
        {steps[2].digitSums.slice().reverse().map((digit, i) => (
          <TouchableOpacity
            key={`sum-${i}`}
            onPress={() => {
              const toSpeak = subTextLines[i];
              if (toSpeak) Speech.speak(toSpeak, { language: "en-US" });
            }}
          >
            <Text style={styles.resultText}>
              {currentStep > i ? digit : "?"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {currentStep > 0 && currentStep <= subTextLines.length && (
        <Text style={styles.explanationText}>
          {subTextLines[subTextLines.length - currentStep]}
        </Text>
      )}


      {currentStep === totalSteps && (
        <>
          <Text style={styles.explanationText}>
            Final result: {steps[2].digits1.join("")} + {steps[2].digits2.join("")} = {steps[2].digitSums.join("")}
          </Text>
          <Text style={styles.finalResultText}>
            {steps[2].digitSums.join("")}
          </Text>
        </>
      )}

      {currentStep < totalSteps && (
        <TouchableOpacity onPress={() => setCurrentStep(prev => prev + 1)}>
          <Text style={{
            marginTop: 16,
            backgroundColor: "#4CAF50",
            color: "white",
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderRadius: 10,
            fontSize: 18,
            fontFamily: Fonts.NUNITO_BLACK,
          }}>
            Next
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

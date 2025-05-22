import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { handleStepZero } from "./logic/handleStepZero";
import { AdditionStepView } from "./StepView/AdditionStepView";
import { SubtractionStepView } from "./StepView/SubtractionStepView";
import { MultiplicationStepView } from "./StepView/MultiplicationStepView";
import { DivisionStepView } from "./StepView/DivisionStepView";
export default function StepByStepScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName } = route.params;
  const [stepIndex, setStepIndex] = useState(0);
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [remember, setRemember] = useState("");
  const [operator, setOperator] = useState("+");

  const [steps, setSteps] = useState([
    {
      title: "Enter any 2 positive integers",
      description: "",
      result: "",
    },
    {
      title: "Step 1: Write straight calculation",
      description:
        "place the numbers 17 and 25 so that the digits in the same row and column are aligned:",
      subText:
        "The units place is in line with the units place, the tens place is in line with the tens place.",
    },
    {
      title: "Step 2: Add the digits in the units digit: ",
      description:
        "Add the digits in the units digit: 7 + 5 = 12 Write 2 in the units column, carry 1 to the tens column.",
      result: "",
    },
    {
      title: "Step 3: Final Result",
      description: "The final calculated result.",
      result: "",
    },
  ]);

  const currentStep = steps[stepIndex]; // Bây giờ sẽ không còn undefined nữa
  const getGradient = () => {
    switch (skillName) {
      case "Addition":
        return theme.colors.gradientGreen;
      case "Subtraction":
        return theme.colors.gradientPurple;
      case "Multiplication":
        return theme.colors.gradientOrange;
      case "Division":
        return theme.colors.gradientRed;
      default:
        return theme.colors.gradientPink;
    }
  };
  const getBorderBox = () => {
    if (skillName === "Addition") return theme.colors.GreenDark;
    if (skillName === "Subtraction") return theme.colors.purpleDark;
    if (skillName === "Multiplication") return theme.colors.orangeDark;
    if (skillName === "Division") return theme.colors.redDark;
    return theme.colors.pinkDark;
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setStepIndex(0);
      setNumber1("");
      setNumber2("");
    });
    return unsubscribe;
  }, [navigation]);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: theme.colors.background,
    },
    header: {
      width: "100%",
      height: "18%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 3,
      marginBottom: 20,
    },
    backButton: {
      position: "absolute",
      left: 10,
      backgroundColor: theme.colors.backBackgound,
      marginLeft: 20,
      padding: 8,
      borderRadius: 50,
    },
    headerText: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    soundContainer: {
      width: 42,
      alignItems: "center",
      paddingVertical: 5,
      borderRadius: 50,
      elevation: 3,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.white,
    },
    title: {
      fontSize: 20,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
      marginBottom: 10,
      width: "80%",
    },
    inputBox: {
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: getBorderBox(),
      padding: 10,
      borderRadius: 10,
      width: "40%",
      height: 200,
      textAlign: "center",
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    numberBoxContainer: {
      flex: 1,
      margin: 10,
    },
    numberContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    operatorContainer: {
      width: "30%",
      height: 120,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: getBorderBox(),
      borderRadius: 10,
      marginBottom: 30,
    },
    operator: {
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 80,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    numbersContainer: {
      width: "30%",
    },
    numberBox: {
      height: 120,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: getBorderBox(),
      borderRadius: 10,
      marginBottom: 30,
    },
    number: {
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 80,
      color: theme.colors.black,
    },
    lineIconContainer: {
      alignItems: "center",
    },
    lineIcon: { width: "80%", height: 10 },
    resultTextContainer: {
      height: 120,
      width: "60%",
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: getBorderBox(),
      borderRadius: 10,
      marginBottom: 30,
      marginLeft: 80,
      justifyContent: "center",
    },
    resultText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.redTomato,
      fontSize: 80,
      textAlign: "right",
    },
    subText: {
      fontSize: 14,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
      width: "80%",
    },
    nextButton: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    nextText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      textAlign: "center",
    },
    backStepContainer: {
      flexDirection: "row",
    },
    backStepButton: {
      borderRadius: 30,
      margin: 10,
      borderWidth: 1,
      borderColor: theme.colors.white,
      padding: 5,
      elevation: 3,
    },
    numberInputRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    placeholderText: {
      position: "absolute",
      top: 75,
      fontSize: 40,
      color: theme.colors.grayLight,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    placeholderLeft: { left: 25 },
    placeholderRight: { right: 25 },
    operatorRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 10,
    },
    operatorButton: {
      padding: 10,
      borderRadius: 10,
      marginHorizontal: 5,
      width: "20%",
      height: "65%",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5,
    },
    operatorActive: { backgroundColor: getBorderBox() },
    operatorInactive: { backgroundColor: theme.colors.grayMedium },
    operatorSymbol: { fontSize: 100, color: theme.colors.white },
    scrollContainer: { flexGrow: 1, paddingBottom: 80 },
  });

  const dynamicFontSize = (value) => {
    if (value.length <= 2) return 100;
    if (value.length <= 4) return 50;
    if (value.length <= 6) return 34;
    if (value.length <= 8) return 24;
    return 20;
  };

  const placeLabels = [
    "Units",
    "Tens",
    "Hundreds",
    "Thousands",
    "Ten thousands",
    "Hundred thousands",
    "Millions",
    "Ten millions",
    "Hundred millions",
    "Billions",
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Calculation</Text>
      </LinearGradient>

      <View style={styles.titleContainer}>
        <LinearGradient colors={getGradient()} style={styles.soundContainer}>
          <TouchableOpacity>
            <Ionicons
              name="volume-medium"
              size={30}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </LinearGradient>
        <Text
          style={styles.title}
          numberOfLines={3}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {currentStep.title}
          {"\n"}
          {currentStep.description}
        </Text>
      </View>

      {stepIndex === 0 && (
        <View style={styles.stepZeroContainer}>
          <View style={styles.numberInputRow}>
            {number1 === "" && (
              <Text style={[styles.placeholderText, styles.placeholderLeft]}>
                Num 1
              </Text>
            )}
            <TextInput
              style={[styles.inputBox, { fontSize: dynamicFontSize(number1) }]}
              value={number1}
              onChangeText={setNumber1}
              keyboardType="numeric"
              maxLength={6}
            />
            {number2 === "" && (
              <Text style={[styles.placeholderText, styles.placeholderRight]}>
                Num 2
              </Text>
            )}
            <TextInput
              style={[styles.inputBox, { fontSize: dynamicFontSize(number2) }]}
              value={number2}
              onChangeText={setNumber2}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.operatorRow}>
            {["+", "-", "×", "÷"].map((op) => (
              <TouchableOpacity
                key={op}
                onPress={() => setOperator(op)}
                style={[
                  styles.operatorButton,
                  operator === op
                    ? styles.operatorActive
                    : styles.operatorInactive,
                ]}
              >
                <Text style={styles.operatorSymbol}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {stepIndex !== 0 && (
          <View style={styles.numberBoxContainer}>
            <View style={styles.numberContainer}>
              <View style={styles.operatorContainer}>
                <Text style={styles.operator}>{operator}</Text>
              </View>
              <View style={styles.numbersContainer}>
                <View style={styles.numberBox}>
                  <Text
                    style={styles.number}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                  >
                    {number1}
                  </Text>
                </View>
                <View style={styles.numberBox}>
                  <Text
                    style={styles.number}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                  >
                    {number2}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.lineIconContainer}>
              <Image source={theme.icons.line} style={styles.lineIcon} />
            </View>
          </View>
        )}

        {stepIndex > 0 && (
          <View style={styles.stepBox}>
            <View style={styles.titleContainer}>
              <LinearGradient
                colors={getGradient()}
                style={styles.soundContainer}
              >
                <TouchableOpacity>
                  <Ionicons
                    name="volume-medium"
                    size={30}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </LinearGradient>
              <Text
                style={styles.subText}
                numberOfLines={100}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                color={theme.colors.black}
              >
                {currentStep.subText}
              </Text>
            </View>
          </View>
        )}

        {stepIndex === 3 && (
          <View style={styles.resultTextContainer}>
            {currentStep.result !== "" && (
              <Text
                style={styles.resultText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {currentStep.result}
              </Text>
            )}
          </View>
        )}

        {operator === "+" && stepIndex === 2 && steps[2]?.digitSums && (
          <AdditionStepView
            steps={steps}
            placeLabels={placeLabels}
            skillName={skillName}
          />
        )}

        {operator === "-" && stepIndex === 2 && (
          <SubtractionStepView
            steps={steps}
            placeLabels={placeLabels}
            skillName={skillName}
          />
        )}

        {operator === "×" && stepIndex === 2 && (
          <MultiplicationStepView
            steps={steps}
            stepIndex={stepIndex}
            skillName={skillName}
          />
        )}

        <View style={styles.backStepContainer}>
          {stepIndex > 0 && (
            <LinearGradient
              colors={getGradient()}
              style={styles.backStepButton}
            >
              <TouchableOpacity
                onPress={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
              >
                <Ionicons
                  name="play-back"
                  size={30}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      </ScrollView>

      <LinearGradient
        colors={getGradient()}
        style={styles.nextButton}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <TouchableOpacity
          onPress={() => {
            if (stepIndex === 0) {
              handleStepZero({
                number1,
                number2,
                operator,
                steps,
                setRemember,
                setStepIndex,
                setSteps,
                stepIndex,
              });
            } else if (stepIndex < steps.length - 1) {
              setStepIndex(stepIndex + 1);
            }
          }}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

import React, { useEffect, useState, useRef } from "react";
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
import * as Speech from "expo-speech";
import FloatingMenu from "../../components/FloatingMenu";
import { useTranslation } from "react-i18next";
export default function StepByStepScreen({ navigation, route }) {
  const { theme } = useTheme();
  const {
    skillName,
    number1: autoNumber1 = "",
    number2: autoNumber2 = "",
    operator: routeOperator,
  } = route.params || {};

  const getOperatorFromSkillName = (skill) => {
    switch (skill) {
      case "Addition":
        return "+";
      case "Subtraction":
        return "-";
      case "Multiplication":
        return "×";
      case "Division":
        return "÷";
      default:
        return "+";
    }
  };

  const [operator, setOperator] = useState(
    routeOperator || getOperatorFromSkillName(skillName)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [remember, setRemember] = useState("");
  const [subStepIndex, setSubStepIndex] = useState(0);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [revealedDigits, setRevealedDigits] = useState(0);
  const [revealedResultDigits, setRevealedResultDigits] = useState(0);
  const [steps, setSteps] = useState([]);
  const [columnStepIndex, setColumnStepIndex] = useState(0);
  const isFromRouteRef = useRef(false);
  const { t, i18n } = useTranslation("stepbystep");
  //nhận params và gán giá trị
  useEffect(() => {
    if (autoNumber1 !== undefined && autoNumber2 !== undefined) {
      console.log("Setting number from route:", autoNumber1, autoNumber2);
      setNumber1(String(autoNumber1));
      setNumber2(String(autoNumber2));
      isFromRouteRef.current = true;
    }
  }, [autoNumber1, autoNumber2]);

  //sau khi number1/number2 được cập nhật
  // useEffect(() => {
  //   console.log("number1 (after set):", number1);
  //   console.log("number2 (after set):", number2);
  // }, [number1, number2]);
  // useEffect(() => {
  //   console.log("autoNumber1 type:", typeof autoNumber1);
  //   console.log("autoNumber2 type:", typeof autoNumber2);
  // }, [autoNumber1, autoNumber2]);

  // useEffect(() => {
  //   console.log("operator:", operator);
  //   console.log("skillName:", skillName);
  // }, [operator, skillName]);
  useEffect(() => {
    if (!isFromRouteRef.current) {
      setNumber1("");
      setNumber2("");
      console.log("Reset vì đổi operator và không nhận từ route");
    } else {
      console.log("Không reset vì vừa nhận từ route");
    }

    isFromRouteRef.current = false;
  }, [operator]);

  useEffect(() => {
    Speech.speak(`You've selected ${operator}. Please enter new numbers`, {
      language: i18n.language === "vi" ? "vi-VN" : "en-US",
      pitch: 1,
      rate: 0.9,
    });
  }, [operator, i18n.language]);

  const speakText = (text) => {
    Speech.stop();
    Speech.speak(text, {
      language: i18n.language === "vi" ? "vi-VN" : "en-US",
      pitch: 1,
      rate: 0.95,
    });
  };
  const getMaxLength = (inputIndex) => {
    switch (operator) {
      case "+":
      case "-":
        return 6;
      case "×":
        return inputIndex === 1 ? 5 : 2;
      case "÷":
        return inputIndex === 1 ? 2 : 1;
      default:
        return 6;
    }
  };
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
  const currentStep = steps[stepIndex];

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
      fontSize: 18,
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
      color: theme.colors.w,
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
    },
    operatorButton: {
      borderRadius: 10,
      marginHorizontal: 5,
      paddingVertical: 10,
      marginBottom: 15,
      width: "20%",
      justifyContent: "center",
      alignItems: "center",
      elevation: 3,
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
    t("place.units"),
    t("place.tens"),
    t("place.hundreds"),
    t("place.thousands"),
    t("place.ten_thousands"),
    t("place.hundred_thousands"),
    t("place.millions"),
    t("place.ten_millions"),
    t("place.hundred_millions"),
    t("place.billions"),
  ];
  useEffect(() => {
    if (stepIndex === 0) return;

    const step = steps[stepIndex];

    if (stepIndex === 2 && Array.isArray(step.subSteps)) {
      // Đọc substep hiện tại trong step 2
      speakText(step.subSteps[subStepIndex] || "");
    } else if (stepIndex === 3 && step.subText) {
      // Đọc subText khi đến bước 3 (kết quả cuối)
      speakText(step.subText);
    } else {
      const fullText = `${step.title || ""}. ${
        step.description || step.subText || ""
      }`;
      speakText(fullText);
    }
  }, [stepIndex, subStepIndex]);

  const handleNext = () => {
    Speech.stop();
    console.log("[handleNext] stepIndex:", stepIndex);
    console.log("[handleNext] currentRowIndex:", currentRowIndex);
    // Step 0: Initial number input
    if (stepIndex === 0) {
      console.log("Đang ở bước nhập số ban đầu");
      handleStepZero({
        number1,
        number2,
        operator,
        steps,
        setRemember,
        setStepIndex,
        setSteps,
        stepIndex,
        t,
      });
      return;
    }

    // Subtraction logic: reveal each result digit and subStep
    if (operator === "-" && stepIndex === 2) {
      const totalLength = steps[2].resultDigits?.length || 0;
      if (revealedResultDigits < totalLength) {
        setRevealedResultDigits((prev) => prev + 1);
        setSubStepIndex((prev) => prev + 1);
        return;
      }
    }

    if (operator === "×" && stepIndex === 2) {
      const partialStr = steps[2].partials[currentRowIndex]?.toString() || "";
      const fullLength = partialStr.length;
      const isLastPartial = currentRowIndex >= steps[2].partials.length - 1;

      const digits = steps[2].digits; // multiplicand (đã đảo ngược)
      const multiplierDigits = steps[2].multiplierDigits;
      const currentMultiplierDigit =
        multiplierDigits[multiplierDigits.length - 1 - currentRowIndex];
      const multiplicandLastDigit = digits[0];

      const product =
        parseInt(currentMultiplierDigit) * parseInt(multiplicandLastDigit);
      const isTwoDigit = product >= 10;

      const isLastRow = currentRowIndex === steps[2].partials.length - 1;
      const isFinalDigitsOfCurrentRow =
        revealedDigits === fullLength - 2 && isTwoDigit;
      console.log("currentRowIndex:", currentRowIndex);
      console.log("partialStr:", partialStr);
      console.log("fullLength:", fullLength);
      console.log("revealedDigits:", revealedDigits);
      console.log("isTwoDigit:", isTwoDigit);
      console.log("product:", product);
      console.log("currentMultiplierDigit:", currentMultiplierDigit);
      console.log("multiplicandLastDigit:", multiplicandLastDigit);
      console.log("isLastRow:", isLastRow);
      console.log("isFinalDigitsOfCurrentRow :", isFinalDigitsOfCurrentRow);

      if (subStepIndex < steps[2].subSteps.length - 1) {
        console.log("Tăng subStepIndex");
        setSubStepIndex((prev) => prev + 1);
      }

      // Nếu còn 2 chữ số cuối của dòng và tích là 2 chữ số → hiện cùng lúc
      if (isFinalDigitsOfCurrentRow) {
        console.log("Trường hợp: 2 chữ số cuối của dòng hiện cùng lúc");
        setRevealedDigits((prev) => prev + 2);
      }
      // Nếu chưa hiện hết dòng → hiện từng chữ
      else if (revealedDigits < fullLength) {
        console.log("Hiện thêm 1 chữ số");
        setRevealedDigits((prev) => prev + 1);
      }
      // Nếu dòng đã xong → chuyển dòng
      else if (!isLastPartial) {
        console.log("Chuyển dòng mới");
        setCurrentRowIndex((prev) => prev + 1);
        setRevealedDigits(0);
      }
      //Nếu dưới 1 dòng nhân thì hiển thị dòng cuối -> hiển thị kết quả và chuyển sang steps[3]
      else if (!isLastPartial) {
        console.log("Chuyển dòng mới");
        setCurrentRowIndex((prev) => prev + 1);
        setRevealedDigits(0);
      } else {
        const totalLength = steps[3].result.length;

        const isOnlyOnePartial = steps[2].partials.length === 1;
        const isPartialFullyRevealed = revealedDigits >= fullLength;

        if (isOnlyOnePartial && isPartialFullyRevealed) {
          console.log(
            "Chỉ có 1 dòng partial → bỏ qua reveal kết quả → chuyển bước"
          );
          setStepIndex((prev) => prev + 1);
          return;
        }

        if (revealedResultDigits < totalLength) {
          console.log("Hiện từng chữ số của kết quả");
          setRevealedResultDigits((prev) => prev + 1);
        } else {
          console.log("Đã hiện xong kết quả → chuyển bước");
          setStepIndex((prev) => prev + 1);
        }
      }

      return;
    }

    if (stepIndex < steps.length - 1) {
      console.log("Chuyển bước thông thường");
      setStepIndex((prev) => prev + 1);
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t("calculation")}</Text>
      </LinearGradient>

      <View style={styles.titleContainer}>
        <LinearGradient colors={getGradient()} style={styles.soundContainer}>
          <TouchableOpacity
            onPress={() => {
              Speech.stop();

              if (stepIndex === 0) {
                Speech.speak(t("instruction.enter_numbers"), {
                  language: i18n.language === "vi" ? "vi-VN" : "en-US",
                  pitch: 1,
                  rate: 0.9,
                });
              } else if (currentStep?.title || currentStep?.description) {
                const speechText = `${currentStep.title || ""}. ${
                  currentStep.description || ""
                }`;

                Speech.speak(speechText, {
                  language: i18n.language === "vi" ? "vi-VN" : "en-US",
                  pitch: 1,
                  rate: 0.9,
                });
              }
            }}
          >
            <Ionicons
              name="volume-medium"
              size={30}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </LinearGradient>

        {stepIndex === 0 ? (
          <Text style={styles.title}>{t("instruction.enter_numbers")}</Text>
        ) : (
          currentStep?.title && (
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
          )
        )}
      </View>

      {stepIndex === 0 && (
        <View style={styles.stepZeroContainer}>
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
              maxLength={getMaxLength(1)}
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
              maxLength={getMaxLength(2)}
            />
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

              <View style={{ width: "80%" }}>
                {stepIndex === 2 && Array.isArray(currentStep.subSteps) ? (
                  currentStep.subSteps.map((text, idx) => {
                    const isVisible = idx <= subStepIndex; // Hiện đến bước đang thực hiện
                    const isCurrent = idx === subStepIndex; // Dòng đang thực hiện

                    return isVisible ? (
                      <Text
                        key={idx}
                        style={[
                          styles.subText,
                          isCurrent && {
                            // backgroundColor: theme.colors.orangeLight,
                            color: getBorderBox(),
                            borderRadius: 6,
                            padding: 6,
                          },
                        ]}
                      >
                        {text}
                      </Text>
                    ) : null;
                  })
                ) : (
                  <Text style={styles.subText}>{currentStep.subText}</Text>
                )}
              </View>
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
            revealedResultDigits={revealedResultDigits}
            setRevealedResultDigits={setRevealedResultDigits}
            subStepIndex={subStepIndex}
            t={t}
          />
        )}
        {operator === "×" && stepIndex === 2 && (
          <MultiplicationStepView
            steps={steps}
            stepIndex={stepIndex}
            skillName={skillName}
            currentRowIndex={currentRowIndex}
            setCurrentRowIndex={setCurrentRowIndex}
            revealedDigits={revealedDigits}
            setRevealedDigits={setRevealedDigits}
            revealedResultDigits={revealedResultDigits}
            setRevealedResultDigits={setRevealedResultDigits}
            multiplier1={number1}
            multiplier2={number2}
            subStepIndex={subStepIndex}
            columnStepIndex={columnStepIndex}
            setColumnStepIndex={setColumnStepIndex}
          />
        )}

        <View style={styles.backStepContainer}>
          {stepIndex > 0 && (
            <LinearGradient
              colors={getGradient()}
              style={styles.backStepButton}
            >
              <TouchableOpacity
                onPress={() => {
                  if (stepIndex > 0) {
                    setStepIndex((prev) => Math.max(prev - 1, 0));
                    setCurrentRowIndex(0);
                    setRevealedDigits(0);
                    setRevealedResultDigits(0);
                    setSubStepIndex(0); // nếu đang dùng substep hiển thị từng dòng mô tả
                  }
                }}
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
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextText}>{t("button.next")}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <FloatingMenu />
    </View>
  );
}

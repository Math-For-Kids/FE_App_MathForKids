import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../themes/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Fonts } from "../../../constants/Fonts";
import FloatingMenu from "../../components/FloatingMenu";
import { useTranslation } from "react-i18next";

export default function ExerciseResultScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { answers, questions, score, correctCount, wrongCount, skillName } =
    route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { t, i18n } = useTranslation("exercise");

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

  const getQuestionColor = (question) => {
    const selected = answers[question.id];
    return selected === question.answer
      ? getCorrectBackground()
      : theme.colors.redTomato;
  };

  const getGradient = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
  };

  const getCorrectBackground = () => {
    if (skillName === "Addition") return theme.colors.GreenDark;
    if (skillName === "Subtraction") return theme.colors.purpleDark;
    if (skillName === "Multiplication") return theme.colors.orangeDark;
    if (skillName === "Division") return theme.colors.redDark;
    return theme.colors.pinkDark;
  };

  const isImageUrl = (value) => {
    return (
      typeof value === "string" &&
      (value.startsWith("http") || value.startsWith("https"))
    );
  };

  const renderImage = (uri, style, key) => {
    if (!uri || typeof uri !== "string") {
      console.warn(`Invalid image URI for key ${key}:`, uri);
      return <Text style={styles.errorText}>Invalid Image</Text>;
    }
    return (
      <Image
        source={{ uri }}
        style={style}
        resizeMode="contain"
        onError={(e) =>
          console.warn(
            `Failed to load image ${uri} for key ${key}:`,
            e.nativeEvent.error
          )
        }
        onLoad={() => console.log(`Image loaded successfully: ${uri}`)}
      />
    );
  };

  const extractNumbers = (answerText) => {
    console.log("Extracting numbers from answerText:", answerText); // Debug log
    if (!answerText || typeof answerText !== "string") {
      console.warn("Invalid answerText:", answerText);
      return { number1: "", number2: "" };
    }
    // Match patterns like "4 + 3 = 7" or "4 + 3" or "4+3=7" or "4+3"
    let match = answerText.match(/(\d+)\s*[\+\-\×\÷xX]\s*(\d+)/);
    if (match) {
      console.log("Extracted numbers:", {
        number1: match[1],
        number2: match[2],
      }); // Debug log
      return { number1: match[1], number2: match[2] };
    }
    match = answerText.match(/(\d+)\s*và\s+(\d+)/i);
    if (match) {
      console.log("Extracted number:", {
        number1: match[1],
        number2: match[2],
      });
      return { number1: match[1], number2: match[2] };
    }
    console.warn("No numbers found in answerText:", answerText);
    return { number1: "", number2: "" };
  };

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
    backIcon: {
      width: 24,
      height: 24,
    },
    headerText: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      width: "60%",
      textAlign: "center",
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    scoreText: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
    correctText: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
    wrongText: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
    wrongNumber: { color: theme.colors.red },
    resultList: {
      padding: 20,
      gap: 15,
    },
    questionBox: {
      padding: 20,
      borderRadius: 15,
      elevation: 3,
      alignItems: "center",
    },
    questionText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    modalQuestionText: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
      marginBottom: 10,
      textAlign: "center",
    },
    modalAnswerText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
      marginBottom: 10,
      textAlign: "center",
    },
    modalImage: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: getCorrectBackground(),
      borderRadius: 5,
    },
    stepByStepButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
    },
    buttonText: {
      color: theme.colors.blueLight,
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    buttonClose: {
      color: theme.colors.white,
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    errorText: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.red,
      fontSize: 18,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.pop(2)}
          style={styles.backButton}
        >
          <Image source={theme.icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text
          style={styles.headerText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {t("header")}
        </Text>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <Text style={styles.scoreText}>{t("score")}: {score}</Text>
        <Text style={styles.correctText}>{t("score")}: {correctCount}</Text>
        <Text style={styles.wrongText}>
          {t("wrong")} <Text style={styles.wrongNumber}>{wrongCount}</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.resultList}>
        {questions.map((q, index) => (
          <TouchableOpacity
            key={q.id}
            style={[
              styles.questionBox,
              { backgroundColor: getQuestionColor(q) },
            ]}
            onPress={() => {
              setSelectedQuestion(q);
              setModalVisible(true);
            }}
          >
            <Text style={styles.questionText}>{t("question")} {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedQuestion && (
              <>
                <Text style={styles.modalQuestionText}>
                  {selectedQuestion.type === "image"
                    ? t("imageQuestion")
                    : selectedQuestion.question}
                </Text>
                {selectedQuestion.type === "image" &&
                  renderImage(
                    selectedQuestion.image?.uri,
                    styles.modalImage,
                    `modal-question-${selectedQuestion.id}`
                  )}
                <Text style={styles.modalAnswerText}>
                  {t("selectedAnswer")}: {answers[selectedQuestion.id] || "None"}
                </Text>
                <Text style={styles.modalAnswerText}>
                  {t("correctAnswer")}:{" "}
                  {selectedQuestion.expression
                    ? selectedQuestion.expression
                    : selectedQuestion.answer}
                </Text>

                <TouchableOpacity
                  style={styles.stepByStepButton}
                  onPress={() => {
                    const answerText =
                      selectedQuestion.expression ||
                      selectedQuestion.answer ||
                      "";

                    const { number1, number2 } = extractNumbers(answerText);
                    if (!number1 || !number2) {
                      console.warn(
                        "Navigation skipped: Invalid numbers extracted",
                        {
                          number1,
                          number2,
                          answerText,
                        }
                      );
                      return;
                    }
                    setModalVisible(false);
                    navigation.navigate("StepByStepScreen", {
                      skillName,
                      number1,
                      number2,
                      operator: getOperatorFromSkillName(skillName),
                    });
                  }}
                >
                  <Text style={styles.buttonText}>{t("goToStepByStep")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonClose}>{t("close")}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <FloatingMenu />
    </View>
  );
}

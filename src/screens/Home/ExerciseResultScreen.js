import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../themes/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Fonts } from "../../../constants/Fonts";
export default function ExerciseResultScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { answers, questions, score, correctCount, wrongCount, skillName } =
    route.params;

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
      width: "60%",
      textAlign: "center",
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    scoreText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    correctText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    wrongText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
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
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text
          style={styles.headerText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          Exercise result
        </Text>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.correctText}>Correct: {correctCount}</Text>
        <Text style={styles.wrongText}>
          Wrong: <Text style={styles.wrongNumber}>{wrongCount}</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.resultList}>
        {questions.map((q) => (
          <View
            key={q.id}
            style={[
              styles.questionBox,
              { backgroundColor: getQuestionColor(q) },
            ]}
          >
            <Text style={styles.questionText}>Question {q.id}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

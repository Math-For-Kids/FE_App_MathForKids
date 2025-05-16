import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName, title } = route.params;

  const questions = [
    { id: 1, answer: 2, image: theme.icons.question1 },
    { id: 2, answer: 3, image: theme.icons.question1 },
    { id: 3, answer: 4, image: theme.icons.question1 },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const optionRefs = useRef({});
  const boxRefs = useRef({});
  const flyingAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [flyingValue, setFlyingValue] = useState(null);
  const [isFlying, setIsFlying] = useState(false);

  const handleSelect = (questionId, value) => {
    const optionRef = optionRefs.current[`q${questionId}-opt${value}`];
    const boxRef = boxRefs.current[`box${questionId}`];

    if (optionRef && boxRef) {
      optionRef.measure((fx, fy, width, height, px, py) => {
        boxRef.measure((bx, by, bWidth, bHeight, bpx, bpy) => {
          // bắt đầu animation từ vị trí nút
          flyingAnim.setValue({
            x: px + width / 2 - 25,
            y: py + height / 2 - 25,
          });
          setFlyingValue(value);
          setIsFlying(true);
          Animated.timing(flyingAnim, {
            // điểm đến
            toValue: {
              x: bpx + bWidth / 2 - 25,
              y: bpy + bHeight / 2 - 25,
            },
            duration: 800,
            useNativeDriver: true,
          }).start(() => {
            setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
            setIsFlying(false);
          });
        });
      });
    }
  };
  const generateOptions = (question) => {
    const correct = question.answer;
    const wrong1 = correct + 1;
    const wrong2 = correct - 1;
    const wrong3 = correct + 2;

    // Trả về mảng hoán vị để vị trí đáp án đúng không cố định
    return shuffleArray([correct, wrong1, wrong2, wrong3]);
  };

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };
  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;

    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined) {
        if (selected === q.answer) correct++;
        else wrong++;
      }
    });

    const score = correct * 5; // mỗi câu đúng 5 điểm

    return { correct, wrong, score };
  };

  const getGradient = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
  };
  const getOptionBackground = () => {
    if (skillName === "Addition") return theme.colors.greenLight;
    if (skillName === "Subtraction") return theme.colors.purpleLight;
    if (skillName === "Multiplication") return theme.colors.orangeLight;
    if (skillName === "Division") return theme.colors.redLight;
    return theme.colors.pinkLight;
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
    requestContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      alignItems: "center",
    },
    soundOnIcon: { width: 40, height: 40 },
    requestText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
      fontSize: 18,
    },
    questionContainer: { marginBottom: 30, paddingHorizontal: 20 },
    questionImageContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    optionsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 10,
    },
    option: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: getOptionBackground(),
      elevation: 3,
    },
    optionText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      fontSize: 18,
    },
    selectedAnswerBox: {
      width: 80,
      height: 80,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: getOptionBackground(),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      backgroundColor: theme.colors.cardBackground,
    },
    selectedAnswerTextContainer: {
      backgroundColor: getOptionBackground(),
      borderRadius: 50,
      paddingHorizontal: 20,
      paddingVertical: 10,
      elevation: 3,
    },
    selectedAnswerText: {
      fontSize: 24,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    questionText: {
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 16,
      marginTop: 10,
      marginBottom: 5,
    },
    submitButton: {
      marginTop: 20,
      paddingHorizontal: 40,
      paddingVertical: 10,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    submitText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      textAlign: "center",
    },
    isFlying: {
      position: "absolute",
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: getOptionBackground(),
      justifyContent: "center",
      alignItems: "center",
      transform: flyingAnim.getTranslateTransform(),
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
          {title}
        </Text>
      </LinearGradient>

      <ScrollView>
        <View style={styles.requestContainer}>
          <Image source={theme.icons.soundOn} style={styles.soundOnIcon} />
          <Text style={styles.requestText}>Choose the correct answer</Text>
        </View>

        {questions.map((q) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>Question {q.id}</Text>
            <View style={styles.questionImageContainer}>
              <Image
                source={q.image}
                style={{ width: 150, height: 150, marginVertical: 10 }}
                resizeMode="contain"
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Image
                  source={theme.icons.equalMark}
                  style={{ width: 50, height: 40, marginVertical: 10 }}
                  resizeMode="contain"
                />
                <View
                  style={styles.selectedAnswerBox}
                  ref={(ref) => (boxRefs.current[`box${q.id}`] = ref)}
                >
                  {selectedAnswers[q.id] !== undefined && (
                    <View style={styles.selectedAnswerTextContainer}>
                      <Text style={styles.selectedAnswerText}>
                        {selectedAnswers[q.id]}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.optionsRow}>
              {generateOptions(q).map((val) =>
                selectedAnswers[q.id] === val ? null : (
                  <TouchableOpacity
                    key={`q${q.id}-opt${val}`}
                    style={styles.option}
                    ref={(ref) =>
                      (optionRefs.current[`q${q.id}-opt${val}`] = ref)
                    }
                    onPress={() => handleSelect(q.id, val)}
                  >
                    <Text style={styles.optionText}>{val}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <LinearGradient colors={getGradient()} style={styles.submitButton}>
        <TouchableOpacity
          onPress={() => {
            const { correct, wrong, score } = calculateResults();
            navigation.navigate("ExerciseResultScreen", {
              skillName,
              answers: selectedAnswers,
              questions,
              score,
              correctCount: correct,
              wrongCount: wrong,
            });
          }}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/* Viên bay */}
      {isFlying && (
        <Animated.View style={styles.isFlying}>
          <Text style={styles.optionText}>{flyingValue}</Text>
        </Animated.View>
      )}
    </View>
  );
}

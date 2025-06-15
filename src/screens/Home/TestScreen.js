import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { Svg, Circle } from "react-native-svg";

export default function TestScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName } = route.params;
  const time = 30;
  const quantity = 30;
  const windowWidth = Dimensions.get("window").width;

  const [questions] = useState([
    { id: 1, type: "image", image: theme.icons.question1, answer: 5 },
    { id: 2, type: "text", text: "2788 + 37", answer: 5 },
    { id: 3, type: "text", text: "2 + 3", answer: 5 },
    { id: 4, type: "image", image: theme.icons.question1, answer: 5 },
    { id: 5, type: "text", text: "2788 + 37", answer: 5 },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const bearPosition = useRef(new Animated.Value(20)).current;
  const [timer, setTimer] = useState(time * 60);
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const bearRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const totalMargin = (questions.length - 1) * 2;
    const progressBarWidth = windowWidth - 40;
    const segmentWidth = (progressBarWidth - totalMargin) / questions.length;
    const iconPositionX = 20 + (currentQuestion - 1) * (segmentWidth + 2);

    Animated.parallel([
      Animated.spring(bearPosition, {
        toValue: iconPositionX,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(bearRotate, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bearRotate, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bearRotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const generateOptions = (correctAnswer) => {
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const fake = correctAnswer + Math.floor(Math.random() * 5) - 2;
      if (fake !== correctAnswer && fake > 0) options.add(fake);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const currentQ = questions[currentQuestion - 1];
  const options = useMemo(
    () => generateOptions(currentQ.answer),
    [currentQuestion]
  );

  const handleAnswer = (val) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    if (val === currentQ.answer) setCorrectCount((prev) => prev + 1);
    if (currentQuestion < questions.length)
      setCurrentQuestion(currentQuestion + 1);
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      const prevQuestion = questions[currentQuestion - 2];
      const prevAnswer = userAnswers[prevQuestion.id];
      // Nếu đã chọn và đúng, giảm correctCount
      if (prevAnswer !== undefined && prevAnswer === prevQuestion.answer) {
        setCorrectCount((prev) => Math.max(0, prev - 1));
      }
      // Xoá đáp án đã chọn khi back
      setUserAnswers((prev) => {
        const updated = { ...prev };
        delete updated[prevQuestion.id];
        return updated;
      });

      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const usedTime = time * 60 - timer;
    clearInterval(timerRef.current);
    if (answeredCount < questions.length) {
      Alert.alert(
        "Warning",
        `You have ${answeredCount}/${questions.length} unanswered questions. Do you still want to submit?`,
        [
          {
            text: "Keep doing",
            style: "cancel",
            onPress: () => {
              timerRef.current = setInterval(() => {
                setTimer((prev) => {
                  if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            },
          },
          {
            text: "Submit",
            style: "destructive",
            onPress: () => {
              setElapsedTime(usedTime);
              setShowResultModal(true);
            },
          },
        ]
      );
    } else {
      setElapsedTime(usedTime);
      setShowResultModal(true);
    }
  };

  const progress = Math.min(Math.max(timer / (time * 60), 0), 1);
  const strokeDashoffset = 2 * Math.PI * 25 * (1 - progress);

  const getGradient = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
  };

  const getProgressBackground = () => {
    if (skillName === "Addition") return theme.colors.GreenLight;
    if (skillName === "Subtraction") return theme.colors.purpleLight;
    if (skillName === "Multiplication") return theme.colors.orangeLight;
    if (skillName === "Division") return theme.colors.redLight;
    return theme.colors.pinkLight;
  };

  const visualProgressBar = () => {
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
      height: "22%",
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
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      color: theme.colors.white,
      width: "60%",
      textAlign: "center",
    },
    subtitleContainer: {
      marginHorizontal: 20,
      marginVertical: -10,
    },
    subtitleText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
    visualProgressBar: {
      marginTop: 62,
      marginHorizontal: 20,
      height: 20,
      backgroundColor: getProgressBackground(),
      borderRadius: 10,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      elevation: 3,
    },
    segmentBlock: {
      flex: 1,
      marginHorizontal: 1,
      height: "100%",
      borderRadius: 2,
    },
    bearIconWrapper: {
      position: "absolute",
      top: 190,
      left: -5,
      elevation: 3,
    },
    bearIcon: {
      width: 30,
      height: 30,
    },
    timerCircleContainer: {
      position: "absolute",
      top: 110,
      right: 35,
      alignItems: "center",
      justifyContent: "center",
      width: 60,
      height: 60,
      alignSelf: "center",
      marginVertical: 20,
      elevation: 3,
    },
    timerTextOverlay: {
      position: "absolute",
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
      fontSize: 14,
    },
    questionContent: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
      flexDirection: "row",
      gap: 10,
    },
    questionImage: {
      width: 200,
      height: 150,
    },
    question: {
      fontSize: 100,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
      maxWidth: "80%",
      height: 150,
      lineHeight: 150,
      textAlignVertical: "center",
      alignSelf: "center",
    },
    backQuestion: {
      position: "absolute",
      bottom: 130,
      left: 20,
      borderWidth: 1,
      borderColor: theme.colors.white,
      backgroundColor: visualProgressBar(),
      borderRadius: 50,
      padding: 5,
      elevation: 3,
    },
    answerOptions: {
      flexDirection: "row",
      justifyContent: "space-around",
      flexWrap: "wrap",
      paddingHorizontal: 20,
    },
    answerButton: {
      backgroundColor: visualProgressBar(),
      paddingVertical: 5,
      paddingHorizontal: 60,
      borderRadius: 20,
      margin: 5,
      elevation: 3,
    },
    answerText: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      fontSize: 32,
    },
    answerSelectedButton: { backgroundColor: getProgressBackground() },
    submitButton: {
      marginTop: 20,
      paddingVertical: 10,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    submitText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.overlay,
    },
    modalCardContainer: {
      backgroundColor: visualProgressBar(),
      width: "80%",
      height: "50%",
      borderRadius: 10,
      justifyContent: "center",
      elevation: 3,
    },
    modalTitleText: {
      color: theme.colors.white,
      fontSize: 28,
      fontFamily: Fonts.NUNITO_BOLD,
      textAlign: "center",
    },
    modalTextContainer: {
      marginTop: 10,
    },
    modalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      paddingHorizontal: 20,
    },
    modalText: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
    modalResultText: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    closeIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 10,
      borderWidth: 1,
      borderColor: theme.colors.white,
      borderRadius: 50,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Confirm", "Want to skip the test?", [
              {
                text: "No",
                style: "cancel",
              },
              {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          }}
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
          Test
        </Text>
      </LinearGradient>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>Total questions: {quantity}</Text>
        <Text style={styles.subtitleText}>
          Anwsers: {currentQuestion}/{quantity}
        </Text>
      </View>
      <View style={styles.timerCircleContainer}>
        <Svg width={60} height={60}>
          <Circle
            cx={30}
            cy={30}
            r={25}
            stroke={theme.colors.graySoft}
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={30}
            cy={30}
            r={25}
            stroke={getProgressBackground()}
            strokeWidth={10}
            strokeDasharray={2 * Math.PI * 25}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation={-90}
            origin="30, 30"
          />
        </Svg>
        <Text style={styles.timerTextOverlay}>{formatTime(timer)}</Text>
      </View>
      <View style={styles.visualProgressBar}>
        {questions.map((q, index) => (
          <View
            key={q.id}
            style={[
              styles.segmentBlock,
              {
                backgroundColor:
                  index < currentQuestion
                    ? visualProgressBar()
                    : theme.colors.progressTestBackground,
              },
            ]}
          />
        ))}
      </View>
      <Animated.View
        style={[
          styles.bearIconWrapper,
          {
            transform: [
              { translateX: bearPosition },
              {
                rotate: bearRotate.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ["-10deg", "0deg", "10deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={theme.icons.test} style={styles.bearIcon} />
      </Animated.View>

      <View style={styles.questionContent}>
        {currentQ.type === "image" ? (
          <Image
            source={currentQ.image}
            style={styles.questionImage}
            resizeMode="contain"
          />
        ) : (
          <Text
            style={styles.question}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {currentQ.text}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleBack()}
        style={styles.backQuestion}
      >
        <Ionicons name="play-back" size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <View style={styles.answerOptions}>
        {options.map((val) => (
          <TouchableOpacity
            key={val}
            style={[
              styles.answerButton,
              userAnswers[currentQ.id] === val && styles.answerSelectedButton,
            ]}
            onPress={() => handleAnswer(val)}
          >
            <Text style={styles.answerText}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <LinearGradient
        colors={getGradient()}
        style={styles.submitButton}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/* Result Modal */}
      <Modal visible={showResultModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalCardContainer}>
            <Text style={styles.modalTitleText}>Result</Text>
            <View style={styles.modalTextContainer}>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Score:</Text>
                <Text style={styles.modalResultText}>
                  {correctCount * (10 / questions.length).toFixed(1)}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Correct:</Text>
                <Text style={styles.modalResultText}>{correctCount}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Wrong:</Text>
                <Text
                  style={[
                    styles.modalResultText,
                    {
                      color:
                        questions.length - correctCount > 0
                          ? theme.colors.black
                          : theme.colors.white,
                    },
                  ]}
                >
                  {questions.length - correctCount}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Time:</Text>
                <Text style={styles.modalResultText}>
                  {formatTime(elapsedTime)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setShowResultModal(false);
                navigation.goBack();
              }}
            >
              <Ionicons name="close" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

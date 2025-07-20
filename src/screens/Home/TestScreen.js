import React, { useState, useEffect, useRef } from "react";
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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getRandomTests,
  createTest,
  createMultipleTestQuestions,
} from "../../redux/testSlice";
import { updatePupilProfile, pupilById } from "../../redux/profileSlice";
import { completeAndUnlockNextLesson } from "../../redux/completedLessonSlice";
import { getEnabledLevels } from "../../redux/levelSlice";
import { Svg, Circle } from "react-native-svg";
import {
  getGoalsWithin30Days,
  autoMarkCompletedGoals,
} from "../../redux/goalSlice";
export default function TestScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("test");
  const { skillName, lessonId, pupilId, levelIds, skillIcon } = route.params;
  console.log("levelIds", levelIds);
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state) => state.test);
  const pupil = useSelector((state) => state.profile.info);
  const { levels } = useSelector((state) => state.level);
  const windowWidth = Dimensions.get("window").width;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const bearPosition = useRef(new Animated.Value(20)).current;
  const bearRotate = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [nextLessonName, setNextLessonName] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const validTests = tests.filter((item) => item.question && item.answer);
  const totalQuestions = validTests.length;
  const currentQ = validTests[currentQuestion - 1];
  // Consolidated timer logic
  useEffect(() => {
    if (!validTests.length || showResultModal) return;
    let newTime = 10; // Default 10 minutes
    if (validTests.length > 10 && validTests.length <= 20) {
      newTime = 25;
    } else if (validTests.length > 20 && validTests.length <= 30) {
      newTime = 35;
    }
    const totalSeconds = newTime * 60;
    setTimer(totalSeconds);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        if (prev === 60) {
          Alert.alert(t("warning"), t("timeAlmostUp"));
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [validTests.length, t, showResultModal]);

  useEffect(() => {
    dispatch(getRandomTests({ lessonId }));
    dispatch(getEnabledLevels());
    dispatch(updatePupilProfile({ id: pupilId }));
    if (pupilId) {
      dispatch(pupilById(pupilId));
    }
  }, [dispatch, lessonId, pupilId]);

  // Shuffle options with unique IDs
  useEffect(() => {
    if (!currentQ) return;
    if (!shuffledOptions[currentQ.id]) {
      const options = [...(currentQ.option || []), currentQ.answer]
        .map((option, index) => ({
          value: option,
          id: `${currentQ.id}-option-${index}`, // Unique ID for each option
          levelId: currentQ.levelId || currentQ.level,
        })
      ).sort(() => Math.random() - 0.5);
      setShuffledOptions((prev) => ({
        ...prev,
        [currentQ.id]: options,
      }));
    }
  }, [currentQ]);

  useEffect(() => {
    if (!validTests.length || showResultModal) return;
    const totalMargin = (validTests.length - 1) * 2;
    const progressBarWidth = windowWidth - 40;
    const segmentWidth = (progressBarWidth - totalMargin) / validTests.length;
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
  }, [currentQuestion, validTests.length, showResultModal]);

  const extractAnswerValue = (value, questionLevel) => {
    const questionLevelObj = levels.find(
      (level) => String(level.id) === String(questionLevel)
    );
    const isEasyLevel = questionLevelObj
      ? questionLevelObj.level === 1 : false;
    if (isEasyLevel && typeof value === "string" && value.includes("=")) {
      return value.split("=")[1].trim();
    }
    return value;
  }

  const handleAnswer = (val, levelId) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: extractAnswerValue(val, levelId) }));
    if (currentQuestion < validTests.length) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!validTests.length) {
      return { score: 0, correct: 0, wrong: 0 };
    }
    let rawScore = 0;
    let maxScore = 0;
    let correct = 0;
    let wrong = 0;

    validTests.forEach((q) => {
      const questionLevelObj = levels.find(
        (level) => String(level.id) === String(q.levelId || q.level)
      );
      const questionLevel = questionLevelObj ? questionLevelObj.level : 1;
      maxScore += questionLevel;

      if (userAnswers[q.id] !== undefined && userAnswers[q.id] === extractAnswerValue(q.answer, q.levelId)) {
        rawScore += questionLevel;
        correct++;
      } else if (userAnswers[q.id] !== undefined) {
        wrong++;
      }
    });

    const score = maxScore > 0 ? (rawScore / maxScore) * 10 : 0;
    return { score: Math.round(score), correct, wrong };
  };

  const calculateBonusPoint = (score) => {
    if (score >= 9) return 5;
    if (score >= 7 && score <= 8) return 3;
    if (score > 5) return 1;
    return 0;
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(userAnswers).length;
    const totalTime =
      (validTests.length > 20 ? 35 : validTests.length > 10 ? 25 : 10) * 60;
    clearInterval(timerRef.current);

    const { score, correct, wrong } = calculateScore();
    setFinalScore(score);
    setCorrectCount(correct);
    setWrongCount(wrong);
    const bonus = calculateBonusPoint(score);
    const currentPoint = pupil?.point || 0;
    const newPoint = currentPoint + bonus;

    const doSubmit = async () => {
      try {
        const usedTime = totalTime - timer;
        const actualElapsedTime = Math.max(0, usedTime);
        setElapsedTime(actualElapsedTime);
        const testPayload = {
          pupilId,
          lessonId,
          point: score,
          duration: usedTime,
        };

        const testResult = await dispatch(createTest(testPayload)).unwrap();
        const testId = testResult?.message?.id;

        if (testId) {
          const questionPayloads = validTests.map((question) => ({
            testId,
            exerciseId: question.id,
            levelId: question.levelId || question.level,
            question: question.question,
            image: question.image || null,
            option: question.option || [],
            correctAnswer: question.answer,
            selectedAnswer: userAnswers[question.id] || null,
          }));
          await dispatch(
            createMultipleTestQuestions(questionPayloads)
          ).unwrap();
        }
        await dispatch(getGoalsWithin30Days(pupilId));
        setShowResultModal(true);

        if (bonus > 0) {
          dispatch(
            updatePupilProfile({ id: pupilId, data: { point: newPoint } })
          );
        }
        if (score >= 9) {
          const unlockResult = await dispatch(
            completeAndUnlockNextLesson({ pupilId, lessonId })
          ).unwrap();
          const exercise = levelIds.join(",");
          const res = await dispatch(
            autoMarkCompletedGoals({ pupilId, lessonId, exercise })
          );

          if (res.payload?.message?.[i18n.language]) {
            Alert.alert(t("success"), res.payload.message[i18n.language]);
          } else if (res.error?.message?.[i18n.language]) {
            Alert.alert(t("error"), res.error.message[i18n.language]);
          }
          setNextLessonName(
            unlockResult?.nextLessonName?.[i18n.language] || null
          );
        } else {
          setNextLessonName(null);
        }
      } catch (error) {
        Alert.alert(t("error"), error.message || t("submissionFailed"), [
          { text: "OK" },
        ]);
      }
    };

    if (answeredCount < validTests.length && timer > 0) {
      Alert.alert(t("warning"), t("youHaveAnswered"), [
        {
          text: t("keepDoing"),
          style: "cancel",
          onPress: () => {
            if (!showResultModal) {
              timerRef.current = setInterval(() => {
                setTimer((prev) => {
                  if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeUp();
                    return 0;
                  }
                  if (prev === 60) {
                    Alert.alert(t("warning"), t("timeAlmostUp"));
                  }
                  return prev - 1;
                });
              }, 1000);
            }
          },
        },
        {
          text: t("submit"),
          style: "destructive",
          onPress: doSubmit,
        },
      ]);
    } else {
      await doSubmit();
    }
  };

  const handleTimeUp = () => {
    Alert.alert(t("timeUp"), t("autoSubmit"));
    handleSubmit();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const progress = Math.min(
    Math.max(
      timer /
        ((validTests.length > 20 ? 30 : validTests.length > 10 ? 20 : 10) * 60),
      0
    ),
    1
  );
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
      backgroundColor: theme.colors.background,
    },
    skillsContainer: {
      paddingBottom: 80,
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
    },
    backButton: {
      position: "absolute",
      top: 50,
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
      marginTop: 20,
      fontSize: 32,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      color: theme.colors.white,
      width: "60%",
      textAlign: "center",
    },
    subtitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 20,
    },
    subtitleText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
    visualProgressBar: {
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
      top: -25,
      left: -5,
      elevation: 3,
    },
    bearIcon: {
      width: 25,
      height: 25,
    },
    timerCircleContainer: {
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
      marginTop: 20,
      gap: 10,
    },
    question: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    questionImage: {
      width: 300,
      height: 150,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: visualProgressBar(),
    },
    backQuestion: {
      marginVertical: 20,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: theme.colors.white,
      backgroundColor: visualProgressBar(),
      borderRadius: 50,
      padding: 10,
      elevation: 3,
      marginLeft: 20,
    },
    answerOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingHorizontal: 20,
      width: "100%",
      gap: 20,
    },
    answerButton: {
      backgroundColor: visualProgressBar(),
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      elevation: 3,
      minWidth: (windowWidth - 60) / 2,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 50,
    },
    answerSelectedButton: {
      backgroundColor: getProgressBackground(),
    },
    answerText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      fontSize: 18,
      textAlign: "center",
    },
    answerImage: {
      width: 50,
      height: 50,
      borderRadius: 10,
      alignSelf: "center",
    },
    submitButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    submitButton: {
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
      height: "auto",
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
      textAlign: "right",
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      flexShrink: 1,
      flexWrap: "wrap",
      maxWidth: "60%",
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
    loadingText: {
      fontSize: 18,
      textAlign: "center",
      color: theme.colors.text,
      marginTop: 20,
    },
    errorText: {
      fontSize: 18,
      textAlign: "center",
      color: theme.colors.error,
      marginTop: 20,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (validTests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("noExercisesFound")}</Text>
      </View>
    );
  }

  if (!currentQ) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("noQuestionAvailable")}</Text>
      </View>
    );
  }

  const options = shuffledOptions[currentQ.id] || [];

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(t("confirm"), t("wantToSkipTest"), [
              {
                text: t("no"),
                style: "cancel",
              },
              {
                text: t("yes"),
                style: "destructive",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          }}
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
          {t("exercise")}
        </Text>
      </LinearGradient>
      <View style={styles.subtitleContainer}>
        <View>
          <Text style={styles.subtitleText}>
            {t("totalQuestions")}: {totalQuestions}
          </Text>
          <Text style={styles.subtitleText}>
            {t("answers")}: {currentQuestion}/{totalQuestions}
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
      </View>
      <View>
        <View style={styles.visualProgressBar}>
          {validTests.map((q, index) => (
            <View
              key={q.id ?? `segment-${index}`} // Fallback to index if q.id is undefined
              style={[
                styles.segmentBlock,
                {
                  backgroundColor:
                    index <= currentQuestion - 1
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
      </View>
      <ScrollView contentContainerStyle={styles.skillsContainer}>
        <View>
          <View style={styles.questionContent}>
            {currentQ.question?.[i18n.language] && (
              <Text
                style={styles.question}
                numberOfLines={5}
                adjustsFontSizeToFit
                minimumFontScale={0.1}
              >
                {currentQ.question?.[i18n.language]}
              </Text>
            )}
            {currentQ.image && (
              <Image
                source={{ uri: currentQ.image }}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleBack()}
          style={styles.backQuestion}
        >
          <Ionicons name="play-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <View style={styles.answerOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id} // Use unique ID from shuffled options
              style={[
                styles.answerButton,
                userAnswers[currentQ.id] === extractAnswerValue(option.value, option.levelId)
                  ? styles.answerSelectedButton
                  : null,
              ]}
              onPress={() => handleAnswer(option.value)}
            >
              <Text style={styles.answerText}>{extractAnswerValue(option.value?.[i18n.language], option.levelId)}</Text>

            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.submitButtonContainer}>
        <LinearGradient
          colors={getGradient()}
          style={styles.submitButton}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitText}>{t("submit")}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <Modal visible={showResultModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalCardContainer}>
            <Text style={styles.modalTitleText}>{t("result")}</Text>
            <View style={styles.modalTextContainer}>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("score")}:</Text>
                <Text style={styles.modalResultText}>{finalScore}/10</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("correct")}:</Text>
                <Text style={styles.modalResultText}>{correctCount}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("wrong")}:</Text>
                <Text style={styles.modalResultText}>{wrongCount}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("time")}:</Text>
                <Text style={styles.modalResultText}>
                  {formatTime(elapsedTime)}
                </Text>
              </View>
              {nextLessonName && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalText}>{t("nextLesson")}:</Text>
                  <Text style={styles.modalResultText}>{nextLessonName}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setShowResultModal(false);
                navigation.goBack();
                setUserAnswers({});
                setShuffledOptions({});
                setNextLessonName(null);
                setCurrentQuestion(1);
              }}
            >
              <Ionicons name="close" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

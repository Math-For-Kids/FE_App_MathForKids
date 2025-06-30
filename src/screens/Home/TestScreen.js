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
import { getRandomTests } from "../../redux/testSlice";
import { updatePupilProfile, pupilById } from "../../redux/profileSlice";
import { completeAndUnlockNextLesson } from "../../redux/completedLessonSlice";
import { Svg, Circle } from "react-native-svg";

export default function TestScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("test");
  const { skillName, lessonId, pupilId } = route.params;

  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state) => state.test);
  const pupil = useSelector((state) => state.profile.info);
  const windowWidth = Dimensions.get("window").width;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const bearPosition = useRef(new Animated.Value(20)).current;
  const bearRotate = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(time * 60);
  const timerRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  // const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);

  const currentQ = tests[currentQuestion - 1];
  const totalQuestions = tests.length;

  const isImageUrl = (value) =>
    typeof value === "string" &&
    (value.startsWith("http") || value.startsWith("https"));

  const renderImage = (uri, style, key) => {
    if (!uri || typeof uri !== "string") return <Text>Invalid Image</Text>;
    return (
      <Image source={{ uri }} style={style} resizeMode="contain" key={key} />
    );
  };
  const [time, setTime] = useState(10);
  useEffect(() => {
    const totalQuestions = tests.length;
    let newTime = 10;

    if (totalQuestions > 10 && totalQuestions <= 20) {
      newTime = 20;
    } else if (totalQuestions > 20 && totalQuestions <= 30) {
      newTime = 30;
    }

    setTime(newTime);
  }, [tests]);
  useEffect(() => {
    setTimer(time * 60);
  }, [time]);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        if (prev === 60) {
          Alert.alert("Thông báo", "Sắp hết giờ làm bài!");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);
  useEffect(() => {
    if (timer === 60) {
      Alert.alert(t("warning"), t("timeAlmostUp"));
    }

    if (timer === 0) {
      clearInterval(timerRef.current);
      handleTimeUp();
    }
  }, [timer]);

  useEffect(() => {
    dispatch(getRandomTests({ lessonId }));
    dispatch(updatePupilProfile({ id: pupilId }));
    if (pupilId) {
      dispatch(pupilById(pupilId));
    }
  }, [dispatch, lessonId, pupilId]);

  useEffect(() => {
    if (!currentQ) return;
    if (!shuffledOptions[currentQ.id]) {
      const options = [...(currentQ.option || []), currentQ.answer].sort(
        () => Math.random() - 0.5
      );
      setShuffledOptions((prev) => ({
        ...prev,
        [currentQ.id]: options,
      }));
    }
  }, [currentQ]);

  useEffect(() => {
    if (!tests.length) return;
    const totalMargin = (tests.length - 1) * 2;
    const progressBarWidth = windowWidth - 40;
    const segmentWidth = (progressBarWidth - totalMargin) / tests.length;
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
  }, [currentQuestion, tests.length]);

  // const handleAnswer = (val) => {
  //   if (!currentQ) return;
  //   const isCorrect = val === currentQ.answer;
  //   setUserAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  //   if (isCorrect) setCorrectCount((prev) => prev + 1);
  //   if (currentQuestion < tests.length) {
  //     setTimeout(() => {
  //       setCurrentQuestion(currentQuestion + 1);
  //     }, 300);
  //   }
  // };
  const handleAnswer = (val) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    if (currentQuestion < tests.length) {
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

  // const handleBack = () => {
  //   if (currentQuestion > 1) {
  //     const prevQuestion = tests[currentQuestion - 2];
  //     const prevAnswer = userAnswers[prevQuestion.id];
  //     if (prevAnswer !== undefined && prevAnswer === prevQuestion.answer) {
  //       setCorrectCount((prev) => Math.max(0, prev - 1));
  //     }
  //     setCurrentQuestion(currentQuestion - 1);
  //   }
  // };
  // const calculateScore = () => {
  //   if (!tests.length) return 0;
  //   const rawScore = (correctCount / tests.length) * 10;
  //   const roundedScore = Math.round(rawScore);
  //   return roundedScore;
  // };
  const calculateScore = () => {
    if (!tests.length) return 0;
    const correctCount = tests.filter(
      (q) => userAnswers[q.id] === q.answer
    ).length;
    const rawScore = (correctCount / tests.length) * 10;
    return Math.round(rawScore);
  };

  // Hàm tính bonus point
  const calculateBonusPoint = (score) => {
    if (score >= 9) return 5;
    if (score >= 7 && score <= 8) return 3;
    if (score > 5) return 1;
    return 0;
  };
  const handleSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const usedTime = time * 60 - timer;
    clearInterval(timerRef.current);

    const score = calculateScore();
    const bonus = calculateBonusPoint(score);
    const currentPoint = pupil?.point || 0;
    const newPoint = currentPoint + bonus;

    // Action khi thực sự nộp bài
    const doSubmit = () => {
      setElapsedTime(usedTime);
      setShowResultModal(true);

      if (bonus > 0) {
        dispatch(
          updatePupilProfile({ id: pupilId, data: { point: newPoint } })
        );
      }

      // Gọi API mở khóa bài học tiếp theo
      dispatch(completeAndUnlockNextLesson({ pupilId, lessonId }));
    };

    if (answeredCount < tests.length && timer > 0) {
      Alert.alert(t("warning"), t("youHaveAnswered"), [
        {
          text: t("keepDoing"),
          style: "cancel",
          onPress: () => {
            // Nếu người dùng muốn tiếp tục làm, restart timer
            timerRef.current = setInterval(() => {
              setTimer((prev) => {
                if (prev <= 1) {
                  clearInterval(timerRef.current);
                  handleTimeUp();
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          },
        },
        {
          text: t("submit"),
          style: "destructive",
          onPress: doSubmit,
        },
      ]);
    } else {
      doSubmit();
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

  const progress = Math.min(Math.max(timer / (time * 60), 0), 1);
  const strokeDashoffset = 2 * Math.PI * 25 * (1 - progress);
  // Gradient and color functions
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
      height: 120,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 3,
      paddingTop: 20,
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
      fontSize: 14,
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
      alignSelf: "center", // Căn giữa hình ảnh trong nút
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

  // Handle loading and error states
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

  if (tests.length === 0) {
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
  // Hàm tính điểm trên thang 10

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
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
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
            {t("answers")}: {currentQuestion}/{tests.length}
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
          {tests.map((q, index) => (
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
      </View>
      <ScrollView contentContainerStyle={styles.skillsContainer}>
        <View>
          <View style={styles.questionContent}>
            {currentQ.question?.[i18n.language] && (
              <Text
                style={styles.question}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
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
          {options.map((val, index) => (
            <TouchableOpacity
              key={`${val}-${index}`}
              style={[
                styles.answerButton,
                userAnswers[currentQ.id] === val
                  ? styles.answerSelectedButton
                  : null,
                isImageUrl(val) && {
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                },
              ]}
              onPress={() => handleAnswer(val)}
            >
              {isImageUrl(val) ? (
                renderImage(
                  val,
                  styles.answerImage,
                  `option-${currentQ.id}-${index}`
                )
              ) : (
                <Text style={styles.answerText}>{val}</Text>
              )}
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
                <Text style={styles.modalResultText}>
                  {calculateScore()}/10
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("correct")}:</Text>
                <Text style={styles.modalResultText}>
                  {tests.filter((q) => userAnswers[q.id] === q.answer).length}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("wrong")}:</Text>
                <Text style={styles.modalResultText}>
                  {tests.length -
                    tests.filter((q) => userAnswers[q.id] === q.answer).length}
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
                setUserAnswers({});
                setCurrentQuestion(1);
                setShuffledOptions({});
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

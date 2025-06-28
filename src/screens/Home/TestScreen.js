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

export default function TestScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("common");
  const { skillName, lessonId } = route.params;
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state) => state.test);
  const windowWidth = Dimensions.get("window").width;

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const bearPosition = useRef(new Animated.Value(20)).current;
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState({});
  const [showResultModal, setShowResultModal] = useState(false);
  const bearRotate = useRef(new Animated.Value(0)).current;

  // Hàm kiểm tra xem giá trị có phải là URL hình ảnh
  const isImageUrl = (value) => typeof value === "string" && (value.startsWith("http") || value.startsWith("https"));

  // Hàm render hình ảnh
  const renderImage = (uri, style, key) => {
    if (!uri || typeof uri !== "string") return <Text style={styles.errorText}>Invalid Image</Text>;
    return <Image source={{ uri }} style={style} resizeMode="contain" key={key} />;
  };

  // Fetch exercises when component mounts
  useEffect(() => {
    dispatch(getRandomTests({ lessonId }));
  }, [dispatch, lessonId]);

  // Log exercises for debugging
  useEffect(() => {
    console.log("Exercises updated:", tests);
    console.log("Current Question:", currentQuestion);
    console.log("User Answers:", userAnswers);
    console.log("Shuffled Options:", shuffledOptions);
  }, [tests, currentQuestion, userAnswers, shuffledOptions]);

  // Shuffle options once per question
  useEffect(() => {
    if (tests.length === 0) return;

    const currentQ = tests[currentQuestion - 1];
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
  }, [tests, currentQuestion, shuffledOptions]);

  // Animate bear icon when currentQuestion changes
  useEffect(() => {
    if (tests.length === 0) return;

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

  // Handle answer selection
  const handleAnswer = (val) => {
    if (!currentQ) return;
    const isCorrect = val === currentQ.answer;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    if (currentQuestion < tests.length) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  // Handle going back to previous question
  const handleBack = () => {
    if (currentQuestion > 1) {
      const prevQuestion = tests[currentQuestion - 2];
      const prevAnswer = userAnswers[prevQuestion.id];
      if (prevAnswer !== undefined && prevAnswer === prevQuestion.answer) {
        setCorrectCount((prev) => Math.max(0, prev - 1));
      }
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle submit button
  const handleSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < tests.length) {
      Alert.alert(
        t("warning"),
        t("youHaveAnswered"),
        [
          {
            text: t("keepDoing"),
            style: "cancel",
          },
          {
            text: t("submit"),
            style: "destructive",
            onPress: () => {
              setShowResultModal(true);
            },
          },
        ]
      );
    } else {
      setShowResultModal(true);
    }
  };

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
    contentContainer: {
      paddingTop: 20,
      paddingBottom: 100,
    },
    header: {
      width: "100%",
      height: "35%",
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
      marginTop: 20,
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
      top: 50,
      left: -5,
      elevation: 3,
    },
    bearIcon: {
      width: 30,
      height: 30,
    },
    questionContent: {
      justifyContent: "center", // Căn giữa theo chiều ngang
      alignItems: "center",    // Căn giữa theo chiều dọc
      marginVertical: 20,
      flexDirection: "row",
      gap: 10,
    },
    question: {
      fontSize: 36,            // Tăng kích thước font để nổi bật
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
      textAlign: "center",     // Căn giữa văn bản
      paddingHorizontal: 20,   // Thêm padding để tránh bị chèn
    },
    questionImage: {
      width: 300,
      height: 150,  
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#000",
      borderStyle: "solid",
    },
    backQuestion: {
      position: "absolute",
      bottom: 0,
      left: 20,
      borderWidth: 1,
      borderColor: theme.colors.white,
      backgroundColor: visualProgressBar(),
      borderRadius: 50,
      padding: 5,
      elevation: 3,
    },
    answerOptions: {
      position: "absolute",
      top: 450,
      flexDirection: "row",
      justifyContent: "center", // Căn giữa theo chiều ngang
      alignItems: "center",    // Căn giữa theo chiều dọc
      flexWrap: "wrap",        // Cho phép xuống dòng nếu cần
      paddingHorizontal: 20,
      width: "100%",           // Đảm bảo chiều rộng đầy đủ
    },
    answerButton: {
      backgroundColor: visualProgressBar(),
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      margin: 5,
      elevation: 3,
      minWidth: (windowWidth - 60) / 2, // Đảm bảo các nút có chiều rộng tối thiểu
      alignItems: "center",
      justifyContent: "center", // Căn giữa nội dung trong nút
      minHeight: 60,
    },
    answerSelectedButton: {
      backgroundColor: getProgressBackground(),
    },
    answerText: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      fontSize: 20,
      textAlign: "center", // Căn giữa văn bản trong nút
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

  const currentQ = tests[currentQuestion - 1];
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
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
          <Text style={styles.subtitleText}>
            {t("totalQuestions")}: {tests.length}
          </Text>
          <Text style={styles.subtitleText}>
            {t("answers")}: {currentQuestion}/{tests.length}
          </Text>
        </View>
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
        <View style={styles.questionContent}>
          {currentQ.image ? (
            <Image
              source={{ uri: currentQ.image }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          ) : (
            <Text
              style={styles.question}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {currentQ.question?.[i18n.language] || t("noQuestionAvailable")}
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
          {options.map((val, index) => (
            <TouchableOpacity
              key={`${val}-${index}`}
              style={[
                styles.answerButton,
                userAnswers[currentQ.id] === val ? styles.answerSelectedButton : null,
                isImageUrl(val) && { paddingVertical: 5, paddingHorizontal: 5 },
              ]}
              onPress={() => handleAnswer(val)}
            >
              {isImageUrl(val) ? (
                renderImage(val, styles.answerImage, `option-${currentQ.id}-${index}`)
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
                  {(correctCount * (10 / tests.length)).toFixed(1)}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("correct")}:</Text>
                <Text style={styles.modalResultText}>{correctCount}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>{t("wrong")}:</Text>
                <Text
                  style={[
                    styles.modalResultText,
                    {
                      color:
                        tests.length - correctCount > 0
                          ? theme.colors.black
                          : theme.colors.white,
                    },
                  ]}
                >
                  {tests.length - correctCount}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setShowResultModal(false);
                navigation.goBack();
                setUserAnswers({});
                setCorrectCount(0);
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
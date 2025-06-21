import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import { ProgressBar } from "react-native-paper";
import { updatePupilProfile } from "../redux/pupilSlice";
import { useDispatch } from "react-redux";

export default function TestLevelScreen({ navigation, route }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { pupilId } = route.params || {};

  const [showModal, setShowModal] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);

  const testLevels = [
    {
      id: 1,
      question: { title: "2 + 3 = ?" },
      option: ["4", "5", "6", "7"],
      answer: 1,
    },
    {
      id: 2,
      question: { title: "4 - 2 = ?" },
      option: ["2", "3", "4", "5"],
      answer: 0,
    },
  ];

  const [selectedOptions, setSelectedOptions] = useState({});
  const questionCount = testLevels.length;

  const getInitialTime = () => {
    if (questionCount === 30) return 30 * 60;
    if (questionCount > 20) return 25 * 60;
    return 20 * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(true);
      return;
    }

    if (timeLeft === 60) {
      Alert.alert(
        "Your test time is running out.",
        "Make sure you complete all questions."
      );
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = (isAutoSubmit = false) => {
    const unanswered = testLevels.filter(
      (q) => selectedOptions[q.id] === undefined
    );

    if (unanswered.length > 0 && !isAutoSubmit) {
      Alert.alert(
        "Warning",
        `You have ${unanswered.length} unanswered questions. Do you still want to submit?`,
        [
          { text: "Keep doing", style: "cancel" },
          { text: "Submit", onPress: () => handleSubmit(true) },
        ]
      );
      return;
    }

    let correct = 0;
    testLevels.forEach((q) => {
      if (selectedOptions[q.id] === q.answer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / testLevels.length) * 10);
    setCorrectCount(correct);
    setScore(calculatedScore);

    // Cập nhật isAssess = true
    if (pupilId) {
      dispatch(updatePupilProfile({ id: pupilId, data: { isAssess: true } }));
    }

    setShowModal(true);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
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
    backContainer: {
      position: "absolute",
      left: 10,
      backgroundColor: theme.colors.backBackgound,
      marginLeft: 20,
      padding: 8,
      borderRadius: 50,
    },
    backIcon: { width: 24, height: 24 },
    title: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    timerContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "absolute",
      right: 20,
      top: 130,
      backgroundColor: theme.colors.cardBackground,
      padding: 5,
      borderRadius: 10,
      elevation: 3,
    },
    clockIcon: {
      width: 40,
      height: 40,
    },
    timerText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueDark,
    },
    leftText: { marginHorizontal: 20, marginBottom: 10 },
    text: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
    },
    ProgressBar: {
      height: 15,
      borderRadius: 20,
      elevation: 3,
      backgroundColor: theme.colors.progressBackground,
    },
    questionCard: {
      marginHorizontal: 20,
      padding: 16,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.white,
      marginBottom: 20,
      elevation: 3,
    },
    subjectText: {
      fontSize: 12,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
      marginBottom: 4,
    },
    questionText: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
      marginVertical: 8,
      textAlign: "center",
    },
    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    optionButton: {
      width: 60,
      height: 60,
      padding: 10,
      borderRadius: 8,
      elevation: 3,
      marginTop: 8,
      marginBottom: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.optionAnswerBackground,
    },
    optionText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
      textAlign: "center",
    },
    selectedOption: {
      backgroundColor: theme.colors.optionSelected,
    },
    selectedOptionText: {
      color: theme.colors.selectedOptionText,
    },
    submitButton: {
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    submitText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.overlay,
      elevation: 3,
    },
    modalContent: {
      backgroundColor: theme.colors.white,
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    modalMessage: {
      fontSize: 18,
      marginTop: 10,
    },
    modalButton: {
      marginTop: 20,
      backgroundColor: theme.colors.green,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
    },
    modalButtonText: {
      color: theme.colors.white,
      fontSize: 16,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={theme.icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Test Level</Text>
        {/* <View style={styles.timerContainer}>
          <Image
            source={theme.icons.time}
            style={styles.clockIcon}
            resizeMode="contain"
          />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View> */}
      </LinearGradient>

      {/* Info + Progress */}
      <View style={styles.leftText}>
        <Text style={styles.text}>Class: 3</Text>
        <Text style={styles.text}>Question total: {testLevels.length}</Text>
        <Text style={styles.text}>
          Answered: {Object.keys(selectedOptions).length}/{testLevels.length}
        </Text>
        <ProgressBar
          progress={Object.keys(selectedOptions).length / testLevels.length}
          color={theme.colors.green}
          style={styles.ProgressBar}
        />
      </View>

      {/* Questions */}
      <FlatList
        data={testLevels}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => {
          const alphabet = ["A", "B", "C", "D"];
          return (
            <View style={styles.questionCard}>
              <Text style={styles.subjectText}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{item.question.title}</Text>
              <View style={styles.optionsContainer}>
                {item.option.map((opt, idx) => {
                  const isSelected = selectedOptions[item.id] === idx;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectOption(item.id, idx)}
                      style={[
                        styles.optionButton,
                        isSelected && styles.selectedOption,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {alphabet[idx]}. {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        }}
      />

      {/* Submit */}
      <TouchableOpacity onPress={handleSubmit}>
        <LinearGradient
          style={styles.submitButton}
          colors={theme.colors.gradientBlue}
        >
          <Text style={styles.submitText}>Submit</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Result Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Score: {score}/10</Text>
            <Text style={styles.modalMessage}>
              Correct Answers: {correctCount} / {testLevels.length}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

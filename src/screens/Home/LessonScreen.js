import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import FloatingMenu from "../../components/FloatingMenu";
import { getLessonsByGradeAndType } from "../../redux/lessonSlice";
import { getExercisesByGradeAndType } from "../../redux/exerciseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import * as Speech from "expo-speech";
export default function LessonScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName, actionType, grade } = route.params;
  const { t } = useTranslation("lesson");
  const { t: c } = useTranslation("common");
  const dispatch = useDispatch();

  const normalizedSkillName = skillName.toLowerCase();
  const [activeTab, setActiveTab] = useState(actionType || "Lesson");

  const {
    lessons,
    loading: lessonLoading,
    error: lessonError,
  } = useSelector((state) => state.lesson);

  const {
    exercises,
    loading: exerciseLoading,
    error: exerciseError,
  } = useSelector((state) => state.exercise);

  useEffect(() => {
    dispatch(getLessonsByGradeAndType({ grade, type: normalizedSkillName }));
    dispatch(getExercisesByGradeAndType({ grade, type: normalizedSkillName }));
  }, []);
  console.log("normalizedSkillName", normalizedSkillName);
  const filteredLessons = lessons.filter(
    (item) => item.type?.toLowerCase() === skillName.toLowerCase()
  );

  const filteredExercises = exercises.filter(
    (item) => item.type?.toLowerCase() === skillName.toLowerCase()
  );

  const Test = [
    { id: 1, title: "Test 1", quantity: 30, time: 1, level: "Easy" },
    { id: 2, title: "Test 2", quantity: 30, time: 40, level: "Medium" },
    { id: 3, title: "Test 3", quantity: 30, time: 45, level: "Difficult" },
  ];

  const lessonData = {
    Lesson: filteredLessons,
    Exercise: filteredExercises,
    Test,
  };

  const currentData = lessonData[activeTab] || [];

  const getGradient = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
  };

  const getTab = () => {
    if (skillName === "Addition") return theme.colors.greenLight;
    if (skillName === "Subtraction") return theme.colors.purpleLight;
    if (skillName === "Multiplication") return theme.colors.orangeLight;
    if (skillName === "Division") return theme.colors.redLight;
    return theme.colors.pinkLight;
  };

  const getTabSelected = () => {
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
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    tabWrapper: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    tabItem: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: getTab(),
      borderRadius: 10,
      elevation: 3,
    },
    activeTabItem: {
      backgroundColor: getTabSelected(),
    },
    tabText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
    },
    activeTabText: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
    },
    lessonList: {
      paddingHorizontal: 20,
      paddingVertical: 40,
    },
    lessonCard: {
      borderRadius: 20,
      padding: 15,
      marginBottom: 30,
      height: 100,
      justifyContent: "center",
      elevation: 3,
    },
    lessonContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    lessonIcon: {
      position: "absolute",
      top: -40,
      left: -140,
      width: 30,
      height: 30,
    },
    lessonTextContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    lessonText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
      textAlign: "center",
    },
    lessonTestTextContainer: {
      flexWrap: "wrap",
      gap: 10,
      paddingHorizontal: 10,
    },
    lessonTestText: {
      color: theme.colors.white,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
  });

  if (lessonLoading || exerciseLoading) return <Text>Loading...</Text>;
  if (lessonError || exerciseError)
    return <Text>Error: {lessonError || exerciseError}</Text>;

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t("course")}</Text>
      </LinearGradient>

      <View style={styles.tabWrapper}>
        {["Lesson", "Exercise", "Test"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {c(tab.toLowerCase())}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.lessonList}>
        {currentData.map((item) => {
          const title =
            item.name?.[i18n.language] || item.name?.en || item.title;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (activeTab === "Lesson") {
                  navigation.navigate("LessonDetailScreen", {
                    skillName,
                    title,
                    lessonId: item.id,
                  });
                } else if (activeTab === "Exercise") {
                  navigation.navigate("ExerciseScreen", { skillName, title });
                } else if (activeTab === "Test") {
                  navigation.navigate("TestScreen", {
                    skillName,
                    title,
                    time: item.time,
                    quantity: item.quantity,
                    level: item.level,
                  });
                }
              }}
            >
              <LinearGradient
                colors={getGradient()}
                style={styles.lessonCard}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
              >
                <View style={styles.lessonContent}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        const speakText =
                          item.name?.[i18n.language] ||
                          item.name?.en ||
                          item.title;
                        Speech.speak(speakText, { language: i18n.language });
                      }}
                    >
                      <Image
                        source={theme.icons.soundOn}
                        style={styles.lessonIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.lessonTextContainer}>
                    <Text style={styles.lessonText}>{title}</Text>
                  </View>
                  {activeTab === "Test" && (
                    <View style={styles.lessonTestTextContainer}>
                      <Text style={styles.lessonTestText}>
                        {t("quantity")}: {item.quantity}
                      </Text>
                      <Text style={styles.lessonTestText}>
                        {t("time")}: {item.time} {t("min")}
                      </Text>
                      <Text style={styles.lessonTestText}>
                        {t("level")}: {item.level}
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FloatingMenu />
    </View>
  );
}

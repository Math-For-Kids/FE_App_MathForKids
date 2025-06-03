import React, { useState } from "react";
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

export default function LessonScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName, actionType } = route.params;
  const [activeTab, setActiveTab] = useState(actionType || "Lesson");

  const [lessons] = useState([
    { id: 1, title: "Intro to Addition", type: "Addition" },
    { id: 2, title: "Adding up to 10", type: "Addition" },
    { id: 3, title: "Adding with Carrying", type: "Addition" },
    { id: 4, title: "Basic Subtraction", type: "Subtraction" },
    { id: 5, title: "Subtraction with Borrowing", type: "Subtraction" },
    { id: 6, title: "Multiplication Basics", type: "Multiplication" },
    { id: 7, title: "Division by 1 Digit", type: "Division" },
  ]);

  const filteredLessons = lessons.filter(
    (item) => item.type?.toLowerCase() === skillName.toLowerCase()
  );

  const Exercise = [
    { id: 1, title: "Plus some more" },
    { id: 2, title: "Add two more numbers" },
    { id: 3, title: "Add multiple numbers" },
  ];
  const Test = [
    { id: 1, title: "Test 1", quantity: 30, time: 1, level: "Easy" },
    { id: 2, title: "Test 2", quantity: 30, time: 40, level: "Medium" },
    { id: 3, title: "Test 3", quantity: 30, time: 45, level: "Difficult" },
  ];

  const lessonData = {
    Lesson: filteredLessons,
    Exercise: Exercise,
    Test: Test,
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
      left: 0,
      width: 30,
      height: 30,
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Course</Text>
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
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.lessonList}>
        {currentData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              if (activeTab === "Lesson") {
                navigation.navigate("LessonDetailScreen", {
                  skillName,
                  title: item.title,
                });
              } else if (activeTab === "Exercise") {
                navigation.navigate("ExerciseScreen", {
                  skillName,
                  title: item.title,
                });
              } else if (activeTab === "Test") {
                navigation.navigate("TestScreen", {
                  skillName,
                  title: item.title,
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
                <Image source={theme.icons.soundOn} style={styles.lessonIcon} />
                <Text style={styles.lessonText}>{item.title}</Text>
                {activeTab === "Exercise" && (
                  <Text style={styles.lessonText}>Exercise one</Text>
                )}
                {activeTab === "Test" && (
                  <View style={styles.lessonTestTextContainer}>
                    <Text style={styles.lessonTestText}>
                      Quantity: {item.quantity} questions
                    </Text>
                    <Text style={styles.lessonTestText}>
                      Time: {item.time} min
                    </Text>
                    <Text style={styles.lessonTestText}>
                      Level: {item.level}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FloatingMenu />
    </View>
  );
}

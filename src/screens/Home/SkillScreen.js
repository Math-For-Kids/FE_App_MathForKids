import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import FloatingMenu from "../../components/FloatingMenu";
export default function SkillScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName, skillIcon } = route.params;

  const actions = [
    { label: "Lesson", icon: theme.icons.lesson },
    { label: "Exercise", icon: theme.icons.exercise },
    { label: "Test", icon: theme.icons.test },
    { label: "Game", icon: theme.icons.game },
  ];
  const getGradientBySkill = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
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
      marginBottom: 40,
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
    headerContent: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
    },
    skillIcon: {
      width: 50,
      height: 50,
    },
    skillName: {
      fontSize: 24,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      marginTop: 30,
      padding: 10,
    },
    card: {
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      elevation: 2,
      padding: 20,
    },
    cardIconContainer: {
      backgroundColor: theme.colors.cardBackground,
      padding: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 3,
    },
    cardIcon: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    cardLabel: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradientBySkill()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={theme.icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image source={skillIcon} style={styles.skillIcon} />
          <Text style={styles.skillName}>{skillName}</Text>
        </View>
      </LinearGradient>

      <View style={styles.grid}>
        {actions.map((action, index) => (
          <LinearGradient
            key={index}
            colors={getGradientBySkill()}
            style={styles.card}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          >
            <TouchableOpacity
              style={styles.cardTouchable}
              onPress={() => {
                if (action.label === "Game") {
                  navigation.navigate("GameScreen", { skillName });
                } else {
                  navigation.navigate("LessonScreen", {
                    skillName,
                    actionType: action.label,
                  });
                }
              }}
            >
              <View style={styles.cardIconContainer}>
                <Image source={action.icon} style={styles.cardIcon} />
              </View>
              <Text style={styles.cardLabel}>{action.label}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </View>
      <FloatingMenu />
    </View>
  );
}

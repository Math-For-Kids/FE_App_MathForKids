import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import FloatingMenu from "../../components/FloatingMenu";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();

  const gradeOptions = ["Class 1", "Class 2", "Class 3"];
  const user = {
    name: "Jolly",
    grade: "Class 1",
    avatar: theme.icons.avatarFemale,
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(user.grade);
  const notifications = [
    {
      id: 1,
      title: "New Achievement!",
      message: "You've earned the Math Badge 🎉",
      time: "2 mins ago",
      icon: theme.icons.badge,
    },
    {
      id: 2,
      title: "Practice Reminder",
      message: "Don't forget to practice subtraction today.",
      time: "1 hour ago",
      icon: theme.icons.reminder,
    },
    {
      id: 3,
      title: "New Skill Unlocked",
      message: "You unlocked Multiplication skill!",
      time: "Yesterday",
      icon: theme.icons.multiply,
    },
  ];
  const newNotificationCount = notifications.length;
  const skills = [
    { icon: theme.icons.addition, label: "Addition" },
    { icon: theme.icons.subtraction, label: "Subtraction" },
    { icon: theme.icons.multiplication, label: "Multiplication" },
    { icon: theme.icons.division, label: "Division" },
    { icon: theme.icons.multiplicationTables, label: "Expression" },
  ];
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    header: {
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      padding: 20,
      elevation: 3,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    avatarContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 50,
      padding: 10,
      elevation: 3,
    },
    avatar: {
      width: 40,
      height: 40,
    },
    greeting: {
      color: theme.colors.white,
      fontSize: 16,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    name: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    notificationContainer: {
      position: "relative",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 50,
      padding: 10,
      elevation: 3,
    },
    badge: {
      position: "absolute",
      top: -2,
      right: -2,
      backgroundColor: theme.colors.red,
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: theme.colors.white,
      fontSize: 10,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    notificationIcon: {
      width: 30,
      height: 30,
    },
    gradeWrapper: {
      position: "absolute",
      top: 120,
      left: 20,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 5,
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
    },
    grade: {
      fontSize: 14,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    gradeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    dropdown: {
      position: "absolute",
      top: 30,
      left: 2,
      marginTop: 5,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 5,
      elevation: 3,
      paddingVertical: 5,
    },
    dropdownItem: {
      paddingVertical: 6,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.blueDark,
    },
    dropdownItemText: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BLACK,
    },

    title: {
      textAlign: "center",
      marginTop: 60,
      marginBottom: 24,
      fontSize: 32,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      paddingHorizontal: 20,
    },
    skillBox: {
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 30,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    skillIcon: {
      width: 100,
      height: 100,
    },
    skillText: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BLACK,
      marginTop: 10,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userRow}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => navigation.navigate("ProfileScreen")}
            >
              <Image source={user.avatar} style={styles.avatar} />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hello!</Text>
              <Text style={styles.name}>{user.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
          >
            <View style={styles.notificationContainer}>
              {newNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{newNotificationCount}</Text>
                </View>
              )}
              <Image
                source={theme.icons.notification}
                style={styles.notificationIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.gradeWrapper}>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.gradeRow}
          >
            <Text style={styles.grade}>{selectedGrade}</Text>
            <Ionicons
              name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              {gradeOptions.map((grade, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedGrade(grade);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{grade}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>

      <Text style={styles.title}>Select skill</Text>

      <ScrollView contentContainerStyle={styles.skillsContainer}>
        {skills.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.skillBox}
            onPress={() =>
              navigation.navigate("SkillScreen", {
                skillName: item.label,
                skillIcon: item.icon,
              })
            }
          >
            <Image source={item.icon} style={styles.skillIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FloatingMenu />
    </LinearGradient>
  );
}

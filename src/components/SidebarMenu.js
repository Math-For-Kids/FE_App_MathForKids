import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SidebarMenu = () => {
  const { theme } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const route = useRoute();
  const skillName = route.params?.skillName;
  const [role, setRole] = useState(null);
  // useEffect(() => {
  //   const loadRole = async () => {
  //     const storedRole = await AsyncStorage.getItem("userRole");
  //     setRole(storedRole);
  //   };
  //   loadRole();
  // }, []);
  useEffect(() => {
    const loadRole = async () => {
      const storedRole = "user";
      setRole(storedRole);
    };
    loadRole();
  }, []);

  const menuItems = [
    { label: "Home", icon: theme.icons.characterLamp, screen: "HomeScreen" },
    {
      label: "Statistics",
      icon: theme.icons.statistic,
      screen: "StatisticScreen",
    },
    { label: "Profile", icon: theme.icons.profile, screen: "ProfileScreen" },
    { label: "Goals", icon: theme.icons.goal, screen: "GoalScreen" },
    { label: "Rank", icon: theme.icons.rank, screen: "RankScreen" },
    { label: "Target", icon: theme.icons.target, screen: "TargetScreen" },
    {
      label: "Notification",
      icon: theme.icons.notification,
      screen: "NotificationScreen",
    },
    {
      label: "Test level",
      icon: theme.icons.testLevel,
      screen: "TestLevelScreen",
    },
    { label: "Reward", icon: theme.icons.reward, screen: "RewardScreen" },
    { label: "Setting", icon: theme.icons.setting, screen: "SettingScreen" },
    { label: "Contact", icon: theme.icons.contact, screen: "ContactScreen" },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (role === "pupil")
      return item.label !== "Goals" && item.label !== "Statistics";
    if (role === "user")
      return !["Rank", "Reward", "Target", "Test level", "Home"].includes(
        item.label
      );
    return true;
  });

  const getMenuItemBackground = () => {
    if (skillName === "Addition") return theme.colors.cyanGreen;
    if (skillName === "Subtraction") return theme.colors.cyanPurple;
    if (skillName === "Multiplication") return theme.colors.cyanOrange;
    if (skillName === "Division") return theme.colors.cyanRed;
    if (skillName === "Expression") return theme.colors.cyanPink;
    return theme.colors.cyanLight;
  };

  const getLabelColor = () => {
    if (skillName === "Addition") return theme.colors.GreenBorderDark;
    if (skillName === "Subtraction") return theme.colors.purpleBorderDark;
    if (skillName === "Multiplication") return theme.colors.orangeBorderDark;
    if (skillName === "Division") return theme.colors.redBorderDark;
    if (skillName === "Expression") return theme.colors.pinkBorderDark;
    return theme.colors.blueDark;
  };

  const getLogoutBackground = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    if (skillName === "Expression") return theme.colors.gradientPink;
    return theme.colors.gradientBluePrimary;
  };

  const styles = StyleSheet.create({
    sidebar: {
      position: "absolute",
      right: 0,
      top: 24,
      width: 180,
      height: screenHeight - 24,
      backgroundColor: theme.colors.cardBackground,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
      paddingTop: 5,
      elevation: 15,
      borderWidth: 3,
      borderColor: getLabelColor(),
    },
    title: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      textAlign: "center",
      color: getLabelColor(),
    },
    menuContainer: {
      flex: 1,
      justifyContent: "space-between",
    },
    menuScroll: {
      flexGrow: 0,
    },
    menuContent: {
      paddingBottom: 10,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.paleBeige,
      elevation: 3,
      backgroundColor: getMenuItemBackground(),
      marginHorizontal: 5,
    },
    icon: {
      width: 28,
      height: 28,
    },
    label: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      marginLeft: 10,
      color: getLabelColor(),
    },
    logoutButtonContainer: {
      alignItems: "center",
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
    },
    logoutButton: {
      fontSize: 16,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
      padding: 10,
    },
  });

  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.menuContainer}>
        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menuContent}
        >
          {filteredMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <LinearGradient
          colors={getLogoutBackground()}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.logoutButtonContainer}
        >
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default SidebarMenu;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { useSound } from "../audio/SoundContext";
import { Fonts } from "../../constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
const SidebarMenu = () => {
  const { theme, isDarkMode } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const route = useRoute();
  const skillName = route.params?.skillName;

  const menuItems = [
    { label: "Home", icon: theme.icons.characterLamp, screen: "HomeScreen" },
    { label: "Profile", icon: theme.icons.profile, screen: "ProfileScreen" },
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
  const getLogutBackground = () => {
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
      borderWidth: 3,
      backgroundColor: theme.colors.cardBackground,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
      //   height: Dimensions.get("window").height,
      paddingTop: 14,
      zIndex: 1,
      elevation: 15,
    },

    title: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      textAlign: "center",
      marginBottom: 10,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 20,
      marginVertical: 4,
      paddingHorizontal: 15,
      elevation: 3,
    },
    label: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      marginLeft: 10,
    },
    logoutButtonContainer: {
      alignItems: "center",
      fontFamily: Fonts.NUNITO_BLACK,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
    },
    logoutButton: {
      fontSize: 16,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
      padding: 14,
    },
  });
  return (
    <View style={[styles.sidebar, { borderColor: getLabelColor() }]}>
      <Text style={[styles.title, { color: getLabelColor() }]}>Menu</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            { backgroundColor: getMenuItemBackground() },
          ]}
          onPress={() => item.screen && navigation.navigate(item.screen)}
        >
          <Image source={item.icon} style={{ width: 28, height: 28 }} />
          <Text style={[styles.label, { color: getLabelColor() }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
      <LinearGradient
        colors={getLogutBackground()}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.logoutButtonContainer}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LoginScreen");
          }}
        >
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default SidebarMenu;

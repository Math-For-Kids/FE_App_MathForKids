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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutUser } from "../redux/authSlice";
const SidebarMenu = () => {
  const { theme } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const pupilId = useSelector((state) => state.auth.user?.pupilId);
  const userId = useSelector((state) => state.auth.user?.id);
  const skillName = route.params?.skillName;

  const isPupil = Boolean(pupilId);
  const isParent = !pupilId;
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // thành công: điều hướng về Login
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (errMsg) {
      // lỗi khi gọi API
      Alert.alert("Error", errMsg || "Failed to logout");
    }
  };
  const menuItems = [
    { label: "Home", icon: theme.icons.characterLamp, screen: "HomeScreen" },
    {
      label: "Statistics",
      icon: theme.icons.statistic,
      screen: "StatisticScreen",
    },
    { label: "Privacy", icon: theme.icons.privacy, screen: "PrivacyScreen" },
    { label: "Profile", icon: theme.icons.profile, screen: "ProfileScreen" },
    {
      label: "View profile",
      icon: theme.icons.profile,
      screen: "DetailScreen",
    },
    { label: "Goals", icon: theme.icons.goal, screen: "GoalScreen" },
    { label: "Rank", icon: theme.icons.rank, screen: "RankScreen" },
    { label: "Target", icon: theme.icons.target, screen: "TargetScreen" },
    {
      label: "Notification",
      icon: theme.icons.notification,
      screen: "NotificationScreen",
    },
    // {
    //   label: "Test level",
    //   icon: theme.icons.testLevel,
    //   screen: "TestLevelScreen",
    // },
    { label: "Reward", icon: theme.icons.reward, screen: "RewardScreen" },
    { label: "Setting", icon: theme.icons.setting, screen: "SettingScreen" },
    { label: "Contact", icon: theme.icons.contact, screen: "ContactScreen" },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (isPupil) {
      return !["Goals", "Statistics", "Privacy", "View profile"].includes(
        item.label
      );
    }
    if (isParent) {
      return ![
        "Home",
        "Rank",
        "Reward",
        "Target",
        "Test level",
        "Profile",
        "View profile",
      ].includes(item.label);
    }
    return false;
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
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
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
              onPress={() => {
                navigation.navigate(item.screen, {
                  userId: userId,
                  pupilId: pupilId,
                });
              }}
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
          <TouchableOpacity
            // onPress={() => {
            //   dispatch(logout());
            //   navigation.navigate("LoginScreen");
            // }}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default SidebarMenu;

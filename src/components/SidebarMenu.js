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

const SidebarMenu = () => {
  const { theme, isDarkMode } = useTheme();
  const screenHeight = Dimensions.get("window").height;

  const menuItems = [
    {
      label: "Home",
      //   icon: <Ionicons name="home" size={28} color={theme.colors.blueDark} />,
    },
    { label: "Profile", icon: theme.icons.profile },
    { label: "Rank", icon: theme.icons.rank },
    { label: "Target", icon: theme.icons.target },
    { label: "Notification", icon: theme.icons.notification },
    { label: "Test level", icon: theme.icons.testLevel },
    { label: "Reward", icon: theme.icons.reward },
    { label: "Setting", icon: theme.icons.setting },
    { label: "Contact", icon: theme.icons.contact },
  ];

  const styles = StyleSheet.create({
    sidebar: {
      position: "absolute",
      right: 0,
      top: 24,
      width: 180,
      borderWidth: 3,
      borderColor: theme.colors.blueDark,
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
      color: theme.colors.blueDark,
      textAlign: "center",
      marginBottom: 10,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.cyanLight,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 20,
      marginVertical: 4,
      paddingHorizontal: 15,
      elevation: 3,
    },
    label: {
      fontSize: 16,
      color: theme.colors.blueDark,
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
    <View style={styles.sidebar}>
      <Text style={styles.title}>Menu</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Image source={item.icon} style={{ width: 28, height: 28 }} />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.logoutButtonContainer}
      >
        <TouchableOpacity>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default SidebarMenu;

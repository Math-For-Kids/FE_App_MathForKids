import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useSound } from "../audio/SoundContext";
import FloatingMenu from "../components/FloatingMenu";
export default function SettingScreen({ navigation }) {
  const { theme, isDarkMode, themeKey, toggleThemeMode, switchThemeKey } =
    useTheme();
  const { volume, increaseVolume, decreaseVolume } = useSound();
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
      marginBottom: 40,
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
      fontSize: 36,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    sectionTitle: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      textAlign: "center",
      marginBottom: 10,
    },
    volume: {
      textAlign: "center",
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 8,
    },
    selectorRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    musicDots: { flexDirection: "row", gap: 10 },
    dot: {
      width: 50,
      height: 15,
      borderRadius: 10,
      shadowColor: theme.colors.shadowDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 6,
    },
    languageContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
    flagIcon: { width: 40, height: 30 },
    languageText: {
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 18,
      color: theme.colors.white,
    },
    darkModeOption: { flexDirection: "row", alignItems: "center", gap: 8 },
    darkIcon: { width: 35, height: 35 },
    darkModeText: {
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 18,
      color: theme.colors.white,
    },
  });
  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
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
        <Text style={styles.title}>Setting</Text>
      </LinearGradient>
      <Text style={styles.sectionTitle}>Music</Text>
      <Text style={styles.volume}>Volume: {(volume * 100).toFixed(0)}%</Text>
      <View style={styles.selectorRow}>
        <TouchableOpacity onPress={decreaseVolume}>
          <Ionicons
            name="caret-back-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
        <View style={styles.musicDots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i < Math.round(volume * 3)
                      ? theme.colors.blueLight
                      : theme.colors.grayLight,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={increaseVolume}>
          <Ionicons
            name="caret-forward-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Language</Text>
      <View style={styles.selectorRow}>
        <TouchableOpacity>
          <Ionicons
            name="caret-back-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
        <View style={styles.languageContainer}>
          <Image source={theme.icons.languageEnglish} style={styles.flagIcon} />
          <Text style={styles.languageText}>English</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="caret-forward-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Mode</Text>
      <View style={styles.selectorRow}>
        <TouchableOpacity onPress={toggleThemeMode}>
          <Ionicons
            name="caret-back-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.darkModeOption}>
          <Image
            source={isDarkMode ? theme.icons.themeDark : theme.icons.themeLight}
            style={styles.darkIcon}
          />
          <Text style={styles.darkModeText}>
            {isDarkMode ? "Dark" : "Light"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleThemeMode}>
          <Ionicons
            name="caret-forward-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Theme</Text>
      <View style={styles.selectorRow}>
        <TouchableOpacity
          onPress={() =>
            switchThemeKey(themeKey === "theme1" ? "theme2" : "theme1")
          }
        >
          <Ionicons
            name="caret-back-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
        <View style={styles.darkModeOption}>
          <Image source={theme.icons.graphic} style={styles.darkIcon} />
          <Text style={styles.darkModeText}>
            {themeKey === "theme1"
              ? "Capybara"
              : themeKey === "theme2"
              ? "Animal"
              : "Super Hero"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            switchThemeKey(
              themeKey === "theme1"
                ? "theme2"
                : themeKey === "theme2"
                ? "theme3"
                : "theme1"
            );
          }}
        >
          <Ionicons
            name="caret-forward-outline"
            size={30}
            color={theme.colors.grayLight}
          />
        </TouchableOpacity>
      </View>
      <FloatingMenu />
    </LinearGradient>
  );
}

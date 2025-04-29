import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Images } from "../../constants/Images";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext"; // 🔥 Sửa đúng import nè!

export default function LoadingProgressScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { theme, isDarkMode } = useTheme();

  const progressBarWidth = 250;
  const capybaraloading = 30;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: progress * (progressBarWidth - capybaraloading),
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.02;
        if (next >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            navigation.replace("LoginScreen");
          }, 800);
        }
        return next > 1 ? 1 : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      position: "absolute",
      top: 40,
      alignSelf: "center",
    },
    normalText: {
      fontSize: 12,
      fontFamily: Fonts.NUNITO_REGULAR,
      color: theme.colors.white,
    },
    boldText: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    title: {
      fontSize: 32,
      marginBottom: 8,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    subtitle: {
      fontSize: 12,
      marginBottom: 20,
      fontFamily: Fonts.NUNITO_MEDIUM_ITALIC,
      color: theme.colors.white,
    },
    logoTrack: {
      width: 250,
      height: 30,
      justifyContent: "center",
      overflow: "hidden",
    },
    logo: {
      width: 30,
      height: 30,
    },
    progressContainer: {
      width: 256,
      height: 16,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 10,
      position: "relative",
      backgroundColor: theme.colors.grayLight,
      shadowColor: theme.colors.shadowDark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
    },
    backgroundBar: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.white,
    },
    foregroundBar: {
      height: 10,
      position: "absolute",
      left: 3,
      top: 3,
      borderRadius: 6,
      overflow: "hidden",
    },
    gradientFill: {
      width: "100%",
      height: "100%",
    },
    loadingText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
  });
  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.normalText}>
          Developed by
          <Text style={styles.boldText}>FPT students</Text>
        </Text>
      </View>

      <Text style={styles.title}>Math is Fun!</Text>
      <Text style={styles.subtitle}>
        Math learning app for students in grades 1 - 2 - 3
      </Text>

      <View style={styles.logoTrack}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <Image
            source={theme.icons.capybaraloading}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.backgroundBar} />
        <Animated.View
          style={[styles.foregroundBar, { width: progress * progressBarWidth }]}
        >
          <LinearGradient
            colors={
              isDarkMode
                ? theme.colors.gradientPurple
                : theme.colors.gradientBluePrimary
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientFill}
          />
        </Animated.View>
      </View>

      <Text style={styles.loadingText}>
        Loading {Math.round(progress * 100)}%
      </Text>
    </LinearGradient>
  );
}

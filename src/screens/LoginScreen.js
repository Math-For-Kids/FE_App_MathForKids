import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";
import useSound from "../audio/useSound";
export default function LoginScreen({ navigation }) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const { play } = useSound();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: theme.colors.cardBackground,
      width: "85%",
      height: "90%",
      borderRadius: 20,
      padding: 30,
      marginTop: 25,
      alignItems: "center",
      elevation: 10,
    },
    logo: {
      width: 150,
      height: 150,
      position: "absolute",
      top: -15,
    },

    title: {
      fontSize: 28,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      marginBottom: 15,
      marginTop: 110,
    },
    inputWrapper: {
      width: "100%",
      height: 50,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.white,
      elevation: 5,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.skyBlue,
      shadowColor: theme.colors.skyBlue,
      shadowOpacity: 0.3,
      elevation: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    buttonWrapper: {
      width: "100%",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 20,
      elevation: 6,
    },
    button: {
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    footer: {
      flexDirection: "row",
    },
    footerText: {
      color: theme.colors.grayLight,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_REGULAR,
      color: theme.colors.grayLight,
    },
    registerText: {
      color: theme.colors.blueDark,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BOLD,
      marginLeft: 5,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={theme.colors.gradientBlue}
        style={styles.container}
      >
        <View style={styles.card}>
          <Image
            source={isDarkMode ? theme.icons.logoDark : theme.icons.logoLight}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Log In</Text>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: theme.colors.white,
              },
              isFocused && {
                borderColor: theme.colors.blueDark,
                shadowColor: theme.colors.blueDark,
                shadowOpacity: 0.6,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={theme.colors.grayLight}
              onFocus={() => {
                play("openClick");
                setIsFocused(true);
              }}
              onBlur={() => {
                play("closeClick");
                setIsFocused(false);
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonWrapper}
            onPress={() => {
              navigation.navigate("AccountScreen");
              play("openClick");
            }}
          >
            <LinearGradient
              colors={theme.colors.gradientBlue}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                play("openClick");
                navigation.navigate("RegisterScreen");
              }}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              play("openClick");
              navigation.navigate("SettingScreen");
            }}
          >
            <Text style={styles.registerText}>Setting</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

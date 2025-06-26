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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { sendOTPByPhone, sendOTPByEmail } from "../redux/authSlice";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";
import useSound from "../audio/useSound";
import { useTranslation } from "react-i18next";

export default function LoginScreen({ navigation }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const dispatch = useDispatch();
  const { theme, isDarkMode } = useTheme();
  const { play } = useSound();
  const { t } = useTranslation("login");

  const handleLogin = async () => {
    play("openClick");

    const value = inputValue.trim();
    if (!value) {
      return Alert.alert(t("errorTitle"), t("errorEnterContact"));
    }

    const isPhone = /^[0-9]{9,15}$/.test(value);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isPhone && !isEmail) {
      return Alert.alert(t("invalidTitle"), t("errorInvalidContact"));
    }

    try {
      const sendAction = isEmail ? sendOTPByEmail : sendOTPByPhone;
      const contactKey = isEmail ? "email" : "phoneNumber";
      const result = await dispatch(
        sendAction({ [contactKey]: value, role: "user" })
      ).unwrap();

      const userId = result?.userId;
      if (!userId) throw new Error(t("errorNoUserId"));

      navigation.navigate("VerifyScreen", {
        userId,
        contact: value,
        isEmail,
        isLogin: true,
      });
    } catch (err) {
      let msg = t("errorSendOtp");

      if (err && typeof err === "object") {
        if (err.vi || err.en) {
          msg = err.vi || err.en || msg;
        } else if (typeof err.message === "object") {
          msg = err.message.vi || err.message.en || msg;
        } else if (typeof err.message === "string") {
          msg = err.message;
        }
      } else if (typeof err === "string") {
        msg = err;
      }
      Alert.alert(t("loginFailedTitle"), msg);
    }
  };

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
      fontFamily: Fonts.NUNITO_BOLD,
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
      elevation: 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    footer: {
      flexDirection: "row",
    },
    footerText: {
      color: theme.colors.grayLight,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    registerText: {
      color: theme.colors.blueDark,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
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
          <Text style={styles.title}>{t("title")}</Text>
          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder={t("placeholder")}
              placeholderTextColor={theme.colors.grayLight}
              value={inputValue}
              onChangeText={setInputValue}
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
            onPress={handleLogin}
          >
            <LinearGradient
              colors={theme.colors.gradientBlue}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{t("loginButton")}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("noAccount")}</Text>
            <TouchableOpacity
              onPress={() => {
                play("openClick");
                navigation.navigate("RegisterScreen");
              }}
            >
              <Text style={styles.registerText}>{t("registerLink")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

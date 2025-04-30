import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
export default function VerifyOTP() {
  const { theme, isDarkMode } = useTheme();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      height: "90%",
      marginTop: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.blueDark,
      marginBottom: 10,
    },
    subtitle: {
      color: theme.colors.grayLight,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_BOLD_ITALIC,
      fontSize: 12,
    },
    phoneNumber: {
      marginBottom: 20,
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 12,
      color: theme.colors.grayMedium,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginBottom: 30,
    },
    otpInput: {
      width: 55,
      height: 55,
      borderRadius: 12,
      backgroundColor: theme.colors.white,
      textAlign: "center",
      fontSize: 24,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
      elevation: 5,
    },
    otpInputFocused: {
      borderColor: theme.colors.skyBlue,
      borderWidth: 1,
    },
    verifyButton: {
      width: 250,
      borderRadius: 10,
      paddingVertical: 12,
      marginBottom: 20,
      elevation: 8,
    },
    verifyText: {
      color: theme.colors.white,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 16,
    },
    resendText: {
      color: theme.colors.grayMedium,
      fontSize: 14,
    },
    resendLink: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BLACK,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to your phone number:
        </Text>
        <Text style={styles.phoneNumber}>0123456789</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                styles.otpInput,
                focusedIndex === index && styles.otpInputFocused,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.verifyButton}
        >
          <TouchableOpacity>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.resendText}>Didn’t receive a code?</Text>
        <Text style={styles.resendText}>
          <Text style={styles.resendLink}>Resend</Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

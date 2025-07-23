import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import { useDispatch } from "react-redux";
import {
  sendOTPByPhone,
  sendOTPByEmail,
  verifyOTP,
  setUser,
  updateUser,
} from "../redux/authSlice";
export default function VerifyOTP({ navigation, route }) {
  const { theme } = useTheme();
  const { userId, contact, isEmail, isLogin } = route.params;
  const dispatch = useDispatch();

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
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      return Alert.alert("Error", "Please enter the full 4-digit OTP");
    }

    try {
      const result = await dispatch(verifyOTP({ userId, otpCode })).unwrap();
      // console.log("Verified user:", result);
      if (!isLogin) {
        await dispatch(updateUser({ id: result.id, data: { isVerify: true } }));
      }
      dispatch(
        setUser({
          id: result.id,
          role: result.role,
          token: result.token,
          fullName: result.fullName,
          image: result.image,
          email: result.email,
          pin: result.pin,
        })
      );

      Alert.alert("Success", "OTP Verified!", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate(isLogin ? "AccountScreen" : "AccountScreen"),
        },
      ]);
    } catch (err) {
      console.error("OTP verify failed:", err);
      Alert.alert("Error", err?.message || "Failed to verify OTP");
    }
  };

  const handleResend = () => {
    const resendAction = isEmail ? sendOTPByEmail : sendOTPByPhone;
    const targetKey = isEmail ? "email" : "phoneNumber";

    dispatch(resendAction({ userId, [targetKey]: contact })).then((res) => {
      if (!res.error) {
        Alert.alert("Success", "OTP resent successfully!");
      } else {
        Alert.alert("Error", "Failed to resend OTP: " + res.payload);
      }
    });
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
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.blueDark,
      marginBottom: 10,
    },
    subtitle: {
      color: theme.colors.grayLight,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 12,
    },
    phoneNumber: {
      marginBottom: 20,
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 16,
    },
    resendText: {
      color: theme.colors.grayMedium,
      fontSize: 14,
    },
    resendLink: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to your {isEmail ? "email" : "phone"}:
        </Text>
        <Text style={styles.phoneNumber}>{contact}</Text>

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
          <TouchableOpacity onPress={handleVerify}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.resendText}>Didn’t receive a code?</Text>
        <Text style={styles.resendText}>
          <Text style={styles.resendLink} onPress={handleResend}>
            Resend
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import { useTranslation } from "react-i18next";

export default function VerifyOTP({ navigation, route }) {
  const { theme } = useTheme();
  const { userId, contact, isEmail, isLogin } = route.params;
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const [isResending, setIsResending] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [errors, setErrors] = useState({});
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
    const otpCode = otp.join("").trim();

    // Kiểm tra nếu chưa đủ 4 chữ số OTP
    if (otpCode.length !== 4) {
      setErrors({ otp: "Please enter the full 4-digit OTP" });
      return;
    }

    setErrors({}); // Xóa lỗi cũ nếu có

    try {
      const result = await dispatch(verifyOTP({ userId, otpCode })).unwrap();

      // Nếu đang là đăng ký mới → cập nhật trạng thái đã xác thực
      if (!isLogin) {
        await dispatch(updateUser({ id: result.id, data: { isVerify: true } }));
      }

      // Lưu thông tin người dùng vào store
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

      // Thông báo thành công và chuyển trang
      Alert.alert("Success", "OTP Verified!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("AccountScreen"),
        },
      ]);
    } catch (err) {
      let msg = "Failed to verify OTP";

      if (err && typeof err === "object") {
        if (
          typeof err.message === "object" &&
          (err.message.vi || err.message.en)
        ) {
          msg =
            err.message[i18n.language] ||
            err.message.en ||
            err.message.vi ||
            msg;
        } else if (err.vi || err.en) {
          msg = err[i18n.language] || err.en || err.vi;
        } else if (typeof err.message === "string") {
          msg = err.message;
        }
      } else if (typeof err === "string") {
        msg = err;
      }

      // ✅ Thêm alert để hiển thị thông báo lỗi
      Alert.alert("Error", msg);
      setErrors({ otp: msg });
    }
  };

  const handleResend = async () => {
    setIsResending(true); // 👉 Bắt đầu loading

    const resendAction = isEmail ? sendOTPByEmail : sendOTPByPhone;
    const targetKey = isEmail ? "email" : "phoneNumber";

    try {
      const res = await dispatch(
        resendAction({ userId, [targetKey]: contact })
      );

      if (!res.error) {
        Alert.alert("Success", "OTP resent successfully!");
      } else {
        const msg =
          typeof res.payload === "object"
            ? res.payload?.[i18n.language] || res.payload?.en || res.payload?.vi
            : String(res.payload);

        Alert.alert("Error", "Failed to resend OTP: " + msg);
      }
    } catch (err) {
      Alert.alert("Error", "Unexpected error when resending OTP.");
    } finally {
      setIsResending(false); // 👉 Kết thúc loading
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
      marginBottom: 5,
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
      marginTop: 20,
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
    errorText: {
      color: "red",
      fontSize: 12,
      alignSelf: "flex-start",
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
        {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
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
          {isResending ? (
            <ActivityIndicator size="small" color={theme.colors.blueDark} />
          ) : (
            <Text style={styles.resendLink} onPress={handleResend}>
              Resend
            </Text>
          )}
        </Text>
      </View>
    </LinearGradient>
  );
}

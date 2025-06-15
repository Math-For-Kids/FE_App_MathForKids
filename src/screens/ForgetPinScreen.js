import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import { sendOTPByPhone, verifyOnlyOTP, updateUser } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const steps = [
  { title: "Confirm phone number" },
  { title: "Verify OTP" },
  { title: "Create PIN" },
];

export default function ForgetPinScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [contact] = useState(user?.phoneNumber || "");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const otpInputs = useRef([]);
  const inputs = useRef([]);
  const confirmInputs = useRef([]);

  const handleChangePin = (val, index, isConfirm = false) => {
    const updated = isConfirm ? [...confirmPin] : [...newPin];
    updated[index] = val.replace(/[^0-9]/g, "");
    isConfirm ? setConfirmPin(updated) : setNewPin(updated);
  };
  console.log("userId", user?.id);
  const handleSendOTP = () => {
    if (!contact || !user?.id) {
      Alert.alert("Notice", "Missing user ID or phone number.");
      return;
    }

    dispatch(sendOTPByPhone({ userId: user?.id, phoneNumber: contact }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "OTP has been sent.");
        setCurrentStep(1);
      })
      .catch((err) => {
        Alert.alert("Error", err || "Failed to send OTP.");
      });
  };

  const handleVerifyOTP = () => {
    if (!user?.id || otp.length !== 4) {
      Alert.alert("Invalid", "Missing user ID or invalid OTP.");
      return;
    }

    dispatch(verifyOnlyOTP({ userId: user?.id, otpCode: otp }))
      .unwrap()
      .then(() => {
        setCurrentStep(2);
      })
      .catch((err) => {
        Alert.alert("Invalid OTP", err || "Please check again.");
      });
  };

  const handleResetPin = () => {
    const np = newPin.join("");
    const cp = confirmPin.join("");

    if (np.length !== 4 || cp.length !== 4) {
      Alert.alert("Error", "PIN must be 4 digits.");
      return;
    }

    if (np !== cp) {
      Alert.alert("Error", "PINs do not match.");
      return;
    }

    dispatch(updateUser({ id: user?.id, data: { pin: np } }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "PIN has been reset.");
        navigation.navigate("AccountScreen");
      })
      .catch((err) => {
        Alert.alert("Error", err?.message || "Something went wrong.");
      });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.cardContent}>
            <Text style={styles.input}>{contact}</Text>
            <LinearGradient
              colors={theme.colors.gradientBlue}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleSendOTP}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        );
      case 1:
        return (
          <View style={styles.cardContent}>
            <Text style={styles.stepTitle}>Enter OTP</Text>
            <View style={styles.pinWrapper}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  style={styles.pinBox}
                  value={otp[index] || ""}
                  onChangeText={(val) => {
                    const numeric = val.replace(/[^0-9]/g, "");
                    const newOtp = otp.split("");
                    newOtp[index] = numeric;
                    setOtp(newOtp.join(""));
                    if (numeric && index < 3) {
                      otpInputs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      otpInputs.current[index - 1]?.focus();
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  color={theme.colors.blueDark}
                />
              ))}
            </View>
            <LinearGradient
              colors={theme.colors.gradientBlue}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        );
      case 2:
        return (
          <View style={styles.cardContent}>
            <Text style={styles.stepTitle}>Create New PIN</Text>
            <View style={styles.pinWrapper}>
              {newPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.pinBox}
                  value={digit}
                  onChangeText={(val) => {
                    const onlyNumber = val.replace(/[^0-9]/g, "");
                    handleChangePin(onlyNumber, index);
                    if (onlyNumber && index < 3) {
                      inputs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !digit &&
                      index > 0
                    ) {
                      inputs.current[index - 1]?.focus();
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry={!showNewPin}
                  textAlign="center"
                  color={theme.colors.blueDark}
                />
              ))}
              <TouchableOpacity
                onPress={() => setShowNewPin(!showNewPin)}
                style={styles.confirmEye}
              >
                <Ionicons
                  name={showNewPin ? "eye" : "eye-off"}
                  size={18}
                  color={theme.colors.blueDark}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.stepTitle}>Confirm New PIN</Text>
            <View style={styles.pinWrapper}>
              {confirmPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (confirmInputs.current[index] = ref)}
                  style={styles.pinBox}
                  value={digit}
                  onChangeText={(val) => {
                    const onlyNumber = val.replace(/[^0-9]/g, "");
                    handleChangePin(onlyNumber, index, true);
                    if (onlyNumber && index < 3) {
                      confirmInputs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !digit &&
                      index > 0
                    ) {
                      confirmInputs.current[index - 1]?.focus();
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry={!showConfirmPin}
                  textAlign="center"
                  color={theme.colors.blueDark}
                />
              ))}
              <TouchableOpacity
                onPress={() => setShowConfirmPin(!showConfirmPin)}
                style={styles.confirmEye}
              >
                <Ionicons
                  name={showConfirmPin ? "eye" : "eye-off"}
                  size={18}
                  color={theme.colors.blueDark}
                />
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={theme.colors.gradientBlue}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleResetPin}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        );
      default:
        return null;
    }
  };
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
      marginBottom: 20,
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
    stepContainer: {
      marginBottom: 10,
      marginLeft: 10,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    verticalLine: {
      width: 3,
      height: 40,
      backgroundColor: theme.colors.white,
      marginTop: 20,
    },
    cardContent: {
      backgroundColor: theme.colors.white,
      borderRadius: 20,
      padding: 16,
      elevation: 3,
      marginHorizontal: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.graySoft,
      padding: 12,
      borderRadius: 10,
      marginBottom: 20,
      fontSize: 16,
      color: theme.colors.blueDark,
    },
    button: {
      backgroundColor: theme.colors.blueDark,
      padding: 12,
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      textAlign: "center",
      fontSize: 16,
    },
    pinWrapper: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    pinBox: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.graySoft,
      fontSize: 22,
      borderRadius: 10,
      textAlign: "center",
      marginHorizontal: 5,
    },
    stepTitle: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.grayDark,
      marginBottom: 10,
    },
    Icon: {
      borderRadius: 50,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.white,
      padding: 2,
    },
    confirmEye: {
      marginLeft: 12,
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
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
          onPress={() => navigation.navigate("AccountScreen")}
        >
          <Image
            source={theme.icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot pin</Text>
      </LinearGradient>
      <ScrollView>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepRow}>
              <View style={{ alignItems: "center" }}>
                {index < currentStep ? (
                  <LinearGradient
                    colors={theme.colors.gradientBlue}
                    style={styles.Icon}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.white}
                    />
                  </LinearGradient>
                ) : index === currentStep ? (
                  <MaterialIcons
                    name="radio-button-checked"
                    size={24}
                    color={theme.colors.white}
                  />
                ) : (
                  <Ionicons
                    name="ellipse-outline"
                    size={24}
                    color={theme.colors.white}
                  />
                )}
                {index < steps.length - 1 && (
                  <View style={styles.verticalLine} />
                )}
              </View>
              <Text
                style={{
                  marginLeft: 12,
                  marginTop: 2,
                  fontFamily:
                    index === currentStep
                      ? Fonts.NUNITO_EXTRA_BOLD
                      : Fonts.NUNITO_MEDIUM,
                  color:
                    index <= currentStep
                      ? theme.colors.white
                      : theme.colors.grayDark,
                }}
              >
                {`Step ${index + 1}: ${step.title}`}
              </Text>
            </View>
            {index === currentStep && renderStepContent()}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

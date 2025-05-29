import React, { useRef, useState } from "react";
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
import Checkbox from "expo-checkbox";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  updateUser,
  sendOTPByPhone,
  sendOTPByEmail,
} from "../redux/authSlice";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const [gender, setGender] = useState("female");
  const [termsChecked, setTermsChecked] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const [showPin, setShowPin] = useState(false);
  const [contact, setContact] = useState("");

  const dispatch = useDispatch();
  const handleSend = async () => {
    const isEmail = /\S+@\S+\.\S+/.test(contact);
    const isPhone = /^[0-9]{9,15}$/.test(contact);
    const pinCode = pin.join("");
    if (!/^\d{4}$/.test(pinCode)) {
      Alert.alert("Invalid", "PIN must be 4 digits.");
      return;
    }

    if (!isEmail && !isPhone) {
      Alert.alert("Invalid", "Please enter a valid phone number or email.");
      return;
    }

    if (!termsChecked) {
      Alert.alert("Terms", "You must agree to the terms.");
      return;
    }

    const userData = {
      fullName,
      phoneNumber: isPhone ? contact : "",
      email: isEmail ? contact : "",
      gender,
      dateOfBirth: "2000-01-01",
      address,
      pin: pinCode,
    };

    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      const userId = result.id;
      const role = result.role || "user";
      await dispatch(
        updateUser({ id: userId, data: { isVerify: true } })
      ).unwrap();
      const sendAction = isEmail ? sendOTPByEmail : sendOTPByPhone;
      const target = isEmail ? userData.email : userData.phoneNumber;
      await dispatch(sendAction(target)).unwrap();
      Alert.alert("Success", "OTP sent successfully!", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("VerifyScreen", {
              contact,
              isEmail,
              userId,
              role,
            }),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.toString());
    }
  };
  const handlePinChange = (value, index) => {
    const updatedPin = [...pin];
    updatedPin[index] = value.replace(/[^0-9]/g, "");
    setPin(updatedPin);
    if (value && index < 3) pinRefs[index + 1].current.focus();
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
      elevation: 3,
    },
    title: {
      position: "absolute",
      top: 10,
      fontSize: 20,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
    },
    avatarWrapper: {
      borderRadius: 50,
      elevation: 6,
      marginTop: 20,
      marginBottom: 20,
    },
    avatar: {
      width: 50,
      height: 50,
    },
    inputWrapper: {
      width: "100%",
      height: 45,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.colors.white,
      justifyContent: "center",
      elevation: 5,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.blueDark,
      elevation: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    checkboxGroup: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      marginVertical: 10,
    },
    checkboxItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkboxLabel: {
      marginLeft: 6,
      fontFamily: Fonts.NUNITO_REGULAR,
      fontSize: 14,
      color: theme.colors.grayMedium,
    },
    termsWrapper: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginVertical: 10,
    },
    termsText: {
      marginLeft: 8,
      fontFamily: Fonts.NUNITO_REGULAR,
      fontSize: 13,
      color: theme.colors.grayLight,
      flexShrink: 1,
    },
    agreeText: {
      color: theme.colors.grayMedium,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    buttonWrapper: {
      width: "100%",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 10,
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
    },
    loginText: {
      color: theme.colors.blueDark,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    pinLabelContainer: {
      width: "100%",
      marginBottom: 5,
    },
    pinLabel: {
      color: theme.colors.grayMedium,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    pinInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    pinContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
      width: "90%",
    },
    pinInput: {
      width: 45,
      height: 45,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.graySoft,
      backgroundColor: theme.colors.cardBackground,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.blueDark,
      elevation: 20,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={theme.colors.gradientBlue}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <LinearGradient
            colors={theme.colors.gradientBluePrimary}
            style={styles.avatarWrapper}
          >
            <Image
              source={theme.icons.avatarAdd}
              style={styles.avatar}
              resizeMode="contain"
            />
          </LinearGradient>

          <View
            style={[
              styles.inputWrapper,
              focusedField === "fullName" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              onChangeText={setFullName}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              focusedField === "contact" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Phone number or email"
              value={contact}
              onChangeText={setContact}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("contact")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              focusedField === "address" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.pinLabelContainer}>
            <Text style={styles.pinLabel}>Pin code</Text>
          </View>

          <View style={styles.pinInputWrapper}>
            <View style={styles.pinContainer}>
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={pinRefs[index]}
                  value={digit}
                  onChangeText={(val) => handlePinChange(val, index)}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="numeric"
                  secureTextEntry={!showPin}
                  textAlign="center"
                />
              ))}
            </View>

            <TouchableOpacity onPress={() => setShowPin(!showPin)}>
              <Ionicons
                name={showPin ? "eye" : "eye-off"}
                size={18}
                color={theme.colors.blueDark}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxItem}>
              <Checkbox
                value={gender === "female"}
                onValueChange={() => setGender("female")}
                color={
                  gender === "female"
                    ? theme.colors.checkBoxBackground
                    : undefined
                }
              />
              <Text style={styles.checkboxLabel}>Female</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                value={gender === "male"}
                onValueChange={() => setGender("male")}
                color={
                  gender === "male"
                    ? theme.colors.checkBoxBackground
                    : undefined
                }
              />
              <Text style={styles.checkboxLabel}>Male</Text>
            </View>
          </View>

          <View style={styles.termsWrapper}>
            <Checkbox
              value={termsChecked}
              onValueChange={setTermsChecked}
              color={termsChecked ? theme.colors.checkBoxBackground : undefined}
            />
            <Text style={styles.termsText}>
              <Text style={styles.agreeText}>I agree to the </Text>
              Terms and Privacy Policy
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonWrapper}
            onPress={handleSend}
          >
            <LinearGradient
              colors={theme.colors.gradientBluePrimary}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";
import { useDispatch } from "react-redux";
import { createUser, sendOTPByPhone } from "../redux/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("register");

  const [gender, setGender] = useState("female");
  const [focusedField, setFocusedField] = useState(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const [showPin, setShowPin] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);

  const handlePinChange = (value, index) => {
    const updated = [...pin];
    updated[index] = value.replace(/[^0-9]/g, "");
    setPin(updated);
    if (value && index < 3) pinRefs[index + 1].current.focus();
  };

  const handleSend = async () => {
    const pinCode = pin.join("");
    if (!/^\d{4}$/.test(pinCode)) {
      return Alert.alert(t("invalidTitle"), t("invalidPin"));
    }
    if (!/^[0-9]{9,15}$/.test(phone)) {
      return Alert.alert(t("invalidTitle"), t("invalidPhone"));
    }

    const userData = {
      fullName,
      gender,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      address,
      pin: pinCode,
      phoneNumber: phone,
      email,
    };

    try {
      const result = await dispatch(createUser(userData)).unwrap();
      const createMsgObj = result.message || {};
      const createMsg =
        createMsgObj[i18n.language] || createMsgObj.en || t("successDefault");

      const sendRes = await dispatch(
        sendOTPByPhone({ userId: result.id, phoneNumber: phone })
      ).unwrap();
      const sendMsgObj = sendRes.message || {};
      const sendMsg =
        sendMsgObj[i18n.language] || sendMsgObj.en || t("sentOtpDefault");

      Alert.alert(createMsg, sendMsg, [
        {
          text: t("ok"),
          onPress: () =>
            navigation.navigate("VerifyScreen", {
              contact: phone,
              isEmail: false,
              userId: result.id,
            }),
        },
      ]);
    } catch (err) {
      const payload = err.payload ?? err.message ?? err;
      const errMsg =
        typeof payload === "object"
          ? payload[i18n.language] || payload.en
          : String(payload);
      Alert.alert(t("errorTitle"), errMsg);
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
      elevation: 3,
    },
    title: {
      position: "absolute",
      top: 10,
      fontSize: 20,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    avatarWrapper: {
      borderRadius: 50,
      elevation: 6,
      marginTop: 20,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    inputDateOfBirth: {
      fontSize: 16,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    checkboxGroup: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 10,
    },
    checkboxItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkboxLabel: {
      marginLeft: 6,
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 14,
      color: theme.colors.grayMedium,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    footer: {
      flexDirection: "row",
    },
    footerText: {
      color: theme.colors.grayLight,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    loginText: {
      color: theme.colors.blueDark,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    pinLabelContainer: {
      width: "100%",
      marginBottom: 5,
    },
    pinLabel: {
      color: theme.colors.grayMedium,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueDark,
      elevation: 20,
      textAlign: "center",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={theme.colors.gradientBlue}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{t("title")}</Text>

          <LinearGradient
            colors={theme.colors.gradientBluePrimary}
            style={styles.avatarWrapper}
          >
            {/* avatar icon if any */}
          </LinearGradient>

          <View
            style={[
              styles.inputWrapper,
              focusedField === "fullName" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder={t("phFullName")}
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              onChangeText={setFullName}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              focusedField === "phone" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder={t("phPhone")}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              focusedField === "email" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder={t("phEmail")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[
              styles.inputWrapper,
              focusedField === "dob" && styles.inputWrapperFocused,
            ]}
          >
            <Text style={styles.inputDateOfBirth}>
              {dateOfBirth.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setShowPicker(false);
                if (d) setDateOfBirth(d);
              }}
              maximumDate={new Date()}
            />
          )}

          <View
            style={[
              styles.inputWrapper,
              focusedField === "address" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder={t("phAddress")}
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.pinLabelContainer}>
            <Text style={styles.pinLabel}>{t("pinLabel")}</Text>
          </View>

          <View style={styles.pinInputWrapper}>
            <View style={styles.pinContainer}>
              {pin.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={pinRefs[idx]}
                  value={digit}
                  onChangeText={(v) => handlePinChange(v, idx)}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="numeric"
                  secureTextEntry={!showPin}
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
              <Text style={styles.checkboxLabel}>{t("female")}</Text>
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
              <Text style={styles.checkboxLabel}>{t("male")}</Text>
            </View>
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
              <Text style={styles.buttonText}>{t("registerButton")}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("haveAccount")}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.loginText}>{t("loginLink")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

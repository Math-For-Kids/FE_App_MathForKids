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
import Checkbox from "expo-checkbox";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const [gender, setGender] = useState("female");
  const [termsChecked, setTermsChecked] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
      fontSize: 28,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
    },
    avatarWrapper: {
      borderRadius: 50,
      elevation: 6,
      marginTop: 40,
      marginBottom: 20,
    },
    avatar: {
      width: 80,
      height: 80,
    },

    inputWrapper: {
      width: "100%",
      height: 50,
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
              focusedField === "fullName" && {
                borderColor: theme.colors.blueDark,
                shadowColor: theme.colors.blueDark,
                shadowOpacity: 0.5,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "phone" && {
                borderColor: theme.colors.blueDark,
                shadowColor: theme.colors.blueDark,
                shadowOpacity: 0.5,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "address" && {
                borderColor: theme.colors.blueDark,
                shadowColor: theme.colors.blueDark,
                shadowOpacity: 0.5,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
            />
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
              <Text style={styles.agreeText}>I agree to the</Text>
              Terms and Privacy Policy
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
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
            <Text style={styles.footerText}>Have an account?</Text>
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

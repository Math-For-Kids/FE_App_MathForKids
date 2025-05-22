import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";

export default function CreatePupilAccountScreen({ navigation }) {
  const { theme } = useTheme();

  // local state
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("female");

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
      borderRadius: 22,
      padding: 30,
      paddingTop: 60,
      alignItems: "center",
      shadowColor: theme.colors.shadowDark,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      position: "absolute",
      top: 20,
      fontSize: 28,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
    },
    label: {
      width: "100%",
      fontSize: 16,
      color: theme.colors.grayDark,
      fontFamily: Fonts.NUNITO_BOLD,
      marginBottom: 4,
    },
    inputWrapper: {
      width: "100%",
      height: 48,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.colors.white,
      justifyContent: "center",
      elevation: 4,
    },
    input: {
      fontSize: 16,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    checkboxGroup: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
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
    buttonRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    },
    buttonWrapper: {
      width: "48%",
      borderRadius: 10,
      overflow: "hidden",
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
  });

  /** ──────────────────────────
   * Handlers
   * ────────────────────────── */
  const onCreate = () => {
    // TODO: validate & submit to backend
    console.log({
      fullName,
      nickName,
      studentClass,
      birthday,
      gender,
    });
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={theme.colors.gradientBlue}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Student</Text>

          {/* Full Name */}
          <Text style={styles.label}>FullName</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "fullName" && {
                borderColor: theme.colors.blueDark,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* NickName */}
          <Text style={styles.label}>NickName</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "nickName" && {
                borderColor: theme.colors.blueDark,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              value={nickName}
              onChangeText={setNickName}
              style={styles.input}
              placeholder="Enter nickname"
              placeholderTextColor={theme.colors.grayMedium}
              onFocus={() => setFocusedField("nickName")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Class */}
          <Text style={styles.label}>Class</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "class" && {
                borderColor: theme.colors.blueDark,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              value={studentClass}
              onChangeText={setStudentClass}
              style={styles.input}
              placeholder="Enter class"
              placeholderTextColor={theme.colors.grayMedium}
              keyboardType="numeric"
              onFocus={() => setFocusedField("class")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Birthday */}
          <Text style={styles.label}>Birthday</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "birthday" && {
                borderColor: theme.colors.blueDark,
                elevation: 8,
              },
            ]}
          >
            <TextInput
              value={birthday}
              onChangeText={setBirthday}
              style={styles.input}
              placeholder="e.g. 2018"
              placeholderTextColor={theme.colors.grayMedium}
              keyboardType="numeric"
              onFocus={() => setFocusedField("birthday")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Gender */}
          <Text style={styles.label}>General</Text>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxItem}>
              <Text style={styles.checkboxLabel}>Female</Text>
              <Checkbox
                value={gender === "female"}
                onValueChange={() => setGender("female")}
                color={
                  gender === "female"
                    ? theme.colors.checkBoxBackground
                    : undefined
                }
              />
            </View>
            <View style={styles.checkboxItem}>
              <Text style={styles.checkboxLabel}>Male</Text>
              <Checkbox
                value={gender === "male"}
                onValueChange={() => setGender("male")}
                color={
                  gender === "male"
                    ? theme.colors.checkBoxBackground
                    : undefined
                }
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonWrapper}
              onPress={onCreate}
            >
              <LinearGradient
                colors={[theme.colors.green, theme.colors.greenDark]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Create</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonWrapper}
              onPress={() => navigation.goBack()}
            >
              <LinearGradient
                colors={[theme.colors.red, theme.colors.redDark]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

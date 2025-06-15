import React, { useState } from "react";
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
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { createPupil } from "../redux/pupilSlice";

export default function CreatePupilAccountScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  console.log("userId", userId);
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("female");
  const [focusedField, setFocusedField] = useState(null);
  const onCreate = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "User ID not found from Redux.");
        return;
      }

      const formattedBirthday =
        birthday.length === 4 ? `${birthday}-01-01` : birthday;

      const data = {
        userId: userId,
        fullName,
        nickName,
        image: "",
        gender,
        dateOfBirth: formattedBirthday,
        grade: studentClass,
        point: 0,
        volume: 100,
        language: "en",
        mode: "light",
        theme: 1,
        isDisabled: false,
      };

      await dispatch(createPupil(data)).unwrap();

      Alert.alert("Success", "Pupil created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error?.message || "Failed to create pupil");
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: {
      backgroundColor: theme.colors.cardBackground,
      width: "80%",
      borderRadius: 22,
      padding: 30,
      paddingTop: 60,
      alignItems: "center",
      elevation: 10,
    },
    title: {
      position: "absolute",
      top: 20,
      fontSize: 28,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    label: {
      width: "100%",
      fontSize: 16,
      color: theme.colors.blueGray,
      fontFamily: Fonts.NUNITO_MEDIUM,
      marginBottom: 4,
    },
    inputWrapper: {
      width: "100%",
      height: 48,
      backgroundColor: theme.colors.paleBeige,
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
      color: theme.colors.grayDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 16,
      color: theme.colors.grayMedium,
    },
    buttonRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    },
    buttonWrapper: {
      width: "40%",
      borderRadius: 10,
      elevation: 6,
    },
    button: {
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 16,
      color: theme.colors.white,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={theme.colors.gradientBlue}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Pupil</Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
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

          {/* Nickname */}
          <Text style={styles.label}>Nick Name</Text>
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

          {/* Grade */}
          <Text style={styles.label}>Grade</Text>
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
              placeholder="e.g. 2015-06-10 or 2015"
              placeholderTextColor={theme.colors.grayMedium}
              keyboardType="numeric"
              onFocus={() => setFocusedField("birthday")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
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

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonWrapper}
              onPress={onCreate}
            >
              <View
                style={[styles.button, { backgroundColor: theme.colors.green }]}
              >
                <Text style={styles.buttonText}>Create</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonWrapper}
              onPress={() => navigation.goBack()}
            >
              <View
                style={[styles.button, { backgroundColor: theme.colors.red }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

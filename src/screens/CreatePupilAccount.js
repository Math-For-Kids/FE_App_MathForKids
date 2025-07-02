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
import { Fonts } from "../../constants/Fonts";
import { useTheme } from "../themes/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { createPupil } from "../redux/pupilSlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";

export default function CreatePupilAccountScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  console.log("userId", userId);
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState(null); // Date object
  const [gender, setGender] = useState("female");
  const [focusedField, setFocusedField] = useState(null);
  const onCreate = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "User ID not found from Redux.");
        return;
      }

      if (!fullName.trim()) {
        Alert.alert("Validation Error", "Please enter the full name.");
        return;
      }

      if (!studentClass) {
        Alert.alert("Validation Error", "Please select a grade (1–3).");
        return;
      }

      if (!birthdayDate) {
        Alert.alert("Validation Error", "Please select a birthday.");
        return;
      }

      const today = new Date();
      const age =
        today.getFullYear() -
        birthdayDate.getFullYear() -
        (today <
        new Date(
          today.getFullYear(),
          birthdayDate.getMonth(),
          birthdayDate.getDate()
        )
          ? 1
          : 0);

      if (age <= 1 || age >= 100) {
        Alert.alert(
          "Validation Error",
          "Age must be between 1 and 100 years old."
        );
        return;
      }

      const formattedBirthday = birthdayDate.toISOString().split("T")[0];

      const data = {
        userId: userId,
        fullName: fullName.trim(),
        nickName: nickName.trim(), // optional
        image: "",
        gender,
        dateOfBirth: formattedBirthday,
        grade: studentClass,
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
      // justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 10,
      gap: 50,
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
            <Picker
              selectedValue={studentClass}
              onValueChange={(itemValue) => setStudentClass(itemValue)}
              dropdownIconColor={theme.colors.grayDark}
              style={[
                styles.input,
                { paddingLeft: 0 }, // Loại bỏ padding để chữ không bị lệch
              ]}
            >
              <Picker.Item
                label="Select grade"
                value=""
                color={theme.colors.grayMedium}
              />
              <Picker.Item label="Grade 1" value="1" />
              <Picker.Item label="Grade 2" value="2" />
              <Picker.Item label="Grade 3" value="3" />
            </Picker>
          </View>

          {/* Birthday */}
          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.inputWrapper,
              focusedField === "birthday" && {
                borderColor: theme.colors.blueDark,
                elevation: 8,
              },
            ]}
          >
            <Text
              style={[
                styles.input,
                {
                  color: birthdayDate
                    ? theme.colors.grayDark
                    : theme.colors.grayMedium,
                },
              ]}
            >
              {birthdayDate
                ? birthdayDate.toISOString().split("T")[0]
                : "Select birthday"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthdayDate || new Date(2015, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setBirthdayDate(selectedDate);
                  setBirthday(selectedDate.toISOString().split("T")[0]);
                }
              }}
            />
          )}
          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group
            onValueChange={(value) => setGender(value)}
            value={gender}
          >
            <View style={styles.checkboxGroup}>
              <View style={styles.checkboxItem}>
                <RadioButton
                  value="female"
                  color={theme.colors.checkBoxBackground}
                />
                <Text style={styles.checkboxLabel}>Female</Text>
              </View>
              <View style={styles.checkboxItem}>
                <RadioButton
                  value="male"
                  color={theme.colors.checkBoxBackground}
                />
                <Text style={styles.checkboxLabel}>Male</Text>
              </View>
            </View>
          </RadioButton.Group>

          {/* Buttons */}
          <View style={styles.buttonRow}>
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
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

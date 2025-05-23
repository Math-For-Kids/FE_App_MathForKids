import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
export default function GoalScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState("Jolly");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [skillType, setSkillType] = useState("");
  const [lesson, setLesson] = useState("");
  const [exercise, setExercise] = useState("");
  const [reward, setReward] = useState("");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const user = {
    pupils: [
      "Nguyen Thi Hoa",
      "Nguyen Thi Hong",
      "Tran Hoa Hong",
      "Lam Hoai Man",
    ],
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
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    labelTitle: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      textAlign: "center",
    },
    label: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      marginLeft: 10,
      marginTop: 10,
    },
    accountScrollContainer: {
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    accountButton: {
      backgroundColor: theme.colors.grayLight,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginRight: 10,
    },
    selectedAccount: { backgroundColor: theme.colors.green },
    accountText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    selectedAccountText: { color: theme.colors.white },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 10,
    },
    dateInput: { flex: 0.45 },
    input: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.colors.cardBackground,
      padding: 10,
      borderRadius: 20,
      textAlign: "center",
      borderWidth: 1,
      borderColor: theme.colors.blueDark,
      marginHorizontal: 10,
      marginBottom: 10,
    },
    saveButton: {
      padding: 14,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      alignItems: "center",
      marginTop: 20,
    },
    saveText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      fontSize: 16,
    },
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
    },
    modalBox: {
      width: "80%",
      height: "65%",
      backgroundColor: "#fff",
      borderRadius: 20,
      paddingVertical: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.blueDark,
      elevation: 3,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      marginBottom: 16,
    },
    modalButton: {
      width: "100%",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.blueDark,
      marginVertical: 10,
      overflow: "hidden",
      elevation: 3,
    },
    modalButtonText: {
      textAlign: "center",
      color: "#fff",
      fontSize: 16,
      paddingVertical: 10,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    rewardContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    rewardImage: { width: 32, height: 32, marginRight: 10 },
  });
  const lessonOptions = {
    Addition: [
      { label: "Lesson 1: Add 1-digit", value: "Lesson 1" },
      { label: "Lesson 2: Add with carry", value: "Lesson 2" },
    ],
    Subtraction: [
      { label: "Lesson 1: Subtract 1-digit", value: "Lesson 1" },
      { label: "Lesson 2: Subtract with borrow", value: "Lesson 2" },
    ],
    Multiplication: [
      { label: "Lesson 1: Multiply by 1", value: "Lesson 1" },
      { label: "Lesson 2: Multiply by 2", value: "Lesson 2" },
    ],
    Division: [
      { label: "Lesson 1: Divide by 1", value: "Lesson 1" },
      { label: "Lesson 2: Divide evenly", value: "Lesson 2" },
    ],
    "Multiplications table": [
      { label: "Lesson 1: Table 2", value: "Lesson 1" },
      { label: "Lesson 2: Table 3", value: "Lesson 2" },
    ],
  };
  const exerciseOptions = {
    "Lesson 1": [
      { label: "Exercise A", value: "Exercise A" },
      { label: "Exercise B", value: "Exercise B" },
    ],
    "Lesson 2": [
      { label: "Exercise C", value: "Exercise C" },
      { label: "Exercise D", value: "Exercise D" },
    ],
  };
  const renderOptionModal = (title, options, onSelect, onClose) => (
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalBox} onStartShouldSetResponder={() => true}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView style={{ width: "100%" }}>
          {options.map((item) => (
            <LinearGradient
              key={item.value}
              colors={theme.colors.gradientBluePrimary}
              style={styles.modalButton}
            >
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
                style={styles.rewardContainer}
              >
                {item.image && (
                  <Image
                    source={item.image}
                    style={styles.rewardImage}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.modalButtonText}>{item.label}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={theme.icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Set goal</Text>
      </LinearGradient>

      <ScrollView>
        <Text style={styles.labelTitle}>Selection account</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.accountScrollContainer}
        >
          {user.pupils.map((pupil) => (
            <TouchableOpacity
              key={pupil}
              style={[
                styles.accountButton,
                selectedAccount === pupil && styles.selectedAccount,
              ]}
              onPress={() => setSelectedAccount(pupil)}
            >
              <Text
                style={[
                  styles.accountText,
                  selectedAccount === pupil && styles.selectedAccountText,
                ]}
              >
                {pupil}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dateRow}>
          <View style={styles.dateInput}>
            <Text style={styles.label}>Date start</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <TextInput
                value={startDate.toLocaleDateString()}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (event.type === "set" && selectedDate)
                    setStartDate(selectedDate);
                }}
              />
            )}
          </View>
          <View style={styles.dateInput}>
            <Text style={styles.label}>Date end</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <TextInput
                value={endDate.toLocaleDateString()}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (event.type === "set" && selectedDate)
                    setEndDate(selectedDate);
                }}
              />
            )}
          </View>
        </View>

        <Text style={styles.label}>Skill type</Text>
        <TouchableOpacity
          onPress={() => setShowSkillModal(true)}
          style={styles.input}
        >
          <Text
            style={{
              color: skillType ? theme.colors.black : theme.colors.gray,
            }}
          >
            {skillType || "Select skill type"}
          </Text>
          <Ionicons
            name="caret-down-outline"
            size={24}
            color={theme.colors.blueDark}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Lesson</Text>
        <TouchableOpacity
          onPress={() => setShowLessonModal(true)}
          style={styles.input}
        >
          <Text
            style={{
              color: lesson ? theme.colors.black : theme.colors.gray,
            }}
          >
            {lesson || "Select lesson"}
          </Text>
          <Ionicons
            name="caret-down-outline"
            size={24}
            color={theme.colors.blueDark}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Exercise</Text>
        <TouchableOpacity
          onPress={() => setShowExerciseModal(true)}
          style={styles.input}
        >
          <Text
            style={{ color: exercise ? theme.colors.black : theme.colors.gray }}
          >
            {exercise || "Select exercise"}
          </Text>
          <Ionicons
            name="caret-down-outline"
            size={24}
            color={theme.colors.blueDark}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Reward</Text>
        <TouchableOpacity
          onPress={() => setShowRewardModal(true)}
          style={styles.input}
        >
          <Text
            style={{ color: reward ? theme.colors.black : theme.colors.gray }}
          >
            {reward || "Select reward"}
          </Text>
          <Ionicons
            name="caret-down-outline"
            size={24}
            color={theme.colors.blueDark}
          />
        </TouchableOpacity>
      </ScrollView>

      <LinearGradient
        colors={theme.colors.gradientBlue}
        style={styles.saveButton}
      >
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </LinearGradient>

      {showSkillModal &&
        renderOptionModal(
          "Select Skill Type",
          [
            { label: "Addition", value: "Addition" },
            { label: "Subtraction", value: "Subtraction" },
            { label: "Multiplication", value: "Multiplication" },
            { label: "Division", value: "Division" },
            { label: "Multiplications table", value: "Multiplications table" },
          ],
          setSkillType,
          () => setShowSkillModal(false)
        )}

      {showLessonModal &&
        renderOptionModal(
          "Select Lesson",
          lessonOptions[skillType] || [],
          setLesson,
          () => setShowLessonModal(false)
        )}

      {showExerciseModal &&
        renderOptionModal(
          "Select Exercise",
          exerciseOptions[lesson] || [],
          setExercise,
          () => setShowExerciseModal(false)
        )}

      {showRewardModal &&
        renderOptionModal(
          "Select Reward",
          [
            {
              label: "Capypara",
              value: "Capypara",
              image: theme.icons.characterSandwich,
            },
            {
              label: "Starfish",
              value: "Starfish",
              image: theme.icons.characterSandwich,
            },
            {
              label: "Hippocampus",
              value: "Hippocampus",
              image: theme.icons.characterSandwich,
            },
            {
              label: "Whale",
              value: "Whale",
              image: theme.icons.characterSandwich,
            },
            {
              label: "Super hero",
              value: "Super hero",
              image: theme.icons.characterSandwich,
            },
            {
              label: "Mask",
              value: "Mask",
              image: theme.icons.characterSandwich,
            },
          ],
          setReward,
          () => setShowRewardModal(false)
        )}
    </LinearGradient>
  );
}

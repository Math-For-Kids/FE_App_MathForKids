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
import FloatingMenu from "../components/FloatingMenu";
import { getAllPupils, pupilById, pupilByUserId } from "../redux/pupilSlice";
import { getLessonsByGradeAndType } from "../redux/lessonSlice";
import { getEnabledRewards } from "../redux/rewardSlice";
import { createGoal } from "../redux/goalSlice";
import { useIsFocused } from "@react-navigation/native";
import { createPupilNotification } from "../redux/pupilNotificationSlice";
import { createUserNotification } from "../redux/userNotificationSlice"; // nếu bạn cũng cần gửi cho user
import { serverTimestamp } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import i18n from "../i18n";
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
  const dispatch = useDispatch();
  const { pupils } = useSelector((state) => state.pupil);
  const { user } = useSelector((state) => state.auth);
  const { lessons } = useSelector((state) => state.lesson);
  const { rewards } = useSelector((state) => state.reward);
  console.log("userId", user.id);
  useEffect(() => {
    dispatch(getEnabledRewards());
    dispatch(pupilByUserId(user?.id));
  }, [dispatch, user?.id]);
  console.log("rewards", rewards);
  console.log("pupils", pupils);
  useEffect(() => {
    const selectedPupil = pupils.find((p) => p.id === selectedAccount);
    console.log("selectedPupil", selectedPupil);
    if (selectedPupil && skillType) {
      dispatch(
        getLessonsByGradeAndType({
          grade: selectedPupil.grade,
          type: skillType.toLowerCase(),
        })
      );
    }
  }, [skillType, selectedAccount]);
  console.log("lessons", lessons);
  const rewardOptions = rewards.map((r) => ({
    label: r.name?.[i18n.language] || r.name?.en || "Unnamed",
    value: r.name?.[i18n.language] || r.name?.en || "Unnamed",
    image: r.image ? { uri: r.image } : undefined,
  }));
  const handleSaveGoal = () => {
    if (!selectedAccount || !skillType || !lesson || !exercise || !reward) {
      alert("Please complete all fields before saving!");
      return;
    }

    const goalData = {
      pupilId: selectedAccount,
      skillType,
      lesson,
      exercise,
      reward,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    dispatch(createGoal(goalData))
      .unwrap()
      .then(() => {
        const now = new Date();
        const createdAt = now.toISOString();
        const updatedAt = now.toISOString();

        // Gửi cho phụ huynh
        dispatch(
          createUserNotification({
            userId: user.id,
            title: {
              en: "Goal Created Successfully",
              vi: "Tạo mục tiêu thành công",
            },
            content: {
              en: `You just created a goal in ${skillType} - ${lesson}`,
              vi: `Bạn vừa tạo mục tiêu cho kỹ năng ${skillType} - ${lesson}`,
            },
            isRead: false,
            createdAt,
            updatedAt,
          })
        );

        // Gửi cho học sinh
        dispatch(
          createPupilNotification({
            pupilId: selectedAccount,
            title: {
              en: "New Goal Assigned",
              vi: "Có mục tiêu mới",
            },
            content: {
              en: `You have a new goal in ${skillType} - ${lesson}`,
              vi: `Bạn có mục tiêu mới cho kỹ năng ${skillType} - ${lesson}`,
            },
            isRead: false,
            createdAt,
            updatedAt,
          })
        );

        alert("Goal saved and notifications sent!");
        navigation.goBack();
      })
      .catch((err) => {
        alert(`Failed to save goal: ${err}`);
      });
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
    labelTitle: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      textAlign: "center",
    },
    label: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      alignItems: "center",
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
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      color: theme.colors.white,
      fontSize: 16,
      paddingVertical: 10,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    labelValueContainer: {
      flexDirection: "column",
      flex: 1,
    },

    rewardContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      padding: 10,
      gap: 10,
    },
    rewardImage: {
      width: 40,
      height: 40,
      marginRight: 10,
      marginLeft: 20,
      borderRadius: 8,
    },
  });
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
                <View style={styles.labelValueContainer}>
                  <Text style={styles.modalButtonText}>{item.label}</Text>
                </View>
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
          {pupils.map((pupil) => (
            <TouchableOpacity
              key={pupil.id}
              style={[
                styles.accountButton,
                selectedAccount === pupil.id && styles.selectedAccount,
              ]}
              onPress={() => setSelectedAccount(pupil.id)}
            >
              <Text
                style={[
                  styles.accountText,
                  selectedAccount === pupil.id && styles.selectedAccountText,
                ]}
              >
                {pupil.fullName}
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
                  if (event.type === "set" && selectedDate) {
                    const maxEndDate = new Date(startDate);
                    maxEndDate.setDate(startDate.getDate() + 14);

                    if (selectedDate > maxEndDate) {
                      alert(
                        "You can only set a goal within 14 days from the start date."
                      );
                      return;
                    }

                    setEndDate(selectedDate);
                  }
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
        <TouchableOpacity onPress={handleSaveGoal}>
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
          lessons.map((l) => ({
            label: l.name?.[i18n.language] || l.name?.en || "Unnamed Lesson",
            value: l.name?.[i18n.language] || l.name?.en || "Unnamed Lesson",
          })),
          setLesson,
          () => setShowLessonModal(false)
        )}

      {showExerciseModal &&
        renderOptionModal(
          "Select Exercise",
          lessons.map((l) => ({
            label: l.name?.[i18n.language] || l.name?.en || "Unnamed Lesson",
            value: l.name?.[i18n.language] || l.name?.en || "Unnamed Lesson",
          })),
          setExercise,
          () => setShowExerciseModal(false)
        )}

      {showRewardModal &&
        renderOptionModal("Select Reward", rewardOptions, setReward, () =>
          setShowRewardModal(false)
        )}

      <FloatingMenu />
    </LinearGradient>
  );
}

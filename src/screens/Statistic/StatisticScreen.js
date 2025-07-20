import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getAllPupils } from "../../redux/pupilSlice";
import {
  getUserPointStatsComparison,
  getAnswerStats,
} from "../../redux/statisticSlice";
import { getLessonsByGradeAndType } from "../../redux/lessonSlice";
import { notificationsByUserId } from "../../redux/userNotificationSlice";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FloatingMenu from "../../components/FloatingMenu";
import AcademicChart from "./AcademicChart";
import TrueFalseChart from "./TrueFalseChart";
import GoalChart from "./GoalChart";
import createStyles from "./styles";

export default function StatisticScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("statistic");
  const screenWidth = Dimensions.get("window").width - 32;
  const styles = createStyles(theme);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const users = useSelector((state) => state.auth.user);
  const pupils = useSelector((state) => state.pupil.pupils || []);
  const lessons = useSelector((state) => state.lesson.lessons || []);
  const { pointStats, answerStats, loading, error } = useSelector(
    (state) => state.statistic
  );
  const notifications = useSelector((state) => state.notifications.list || []);
  const newNotificationCount = notifications.filter((n) => !n.isRead).length;

  const [selectedPupil, setSelectedPupil] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [showPupilDropdown, setShowPupilDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showLessonDropdown, setShowLessonDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedChart, setSelectedChart] = useState("progress");

  const filteredPupils = pupils.filter(
    (p) => String(p.userId) === String(users?.id)
  );
  const periods = ["thisWeek", "thisMonth", "thisQuarter"];
  const periodRanges = {
    thisWeek: ["thisWeek", "lastWeek"],
    thisMonth: ["thisMonth", "lastMonth"],
    thisQuarter: ["thisQuarter", "lastQuarter"],
  };

  const skillTypes = useMemo(() => {
    if (selectedPupil?.grade === 1) {
      return ["addition", "subtraction"];
    }
    return ["addition", "subtraction", "multiplication", "division"];
  }, [selectedPupil]);

  const skillLabels = {
    addition: t("skill.add"),
    subtraction: t("skill.sub"),
    multiplication: t("skill.mul"),
    division: t("skill.div"),
  };
  useEffect(() => {
    if (isFocused) {
      dispatch(getAllPupils());
      dispatch(notificationsByUserId(users.id));
      if (selectedPupil && selectedPupil.grade) {
        dispatch(
          getLessonsByGradeAndType({
            pupilId: selectedPupil.id,
            grade: selectedPupil.grade,
            type: selectedSkill || null, // Raw skill key
          })
        );
        console.log("Fetching lessons for:", {
          pupilId: selectedPupil.id,
          grade: selectedPupil.grade,
          type: selectedSkill, // Should be "addition", etc.
        });
      }
    }
  }, [isFocused, users?.id, selectedPupil, selectedSkill]);


  useEffect(() => {
    if (selectedPupil && selectedPupil.grade && selectedPeriod) {
      const ranges = periodRanges[selectedPeriod];
      const rangesInEnglish = ranges.map((key) => key);

      dispatch(
        getUserPointStatsComparison({
          pupilId: selectedPupil.id,
          grade: selectedPupil.grade,
          ranges: rangesInEnglish,
          lessonId: selectedLesson?.id || null,
          skill: selectedSkill || null, // Raw skill key
        })
      );
      dispatch(
        getAnswerStats({
          pupilId: selectedPupil.id,
          grade: selectedPupil.grade,
          ranges: rangesInEnglish,
          lessonId: selectedLesson?.id || null,
          skill: selectedSkill || null, // Raw skill key
        })
      );
    }
  }, [selectedPupil, selectedPeriod, selectedLesson, selectedSkill]);
  // In StatisticScreen.js
  const chartSkills = selectedSkill
    ? [skillLabels[selectedSkill]]
    : skillTypes.map((type) => skillLabels[type]);

  const getWeightedScore = (type, rangeName) => {
    if (!pointStats || !Array.isArray(pointStats.compareByType)) {
      // console.warn("pointStats.compareByType is not an array or is undefined");
      return 0;
    }

    const found = pointStats.compareByType.find((s) => s.type === type); // Uses raw key
    const rangeData = found?.ranges?.[rangeName];
    if (!rangeData) return 0;

    const weights = { "≥9": 10, "≥7": 8, "≥5": 6, "<5": 4 };
    return Object.entries(rangeData).reduce(
      (sum, [key, count]) => sum + (weights[key] || 0) * count,
      0
    );
  };

  const thisRange = periodRanges[selectedPeriod]?.[0];
  const lastRange = periodRanges[selectedPeriod]?.[1];

  const thisMonth = (selectedSkill ? [selectedSkill] : skillTypes).map((type) =>
    getWeightedScore(type, thisRange)
  );
  const lastMonth = (selectedSkill ? [selectedSkill] : skillTypes).map((type) =>
    getWeightedScore(type, lastRange)
  );

  const trueRatio = (selectedSkill ? [selectedSkill] : skillTypes).map((type) => {
    const found = answerStats?.statsByType?.find((s) => s.type === type); // Uses raw key
    const data = found?.ranges?.[thisRange] || [];
    const total =
      Array.isArray(data) && data.length > 0
        ? data.reduce((acc, lv) => acc + (lv.correct || 0) + (lv.wrong || 0), 0)
        : 0;
    return total === 0
      ? 0
      : Math.round(
        (Array.isArray(data) && data.length > 0
          ? data.reduce((acc, lv) => acc + (lv.correct || 0), 0)
          : 0) * 100 / total
      );
  });

  const falseRatio = trueRatio.map((v) => 100 - v);

  const createBarDetails = (skillTypes, answerStats, range) => {
    const bars = [];

    (selectedSkill ? [selectedSkill] : skillTypes).forEach((type) => {
      const stat = answerStats?.statsByType?.find((s) => s.type === type); // Uses raw key
      const rangeData = Array.isArray(stat?.ranges?.[range])
        ? stat.ranges[range]
        : [];

      const correctTotal =
        rangeData.length > 0
          ? rangeData.reduce((a, lv) => a + (lv.correct || 0), 0)
          : 0;
      const wrongTotal =
        rangeData.length > 0
          ? rangeData.reduce((a, lv) => a + (lv.wrong || 0), 0)
          : 0;
      const total = correctTotal + wrongTotal;

      const truePercent = total > 0 ? Math.round((correctTotal * 100) / total) : 0;
      const falsePercent = 100 - truePercent;

      const firstLevel = rangeData[0] || {};

      bars.push({
        percent: truePercent,
        levelId: firstLevel.levelId || "-",
        correct: firstLevel.correct || 0,
        wrong: firstLevel.wrong || 0,
      });

      bars.push({
        percent: falsePercent,
        levelId: firstLevel.levelId || "-",
        correct: firstLevel.correct || 0,
        wrong: firstLevel.wrong || 0,
      });
    });

    return bars;
  };
  const barDetails = createBarDetails(skillTypes, answerStats, thisRange);

  const filteredLessons = useMemo(() => {
    return lessons.filter(
      (lesson) => !selectedSkill || lesson.type === selectedSkill // Uses raw key
    );
  }, [lessons, selectedSkill]);

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userRow}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => navigation.navigate("DetailScreen")}
            >
              <Image
                source={
                  users?.image ? { uri: users?.image } : theme.icons.avatarAdd
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>{t("hello")}</Text>
              <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
                {users?.fullName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NotificationScreen", { userId: users.id })
            }
          >
            <View style={styles.notificationContainer}>
              {newNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{newNotificationCount}</Text>
                </View>
              )}
              <Image
                source={theme.icons.notification}
                style={styles.notificationIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView>
        {/* Chart Type Buttons */}
        <View style={styles.chartTypeWrapper}>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              selectedChart === "progress" && styles.chartTypeButtonSelected,
            ]}
            onPress={() => setSelectedChart("progress")}
          >
            <Text
              style={[
                styles.chartTypeText,
                selectedChart === "progress" && styles.chartTypeTextSelected,
              ]}
            >
              {t("academicProgress")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              selectedChart === "trueFalse" && styles.chartTypeButtonSelected,
            ]}
            onPress={() => setSelectedSkill("trueFalse")}
          >
            <Text
              style={[
                styles.chartTypeText,
                selectedChart === "trueFalse" && styles.chartTypeTextSelected,
              ]}
            >
              {t("trueFalseRatio")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              selectedChart === "goal" && styles.chartTypeButtonSelected,
            ]}
            onPress={() => setSelectedSkill("goal")}
          >
            <Text
              style={[
                styles.chartTypeText,
                selectedChart === "goal" && styles.chartTypeTextSelected,
              ]}
            >
              {t("goal")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dropdowns */}
        <View style={styles.dropdownContainer}>
          {/* Pupil Dropdown */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setShowPupilDropdown(true)}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedPupil?.fullName || t("selectPupil")}
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
            <Modal
              transparent
              visible={showPupilDropdown}
              animationType="fade"
              onRequestClose={() => setShowPupilDropdown(false)}
            >
              <TouchableOpacity
                style={styles.dropdownModal}
                activeOpacity={1}
                onPressOut={() => setShowPupilDropdown(false)}
              >
                <View style={styles.dropdownContent}>
                  {filteredPupils.map((pupil, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedPupil(pupil);
                        setShowPupilDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {pupil.fullName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Skill Dropdown */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setShowSkillDropdown(true)}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedSkill ? skillLabels[selectedSkill] : t("selectSkill")}
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
            <Modal
              transparent
              visible={showSkillDropdown}
              animationType="fade"
              onRequestClose={() => setShowSkillDropdown(false)}
            >
              <TouchableOpacity
                style={styles.dropdownModal}
                activeOpacity={1}
                onPressOut={() => setShowSkillDropdown(false)}
              >
                <View style={styles.dropdownContent}>
                  {skillTypes.map((skill, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedSkill(skill); // Store raw skill key
                        if (selectedLesson?.type !== skill) setSelectedLesson(null);
                        setShowSkillDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {skillLabels[skill]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Lesson Dropdown */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setShowLessonDropdown(true)}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedLesson?.name[i18n.language] || t("selectLesson")}
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
            <Modal
              transparent
              visible={showLessonDropdown}
              animationType="fade"
              onRequestClose={() => setShowLessonDropdown(false)}
            >
              <TouchableOpacity
                style={styles.dropdownModal}
                activeOpacity={1}
                onPressOut={() => setShowLessonDropdown(false)}
              >
                <View style={styles.dropdownContent}>
                  {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedLesson(lesson);
                          setShowLessonDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {lesson.name[i18n.language] || t("noLessonName")}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.dropdownItemText}>
                      {t("noLessonsAvailable")}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Period Dropdown */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => setShowPeriodDropdown(true)}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {t(periodRanges[selectedPeriod][0])}
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
            <Modal
              transparent
              visible={showPeriodDropdown}
              animationType="fade"
              onRequestClose={() => setShowPeriodDropdown(false)}
            >
              <TouchableOpacity
                style={styles.dropdownModal}
                activeOpacity={1}
                onPressOut={() => setShowPeriodDropdown(false)}
              >
                <View style={styles.dropdownContent}>
                  {periods.map((period, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedPeriod(period);
                        setShowPeriodDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {t(periodRanges[period][1])}, {t(periodRanges[period][0])}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>

        {/* Charts */}
        {loading ? (
          <Text style={styles.loadingText}>Loading statistics...</Text>
        ) : error ? (
          <Text style={styles.errorText}> {t("error")}</Text>
        ) : (
          <>
            {!loading && selectedChart === "progress" && (
              <AcademicChart
                t={t}
                styles={styles}
                screenWidth={screenWidth}
                skills={selectedSkill ? [selectedSkill] : skillTypes} // Pass raw keys instead of chartSkills
                pointStats={pointStats}
                selectedPeriod={selectedPeriod}
                language={i18n.language}
                filteredLessons={filteredLessons}
                thisRange={thisRange}
                lastRange={lastRange}
              />
            )}
            {selectedChart === "trueFalse" && (
              <TrueFalseChart
                t={t}
                styles={styles}
                skills={chartSkills}
                trueRatio={trueRatio}
                falseRatio={falseRatio}
                screenWidth={screenWidth}
                answerStats={answerStats}
                thisRange={thisRange}
                barDetails={barDetails}
              />
            )}
            {selectedChart === "goal" && (
              <GoalChart
                t={t}
                styles={styles}
                skills={chartSkills}
                screenWidth={screenWidth}
              />
            )}
          </>
        )}
      </ScrollView>

      <FloatingMenu />
    </LinearGradient>
  );
}
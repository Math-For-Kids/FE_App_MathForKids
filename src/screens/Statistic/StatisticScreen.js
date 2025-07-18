import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
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
import { notificationsByUserId } from "../../redux/userNotificationSlice";
import { getEnabledLevels } from "../../redux/levelSlice";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FloatingMenu from "../../components/FloatingMenu";
import AcademicChart from "./AcademicChart";
import TrueFalseChart from "./TrueFalseChart";
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
  const { pointStats, answerStats } = useSelector((state) => state.statistic);
  const notifications = useSelector((state) => state.notifications.list || []);
  const levels = useSelector((state) => state.level.levels || []);
  const newNotificationCount = notifications.filter((n) => !n.isRead).length;

  const [selectedPupil, setSelectedPupil] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const filteredPupils = pupils.filter(
    (p) => String(p.userId) === String(users?.id)
  );

  const getLevelNameById = (id) => {
    const level = levels.find((lv) => lv.id === id);
    return level?.name?.[i18n.language] || level?.name?.vi || "-";
  };

  const periods = ["thisWeek", "thisMonth", "thisQuarter"];
  const periodRanges = {
    thisWeek: ["thisWeek", "lastWeek"],
    thisMonth: ["thisMonth", "lastMonth"],
    thisQuarter: ["thisQuarter", "lastQuarter"],
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(getAllPupils());
      dispatch(getEnabledLevels());
      dispatch(notificationsByUserId(users.id));
    }
  }, [isFocused, users?.id]);

  useEffect(() => {
    if (selectedPupil && selectedPupil.grade && selectedPeriod) {
      const ranges = periodRanges[selectedPeriod] || ["thisMonth", "lastMonth"];
      const rangesInEnglish = ranges.map((key) => key);

      dispatch(
        getUserPointStatsComparison({
          pupilId: selectedPupil.id,
          grade: selectedPupil.grade,
          ranges: rangesInEnglish,
        })
      );
      dispatch(
        getAnswerStats({
          pupilId: selectedPupil.id,
          grade: selectedPupil.grade,
          ranges: rangesInEnglish,
        })
      );
    }
  }, [selectedPupil, selectedPeriod]);

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

  const skillTypeOptions = ["all", ...skillTypes];

  const rawSkills = skillTypes.filter((type) =>
    answerStats?.statsByType?.some((s) => s.type === type)
  );

  const validSkills =
    selectedType === "all"
      ? rawSkills
      : rawSkills.filter((type) => type === selectedType);

  const chartSkills = validSkills.map((type) => skillLabels[type]);

  const getWeightedScore = (type, rangeName) => {
    const found = pointStats?.compareByType?.find((s) => s.type === type);
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

  const thisMonth = validSkills.map((type) =>
    getWeightedScore(type, thisRange)
  );
  const lastMonth = validSkills.map((type) =>
    getWeightedScore(type, lastRange)
  );

  const trueRatio = validSkills.map((type) => {
    const found = answerStats?.statsByType?.find((s) => s.type === type);
    const data = found?.ranges?.[thisRange] || [];
    const total = data.reduce((acc, lv) => acc + lv.correct + lv.wrong, 0);
    return total === 0
      ? 0
      : Math.round(
          (data.reduce((acc, lv) => acc + lv.correct, 0) * 100) / total
        );
  });

  const falseRatio = trueRatio.map((v) => 100 - v);

  const createBarDetails = (validSkills, answerStats, range) => {
    const bars = [];

    validSkills.forEach((type) => {
      const stat = answerStats?.statsByType?.find((s) => s.type === type);
      const rangeData = stat?.ranges?.[range] || [];

      if (!rangeData.length) {
        bars.push({
          percent: 0,
          correct: 0,
          wrong: 0,
          type,
        });
        bars.push({
          percent: 0,
          correct: 0,
          wrong: 0,
          type,
        });
        return;
      }

      const totalCorrect = rangeData.reduce((sum, lv) => sum + lv.correct, 0);
      const totalWrong = rangeData.reduce((sum, lv) => sum + lv.wrong, 0);
      const totalAll = totalCorrect + totalWrong;

      const percentTrue =
        totalAll > 0 ? Math.round((totalCorrect * 100) / totalAll) : 0;
      const percentFalse = 100 - percentTrue;

      bars.push({
        percent: percentTrue,
        correct: totalCorrect,
        wrong: totalWrong,
        type,
      });

      bars.push({
        percent: percentFalse,
        correct: totalCorrect,
        wrong: totalWrong,
        type,
      });
    });

    return bars;
  };

  const barDetails = createBarDetails(validSkills, answerStats, thisRange);
  const barDetailsThisRange = createBarDetails(
    validSkills,
    answerStats,
    thisRange
  );
  const barDetailsLastRange = createBarDetails(
    validSkills,
    answerStats,
    lastRange
  );

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
        {/* Pupil Dropdown */}
        <View style={styles.gradeWrapper}>
          <TouchableOpacity
            onPress={() => setShowDropdown(true)}
            style={styles.gradeRow}
          >
            <Text style={styles.grade}>
              {selectedPupil?.fullName || t("selectPupil")}
            </Text>
            <Ionicons
              name="caret-down-outline"
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>
        </View>
        <Modal transparent visible={showDropdown} animationType="fade">
          <TouchableOpacity
            style={styles.dropdown}
            activeOpacity={1}
            onPressOut={() => setShowDropdown(false)}
          >
            <View>
              {filteredPupils.map((pupil, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedPupil(pupil);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{pupil.fullName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Period Dropdown */}
        <View style={styles.periodWrapper}>
          <TouchableOpacity
            onPress={() => setShowPeriodDropdown(true)}
            style={styles.gradeRow}
          >
            <Text style={styles.grade}>
              {`${t(periodRanges[selectedPeriod][0])}, ${t(
                periodRanges[selectedPeriod][1]
              )}`}
            </Text>
            <Ionicons
              name="caret-down-outline"
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>
        </View>
        <Modal transparent visible={showPeriodDropdown} animationType="fade">
          <TouchableOpacity
            style={{ flex: 1 }}
            onPressOut={() => setShowPeriodDropdown(false)}
          >
            <View style={styles.dropdownDay}>
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
                    {`${t(periodRanges[period][0])}, ${t(
                      periodRanges[period][1]
                    )}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Type Dropdown */}
        <View style={styles.periodWrapper}>
          <TouchableOpacity
            onPress={() => setShowTypeDropdown(true)}
            style={styles.gradeRow}
          >
            <Text style={styles.grade}>
              {selectedType === "all"
                ? t("allSkills")
                : skillLabels[selectedType]}
            </Text>
            <Ionicons
              name="caret-down-outline"
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>
        </View>
        <Modal transparent visible={showTypeDropdown} animationType="fade">
          <TouchableOpacity
            style={{ flex: 1 }}
            onPressOut={() => setShowTypeDropdown(false)}
          >
            <View style={styles.dropdownDay}>
              {skillTypeOptions.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {type === "all" ? t("allSkills") : skillLabels[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Charts */}
        <AcademicChart
          t={t}
          styles={styles}
          skills={chartSkills}
          lastMonth={lastMonth}
          thisMonth={thisMonth}
          screenWidth={screenWidth}
        />

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
          rangeLabel={t(thisRange)}
          barDetailsThis={barDetailsThisRange}
          barDetailsLast={barDetailsLastRange}
        />
      </ScrollView>

      <FloatingMenu />
    </LinearGradient>
  );
}

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "../../constants/Fonts";
import FloatingMenu from "../components/FloatingMenu";
import { BarChart } from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import { getAllPupils } from "../redux/pupilSlice";
import { getUserPointStatsComparison } from "../redux/testSlice";
import { notificationsByUserId } from "../redux/userNotificationSlice";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function StatisticScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation("statistic");
  const screenWidth = Dimensions.get("window").width - 32;
  const users = useSelector((state) => state.auth.user);
  const pupils = useSelector((state) => state.pupil.pupils || []);
  const userNotifications = useSelector(
    (state) => state.notifications.list || []
  );
  const userpoints = useSelector((state) => state.test.userpoints);
  const loading = useSelector((state) => state.test.loading);
  const error = useSelector((state) => state.test.error);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // State for dropdowns
  const [selectedPupil, setSelectedPupil] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [showPeriod, setShowPeriod] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState("addition");
  const [showOperation, setShowOperation] = useState(false);

  // Available periods and operations
  const periods = ["Week", "Month", "Quarter"];
  const operations = ["addition", "subtraction", "multiplication", "division"];
  const scoreRanges = ["≥9", "≥7", "≥5", "<5"];
  const skills = [
    t("skill.add"),
    t("skill.sub"),
    t("skill.mul"),
    t("skill.div"),
  ];

  // Map period to API ranges
  const periodToRanges = {
    Week: "thisWeek,lastWeek",
    Month: "thisMonth,lastMonth",
    Quarter: "thisQuarter,lastQuarter",
  };

  // Map period to display labels
  const periodToLabels = {
    Week: { current: "thisWeek", previous: "lastWeek" },
    Month: { current: "thisMonth", previous: "lastMonth" },
    Quarter: { current: "thisQuarter", previous: "lastQuarter" },
  };

  // Fetch data
  useEffect(() => {
    if (isFocused && users?.id) {
      console.log("Fetching pupils and notifications for user:", users.id);
      dispatch(getAllPupils());
      dispatch(notificationsByUserId(users.id));
    }
  }, [isFocused, users, dispatch]);

  useEffect(() => {
    if (selectedPupil && isFocused) {
      console.log("Dispatching getUserPointStatsComparison with:", {
        pupilId: selectedPupil.id,
        grade: selectedPupil.grade || 2,
        ranges: periodToRanges[selectedPeriod],
      });
      dispatch(
        getUserPointStatsComparison({
          pupilId: selectedPupil.id,
          grade: selectedPupil.grade || 2,
          ranges: periodToRanges[selectedPeriod],
        })
      );
    }
  }, [selectedPupil, isFocused, selectedPeriod, dispatch]);

  // Debug userpoints
  console.log("userpoints:", JSON.stringify(userpoints, null, 2));

  // Filter pupils and notifications
  const filteredPupils = pupils.filter(
    (pupil) => String(pupil.userId) === String(users?.id)
  );
  const filteredNotifications = userNotifications.filter(
    (notification) => notification.isRead === false
  );
  const newNotificationCount = filteredNotifications.length;

  // Prepare academic progress chart data
  const getChartData = () => {
    if (
      !userpoints ||
      !userpoints.compareByType ||
      !userpoints.compareByType[selectedOperation]
    ) {
      console.log("No valid userpoints data for chart");
      return {
        labels: scoreRanges,
        datasets: [
          {
            data: [0, 0, 0, 0],
            colors: scoreRanges.map(() => () => theme.colors.grayLight),
          },
        ],
        legend: [
          t(periodToLabels[selectedPeriod].previous),
          t(periodToLabels[selectedPeriod].current),
        ],
      };
    }

    const currentPeriod = periodToLabels[selectedPeriod].current;
    const previousPeriod = periodToLabels[selectedPeriod].previous;

    console.log(
      `Fetching data for ${selectedOperation} - ${currentPeriod}:`,
      userpoints.compareByType[selectedOperation][currentPeriod]
    );
    console.log(
      `Fetching data for ${selectedOperation} - ${previousPeriod}:`,
      userpoints.compareByType[selectedOperation][previousPeriod]
    );

    const currentData = scoreRanges.map(
      (range) =>
        userpoints.compareByType[selectedOperation][currentPeriod]?.[range] || 0
    );
    const previousData = scoreRanges.map(
      (range) =>
        userpoints.compareByType[selectedOperation][previousPeriod]?.[range] || 0
    );

    return {
      labels: scoreRanges
        .flatMap((range) => [range, ""])
        .flatMap((label, index) => (index % 3 === 2 ? [label] : [label])),
      datasets: [
        {
          data: scoreRanges
            .flatMap((_, i) => [previousData[i], currentData[i], 0])
            .concat(100),
          colors: scoreRanges
            .flatMap(() => [
              () => theme.colors.grayLight, // Previous period (left)
              () => theme.colors.blueDark, // Current period (right)
              () => "rgb(255, 255, 255)",
            ])
            .concat(() => "rgb(255, 255, 255)"),
        },
      ],
      legend: [
        t(periodToLabels[selectedPeriod].previous),
        t(periodToLabels[selectedPeriod].current),
      ],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.cardBackground,
    backgroundGradientTo: theme.colors.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => theme.colors.black,
    propsForBackgroundLines: {
      stroke: "#e3e3e3",
    },
    barPercentage: 0.65,
  };

  // True/False chart data
  const trueRatio = [95, 90, 55, 56];
  const falseRatio = [5, 10, 45, 44];
  const accuracyBarChartData = {
    labels: skills
      .flatMap((skill) => [skill, ""])
      .flatMap((label, index) => (index % 3 === 2 ? [label] : [label])),
    datasets: [
      {
        data: skills
          .flatMap((_, i) => [trueRatio[i], falseRatio[i], 0])
          .concat(100),
        colors: skills
          .flatMap(() => [
            () => theme.colors.green,
            () => theme.colors.redTomato,
            () => "rgba(0,0,0,0.01)",
          ])
          .concat(() => "rgb(255, 255, 255)"),
      },
    ],
    legend: [t("true"), t("false")],
  };

  const chartTFConfig = {
    backgroundGradientFrom: theme.colors.cardBackground,
    backgroundGradientTo: theme.colors.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => theme.colors.black,
    propsForBackgroundLines: {
      stroke: "#e3e3e3",
    },
    barPercentage: 0.65,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    header: {
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      padding: 20,
      elevation: 3,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    avatarContainer: {
      marginVertical: 10,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.white,
      backgroundColor: theme.colors.avatartBackground,
      elevation: 3,
    },
    avatar: {
      width: 60,
      height: 60,
      resizeMode: "cover",
      borderRadius: 50,
    },
    greeting: {
      color: theme.colors.white,
      fontSize: 16,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    name: {
      color: theme.colors.white,
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BOLD,
      width: "80%",
    },
    notificationContainer: {
      position: "relative",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 50,
      padding: 10,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.white,
    },
    badge: {
      position: "absolute",
      top: -2,
      right: -2,
      backgroundColor: theme.colors.red,
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.white,
    },
    badgeText: {
      color: theme.colors.white,
      fontSize: 10,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    notificationIcon: {
      width: 30,
      height: 30,
    },
    gradeWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 5,
    },
    dropdown: {
      position: "absolute",
      top: 175,
      left: 20,
      width: "89%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 3,
      paddingVertical: 5,
    },
    grade: {
      fontSize: 14,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    gradeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    periodWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 5,
    },
    operationWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 5,
    },
    dropdownButtonText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 13,
      color: theme.colors.black,
    },
    dropdownDay: {
      position: "absolute",
      top: 230,
      left: 20, // Adjusted to appear on the left
      width: "40%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 5,
      elevation: 3,
      overflow: "hidden",
    },
    dropdownOperation: {
      position: "absolute",
      top: 230,
      right: 20, // Adjusted to appear on the right
      width: "40%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 5,
      elevation: 3,
      overflow: "hidden",
    },
    dropdownItem: {
      paddingHorizontal: 15,
      paddingVertical: 3,
      borderBottomColor: theme.colors.grayLight,
      borderBottomWidth: 1,
    },
    dropdownItemText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 13,
      color: theme.colors.black,
      textAlign: "center",
    },
    academicChartContainer: {
      marginTop: 10,
      alignItems: "center",
    },
    tfChartContainer: {
      marginTop: 30,
      alignItems: "center",
    },
    chartName: {
      color: theme.colors.white,
      fontSize: 22,
      fontFamily: Fonts.NUNITO_MEDIUM,
      marginBottom: 10,
    },
    chartNoteContainer: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },
    chartNote: {
      flexDirection: "row",
      alignItems: "center",
    },
    noteLast: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.grayLight,
      marginRight: 6,
      borderRadius: 2,
    },
    noteThis: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.blueDark,
      marginRight: 6,
      borderRadius: 2,
    },
    noteTrue: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.green,
      marginRight: 6,
      borderRadius: 2,
    },
    noteFalse: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.redTomato,
      marginRight: 6,
      borderRadius: 2,
    },
    noteText: {
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    commentContainer: {
      width: "90%",
      backgroundColor: theme.colors.cardBackground,
      marginHorizontal: 20,
      marginVertical: 20,
      padding: 10,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 3,
    },
    commentTitle: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.comment,
    },
    summaryContainer: {
      width: "90%",
      backgroundColor: theme.colors.cardBackground,
      padding: 10,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 3,
      marginBottom: 10,
    },
    summaryTitle: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.green,
    },
    commentText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
    },
    skillName: {
      fontWeight: "bold",
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      {users ? (
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
                    users.image ? { uri: users.image } : theme.icons.avatarAdd
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.greeting}>{t("hello")}</Text>
                <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
                  {users.fullName || "User"}
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
      ) : (
        <Text style={styles.commentText}>Loading user data...</Text>
      )}
      <ScrollView>
        <View>
          <View style={styles.gradeWrapper}>
            <TouchableOpacity
              onPress={() => setShowDropdown((prev) => !prev)}
              style={styles.gradeRow}
            >
              <Text style={styles.grade}>
                {selectedPupil?.fullName || t("selectPupil")}
              </Text>
              <Ionicons
                name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            visible={showDropdown}
            animationType="fade"
            onRequestClose={() => setShowDropdown(false)}
          >
            <TouchableOpacity
              style={styles.dropdown}
              activeOpacity={1}
              onPressOut={() => setShowDropdown(false)}
            >
              <View>
                {filteredPupils.length > 0 ? (
                  filteredPupils.map((pupil, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedPupil(pupil);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {pupil.fullName}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.dropdownItemText}>No pupils available</Text>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.periodWrapper}
            onPress={() => setShowPeriod(!showPeriod)}
          >
            <Text style={styles.dropdownButtonText}>{t(selectedPeriod)}</Text>
            <Ionicons
              name={showPeriod ? "caret-up-outline" : "caret-down-outline"}
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.operationWrapper}
            onPress={() => setShowOperation(!showOperation)}
          >
            <Text style={styles.dropdownButtonText}>
              {t(`${selectedOperation}`)}
            </Text>
            <Ionicons
              name={showOperation ? "caret-up-outline" : "caret-down-outline"}
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>
        </View>
        <Modal
          transparent
          visible={showPeriod}
          animationType="fade"
          onRequestClose={() => setShowPeriod(false)}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowPeriod(false)}
          >
            <View style={styles.dropdownDay}>
              {periods.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedPeriod(item);
                    setShowPeriod(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{t(item)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          transparent
          visible={showOperation}
          animationType="fade"
          onRequestClose={() => setShowOperation(false)}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowOperation(false)}
          >
            <View style={styles.dropdownOperation}>
              {operations.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedOperation(item);
                    setShowOperation(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {t(`${item}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        {loading && <Text style={styles.commentText}>Loading...</Text>}
        {error && <Text style={styles.commentText}>Error: {error}</Text>}
        {!selectedPupil && (
          <Text style={styles.commentText}>Please select a pupil</Text>
        )}
        {userpoints && selectedPupil && (
          <>
            <View style={styles.academicChartContainer}>
              <Text style={styles.chartName}>{t("academicProgress")}</Text>
              <BarChart
                key={`academic-${selectedPeriod}-${selectedOperation}`}
                data={getChartData()}
                width={screenWidth}
                height={250}
                fromZero={true}
                segments={4}
                chartConfig={chartConfig}
                showBarTops={false}
                withInnerLines={true}
                withHorizontalLabels={true}
                withCustomBarColorFromData={true}
                flatColor={true}
              />
              <View style={styles.chartNoteContainer}>
                <View style={styles.chartNote}>
                  <View style={styles.noteLast} />
                  <Text style={styles.noteText}>
                    {t(periodToLabels[selectedPeriod].previous)}
                  </Text>
                </View>
                <View style={styles.chartNote}>
                  <View style={styles.noteThis} />
                  <Text style={styles.noteText}>
                    {t(periodToLabels[selectedPeriod].current)}
                  </Text>
                </View>
              </View>
              <View style={styles.commentContainer}>
                <Text style={styles.commentTitle}>{t("comment")}</Text>
                {userpoints.compareByType && (
                  <Text style={styles.commentText}>
                    <Text style={styles.skillName}>
                      {t(`${selectedOperation}`)}:
                    </Text>{" "}
                    {(() => {
                      const currentPeriod = periodToLabels[selectedPeriod].current;
                      const previousPeriod = periodToLabels[selectedPeriod].previous;
                      const currentTotal = scoreRanges.reduce(
                        (sum, range) =>
                          sum +
                          (userpoints.compareByType[selectedOperation]?.[
                            currentPeriod
                          ]?.[range] || 0),
                        0
                      );
                      const previousTotal = scoreRanges.reduce(
                        (sum, range) =>
                          sum +
                          (userpoints.compareByType[selectedOperation]?.[
                            previousPeriod
                          ]?.[range] || 0),
                        0
                      );
                      const change = currentTotal - previousTotal;
                      if (change > 0) {
                        return t("improvedBy", { value: change });
                      } else if (change < 0) {
                        return t("droppedBy", { value: Math.abs(change) });
                      } else {
                        return t("noChange");
                      }
                    })()}
                  </Text>
                )}
              </View>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>{t("summary")}</Text>
                {userpoints.compareByType && (
                  <Text style={styles.commentText}>
                    <Text style={styles.skillName}>
                      {t(`${selectedOperation}`)}:
                    </Text>{" "}
                    {t("summaryChange", {
                      from: scoreRanges.reduce(
                        (sum, range) =>
                          sum +
                          (userpoints.compareByType[selectedOperation]?.[
                            periodToLabels[selectedPeriod].previous
                          ]?.[range] || 0),
                        0
                      ),
                      to: scoreRanges.reduce(
                        (sum, range) =>
                          sum +
                          (userpoints.compareByType[selectedOperation]?.[
                            periodToLabels[selectedPeriod].current
                          ]?.[range] || 0),
                        0
                      ),
                    })}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.tfChartContainer}>
              <Text style={styles.chartName}>{t("trueFalseRatio")}</Text>
              <BarChart
                key={`tf-${selectedPeriod}`}
                data={accuracyBarChartData}
                width={screenWidth}
                height={250}
                fromZero
                showBarTops={false}
                withInnerLines={true}
                withHorizontalLabels={true}
                withCustomBarColorFromData={true}
                flatColor={true}
                segments={4}
                chartConfig={chartTFConfig}
              />
              <View style={styles.chartNoteContainer}>
                <View style={styles.chartNote}>
                  <View style={styles.noteTrue} />
                  <Text style={styles.noteText}>{t("true")}</Text>
                </View>
                <View style={styles.chartNote}>
                  <View style={styles.noteFalse} />
                  <Text style={styles.noteText}>{t("false")}</Text>
                </View>
              </View>
              <View style={styles.commentContainer}>
                <Text style={styles.commentTitle}>{t("comment")}</Text>
                {skills.map((skill, i) => {
                  const correct = trueRatio[i];
                  const incorrect = falseRatio[i];
                  let comment = "";
                  if (correct >= 90) {
                    comment = t("excellentAccuracy", { correct });
                  } else if (correct >= 70) {
                    comment = t("goodAccuracy", { correct, incorrect });
                  } else {
                    comment = t("lowAccuracy", { correct });
                  }
                  return (
                    <Text style={styles.commentText} key={i}>
                      <Text style={styles.skillName}>{skill}:</Text> {comment}
                      {"\n"}
                    </Text>
                  );
                })}
              </View>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>{t("summary")}</Text>
                {skills.map((skill, i) => (
                  <Text style={styles.commentText} key={i}>
                    <Text style={styles.skillName}>{skill}:</Text>{" "}
                    {t("summaryTF", {
                      true: trueRatio[i],
                      false: falseRatio[i],
                    })}
                    {"\n"}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <FloatingMenu />
    </LinearGradient>
  );
}
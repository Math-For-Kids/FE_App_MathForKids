import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "../../constants/Fonts";
import FloatingMenu from "../components/FloatingMenu";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import { getAllPupils } from "../redux/pupilSlice";
import { profileById } from "../redux/profileSlice";
import { notificationsByUserId } from "../redux/userNotificationSlice";
import { useIsFocused } from "@react-navigation/native";
export default function StatisticScreen({ navigation }) {
  const { theme } = useTheme();

  const screenWidth = Dimensions.get("window").width - 32;
  const users = useSelector((state) => state.auth.user);
  const pupils = useSelector((state) => state.pupil.pupils || []);
  const profile = useSelector((state) => state.profile.info || {});
  const userNotifications = useSelector(
    (state) => state.notifications.list || []
  );
  console.log("notification", userNotifications);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      dispatch(profileById(users.id));
      dispatch(getAllPupils());
      dispatch(notificationsByUserId(users.id));
    }
  }, [isFocused, users?.id]);

  const filteredPupils = pupils.filter(
    (pupil) => String(pupil.userId) === String(users?.id)
  );

  const filteredNotifications = userNotifications.filter(
    (notification) => notification.isRead === false
  );

  const skills = ["Add", "Sub", "Multipl", "Div"];
  const lastMonth = [70, 85, 40, 54];
  const thisMonth = [85, 90, 50, 10];
  const trueRatio = [95, 90, 55, 56];
  const falseRatio = [5, 10, 45, 44];
  const groupedBarChartData = {
    labels: skills
      .flatMap((skill) => [skill, ""])
      .flatMap((label, index) => (index % 3 === 2 ? [label] : [label])),
    datasets: [
      {
        data: skills
          .flatMap((_, i) => [lastMonth[i], thisMonth[i], 0])
          .concat(100),
        colors: skills
          .flatMap((_, i) => [
            () => theme.colors.grayLight,
            () => theme.colors.blueDark,
            () => "rgb(255, 255, 255)",
          ])
          .concat(() => "rgb(255, 255, 255)"),
      },
    ],
    legend: ["Last Month", "This Month"],
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
          .flatMap((_, i) => [
            () => theme.colors.green,
            () => theme.colors.redTomato,
            () => "rgba(0,0,0,0.01)",
          ])
          .concat(() => "rgb(255, 255, 255)"),
      },
    ],
    legend: ["True", "False"],
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

  const timePieChartData = [
    {
      name: "Study",
      population: 25,
      color: theme.colors.GreenDark,
      legendFontColor: theme.colors.black,
      legendFontSize: 12,
    },
    {
      name: "Practice",
      population: 22,
      color: theme.colors.orangeDark,
      legendFontColor: theme.colors.black,
      legendFontSize: 12,
    },
    {
      name: "Game",
      population: 53,
      color: theme.colors.yellowLight,
      legendFontColor: theme.colors.black,
      legendFontSize: 12,
    },
  ];
  const timeData = [
    { x: "Study", y: 25 },
    { x: "Practice", y: 22 },
    { x: "Game", y: 53 },
  ];
  const analyzeTimeUsage = () => {
    if (!timeData || timeData.length === 0) return { timeComment: "" };

    let total = 0;
    let max = { x: "", y: -Infinity };
    let min = { x: "", y: Infinity };

    timeData.forEach((item) => {
      total += item.y;
      if (item.y > max.y) max = item;
      if (item.y < min.y) min = item;
    });

    const timeComment =
      `Most time spent on: ${max.x} (${max.y}%).\n` +
      `Least time spent on: ${min.x} (${min.y}%).\n` +
      (max.x === "Game"
        ? "Game time dominates. Consider reducing it for better balance."
        : "Good time distribution. Keep it up!");

    return { timeComment };
  };
  const { timeComment } = analyzeTimeUsage();
  const [selectedPupil, setSelectedPupil] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const newNotificationCount = filteredNotifications.length;
  const [selectedTab, setSelectedTab] = useState("Skill statistics");
  const [selectedPeriod, setSelectedPeriod] = useState("Last month");
  const periods = ["This week", "Last week", "This month", "Last month"];
  const [showpPeriod, setShowpPeriod] = useState(false);
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
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 50,
      padding: 10,
      elevation: 3,
    },
    avatar: {
      width: 40,
      height: 40,
    },
    greeting: {
      color: theme.colors.white,
      fontSize: 16,
      fontFamily: Fonts.NUNITO_REGULAR,
    },
    name: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    notificationContainer: {
      position: "relative",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 50,
      padding: 10,
      elevation: 3,
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
      top: 60,
      left: 20,
      width: "89%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 10,
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

    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginTop: 10,
      marginHorizontal: 20,
      gap: 10,
      backgroundColor: theme.colors.cardBackground,
      paddingVertical: 10,
      borderRadius: 10,
      elevation: 3,
    },

    filterButton: {
      width: "40%",
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
    },

    filterText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 13,
      color: theme.colors.black,
      textAlign: "center",
    },

    activeFilter: {
      backgroundColor: theme.colors.green,
    },

    activeFilterText: {
      color: theme.colors.white,
    },

    periodWrapper: {
      position: "absolute",
      right: 0,
      width: "40%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      elevation: 3,
    },

    dropdownButtonText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 13,
      color: theme.colors.black,
    },

    dropdownDay: {
      position: "absolute",
      top: 60,
      right: 20,
      width: "40%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 5,
      elevation: 3,
      overflow: "hidden",
    },

    dropdownItem: {
      paddingHorizontal: 15,
      paddingVertical: 20,
      borderBottomColor: theme.colors.grayLight,
      borderBottomWidth: 1,
    },

    dropdownItemText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 13,
      color: theme.colors.black,
      textAlign: "center",
      elevation: 20,
    },
    academicChartContainer: {
      marginTop: 80,
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
    chartNote: { flexDirection: "row", alignItems: "center" },
    noteLast: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.grayLight,
      marginRight: 6,
      borderRadius: 2,
    },
    noteText: { color: theme.colors.white, fontFamily: Fonts.NUNITO_MEDIUM },
    noteThis: {
      width: 12,
      height: 12,
      backgroundColor: theme.colors.blueDark,
      marginRight: 6,
      borderRadius: 2,
    },
    tfChartContainer: { marginTop: 30, alignItems: "center" },
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
    timeChartContainer: { marginTop: 80, alignItems: "center" },
    noteTimeContainer: {
      position: "absolute",
      top: 100,
      right: 30,
    },
    noteTime: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    commentContainer: {
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
  });
  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
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
                  profile?.avatar
                    ? { uri: profile.avatar }
                    : theme.icons.avatarAdd
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hello!</Text>
              <Text style={styles.name}>{profile?.fullName}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
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
        <View>
          <View style={styles.gradeWrapper}>
            <TouchableOpacity
              onPress={() => setShowDropdown((prev) => !prev)}
              style={styles.gradeRow}
            >
              <Text style={styles.grade}>
                {selectedPupil?.fullName || "Selected pupil"}
              </Text>
              <Ionicons
                name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
          </View>

          {showDropdown && (
            <View style={styles.dropdown}>
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
          )}
        </View>
        <View style={styles.filterRowContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedTab === "Skill statistics" && styles.activeFilter,
              ]}
              onPress={() => setSelectedTab("Skill statistics")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTab === "Skill statistics" && styles.activeFilterText,
                ]}
              >
                Skill statistics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedTab === "Time" && styles.activeFilter,
              ]}
              onPress={() => setSelectedTab("Time")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTab === "Time" && styles.activeFilterText,
                ]}
              >
                Time
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.periodWrapper}
              onPress={() => setShowpPeriod(!showpPeriod)}
            >
              <Text style={styles.dropdownButtonText}>{selectedPeriod}</Text>

              <Ionicons
                name={showpPeriod ? "caret-up-outline" : "caret-down-outline"}
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>

            {showpPeriod && (
              <View style={styles.dropdownDay}>
                {periods.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedPeriod(item);
                      setShowpPeriod(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {selectedTab === "Skill statistics" && (
            <>
              <View style={styles.academicChartContainer}>
                <Text style={styles.chartName}>Academic Progress</Text>

                <BarChart
                  data={groupedBarChartData}
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
                    <Text style={styles.noteText}>Last Month</Text>
                  </View>
                  <View style={styles.chartNote}>
                    <View style={styles.noteThis} />
                    <Text style={styles.noteText}>This Month</Text>
                  </View>
                </View>
                <View style={styles.commentContainer}>
                  <Text style={styles.commentTitle}>Comments</Text>
                  <Text style={styles.commentText}>
                    {skills
                      .map((skill, i) => {
                        const change = thisMonth[i] - lastMonth[i];
                        if (change > 0) {
                          return `${skill}: Improved by ${change}%. Keep practicing to maintain progress.`;
                        } else if (change < 0) {
                          return `${skill}: Dropped by ${Math.abs(
                            change
                          )}%. Needs more attention and review.`;
                        } else {
                          return `${skill}: No change. Continue steady practice.`;
                        }
                      })
                      .join("")}
                  </Text>
                </View>

                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryTitle}>Summary</Text>
                  <Text style={styles.commentText}>
                    {skills
                      .map(
                        (skill, i) =>
                          `${skill}: ${lastMonth[i]}% → ${thisMonth[i]}%`
                      )
                      .join(".\n ")}
                  </Text>
                </View>
              </View>
            </>
          )}
          {selectedTab === "Skill statistics" && (
            <>
              <View style={styles.tfChartContainer}>
                <Text style={styles.chartName}>True vs False Ratio</Text>

                <BarChart
                  data={accuracyBarChartData}
                  width={screenWidth}
                  height={250}
                  chartConfig={chartTFConfig}
                  fromZero
                  showBarTops={false}
                  withInnerLines={true}
                  withHorizontalLabels={true}
                  withCustomBarColorFromData={true}
                  flatColor={true}
                  segments={4}
                />

                <View style={styles.chartNoteContainer}>
                  <View style={styles.chartNote}>
                    <View style={styles.noteTrue} />
                    <Text style={styles.noteText}>True</Text>
                  </View>
                  <View style={styles.chartNote}>
                    <View style={styles.noteFalse} />
                    <Text style={styles.noteText}>False</Text>
                  </View>
                </View>
                <View style={styles.commentContainer}>
                  <Text style={styles.commentTitle}>Comments</Text>
                  <Text style={styles.commentText}>
                    {skills
                      .map((skill, i) => {
                        const correct = trueRatio[i];
                        const incorrect = falseRatio[i];
                        if (correct >= 90) {
                          return `${skill}: Excellent accuracy (${correct}% correct). Keep up the great work.\n`;
                        } else if (correct >= 70) {
                          return `${skill}: Good accuracy (${correct}% correct), but some mistakes (${incorrect}%) exist. Keep improving.\n`;
                        } else {
                          return `${skill}: Low accuracy (${correct}% correct). Needs focused review and practice.\n`;
                        }
                      })
                      .join("")}
                  </Text>
                </View>

                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryTitle}>Summary</Text>
                  <Text style={styles.commentText}>
                    {skills
                      .map(
                        (skill, i) =>
                          `${skill}: ${trueRatio[i]}% correct, ${falseRatio[i]}% incorrect`
                      )
                      .join(".\n ")}
                  </Text>
                </View>
              </View>
            </>
          )}
          {selectedTab === "Time" && (
            <>
              <View style={styles.timeChartContainer}>
                <Text style={styles.chartName}>Time Distribution</Text>

                <PieChart
                  data={timePieChartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="16"
                  hasLegend={false}
                />
                <View style={styles.noteTimeContainer}>
                  {timePieChartData.map((item, index) => (
                    <View key={index} style={styles.noteTime}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: item.color,
                          borderRadius: 6,
                          marginRight: 8,
                        }}
                      />
                      <Text style={styles.noteText}>{item.name}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.commentContainer}>
                  <Text style={styles.commentTitle}>Comments</Text>
                  <Text style={styles.commentText}>{timeComment}</Text>
                </View>
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryTitle}>Summary</Text>
                  <Text style={styles.commentText}>
                    {timeData.map((item) => `${item.x}: ${item.y}%`).join("\n")}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <FloatingMenu />
    </LinearGradient>
  );
}

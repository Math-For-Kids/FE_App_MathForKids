import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
  VictoryPie,
} from "victory-native";
import { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../themes/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "../../constants/Fonts";
import FloatingMenu from "../components/FloatingMenu";
export default function StatisticScreen({ navigation }) {
  const { theme } = useTheme();
  const skills = ["Add", "Sub", "Multipl", "Div"];
  const lastMonth = [
    { skill: "Add", value: 70 },
    { skill: "Sub", value: 85 },
    { skill: "Multipl", value: 40 },
    { skill: "Div", value: 54 },
  ];

  const thisMonth = [
    { skill: "Add", value: 85 },
    { skill: "Sub", value: 90 },
    { skill: "Multipl", value: 50 },
    { skill: "Div", value: 10 },
  ];

  const trueRatio = [
    { skill: "Add", value: 95 },
    { skill: "Sub", value: 90 },
    { skill: "Multipl", value: 55 },
    { skill: "Div", value: 56 },
  ];

  const falseRatio = [
    { skill: "Add", value: 5 },
    { skill: "Sub", value: 10 },
    { skill: "Multipl", value: 45 },
    { skill: "Div", value: 44 },
  ];
  const user = {
    name: "Nguyen Thi Hoa",
    avatar: theme.icons.avatarFemale,
    grade: "Class 1",
    pupils: [
      "Nguyen Thi Hoa",
      "Nguyen Thi Hong",
      "Tran Hoa Hong",
      "Lam Hoai Man",
    ],
  };

  const notifications = [
    {
      id: 1,
      title: "New Achievement!",
      message: "You've earned the Math Badge",
      time: "2 mins ago",
      icon: theme.icons.badge,
    },
    {
      id: 2,
      title: "Practice Reminder",
      message: "Don't forget to practice subtraction today.",
      time: "1 hour ago",
      icon: theme.icons.reminder,
    },
    {
      id: 3,
      title: "New Skill Unlocked",
      message: "You unlocked Multiplication skill!",
      time: "Yesterday",
      icon: theme.icons.multiply,
    },
  ];
  const timeData = [
    { x: "Study", y: 25 },
    { x: "Practice", y: 22 },
    { x: "Game", y: 53 },
  ];
  const analyzePerformance = () => {
    const comments = [];
    const summary = [];

    let maxIncrease = -Infinity;
    let maxDecrease = Infinity;
    let bestSkill = "";
    let worstSkill = "";

    skills.forEach((skill) => {
      const last = lastMonth.find((s) => s.skill === skill)?.value || 0;
      const current = thisMonth.find((s) => s.skill === skill)?.value || 0;
      const change = current - last;

      if (change > maxIncrease) {
        maxIncrease = change;
        bestSkill = skill;
      }

      if (change < maxDecrease) {
        maxDecrease = change;
        worstSkill = skill;
      }

      if (change > 0) {
        comments.push(`${skill}: improved by ${change}%.`);
      } else if (change < 0) {
        comments.push(`${skill}: decreased by ${Math.abs(change)}%.`);
      } else {
        comments.push(`${skill}: no change.`);
      }

      summary.push(`${skill}: ${last}% → ${current}%`);
    });

    if (maxIncrease > 0) {
      comments.push(
        `Best improvement: ${bestSkill} increased by ${maxIncrease}%.`
      );
    }
    if (maxDecrease < 0) {
      comments.push(
        `Most decline: ${worstSkill} dropped by ${Math.abs(maxDecrease)}%.`
      );
    }

    return {
      commentText: comments.join("\n"),
      summaryText: summary.join(", "),
    };
  };

  const analyzeAccuracy = () => {
    return trueRatio
      .map((item) => {
        const falseItem = falseRatio.find((f) => f.skill === item.skill);
        return `${item.skill}: correct ${item.value}%, incorrect ${
          falseItem?.value || 0
        }%`;
      })
      .join("\n");
  };
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
  const timeColors = ["#4c75f2", "#e6417a", "#f4c342"];
  const [selectedPupil, setSelectedPupil] = useState(user.name);
  const [showDropdown, setShowDropdown] = useState(false);
  const newNotificationCount = notifications.length;
  const [selectedTab, setSelectedTab] = useState("Skill statistics");
  const [selectedPeriod, setSelectedPeriod] = useState("Last month");
  const periods = ["This week", "Last week", "This month", "Last month"];
  const [showpPeriod, setShowpPeriod] = useState(false);
  const chartWidth = Dimensions.get("window").width - 20;
  const chartHeight = 300;
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
      fontFamily: Fonts.NUNITO_BLACK,
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
      fontFamily: Fonts.NUNITO_BLACK,
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
      elevation: 5,
      paddingVertical: 5,
    },

    grade: {
      fontSize: 14,
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    gradeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    dropdownItem: {
      paddingVertical: 6,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.blueDark,
    },
    dropdownItemText: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_BLACK,
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
      fontFamily: Fonts.NUNITO_BLACK,
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
      fontFamily: Fonts.NUNITO_BLACK,
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
      paddingVertical: 6,
      paddingHorizontal: 15,
      borderBottomColor: theme.colors.grayLight,
      borderBottomWidth: 1,
    },

    dropdownItemText: {
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 13,
      color: theme.colors.black,
      textAlign: "center",
    },
    section: {
      fontSize: 24,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      textAlign: "center",
      marginTop: 80,
      marginBottom: 10,
      textAlign: "center",
    },
    skillChartContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 16,
      padding: 10,
      marginHorizontal: 20,
      marginVertical: 10,
      elevation: 2,
    },
    commentContainer: {
      backgroundColor: theme.colors.cardBackground,
      marginHorizontal: 20,
      padding: 10,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      marginBottom: 10,
      elevation: 3,
    },
    commentTitle: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.comment,
    },
    summaryContainer: {
      backgroundColor: theme.colors.cardBackground,
      marginHorizontal: 20,
      padding: 10,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 3,
      marginBottom: 10,
    },
    summaryTitle: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.green,
    },
    commentText: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    timeSectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      marginTop: 80,
      marginBottom: 10,
      textAlign: "center",
    },
    timeChartContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 16,
      marginHorizontal: 20,
      paddingTop: 45,
      paddingHorizontal: 10,
      alignItems: "center",
      elevation: 2,
      marginBottom: 10,
      height: 360,
      overflow: "hidden",
    },
    labels: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK_ITALIC,
      fill: theme.colors.white,
    },
    timeCommentContainer: {
      backgroundColor: theme.colors.cardBackground,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 12,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 3,
    },
    timeCommentTitle: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.comment,
      marginBottom: 5,
    },
    timeCommentText: {
      fontSize: 13,
      fontFamily: Fonts.NUNITO_BLACK,
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
              onPress={() => navigation.navigate("ProfileScreen")}
            >
              <Image source={user.avatar} style={styles.avatar} />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hello!</Text>
              <Text style={styles.name}>{user.name}</Text>
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
              <Text style={styles.grade}>{selectedPupil}</Text>
              <Ionicons
                name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
                size={20}
                color={theme.colors.blueDark}
              />
            </TouchableOpacity>
          </View>

          {showDropdown && (
            <View style={styles.dropdown}>
              {user.pupils.map((pupil, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedPupil(pupil);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{pupil}</Text>
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
        </View>
        {selectedTab === "Skill statistics" && (
          <>
            <Text style={styles.section}>Academic Progress</Text>
            <View style={styles.skillChartContainer}>
              <VictoryChart
                width={chartWidth}
                height={chartHeight}
                domainPadding={20}
                theme={VictoryTheme.material}
              >
                <VictoryLegend
                  x={60}
                  y={0}
                  orientation="horizontal"
                  gutter={20}
                  data={[
                    {
                      name: "Last Month",
                      symbol: { fill: theme.colors.grayLight },
                    },
                    {
                      name: "This Month",
                      symbol: { fill: theme.colors.blueDark },
                    },
                  ]}
                />
                <VictoryAxis
                  tickValues={skills}
                  tickFormat={skills}
                  style={{ tickLabels: { fontSize: 12 } }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `${x}%`}
                  style={{ tickLabels: { fontSize: 10 } }}
                />
                <VictoryGroup
                  offset={15}
                  colorScale={[theme.colors.grayLight, theme.colors.blueDark]}
                >
                  <VictoryBar data={lastMonth} x="skill" y="value" />
                  <VictoryBar data={thisMonth} x="skill" y="value" />
                </VictoryGroup>
              </VictoryChart>
            </View>
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>Comments</Text>
              <Text style={styles.commentText}>
                {analyzePerformance().commentText}
              </Text>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.commentText}>{analyzeAccuracy()}</Text>
            </View>
          </>
        )}
        {selectedTab === "Skill statistics" && (
          <>
            <Text style={styles.section}>True and False Ratio</Text>
            <View style={styles.skillChartContainer}>
              <VictoryChart
                width={chartWidth}
                height={chartHeight}
                domainPadding={20}
                theme={VictoryTheme.material}
              >
                <VictoryLegend
                  x={85}
                  y={0}
                  orientation="horizontal"
                  gutter={50}
                  data={[
                    { name: "True", symbol: { fill: theme.colors.green } },
                    { name: "False", symbol: { fill: theme.colors.comment } },
                  ]}
                />
                <VictoryAxis
                  tickValues={skills}
                  tickFormat={skills}
                  style={{ tickLabels: { fontSize: 12 } }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => `${x}%`}
                  style={{ tickLabels: { fontSize: 10 } }}
                />
                <VictoryGroup
                  offset={15}
                  colorScale={[theme.colors.green, theme.colors.comment]}
                >
                  <VictoryBar data={trueRatio} x="skill" y="value" />
                  <VictoryBar data={falseRatio} x="skill" y="value" />
                </VictoryGroup>
              </VictoryChart>
            </View>
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>Comments</Text>
              <Text style={styles.commentText}>
                Addition: High correct (95%), low incorrect (5%) → Solid grasp.
                {"\n"}
                Subtraction: Best skill.{"\n"}
                Multiplication: Many mistakes → needs review.{"\n"}
                Division: Needs reinforcement.
              </Text>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.commentText}>
                Student performs well with basic operations (add, subtract).
                Needs improvement on advanced ones (multiply, divide).
              </Text>
            </View>
          </>
        )}
        {selectedTab === "Time" && (
          <View>
            <Text style={styles.timeSectionTitle}>Operating time</Text>
            <View style={styles.timeChartContainer}>
              <VictoryPie
                width={200}
                height={200}
                data={timeData}
                colorScale={timeColors}
                innerRadius={100}
                labelRadius={60}
                labels={({ datum }) => `${datum.y}%`}
                style={{
                  labels: styles.labels,
                }}
              />

              <VictoryLegend
                x={60}
                y={50}
                orientation="horizontal"
                gutter={30}
                data={[
                  { name: "Study", symbol: { fill: "#4c75f2" } },
                  { name: "Practice", symbol: { fill: "#e6417a" } },
                  { name: "Game", symbol: { fill: "#f4c342" } },
                ]}
                style={{
                  labels: {
                    fontSize: 12,
                    fontFamily: Fonts.NUNITO_BLACK,
                    fill: theme.colors.black,
                  },
                }}
              />
            </View>
          </View>
        )}

        {selectedTab === "Time" && (
          <View style={styles.timeCommentContainer}>
            <Text style={styles.timeCommentTitle}>Comments</Text>
            <Text style={styles.timeCommentText}>{timeComment}</Text>
          </View>
        )}
      </ScrollView>
      <FloatingMenu />
    </LinearGradient>
  );
}

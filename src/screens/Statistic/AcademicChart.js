import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../../themes/ThemeContext";

export default function AcademicChart({
  t,
  styles,
  skills,
  pointStats,
  screenWidth,
  thisRange,
  lastRange,
}) {
  // Check if pointStats is undefined or empty
  if (!pointStats || !pointStats.compareByType || Object.keys(pointStats.compareByType).length === 0) {
    return (
      <View style={[styles.academicChartContainers, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.chartName, { textAlign: "center", marginTop: 10 }]}>{t("academicProgress")}</Text>
        <Text style={[styles.commentText, { textAlign: "center", marginTop: 10 }]}>
          {t("noSignificantChanges")}
        </Text>
      </View>
    );
  }

  const { theme } = useTheme();
  const scoreCategories = ["≥9", "≥7", "≥5", "<5"];

  // Aggregate data across all skills for each score category
  const aggregatedData = scoreCategories.map((category) => {
    const thisPeriodTotal = skills.reduce((sum, skill) => {
      const stat = pointStats?.compareByType?.[skill] || {};
      const thisPeriodData = stat?.[thisRange] || {};
      return sum + (thisPeriodData[category] || 0);
    }, 0);

    const lastPeriodTotal = skills.reduce((sum, skill) => {
      const stat = pointStats?.compareByType?.[skill] || {};
      const lastPeriodData = stat?.[lastRange] || {};
      return sum + (lastPeriodData[category] || 0);
    }, 0);

    return [lastPeriodTotal, thisPeriodTotal, 0]; // [last, this, spacer]
  });

  // Prepare data for grouped bar chart
  const groupedBarChartData = {
    labels: scoreCategories.flatMap((cat) => [cat, ""]),
    datasets: [
      {
        data: aggregatedData.flat(),
        colors: scoreCategories.flatMap(() => [
          () => styles.noteLast.backgroundColor,
          () => styles.noteThis.backgroundColor,
          () => "rgba(0,0,0,0)", // Transparent for spacer
        ]),
      },
    ],
    legend: [t(lastRange), t(thisRange)],
  };

  // Calculate dynamic segments based on max data value
  const maxDataValue = Math.max(...groupedBarChartData.datasets[0].data, 1); // Avoid division by 0
  const segments = Math.ceil(maxDataValue); // Dynamic segments
  const chartConfig = {
    backgroundGradientFrom: styles.container.backgroundColor || "#fff",
    backgroundGradientTo: styles.container.backgroundColor || "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => styles.noteText.color || "#000",
    propsForBackgroundLines: {
      stroke: "#e3e3e3",
    },
    barPercentage: 0.65,
    formatYLabel: (value) => `${Math.round(value)}`,
  };

  // Calculate overall statistics for comments
  const calculateTotalStats = (range) => {
    return skills.reduce((acc, skill) => {
      const stat = pointStats?.compareByType?.[skill] || {};
      const rangeData = stat?.[range] || {};
      return scoreCategories.reduce((sum, cat) => sum + (rangeData[cat] || 0), 0);
    }, 0);
  };

  const thisTotal = calculateTotalStats(thisRange);
  const lastTotal = calculateTotalStats(lastRange);

  // Generate comments
  const percentChange =
    lastTotal === 0
      ? thisTotal > 0
        ? 100
        : 0
      : Math.round(((thisTotal - lastTotal) * 100) / lastTotal);

  let generalComment = t("noChange");
  if (percentChange > 5) {
    generalComment = t("improvedBy", { value: percentChange });
  } else if (percentChange < -5) {
    generalComment = t("droppedBy", { value: Math.abs(percentChange) });
  }

  // Detailed comments for each score category, only for significant changes
  const detailedComments = scoreCategories
    .map((category) => {
      const thisPeriodTotal = skills.reduce((sum, skill) => {
        const stat = pointStats?.compareByType?.[skill] || {};
        const thisPeriodData = stat?.[thisRange] || {};
        return sum + (thisPeriodData[category] || 0);
      }, 0);

      const lastPeriodTotal = skills.reduce((sum, skill) => {
        const stat = pointStats?.compareByType?.[skill] || {};
        const lastPeriodData = stat?.[lastRange] || {};
        return sum + (lastPeriodData[category] || 0);
      }, 0);

      const categoryChange =
        lastPeriodTotal === 0
          ? thisPeriodTotal > 0
            ? 100
            : 0
          : Math.round(((thisPeriodTotal - lastPeriodTotal) * 100) / lastPeriodTotal);

      let comment = t("noChange");
      if (categoryChange > 5) {
        comment = t("improvedBy", { value: categoryChange });
      } else if (categoryChange < -5) {
        comment = t("droppedBy", { value: Math.abs(categoryChange) });
      }

      return { category, comment, categoryChange };
    })
    .filter((item) => Math.abs(item.categoryChange) > 5);

  return (
    <View style={[styles.academicChartContainers, { padding: 16, borderRadius: 12, marginVertical: 10, alignItems: "center" }]}>
      <Text style={[styles.chartName, { fontSize: 18, fontWeight: "600", color: theme.colors.black, marginBottom: 12, textAlign: "center" }]}>
        {t("academicProgress")}
      </Text>
      <View style={styles.back}>
        <BarChart
          data={groupedBarChartData}
          width={screenWidth} // Reduce width to allow centering with padding
          height={300}
          fromZero
          segments={segments}
          chartConfig={chartConfig}
          showBarTops={false}
          withCustomBarColorFromData
          showTooltip={false}
          style={styles.academicChartContainer}
          flatColor
        />
        <View style={[styles.chartNoteContainer, { flexDirection: "row", justifyContent: "center", marginBottom: 16, alignItems: "center" }]}>
          <View style={[styles.chartNote, { flexDirection: "row", alignItems: "center", marginRight: 16 }]}>
            <View style={[styles.noteLast, { width: 14, height: 14, borderRadius: 2 }]} />
            <Text style={[styles.noteTexts, { marginLeft: 6, color: theme.colors.black, fontSize: 12, textAlign: "center" }]}>{t(lastRange)}</Text>
          </View>
          <View style={[styles.chartNote, { flexDirection: "row", alignItems: "center" }]}>
            <View style={[styles.noteThis, { width: 14, height: 14, borderRadius: 2 }]} />
            <Text style={[styles.noteTexts, { marginLeft: 6, color: theme.colors.black, fontSize: 12, textAlign: "center" }]}>{t(thisRange)}</Text>
          </View>
        </View>
      </View>
      {/* Improved Comments Section */}
      <View style={{
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.grayLight,
        marginTop: 8,
        width: "90%", // Restrict width to allow centering
        alignSelf: "center",
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: "600",
          color: theme.colors.black,
          marginBottom: 8,
          textAlign: "center",
        }}>
          {t("summary")}
        </Text>
        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 14,
            color: percentChange > 5 ? theme.colors.green : percentChange < -5 ? theme.colors.redTomato : theme.colors.black,
            fontWeight: "500",
            textAlign: "center",
          }}>
            {t("overallProgress")}: {generalComment}
          </Text>
        </View>
        {detailedComments.length > 0 && (
          <View>
            <Text style={{
              fontSize: 14,
              fontWeight: "500",
              color: theme.colors.black,
              marginBottom: 8,
              textAlign: "center",
            }}>
              {t("scoreBreakdown")}
            </Text>
            {detailedComments.map((item, idx) => (
              <Text key={idx} style={{
                fontSize: 14,
                color: item.categoryChange > 5 ? theme.colors.green : theme.colors.redTomato,
                marginBottom: 4,
                paddingLeft: 8,
                textAlign: "left", // Keep text left-aligned within centered container
              }}>
                • {item.category}: {item.comment}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
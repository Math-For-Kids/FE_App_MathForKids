import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function AcademicChart({
  t,
  styles,
  skills,
  pointStats,
  screenWidth,
  thisRange,
  lastRange,
}) {
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
    labels: scoreCategories.flatMap((cat) => [cat, ""]), // Add spacing between categories
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
  const segments = Math.ceil(maxDataValue); // Dynamic segments: 2 for 0-1, 3 for 0-2, 4 for 0-3, etc.
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

      return { category, comment, categoryChange }; // Return object with category and change info
    })
    .filter((item) => Math.abs(item.categoryChange) > 5); // Filter for significant changes only

  return (
    <View style={styles.academicChartContainer}>
      <Text style={styles.chartName}>{t("academicProgress")}</Text>
      <BarChart
        data={groupedBarChartData}
        width={screenWidth}
        height={250}
        fromZero
        segments={segments} // Use dynamic segments
        chartConfig={chartConfig}
        showBarTops={false}
        withInnerLines
        withHorizontalLabels
        withCustomBarColorFromData
        flatColor
      />
      <View style={styles.chartNoteContainer}>
        <View style={styles.chartNote}>
          <View style={styles.noteLast} />
          <Text style={styles.noteText}>{t(lastRange)}</Text>
        </View>
        <View style={styles.chartNote}>
          <View style={styles.noteThis} />
          <Text style={styles.noteText}>{t(thisRange)}</Text>
        </View>
      </View>

      {/* Comments below chart */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>{t("comment")}</Text>
        <Text style={styles.commentText}>{generalComment}</Text>
        <Text style={styles.commentTitle}>{t("scoreComments")}</Text>
        {detailedComments.map((item, idx) => (
          <Text key={idx} style={styles.commentText}>
            {item.category}: {item.comment}
          </Text>
        ))}
      </View>
    </View>
  );
}
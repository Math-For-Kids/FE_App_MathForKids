import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function AcademicChart({
  t,
  styles,
  skills,
  lastMonth,
  thisMonth,
  screenWidth,
}) {
  const groupedBarChartData = {
    labels: skills.flatMap((skill) => [skill, ""]),
    datasets: [
      {
        data: skills
          .flatMap((_, i) => [lastMonth[i], thisMonth[i], 0])
          .concat(100),
        colors: skills
          .flatMap(() => [
            () => styles.noteLast.backgroundColor,
            () => styles.noteThis.backgroundColor,
            () => "rgba(0,0,0,0)",
          ])
          .concat(() => "#fff"),
      },
    ],
    legend: [t("lastMonth"), t("thisMonth")],
  };

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
  };

  // Nhận xét tổng thể
  const avgLast = lastMonth.reduce((a, b) => a + b, 0) / lastMonth.length || 0;
  const avgThis = thisMonth.reduce((a, b) => a + b, 0) / thisMonth.length || 0;
  const diff = avgThis - avgLast;
  const percentChange =
    avgLast === 0
      ? avgThis > 0
        ? 100
        : 0
      : Math.round((diff * 100) / avgLast);

  let generalComment = t("noChange");
  if (percentChange > 5) {
    generalComment = t("improvedBy", { value: percentChange });
  } else if (percentChange < -5) {
    generalComment = t("droppedBy", { value: Math.abs(percentChange) });
  }

  // Nhận xét chi tiết từng kỹ năng
  const detailedComments = skills.map((skill, i) => {
    const last = lastMonth[i];
    const current = thisMonth[i];
    const diff = current - last;
    const change =
      last === 0 ? (current > 0 ? 100 : 0) : Math.round((diff * 100) / last);

    let comment = t("noChange");
    if (change > 5) {
      comment = t("improvedBy", { value: change });
    } else if (change < -5) {
      comment = t("droppedBy", { value: Math.abs(change) });
    }

    return `${skill}: ${comment}`;
  });

  return (
    <View style={styles.academicChartContainer}>
      <Text style={styles.chartName}>{t("academicProgress")}</Text>
      <BarChart
        data={groupedBarChartData}
        width={screenWidth}
        height={250}
        fromZero
        segments={4}
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
          <Text style={styles.noteText}>{t("lastMonth")}</Text>
        </View>
        <View style={styles.chartNote}>
          <View style={styles.noteThis} />
          <Text style={styles.noteText}>{t("thisMonth")}</Text>
        </View>
      </View>

      {/* Nhận xét dưới biểu đồ */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>{t("comment")}</Text>
        <Text style={styles.commentText}>{generalComment}</Text>
        <Text style={styles.commentTitle}>{t("skillComments")}</Text>
        {detailedComments.map((line, idx) => (
          <Text key={idx} style={styles.commentText}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

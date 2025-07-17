import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function TrueFalseChart({
  t,
  styles,
  skills,
  trueRatio,
  falseRatio,
  screenWidth,
  barDetails = [], // [{ percent, levelId, correct, wrong }]
}) {
  const chartData = {
    labels: skills.flatMap((skill) => [skill, ""]),
    datasets: [
      {
        data: skills
          .flatMap((_, i) => [trueRatio[i], falseRatio[i], 0])
          .concat(100),
        colors: skills
          .flatMap(() => [
            () => styles.noteTrue.backgroundColor,
            () => styles.noteFalse.backgroundColor,
            () => "rgba(0,0,0,0)",
          ])
          .concat(() => "#fff"),
      },
    ],
    legend: [t("true"), t("false")],
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

  // Nhận xét tổng thể đúng/sai
  const avgTrue = trueRatio.reduce((a, b) => a + b, 0) / trueRatio.length || 0;
  const avgFalse = 100 - avgTrue;
  const summaryComment = t("summaryTF", {
    true: Math.round(avgTrue),
    false: Math.round(avgFalse),
  });

  // Nhận xét chi tiết từng kỹ năng
  const detailedComments = skills.map((skill, i) => {
    const correct = trueRatio[i];
    const incorrect = falseRatio[i];
    if (correct >= 90) {
      return `${skill}: ${t("excellentAccuracy", { correct })}`;
    } else if (correct >= 70) {
      return `${skill}: ${t("goodAccuracy", { correct, incorrect })}`;
    } else {
      return `${skill}: ${t("lowAccuracy", { correct })}`;
    }
  });

  // detail
  const renderBarLabels = () => {
    return (
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          width: screenWidth,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          paddingHorizontal: 10,
        }}
      >
        {barDetails.map((bar, i) => (
          <View key={i} style={{ alignItems: "center", width: 40 }}>
            <Text style={{ fontSize: 12, color: "#000" }}>{bar.percent}%</Text>
            <Text style={{ fontSize: 10, color: "#444" }}>{bar.levelId}</Text>
            <Text style={{ fontSize: 10, color: "#555" }}>
              {t("correct")}: {bar.correct}
            </Text>
            <Text style={{ fontSize: 10, color: "#555" }}>
              {t("wrong")}: {bar.wrong}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <View style={styles.tfChartContainer}>
        <Text style={styles.chartName}>{t("trueFalseRatio")}</Text>

        <View style={{ position: "relative" }}>
          <BarChart
            data={chartData}
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
          {renderBarLabels()}
        </View>
      </View>

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

      {/* Nhận xét dưới biểu đồ */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>{t("summary")}</Text>
        <Text style={styles.commentText}>{summaryComment}</Text>
        <Text style={styles.commentTitle}>{t("skillComments")}</Text>
        {detailedComments.map((line, idx) => (
          <Text key={idx} style={styles.commentText}>
            {line}
          </Text>
        ))}
      </View>
    </>
  );
}

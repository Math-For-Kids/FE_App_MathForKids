import React, { useState } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function TrueFalseChart({
  t,
  styles,
  skills,
  trueRatio,
  falseRatio,
  screenWidth,
  thisRange,
  rangeLabel,
  barDetailsThis = [],
  barDetailsLast = [],
}) {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);

  const chartData = {
    labels: [
      `${t("true")}(${t("last")})`,
      `${t("true")}(${t("this")})`,
      `${t("false")}(${t("last")})`,
      `${t("false")}(${t("this")})`,
      "", // cho cột dummy nếu có
    ],
    datasets: [
      {
        data: skills
          .flatMap((_, i) => {
            const idx = i * 2;
            return [
              barDetailsLast[idx]?.percent || 0, // đúng (last)
              barDetailsThis[idx]?.percent || 0, // đúng (this)
              barDetailsLast[idx + 1]?.percent || 0, // sai (last)
              barDetailsThis[idx + 1]?.percent || 0, // sai (this)
            ];
          })
          .concat(100), // dummy spacer
        colors: skills
          .flatMap(() => [
            () => "#648568ff", // đúng (last)
            () => styles.noteTrue.backgroundColor, // đúng (this)
            () => "#754b4bff", // sai (last)
            () => styles.noteFalse.backgroundColor, // sai (this)
          ])
          .concat(() => "#fff"),
      },
    ],
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

  const chartHeight = 215;
  const maxPercent = 110;

  const renderBarLabels = () => {
    if (selectedSkillIndex === null) return null;
    const realSkillCount = skills.length;
    if (selectedSkillIndex >= realSkillCount) return null;
    const columnWidth = screenWidth / (realSkillCount * 4);
    if (selectedSkillIndex * 4 + 3 >= barDetailsThis.length) return null;

    const startIdx = selectedSkillIndex * 4;
    const barThisTrue = barDetailsThis[startIdx + 2];
    const barThisFalse = barDetailsThis[startIdx + 3];
    const barLastTrue = barDetailsLast[startIdx];
    const barLastFalse = barDetailsLast[startIdx + 1];

    const left = columnWidth * startIdx + columnWidth;
    const top =
      chartHeight -
      ((barThisTrue?.percent || 0) / maxPercent) * chartHeight -
      200;

    return (
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: screenWidth,
          height: chartHeight,
        }}
      >
        <View
          style={{
            position: "absolute",
            left,
            top: Math.max(0, top),
            width: 120,
            alignItems: "flex-start",
            backgroundColor: "#fff",
            padding: 6,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#ccc",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            {skills[selectedSkillIndex]}
          </Text>
          <Text style={{ fontSize: 10, color: "#333" }}>
            {t("thisRange")} - {t("correct")}: {barThisTrue?.correct || 0},{" "}
            {t("wrong")}: {barThisFalse?.wrong || 0}
          </Text>
          <Text style={{ fontSize: 10, color: "#666" }}>
            {t("lastRange")} - {t("correct")}: {barLastTrue?.correct || 0},{" "}
            {t("wrong")}: {barLastFalse?.wrong || 0}
          </Text>
        </View>
      </View>
    );
  };

  const avgTrue = trueRatio.reduce((a, b) => a + b, 0) / trueRatio.length || 0;
  const avgFalse = 100 - avgTrue;

  const summaryComment = t("summaryTF", {
    true: Math.round(avgTrue),
    false: Math.round(avgFalse),
  });

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

        {/* Label kỹ năng để chọn */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 8,
            paddingHorizontal: 10,
          }}
        >
          {skills.map((skill, i) => {
            const isSelected = selectedSkillIndex === i;
            return (
              <Text
                key={i}
                onPress={() => setSelectedSkillIndex(isSelected ? null : i)}
                style={{
                  fontSize: 14,
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#ffffffff" : "#000",
                }}
              >
                {skill}
              </Text>
            );
          })}
        </View>
      </View>

      {/* Chú thích */}
      <View style={styles.chartNoteContainer}>
        <View>
          <View style={styles.chartNote}>
            <View
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#91caff",
                marginRight: 4,
              }}
            />
            <Text style={styles.note}>
              {t("true")} ({t("lastRange")})
            </Text>
          </View>
          <View style={styles.chartNote}>
            <View
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#fcb3b3",
                marginRight: 4,
              }}
            />
            <Text style={styles.note}>
              {t("false")} ({t("lastRange")})
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.chartNote}>
            <View style={[styles.noteTrue, { marginRight: 4 }]} />
            <Text style={styles.note}>
              {t("true")} ({t("thisRange")})
            </Text>
          </View>
          <View style={styles.chartNote}>
            <View style={[styles.noteFalse, { marginRight: 4 }]} />
            <Text style={styles.note}>
              {t("false")} ({t("thisRange")})
            </Text>
          </View>
        </View>
      </View>
      {/* Nhận xét */}
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

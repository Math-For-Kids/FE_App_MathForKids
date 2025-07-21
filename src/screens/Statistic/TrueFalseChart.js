import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
const screenWidth = Dimensions.get("window").width;
const sanitize = (value) =>
  Number.isFinite(value) && !isNaN(value) ? value : 0;

export default function TrueFalseChart({
  t,
  styles,
  accuracyByMonth = [],
  retryList = [],
  correct = 0,
  wrong = 0,
  total = 0,
  data = [],
  weakSkills = [],
  rangeType = "month",
}) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { theme } = useTheme();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [selectedBarLevelIndex, setSelectedBarLevelIndex] = useState(null);
  // Tim levelName theo exerciseId
  const enrichedRetryList = retryList.map((retryItem) => {
    const match = data.find((item) => item.exerciseId === retryItem.exerciseId);
    return {
      ...retryItem,
      levelName:
        match?.levelName?.[i18n.language] || match?.levelName?.en || null,
    };
  });
  // Xử lý label hiển thị theo rangeType
  const getLabelFromRange = (rangeKey) => {
    if (rangeType === "week") return t("week") + " " + rangeKey.split("-W")[1];
    if (rangeType === "quarter")
      return t("quarter") + " " + rangeKey.split("-Q")[1];
    return moment(rangeKey).format("MM/YYYY");
  };
  const chartData = {
    labels: accuracyByMonth.map((m) => getLabelFromRange(m.range)),
    datasets: [
      {
        data: accuracyByMonth.map((m) => sanitize(m.accuracy)),
        color: () => theme.colors.blueDark,
        strokeWidth: 2,
      },
      {
        data: accuracyByMonth.map((m) => sanitize(100 - m.accuracy)),
        color: () => theme.colors.redTomato,
        strokeWidth: 2,
      },
    ],
    legend: [t("correct"), t("wrong")],
  };
  //Bieu do hieu xuat
  const resultByRange = {};
  // Gom dữ liệu đúng/sai theo từng rangeKey
  accuracyByMonth.forEach((m) => {
    resultByRange[m.range] = { correct: m.correct, wrong: m.wrong };
  });
  // Sắp xếp các range theo thời gian
  const sortedRanges = Object.keys(resultByRange).sort();
  // Tạo dữ liệu cho stackedBar chart
  const stackedBarData = sortedRanges.map((range, index) => ({
    label: getLabelFromRange(range),
    stacks: [
      { value: resultByRange[range].correct, color: theme.colors.green },
      { value: resultByRange[range].wrong, color: theme.colors.redDark },
    ],
    onPress: () => setSelectedBarIndex(index),
  }));

  const chartHeight = 240;
  const maxValue = 30;
  const unitHeight = chartHeight / maxValue;
  const barWidth = 28;
  const spacing = 40;
  const leftOffset = 16;
  const tooltipWidth = selectedBarIndex === 0 ? -135 : -195;
  const totals =
    stackedBarData[selectedBarIndex]?.stacks?.reduce(
      (sum, s) => sum + s.value,
      0
    ) || 0;
  const offset = 45;

  const topOffset = chartHeight - totals * unitHeight - offset;
  const left =
    leftOffset +
    selectedBarIndex * (barWidth + spacing) +
    barWidth / 2 -
    tooltipWidth / 2;

  // Bieu do cau dung sai theo cap do
  const resultByLevel = {};
  data.forEach((item) => {
    const level =
      item.levelName?.[i18n.language] || item.levelName?.en || "Unknown";
    if (!resultByLevel[level]) {
      resultByLevel[level] = { correct: 0, wrong: 0 };
    }
    resultByLevel[level][item.isCorrect ? "correct" : "wrong"] += 1;
  });
  const levelLabels = Object.keys(resultByLevel);
  const stackedLevelData = levelLabels.map((level, index) => {
    const { correct, wrong } = resultByLevel[level];
    const total = correct + wrong;
    const correctPercent = total > 0 ? (correct / total) * 100 : 0;
    const wrongPercent = total > 0 ? (wrong / total) * 100 : 0;
    return {
      label: level,
      stacks: [
        { value: correctPercent, color: theme.colors.greenDark },
        { value: wrongPercent, color: theme.colors.redTomato },
      ],
      onPress: () => setSelectedBarLevelIndex(index),
    };
  });
  const yAxisLabelTexts = Array.from({ length: 11 }, (_, i) => `${i * 10}%`);
  // Thong ke cau dung/sai nhieu nhat o level nao
  const levelStats = {};
  data.forEach((item) => {
    const levelName = item.levelName?.vi || item.levelName?.en || "Unknown";
    if (!levelStats[levelName]) {
      levelStats[levelName] = { correct: 0, wrong: 0 };
    }
    if (item.isCorrect) {
      levelStats[levelName].correct += 1;
    } else {
      levelStats[levelName].wrong += 1;
    }
  });
  // Tìm level sai nhiều nhất
  const mostWrongLevel = Object.entries(levelStats).reduce(
    (max, [level, stats]) => {
      return stats.wrong > (max?.stats?.wrong || 0) ? { level, stats } : max;
    },
    null
  );
  // Tìm level đúng nhiều nhất
  const mostCorrectLevel = Object.entries(levelStats).reduce(
    (max, [level, stats]) => {
      return stats.correct > (max?.stats?.correct || 0)
        ? { level, stats }
        : max;
    },
    null
  );
  useEffect(() => {
    if (selectedBarIndex !== null) {
      const timeout = setTimeout(() => {
        setSelectedBarIndex(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [selectedBarIndex]);
  useEffect(() => {
    if (selectedBarLevelIndex !== null) {
      const timeout = setTimeout(() => {
        setSelectedBarLevelIndex(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [selectedBarLevelIndex]);

  return (
    <ScrollView contentContainerStyle={styles.containerTF}>
      {/* Biểu đồ Accuracy */}
      {accuracyByMonth.length > 0 && (
        <>
          <Text
            style={styles.chartTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            Caves
            minimumFontScale={0.5}
          >
            {t("accuracyOverTime")}
          </Text>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={240}
            fromZero
            yAxisSuffix="%"
            chartConfig={{
              backgroundGradientFrom: theme.colors.white,
              backgroundGradientTo: theme.colors.white,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: () => theme.colors.black,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: theme.colors.white,
              },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
            onDataPointClick={({ value, index, dataset, x, y }) => {
              setSelectedPoint({ value, index, datasetIndex: dataset, x, y });
              setTimeout(() => setSelectedPoint(null), 3000);
            }}
            renderDotContent={({ x, y, index }) =>
              selectedPoint?.index === index &&
              selectedPoint?.x === x &&
              selectedPoint?.y === y ? (
                <View
                  key={`dot-${index}`}
                  style={{
                    position: "absolute",
                    top: y - 300,
                    left: x - 20,
                    backgroundColor: theme.colors.red,
                    padding: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: theme.colors.white, fontSize: 10 }}>
                    {selectedPoint.value.toFixed(1)}%
                  </Text>
                </View>
              ) : null
            }
          />
          <Text style={styles.chartNote}>
            {t("accuracyOverTime")} – {t("comment")}:{" "}
            {accuracyByMonth[0]?.accuracy >= 80
              ? t("excellentAccuracy", { correct: accuracyByMonth[0].accuracy })
              : accuracyByMonth[0]?.accuracy >= 50
              ? t("goodAccuracy", {
                  correct: accuracyByMonth[0].accuracy,
                  incorrect: (100 - accuracyByMonth[0].accuracy).toFixed(1),
                })
              : t("lowAccuracy", { correct: accuracyByMonth[0].accuracy })}
          </Text>
        </>
      )}

      {/* Biểu đồ đúng/sai theo tháng */}
      {stackedBarData.length > 0 && (
        <>
          <Text
            style={styles.chartTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            Caves
            minimumFontScale={0.5}
          >
            {t("correctWrongByMonth")}
          </Text>
          <View style={styles.chartWrapper}>
            <View style={styles.noteContainer}>
              <View style={styles.noteItem}>
                <View
                  style={[
                    styles.noteColorBox,
                    { backgroundColor: theme.colors.green },
                  ]}
                />
                <Text style={styles.noteLabel}>{t("correct")}</Text>
              </View>
              <View style={styles.noteItem}>
                <View
                  style={[
                    styles.noteColorBox,
                    { backgroundColor: theme.colors.orangeLight },
                  ]}
                />
                <Text style={styles.noteLabel}>{t("wrong")}</Text>
              </View>
            </View>
            <Text style={styles.yAxisUnitLabel}>
              {t("unit")}: {t("questions")}
            </Text>
            <BarChart
              stackData={stackedBarData}
              barWidth={40}
              spacing={60}
              height={240}
              yAxisColor={{ color: theme.colors.black }}
              xAxisColor={{ color: theme.colors.black }}
              xAxisLabelTextStyle={styles.chartAxisLabel}
              yAxisTextStyle={styles.chartAxisText}
              showValuesOnTopOfBars
              selectedIndex={selectedBarIndex}
              showTooltip={false}
            />
            {selectedBarIndex !== null && (
              <View style={styles.tooltipContainer}>
                <Text style={styles.tooltipText}>
                  {t("total")}:{" "}
                  {stackedBarData[selectedBarIndex]?.stacks[0].value +
                    stackedBarData[selectedBarIndex]?.stacks[1].value}
                </Text>
                <Text style={styles.correctText}>
                  {t("correct")}:{" "}
                  {stackedBarData[selectedBarIndex]?.stacks[0].value}
                </Text>
                <Text style={styles.wrongText}>
                  {t("wrong")}:{" "}
                  {stackedBarData[selectedBarIndex]?.stacks[1].value}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.chartNote}>
            {t("correctWrongByMonth")} –{" "}
            {t("summaryTF", {
              true:
                stackedBarData[0]?.stacks?.[0]?.value +
                  stackedBarData[1]?.stacks?.[0]?.value || 0,
              false:
                stackedBarData[0]?.stacks?.[1]?.value +
                  stackedBarData[1]?.stacks?.[1]?.value || 0,
            })}
          </Text>
        </>
      )}

      {/* Tinh theo level */}
      {stackedLevelData.length > 0 && (
        <>
          <Text
            style={styles.chartTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            Caves
            minimumFontScale={0.5}
          >
            {t("accuracyByLevel")}
          </Text>
          <View style={styles.chartWrapperWithMargin}>
            <View style={styles.noteContainer}>
              <View style={styles.noteItem}>
                <View
                  style={[
                    styles.noteColorBox,
                    { backgroundColor: theme.colors.greenDark },
                  ]}
                />
                <Text style={styles.noteLabel}>{t("correct")}</Text>
              </View>
              <View style={styles.noteItem}>
                <View
                  style={[
                    styles.noteColorBox,
                    { backgroundColor: theme.colors.redTomato },
                  ]}
                />
                <Text style={styles.noteLabel}>{t("wrong")}</Text>
              </View>
            </View>

            <BarChart
              stackData={stackedLevelData}
              barWidth={40}
              spacing={40}
              height={240}
              yAxisColor={{ color: theme.colors.black }}
              xAxisColor={{ color: theme.colors.black }}
              maxValue={100}
              yAxisLabelTexts={yAxisLabelTexts}
              xAxisLabelTextStyle={styles.chartAxisLabel}
              yAxisTextStyle={styles.chartAxisText}
              showValuesOnTopOfBars={true}
            />
            {selectedBarLevelIndex !== null && (
              <View style={styles.levelTooltipContainer}>
                <Text style={styles.levelLabel}>
                  {levelLabels[selectedBarLevelIndex]}
                </Text>
                <Text style={styles.levelCorrect}>
                  {t("correct")}:{" "}
                  {resultByLevel[levelLabels[selectedBarLevelIndex]].correct} (
                  {sanitize(
                    (resultByLevel[levelLabels[selectedBarLevelIndex]].correct /
                      (resultByLevel[levelLabels[selectedBarLevelIndex]]
                        .correct +
                        resultByLevel[levelLabels[selectedBarLevelIndex]]
                          .wrong)) *
                      100
                  ).toFixed(1)}
                  %)
                </Text>
                <Text style={styles.levelWrong}>
                  {t("wrong")}:{" "}
                  {resultByLevel[levelLabels[selectedBarLevelIndex]].wrong} (
                  {sanitize(
                    (resultByLevel[levelLabels[selectedBarLevelIndex]].wrong /
                      (resultByLevel[levelLabels[selectedBarLevelIndex]]
                        .correct +
                        resultByLevel[levelLabels[selectedBarLevelIndex]]
                          .wrong)) *
                      100
                  ).toFixed(1)}
                  %)
                </Text>
              </View>
            )}
          </View>
          {mostWrongLevel && mostCorrectLevel && (
            <Text style={styles.chartNote}>
              {t("mostCorrectLevel")}: {mostCorrectLevel.level} (
              {mostCorrectLevel.stats.correct} {t("times")}) –{" "}
              {t("mostWrongLevel")}: {mostWrongLevel.level} (
              {mostWrongLevel.stats.wrong} {t("times")})
            </Text>
          )}
        </>
      )}

      {/* Tổng quan */}
      <View style={styles.summaryTFContainer}>
        <Text style={styles.summaryTitle}>{t("summary")}</Text>
        <Text style={styles.summaryItem}>
          {t("correct")}: {correct} / {total} (
          {sanitize((correct / total) * 100).toFixed(1)}%)
        </Text>
        <Text style={styles.summaryItem}>
          {t("wrong")}: {wrong}
        </Text>
        {weakSkills.length > 0 && (
          <Text style={styles.summaryItem}>
            {t("weakSkills")}: {weakSkills.map((s) => t(s)).join(", ")}
          </Text>
        )}
        {accuracyByMonth.length > 1 &&
          (() => {
            const [current, previous] = [
              accuracyByMonth[0]?.accuracy || 0,
              accuracyByMonth[1]?.accuracy || 0,
            ];
            const diff = sanitize(previous - current);
            return (
              <Text style={styles.summaryItem}>
                {t("accuracyChange")}: {diff >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(diff).toFixed(1)}% (
                {t(diff >= 0 ? "improved" : "declined")})
              </Text>
            );
          })()}

        {mostWrongLevel && (
          <Text style={styles.summaryItem}>
            {t("mostWrongLevel")}: {mostWrongLevel.level} (
            {mostWrongLevel.stats.wrong} {t("times")})
          </Text>
        )}

        {mostCorrectLevel && (
          <Text style={styles.summaryItem}>
            {t("mostCorrectLevel")}: {mostCorrectLevel.level} (
            {mostCorrectLevel.stats.correct} {t("times")})
          </Text>
        )}
      </View>
      {/* Danh sách cần luyện lại */}
      {enrichedRetryList.length > 0 && (
        <View style={styles.retryContainer}>
          <Text style={styles.retryTitle}>{t("shouldRetry")}</Text>
          {enrichedRetryList.map((r, i) => (
            <View key={i} style={styles.retryItem}>
              <Text style={styles.retryText}>
                {r.question?.[currentLang] || r.question?.en || t("noQuestion")}
              </Text>
              {r.image && (
                <Image source={{ uri: r.image }} style={styles.retryImage} />
              )}
              <Text style={styles.retryCount}>
                {t("wrongTimes")}: {r.wrongTimes}
              </Text>
              <Text style={styles.retryCount}>
                {t("level")}: {r.levelName}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

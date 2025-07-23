import React, { useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../../themes/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getLessonsByGradeAndType } from "../../redux/lessonSlice";

// Component hiển thị biểu đồ cột so sánh điểm số học tập
export default React.memo(function AcademicChart({
  t,
  styles,
  skills,
  pointStats,
  fullLessonStats,
  screenWidth,
  thisRange,
  lastRange,
  language,
  grade,
  type,
  pupilId,
}) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  // Sắp xếp thứ tự danh mục điểm số: <5, ≥5, ≥7, ≥9
  const scoreCategories = ["<5", "≥5", "≥7", "≥9"];
  const lessons = useSelector((state) => state.lesson.lessons);

  // Lấy dữ liệu bài học dựa trên grade, type và pupilId
  useEffect(() => {
    if (grade && type && pupilId) {
      dispatch(getLessonsByGradeAndType({ grade, type, pupilId }));
    }
  }, [dispatch, grade, type, pupilId]);

  // Phân tích sự cải thiện dựa trên pointStats
  const improvementAnalysis = useMemo(() => {
    if (
      !pointStats?.compareByType ||
      !Object.keys(pointStats.compareByType).length
    ) {
      return t("noDataAvailable");
    }

    const calculateScores = (range) => {
      let highScores = 0;
      let lowScores = 0;
      skills.forEach((skill) => {
        const skillData = pointStats.compareByType[skill]?.[range];
        if (skillData) {
          highScores += (skillData["≥9"] || 0) + (skillData["≥7"] || 0);
          lowScores += skillData["<5"] || 0;
        }
      });
      return { highScores, lowScores };
    };

    const thisPeriod = calculateScores(thisRange);
    const lastPeriod = calculateScores(lastRange);

    let improvementMessage = "";
    if (
      thisPeriod.lowScores < lastPeriod.lowScores &&
      thisPeriod.highScores >= lastPeriod.highScores
    ) {
      improvementMessage = t("improvementNoticed", {
        range: thisRange,
        lowScoreReduction: lastPeriod.lowScores - thisPeriod.lowScores,
      });
    } else if (thisPeriod.lowScores > lastPeriod.lowScores) {
      improvementMessage = t("moreLowScores", {
        range: thisRange,
        lowScoreIncrease: thisPeriod.lowScores - lastPeriod.lowScores,
      });
    } else if (thisPeriod.highScores > lastPeriod.highScores) {
      improvementMessage = t("moreHighScores", {
        range: thisRange,
        highScoreIncrease: thisPeriod.highScores - lastPeriod.highScores,
      });
    } else {
      improvementMessage = t("noSignificantChange", { range: thisRange });
    }

    return improvementMessage;
  }, [pointStats, thisRange, lastRange, skills, t]);

  // Tạo thông báo về các bài học cần cải thiện
  const notificationMessage = useMemo(() => {
    if (!fullLessonStats?.compareByLesson) return [t("noDataAvailable")];

    const lessonNameMap = lessons.reduce((map, lesson) => {
      if (lesson.id && lesson.name?.[language]) {
        map[lesson.id] = lesson.name[language];
      }
      return map;
    }, {});

    const scoresByLesson = Object.entries(
      fullLessonStats.compareByLesson
    ).flatMap(([skill, lessons]) =>
      Object.entries(lessons).map(([lessonKey, data]) => ({
        lessonId: lessonKey.split(": ")[1],
        highScores:
          (data[thisRange]?.["≥9"] || 0) + (data[thisRange]?.["≥7"] || 0),
        lowScores: data[thisRange]?.["<5"] || 0,
      }))
    );

    const lessonsToImprove = scoresByLesson
      .filter(({ highScores, lowScores }) => lowScores > highScores)
      .map(
        ({ lessonId }) =>
          `${lessonNameMap[lessonId] || lessonId} ${t("needsImprovement")}.`
      );

    return lessonsToImprove.length
      ? [...lessonsToImprove, improvementAnalysis]
      : [t("noLessonsNeedImprovement"), improvementAnalysis];
  }, [fullLessonStats, thisRange, language, t, lessons, improvementAnalysis]);

  // Kiểm tra nếu không có dữ liệu để hiển thị
  if (
    !pointStats?.compareByType ||
    !Object.keys(pointStats.compareByType).length
  ) {
    return (
      <View
        style={[
          styles.academicChartContainers,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Text
          style={[
            styles.chartName,
            { textAlign: "center", fontSize: 20, fontWeight: "600" },
          ]}
        >
          {t("academicProgress")}
        </Text>
      </View>
    );
  }

  // Tổng hợp dữ liệu cho biểu đồ
  const aggregatedData = scoreCategories.map((category) => {
    const thisPeriodTotal = skills.reduce((sum, skill) => {
      const skillData =
        pointStats.compareByType[skill]?.[thisRange]?.[category] || 0;
      return sum + skillData;
    }, 0);
    const lastPeriodTotal = skills.reduce(
      (sum, skill) =>
        sum + (pointStats.compareByType[skill]?.[lastRange]?.[category] || 0),
      0
    );
    return [lastPeriodTotal, thisPeriodTotal, 0]; // 0 là placeholder cho khoảng trống
  });

  // Kiểm tra nếu không có dữ liệu để hiển thị biểu đồ
  const shouldShowChart = aggregatedData.some(
    (data) => data[0] > 0 || data[1] > 0
  );
  if (!shouldShowChart) {
    return (
      <View
        style={[
          styles.academicChartContainers,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Text
          style={[
            styles.chartName,
            { textAlign: "center", fontSize: 20, fontWeight: "600" },
          ]}
        >
          {t("academicProgress")}
        </Text>
      </View>
    );
  }

  // Cấu hình dữ liệu cho biểu đồ
  const chartData = {
    labels: scoreCategories.flatMap((cat) => [cat, ""]), // Thêm khoảng trống giữa các nhóm cột
    datasets: [
      {
        data: aggregatedData.flat(),
        colors: scoreCategories.flatMap(() => [
          () => "#FF6F61", // Màu đỏ cam cho giai đoạn trước
          () => "#6BCB77", // Màu xanh lá cho giai đoạn hiện tại
          () => "rgba(0,0,0,0)", // Khoảng trống giữa các cột
        ]),
      },
    ],
    legend: [t(lastRange), t(thisRange)],
  };

  // Cấu hình giao diện cho biểu đồ, bao gồm đường dọc trục Y
  const chartConfig = {
    backgroundColor: "#F5F5F5", // Màu nền nhẹ
    backgroundGradientFrom: "#F5F5F5",
    backgroundGradientTo: "#F5F5F5",
    decimalPlaces: 0,
    color: () => theme.colors.black || "#333", // Màu chữ tối
    labelColor: () => "#333", // Màu nhãn cột
    barPercentage: 0.7, // Tăng chiều rộng cột
    formatYLabel: (value) => `${Math.max(Math.round(value), 0)}`,
    minY: 0,
    maxY: Math.max(...aggregatedData.flat()) + 2, // Tăng maxY để có không gian
    yAxisLabel: "", // Không hiển thị nhãn trục Y
    withVerticalLines: true, // Bật đường dọc
    withHorizontalLines: true, // Bật đường ngang
    propsForBackgroundLines: {
      stroke: "#E0E0E0", // Màu đường lưới ngang nhạt
      strokeWidth: 1,
    },
    propsForVerticalLines: {
      stroke: "#666", // Màu đường dọc đậm hơn để rõ ràng
      strokeWidth: 2, // Độ dày đường dọc
      strokeDashArray: "", // Đường liền, không nét đứt
    },
    propsForLabels: {
      fontSize: 14, // Tăng kích thước chữ nhãn
      fontWeight: "500",
    },
  };

  return (
    <View
      style={[
        styles.academicChartContainers,
        { padding: 16, borderRadius: 12, alignItems: "center" },
      ]}
    >
      {/* Tiêu đề biểu đồ */}
      <Text
        style={[
          styles.chartName,
          { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 16 },
        ]}
      >
        {t("academicProgress")}
      </Text>
      <View style={[styles.back, { alignItems: "center" }]}>
        {/* Biểu đồ cột */}
        <BarChart
          data={chartData}
          width={screenWidth} // Giảm chiều rộng để có lề
          height={320} // Tăng chiều cao biểu đồ
          spacing={80} // Tăng khoảng cách giữa các nhóm cột
          fromZero
          flatColor
          segments={Math.max(...chartData.datasets[0].data, 1)}
          chartConfig={chartConfig}
          withCustomBarColorFromData
          showTooltip={false}
          showBarTops={false}
          withVerticalLines={true} // Đảm bảo bật đường dọc
          style={styles.academicChartContainer}
        />
        {/* Chú thích màu */}
        <View
          style={[
            styles.chartNoteContainer,
            { flexDirection: "row", justifyContent: "center", marginTop: 16 },
          ]}
        >
          <View
            style={[
              styles.chartNote,
              { flexDirection: "row", alignItems: "center", marginRight: 20 },
            ]}
          >
            <View
              style={[
                {
                  width: 16,
                  height: 16,
                  backgroundColor: "#FF6F61",
                  borderRadius: 4,
                },
              ]}
            />
            <Text
              style={[
                {
                  marginLeft: 8,
                  color: "#333",
                  fontSize: 14,
                  fontWeight: "500",
                },
              ]}
            >
              {t(lastRange)}
            </Text>
          </View>
          <View
            style={[
              styles.chartNote,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <View
              style={[
                {
                  width: 16,
                  height: 16,
                  backgroundColor: "#6BCB77",
                  borderRadius: 4,
                },
              ]}
            />
            <Text
              style={[
                {
                  marginLeft: 8,
                  color: "#333",
                  fontSize: 14,
                  fontWeight: "500",
                },
              ]}
            >
              {t(thisRange)}
            </Text>
          </View>
        </View>
      </View>
      {/* Phần tóm tắt */}
      <View style={[styles.summaryTFContainer, { width: 330 }]}>
        <Text style={styles.summaryTitle}>{t("summary")}</Text>
        {notificationMessage.map((line, index) => (
          <Text key={index} style={styles.summaryItem}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
});

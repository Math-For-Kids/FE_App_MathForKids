import { StyleSheet } from "react-native";
import { Fonts } from "../../../constants/Fonts";

export default function createStyles(theme) {
  return StyleSheet.create({
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
    dropdownpupil: {
      flexDirection: "row",
      justifyContent: "center",
      padding: 10,
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
      // elevation: 5,
    },

    dropdown: {
      position: "absolute",
      top: 175,
      left: 20,
      width: "89%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      // elevation: 3,
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
      width: "45%",
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginLeft: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      // elevation: 3,
    },
    dropdownButtonText: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 13,
      color: theme.colors.black,
    },
    dropdownDay: {
      position: "absolute",
      top: 230,
      left: 20,
      width: "60%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 5,
      // elevation: 3,
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
      // elevation: 20,
    },
    academicChartContainer: {
      marginTop: 10,
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
    commentContainer: {
      width: "90%",
      backgroundColor: theme.colors.cardBackground,
      marginHorizontal: 20,
      marginVertical: 20,
      padding: 10,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      // elevation: 3,
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
      // elevation: 3,
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
    noteText: {
      fontSize: 12,
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    filterButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#e0e0e0",
    },
    filterButtonSelected: {
      backgroundColor: "#007AFF",
    },
    filterText: {
      fontSize: 14,
      color: "#000",
    },
    filterTextSelected: {
      color: "#fff",
      fontWeight: "bold",
    },
    chartTypeWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      marginVertical: 10,
    },
    chartTypeButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.white,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.colors.blueDark,
    },
    chartTypeButtonSelected: {
      backgroundColor: theme.colors.green,
    },
    chartTypeText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.blueDark,
    },
    chartTypeTextSelected: {
      color: theme.colors.white,
    },
    dropdownContainer: {
      flexDirection: "column",
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    dropdownWrapper: {
      marginBottom: 8,
    },
    dropdownRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme.colors.white,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
    },
    dropdownText: {
      fontSize: 14,
      color: theme.colors.blueDark,
      flex: 1,
    },
    dropdownModal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    dropdownContent: {
      backgroundColor: theme.colors.white,
      borderRadius: 10,
      padding: 10,
      width: "80%",
      maxHeight: "50%",
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.blueDark,
      textAlign: "center",
      marginTop: 20,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.red,
      textAlign: "center",
      marginTop: 20,
    },
    weakSkillContainer: {
      margin: 16,
      backgroundColor: "#ffe5e5",
      padding: 12,
      borderRadius: 10,
    },
    weakSkillTitle: {
      fontWeight: "bold",
      color: "#cc0000",
    },
    weakSkillItem: {
      marginTop: 4,
    },
    retryContainer: {
      marginVertical: 20,
      backgroundColor: "#e6f7ff",
      padding: 12,
      borderRadius: 10,
    },
    retryTitle: {
      fontWeight: "bold",
      color: "#006699",
    },
    retryItem: {
      marginTop: 8,
      borderWidth: 1,
      borderColor: "#fff",
      borderRadius: 20,
      padding: 10,
    },
    retryText: {
      fontSize: 14,
    },
    retryImage: {
      height: 100,
      resizeMode: "contain",
      marginVertical: 4,
    },
    retryCount: {
      color: "#333",
      fontStyle: "italic",
    },
    containerTF: { paddingHorizontal: 16, paddingBottom: 60 },
    summaryTFContainer: {
      backgroundColor: theme.colors.cardBackground,
      padding: 10,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      marginTop: 20,
    },
    chartTitle: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BOLD,
      marginBottom: 8,
      color: theme.colors.white,
    },
    tooltipContainer: {
      position: "absolute",
      backgroundColor: theme.colors.white,
      borderRadius: 6,
      padding: 6,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
      zIndex: 10,
    },
    tooltipText: {
      color: theme.colors.black,
      fontSize: 12,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    correctText: {
      color: theme.colors.green,
      fontSize: 12,
    },
    wrongText: {
      color: theme.colors.redDark,
      fontSize: 12,
    },
    levelTooltipContainer: {
      position: "absolute",
      top: 5,
      left: 5,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 6,
      padding: 6,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
      zIndex: 10,
    },
    levelLabel: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 12,
    },
    levelCorrect: {
      color: theme.colors.GreenDark,
      fontSize: 12,
    },
    levelWrong: {
      color: theme.colors.redTomato,
      fontSize: 12,
    },
    chartWrapper: {
      position: "relative",
      backgroundColor: theme.colors.cardBackground,
      padding: 12,
      borderRadius: 12,
    },
    chartWrapperWithMargin: {
      position: "relative",
      backgroundColor: theme.colors.cardBackground,
      padding: 12,
      borderRadius: 12,
      marginTop: 10,
    },
    chartAxisLabel: {
      color: theme.colors.black,
      fontSize: 12,
    },
    chartAxisText: {
      color: theme.colors.black,
      fontSize: 12,
    },
    // phuc thêm
    academicChartContainer: {
      backgroundColor: "#F8FAFC", // Màu nền nhạt, sạch sẽ
      borderRadius: 12, // Bo góc nhẹ
      margin: 16,
      shadowColor: "#000", // Bóng đổ
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Bóng đổ cho Android
    },
    chartName: {
      fontSize: 20, // Kích thước chữ tiêu đề
      fontWeight: "600", // Độ đậm trung bình
      color: "#1F2937", // Màu xám đậm
      textAlign: "center", // Căn giữa
    },
    chartNoteContainer: {
      flexDirection: "row", // Sắp xếp ngang
      justifyContent: "center", // Căn giữa các chú thích
      marginTop: 12, // Khoảng cách trên
    },
    chartNote: {
      flexDirection: "row", // Sắp xếp ô màu và chữ ngang
      alignItems: "center", // Căn giữa theo chiều dọc
      marginHorizontal: 12, // Khoảng cách giữa các chú thích
    },
    noteLast: {
      width: 20,
      height: 20,
      backgroundColor: "#8884d8", // Màu tím cho last period
      marginRight: 5,
    },
    noteThis: {
      width: 20,
      height: 20,
      backgroundColor: "#82ca9d", // Màu xanh cho this period
      marginRight: 5,
    },
    noteTexts: {
      fontSize: 14, // Kích thước chữ chú thích
      color: "#ffffffff", // Xám trung tính
      fontWeight: "500",
    },
    commentText: {
      fontSize: 14, // Kích thước chữ bình luận
      color: "#4B5563", // Xám trung tính
      lineHeight: 20, // Khoảng cách dòng
      marginBottom: 4, // Khoảng cách giữa các dòng bình luận
    },
    noteText: {
      color: "#4B5563", // Màu chữ cho nhãn biểu đồ
    },
  });
}
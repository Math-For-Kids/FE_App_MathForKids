import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import FloatingMenu from "../../components/FloatingMenu";
import { Ionicons } from "@expo/vector-icons";
import { getAllPupils } from "../../redux/pupilSlice";
import { notificationsByPupilId } from "../../redux/pupilNotificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function HomeScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { pupilId } = route.params || {};
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { t } = useTranslation("home");

  const pupils = useSelector((state) => state.pupil.pupils || []);
  const pupilNotifications = useSelector(
    (state) => state.pupilnotifications.list || []
  );

  const [selectedGrade, setSelectedGrade] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const gradeOptions = ["1", "2", "3"];

  useEffect(() => {
    if (isFocused && pupilId) {
      dispatch(getAllPupils());
      dispatch(notificationsByPupilId(pupilId));
    }
  }, [isFocused, pupilId]);

  const filteredPupils = pupils.find(
    (pupil) => String(pupil.id) === String(pupilId)
  );
  console.log("filteredPupils", filteredPupils);
  useEffect(() => {
    if (filteredPupils?.grade) {
      setSelectedGrade(String(filteredPupils.grade));
    }
  }, [filteredPupils]);

  const filteredNotifications = pupilNotifications.filter(
    (notification) => notification.isRead === false
  );

  const skills = (() => {
    if (selectedGrade === "1") {
      return [
        {
          icon: theme.icons.addition,
          label: "Addition",
          route: "LessonScreen",
          borderColor: theme.colors.greenDark,
        },
        {
          icon: theme.icons.subtraction,
          label: "Subtraction",
          route: "LessonScreen",
        },
      ];
    }
    return [
      { icon: theme.icons.addition, label: "Addition", route: "LessonScreen" },
      {
        icon: theme.icons.subtraction,
        label: "Subtraction",
        route: "LessonScreen",
      },
      {
        icon: theme.icons.multiplication,
        label: "Multiplication",
        route: "LessonScreen",
      },
      { icon: theme.icons.division, label: "Division", route: "LessonScreen" },
      {
        icon: theme.icons.multiplicationTables,
        label: "Expression",
        route: "MultiplicationTableScreen",
      },
    ];
  })();

  if (!selectedGrade) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.colors.white, fontSize: 18 }}>
          Loading grade...
        </Text>
      </View>
    );
  }
  const getTab = (label) => {
    if (label === "Addition") return theme.colors.greenLight;
    if (label === "Subtraction") return theme.colors.purpleLight;
    if (label === "Multiplication") return theme.colors.orangeLight;
    if (label === "Division") return theme.colors.redLight;
    return theme.colors.pinkLight;
  };
  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
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
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
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
    notificationIcon: { width: 30, height: 30 },
    gradeWrapper: {
      position: "absolute",
      top: 140,
      left: 20,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 5,
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
      width: 100,
      borderWidth: 1,
      borderColor: theme.colors.white,
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
    dropdown: {
      position: "absolute",
      top: 30,
      left: 0,
      marginTop: 5,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 5,
      elevation: 3,
      paddingVertical: 0,
    },
    dropdownItem: {
      paddingVertical: 6,
      paddingHorizontal: 45,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.blueDark,
    },
    dropdownItemText: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    title: {
      textAlign: "center",
      marginTop: 60,
      marginBottom: 24,
      fontSize: 32,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BOLD,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      paddingHorizontal: 10,
    },
    skillBox: {
      backgroundColor: theme.colors.background,
      elevation: 3,
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 30,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
    },
    skillIcon: { width: 100, height: 100 },
    skillText: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
      marginTop: 10,
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
              onPress={() => navigation.navigate("ProfileScreen", { pupilId })}
            >
              <Image
                source={
                  filteredPupils?.image
                    ? { uri: filteredPupils?.image }
                    : filteredPupils?.gender === "female"
                      ? theme.icons.avatarFemale
                      : theme.icons.avatarMale
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>{t("hello")}</Text>
              <Text style={styles.name}>{filteredPupils?.fullName}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NotificationScreen", { pupilId })
            }
          >
            <View style={styles.notificationContainer}>
              {filteredNotifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {filteredNotifications.length}
                  </Text>
                </View>
              )}
              <Image
                source={theme.icons.notification}
                style={styles.notificationIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.gradeWrapper}>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.gradeRow}
          >
            <Text style={styles.grade}>
              {t("grade", { value: selectedGrade })}
            </Text>
            <Ionicons
              name={showDropdown ? "caret-up-outline" : "caret-down-outline"}
              size={20}
              color={theme.colors.blueDark}
            />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              {gradeOptions.map((grade, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedGrade(grade);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{grade}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>

      <Text style={styles.title}>{t("select_skill")}</Text>

      <ScrollView contentContainerStyle={styles.skillsContainer}>
        {skills.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.skillBox,
              { borderColor: getTab(item.label) },
            ]}
            onPress={() =>
              navigation.navigate(item.route, {
                skillName: item.label,
                skillIcon: item.icon,
                grade: selectedGrade,
                pupilId: pupilId,
              })
            }
          >
            <Image source={item.icon} style={styles.skillIcon} />
            <Text style={styles.skillText}>{t(item.label)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FloatingMenu />
    </LinearGradient>
  );
}

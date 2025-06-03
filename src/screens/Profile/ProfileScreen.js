import React from "react";
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
import { ProgressBar } from "react-native-paper";
import FloatingMenu from "../../components/FloatingMenu";
export default function ProfileScreen({ navigation }) {
  const { theme } = useTheme();

  const user = {
    name: "Nguyen Thi Hong",
    class: "Class 3",
    avatar: theme.icons.avatarFemale,
  };

  const achievements = [
    {
      icon: theme.icons.achievement,
      label: "Top",
      value: "1",
    },
    {
      icon: theme.icons.point,
      label: "Point",
      value: "1500",
    },
    {
      icon: theme.icons.time,
      label: "Time",
      value: "2h",
    },
    {
      icon: theme.icons.badge,
      label: "Badge",
      value: "3",
    },
  ];
  const progressData = {
    lesson: 0.01,
    exercise: 0.6,
    test: 0.4,
    mission: 0.7,
  };
  const renderProgressBar = (label, progress, key) => (
    <View key={key}>
      <Text style={styles.progressTitle}>{label}</Text>
      <ProgressBar
        progress={progress}
        color={theme.colors.process}
        style={styles.progressBar}
      />
      <Text style={styles.progressText}>{`${Math.round(
        progress * 100
      )}%`}</Text>
    </View>
  );
  const handleDetail = () => {
    navigation.navigate("ProfilePupilDetailScreen");
  };

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
    header: {
      height: "20%",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 3,
    },
    backBtn: {
      position: "absolute",
      left: 20,
      top: 40,
      backgroundColor: theme.colors.backBackgound,
      padding: 10,
      borderRadius: 50,
    },
    backIcon: { width: 24, height: 24 },
    title: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    userInfo: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 80,
      backgroundColor: theme.colors.cardBackground,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 15,
      elevation: 3,
      marginHorizontal: 15,
    },
    avatarContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderWidth: 1,
      borderColor: theme.colors.blueDark,
      padding: 10,
      borderRadius: 50,
      elevation: 3,
    },
    avatar: { width: 30, height: 30 },
    name: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.blueDark,
    },
    text: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueDark,
    },
    achievementTagContainer: {
      width: "40%",
      backgroundColor: theme.colors.cardBackground,
      marginLeft: 15,
      marginTop: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      elevation: 3,
      alignItems: "center",
    },
    achievementTagText: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    achievements: {
      marginTop: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    achievementBox: {
      alignItems: "center",
      padding: 10,
      width: "30%",
    },
    iconContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    icon: { width: 30, height: 30 },
    label: {
      fontSize: 14,
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    valueContainer: {
      width: "100%",
      backgroundColor: theme.colors.cardBackground,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderBottomRightRadius: 15,
      elevation: 3,
    },
    value: {
      color: theme.colors.blueDark,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    progressContainer: {
      marginTop: 20,
      marginBottom: 80,
      marginHorizontal: 15,
    },
    progressBar: {
      height: 20,
      borderRadius: 20,
      marginBottom: 5,
      backgroundColor: theme.colors.progressBackground,
      elevation: 3,
    },
    progressTitle: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      marginBottom: 5,
    },
    progressText: {
      position: "absolute",
      top: 25,
      left: "50%",
      color: theme.colors.white,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
    detailButtonWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    detailButton: {
      paddingVertical: 12,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      alignItems: "center",
    },
    detailText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Image source={theme.icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </LinearGradient>
      <ScrollView>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={user.avatar}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.text}>{user.class}</Text>
          </View>
        </View>
        <View style={styles.achievementTagContainer}>
          <Text style={styles.achievementTagText}>Achievements</Text>
        </View>
        <View style={styles.achievements}>
          {achievements.map((item, index) => (
            <View key={index} style={styles.achievementBox}>
              <View style={styles.iconContainer}>
                <Image
                  source={item.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.progressContainer}>
          {Object.entries(progressData).map(([key, progress]) =>
            renderProgressBar(
              `${key.charAt(0).toUpperCase() + key.slice(1)} Progress`,
              progress,
              key
            )
          )}
        </View>
      </ScrollView>
      <View style={styles.detailButtonWrapper}>
        <TouchableOpacity onPress={handleDetail}>
          <LinearGradient
            style={styles.detailButton}
            colors={theme.colors.gradientBlue}
          >
            <Text style={styles.detailText}>Detail</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <FloatingMenu />
    </LinearGradient>
  );
}

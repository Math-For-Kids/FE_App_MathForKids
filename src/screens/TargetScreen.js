import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import FloatingMenu from "../components/FloatingMenu";

export default function TargetScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("target");

  const allTargets = [
    {
      id: 1,
      title: "Parental",
      misstion: "Two number addition lesson",
      content: "Complete this lesson to earn rewards!",
      rewardImage: theme.images.characterHeart,
      reward: 12,
      rewardName: "Capybara",
      dateEnd: new Date("2025-05-20"),
      isSuccess: false,
    },
    {
      id: 2,
      title: "Daily",
      misstion: "Two number addition lesson",
      content: "Try to solve all questions correctly!",
      rewardImage: theme.images.characterEating,
      reward: 10,
      rewardName: "Koala",
      dateEnd: new Date("2025-04-18"),
      isSuccess: true,
    },
    {
      id: 3,
      title: "Parental",
      misstion: "Two number addition lesson",
      content: "Earn stars by completing 5 tasks.",
      rewardImage: theme.images.characterWithBird,
      reward: 15,
      rewardName: "Eagle",
      dateEnd: new Date("2025-06-01"),
      isSuccess: false,
    },
    {
      id: 4,
      title: "Daily",
      misstion: "Two number addition lesson",
      content: "Earn stars by completing 5 tasks.",
      rewardImage: theme.images.characterWithBird,
      reward: 15,
      rewardName: "Eagle",
      dateEnd: new Date("2025-06-01"),
      isSuccess: false,
    },
    {
      id: 5,
      title: "Parental",
      misstion: "Two number addition lesson",
      content: "Earn stars by completing 5 tasks.",
      rewardImage: theme.images.characterWithBird,
      reward: 15,
      rewardName: "Eagle",
      dateEnd: new Date("2025-06-01"),
      isSuccess: true,
    },
  ];

  const filteredTargets = allTargets.filter((item) =>
    selectedTab === "success" ? item.isSuccess : !item.isSuccess
  );

  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
    header: {
      width: "100%",
      height: "18%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 3,
      marginBottom: 20,
    },
    backContainer: {
      position: "absolute",
      left: 10,
      backgroundColor: theme.colors.backBackgound,
      marginLeft: 20,
      padding: 8,
      borderRadius: 50,
    },
    backIcon: { width: 24, height: 24 },
    title: {
      fontSize: 36,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      marginHorizontal: 20,
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      marginHorizontal: 5,
      borderRadius: 10,
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.green,
    },
    tabText: {
      fontFamily: Fonts.NUNITO_BOLD,
      fontSize: 14,
      color: theme.colors.black,
    },
    tabTextActive: {
      color: theme.colors.white,
    },
    targetCard: {
      marginHorizontal: 20,
      borderRadius: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 3,
      marginBottom: 15,
      paddingLeft: 10,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    cardTitle: {
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BOLD,
      fontSize: 14,
      marginBottom: 4,
    },
    cardMission: {
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 12,
    },
    cardReward: {
      color: theme.colors.black,
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 12,
    },
    rewardHighlight: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    cardDateEnd: {
      color: theme.colors.blueGray,
      fontSize: 8,
      fontFamily: Fonts.NUNITO_ITALIC,
      marginTop: 4,
      position: "absolute",
      top: 50,
      right: 0,
    },
    rewardImageWrapper: {
      width: 64,
      height: 80,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
      elevation: 5,
    },
    rewardImageContainer: {
      borderRadius: 50,
      backgroundColor: theme.colors.white,
      padding: 8,
      borderWidth: 1,
      borderColor: theme.colors.black,
    },
    rewardImage: {
      width: 40,
      height: 40,
    },
    boldText: {
      fontFamily: Fonts.NUNITO_BOLD,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={theme.icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Task</Text>
      </LinearGradient>
      <View style={styles.tabContainer}>
        {["target", "success"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "target" ? "Target" : "Success target"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredTargets}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              setExpandedId((prev) => (prev === item.id ? null : item.id))
            }
          >
            <LinearGradient
              colors={
                !item.isSuccess
                  ? item.title === "Parental"
                    ? theme.colors.gradientBluePrimary
                    : theme.colors.gradientGreen
                  : theme.colors.gradientGreen
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.targetCard}
            >
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMission}>
                    Mission:{" "}
                    <Text style={styles.boldText}>{item.misstion}</Text>
                  </Text>
                  <Text style={styles.cardReward}>
                    Reward:{" "}
                    <Text style={styles.rewardHighlight}>
                      {item.reward} {item.rewardName} reward
                    </Text>
                  </Text>
                  <Text style={styles.cardDateEnd}>
                    end: {new Date(item.dateEnd).toLocaleDateString("en-GB")}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rewardImageWrapper,
                    {
                      backgroundColor:
                        index % 2 === 0
                          ? theme.colors.yellowLight
                          : theme.colors.orangeLight,
                    },
                  ]}
                >
                  <View style={styles.rewardImageContainer}>
                    <Image
                      source={item.rewardImage}
                      style={styles.rewardImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
      <FloatingMenu />
    </LinearGradient>
  );
}

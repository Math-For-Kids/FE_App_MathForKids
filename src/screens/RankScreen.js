import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import FloatingMenu from "../components/FloatingMenu";

const AnimatedStar = ({ color }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name="star" size={14} color={color} />
    </Animated.View>
  );
};
export default function RankScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const users = [
    {
      id: 1,
      avatar: theme.images.avatarFemale,
      name: "Nguyen Thi Hong",
      point: 1250,
      time: 100,
    },
    {
      id: 2,
      avatar: theme.images.avatarMale,
      name: "Nguyen Van Hoai",
      point: 1240,
      time: 100,
    },
    {
      id: 3,
      avatar: theme.images.avatarMale,
      name: "Nguyen Van Hung",
      point: 1240,
      time: 90,
    },
    {
      id: 4,
      avatar: theme.images.avatarFemale,
      name: "Nguyen Thanh Thien",
      point: 1230,
      time: 90,
    },
  ];
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
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      color: theme.colors.white,
    },
    topContainer: { paddingHorizontal: 10 },
    top23: { flexDirection: "row", justifyContent: "space-between" },
    topUser: {
      alignItems: "center",
      width: "30%",
    },
    topName: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 12,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    topIcon: {
      width: 50,
      height: 50,
      backgroundColor: theme.colors.white,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.white,
      elevation: 5,
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 30,
      padding: 10,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.white,
      marginBottom: 20,
      elevation: 5,
    },
    leftContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    avatarContainer: {
      padding: 10,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.white,
      backgroundColor: theme.colors.white,
      elevation: 5,
      position: "relative",
    },
    star: {
      position: "absolute",
      top: -3,
      right: -6,
      backgroundColor: theme.colors.white,
      padding: 4,
      borderRadius: 50,
    },
    avatar: {
      width: 40,
      height: 40,
    },
    name: {
      width: "50%",
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    rightContainer: {
      alignItems: "flex-end",
    },
    point: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    time: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_REGULAR,
      color: theme.colors.white,
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
        <Text style={styles.title}>Ranking</Text>
      </LinearGradient>
      <View style={styles.topContainer}>
        <View style={styles.top23}>
          <View style={[styles.topUser, { marginTop: 20 }]}>
            <Image source={theme.icons.top2} style={styles.topIcon} />
            <Text style={styles.topName}>{users[1]?.name}</Text>
          </View>
          <View style={[styles.topUser, { marginTop: 0 }]}>
            <Image source={theme.icons.top1} style={styles.topIcon} />
            <Text style={styles.topName}>{users[0]?.name}</Text>
          </View>
          <View style={[styles.topUser, { marginTop: 20 }]}>
            <Image source={theme.icons.top3} style={styles.topIcon} />
            <Text style={styles.topName}>{users[2]?.name}</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity key={item.id}>
            <LinearGradient
              colors={
                index % 2 === 0
                  ? theme.colors.gradientBluePrimary
                  : theme.colors.gradientGreen
              }
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.userCard}
            >
              <View style={styles.leftContainer}>
                <View style={styles.avatarContainer}>
                  <Image source={item.avatar} style={styles.avatar} />
                  {(index === 0 || index === 1 || index === 2) && (
                    <View style={styles.star}>
                      <AnimatedStar
                        color={
                          index === 0
                            ? theme.colors.starColor
                            : index === 1
                            ? theme.colors.grayMedium
                            : theme.colors.brown
                        }
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.point}>{item.point}</Text>
                <Text style={styles.time}>{item.time} Hours</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
      <FloatingMenu />
    </LinearGradient>
  );
}

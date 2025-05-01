import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeContext";
import { Fonts } from "../../constants/Fonts";
import FloatingMenu from "../components/FloatingMenu";

export default function NotificationScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const [expandedId, setExpandedId] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Learn five lessons of addition",
      content:
        "You have completed the assigned task, the reward has been added to your inventory.",
      dateEnd: new Date("2025-05-20"),
      isRead: false,
    },
    {
      id: 2,
      title: "Learn five lessons of subtraction",
      content:
        "You have completed the assigned task, the reward has been added to your inventory.",
      dateEnd: new Date("2025-05-20"),
      isRead: false,
    },
    {
      id: 3,
      title: "Learn two lessons of addition",
      content:
        "You have completed the assigned task, the reward has been added to your inventory.",
      dateEnd: new Date("2025-05-20"),
      isRead: false,
    },
    {
      id: 4,
      title: "Learn one lessons of addition",
      content:
        "You have completed the assigned task, the reward has been added to your inventory.",
      dateEnd: new Date("2025-05-20"),
      isRead: false,
    },
  ]);

  const handlePress = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setExpandedId(expandedId === id ? null : id);
  };

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
      marginBottom: 40,
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
    notificationCard: {
      marginHorizontal: 30,
      padding: 5,
      backgroundColor: theme.colors.paleBeige,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.white,
      marginBottom: 20,
      elevation: 4,
    },
    notificationTitle: {
      fontSize: 16,
      padding: 10,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
    },
    notificationDateEnd: {
      position: "absolute",
      bottom: 0,
      right: 10,
      top: 30,
      fontSize: 8,
      fontFamily: Fonts.NUNITO_BLACK_ITALIC,
      color: theme.colors.blueGray,
    },
    notificationContentContainer: {
      marginTop: 10,
      alignItems: "center",
    },
    notificationContent: {
      fontSize: 14,
      fontFamily: Fonts.NUNITO_REGULAR,
      color: theme.colors.black,
    },
    notificationIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      borderRadius: 50,
      padding: 5,
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
        <Text style={styles.title}>Notification</Text>
      </LinearGradient>

      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={styles.notificationCard}
          onPress={() => handlePress(notification.id)}
        >
          {!notification.isRead && (
            <View style={styles.notificationIcon}>
              <Ionicons
                name="notifications-circle"
                size={14}
                color={isDarkMode ? theme.colors.white : theme.colors.green}
              />
            </View>
          )}

          <View>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationDateEnd}>
              {new Date(notification.dateEnd).toLocaleDateString("en-GB")}
            </Text>
          </View>
          {expandedId === notification.id && (
            <View style={styles.notificationContentContainer}>
              <Text style={styles.notificationContent}>
                {notification.content}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
      <FloatingMenu />
    </LinearGradient>
  );
}

import React, { useEffect, useState } from "react";
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
import {
  notificationsByUserId,
  updateNotification,
} from "../redux/userNotificationSlice";
import {
  notificationsByPupilId,
  updatePupilNotification,
} from "../redux/pupilNotificationSlice";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationScreen({ navigation, route }) {
  const { theme, isDarkMode } = useTheme();
  const { userId, pupilId } = route.params || {};
  console.log("userId", userId);
  const [expandedId, setExpandedId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const userNotifications = useSelector(
    (state) => state.notifications.list || []
  );
  const pupilNotifications = useSelector(
    (state) => state.pupilnotifications.list || []
  );
  const notificationsToDisplay = pupilId
    ? pupilNotifications
    : userNotifications;
  console.log("Notifications to display:", pupilNotifications);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      console.log("pupilId:", pupilId);
      if (pupilId) {
        dispatch(notificationsByPupilId(pupilId));
      } else if (userId) {
        dispatch(notificationsByUserId(userId));
      }
    }
  }, [isFocused, pupilId, userId]);

  const handlePress = async (id) => {
    const selected = notificationsToDisplay.find((n) => n.id === id);
    console.log("Pressed notification ID:", id);
    console.log("Selected notification:", selected);

    if (selected && !selected.isRead) {
      try {
        if (pupilId) {
          await dispatch(
            updatePupilNotification({ id, data: { ...selected, isRead: true } })
          ).unwrap();
          dispatch(notificationsByPupilId(pupilId));
        } else {
          await dispatch(
            updateNotification({ id, data: { ...selected, isRead: true } })
          ).unwrap();
          dispatch(notificationsByUserId(user.id));
        }
      } catch (err) {
        console.error("Failed to update notification:", err);
      }
    }
    setExpandedId((prev) => (prev === id ? null : id));
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
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.black,
    },
    notificationDateEnd: {
      position: "absolute",
      bottom: 0,
      right: 10,
      top: 30,
      fontSize: 8,
      fontFamily: Fonts.NUNITO_MEDIUM_ITALIC,
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

      <FlatList
        style={{ paddingTop: 10 }}
        data={notificationsToDisplay}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationCard}
            onPress={() => handlePress(item.id)}
          >
            {!item.isRead && (
              <View style={styles.notificationIcon}>
                <Ionicons
                  name="notifications-circle"
                  size={14}
                  color={isDarkMode ? theme.colors.white : theme.colors.green}
                />
              </View>
            )}

            <View>
              <Text style={styles.notificationTitle}>
                {item.title?.en || "No title"}
              </Text>
              <Text style={styles.notificationDateEnd}>
                {new Date(
                  item.dateEnd?.seconds * 1000 || item.dateEnd
                ).toLocaleDateString("en-GB")}
              </Text>
            </View>

            {expandedId === item.id && (
              <View style={styles.notificationContentContainer}>
                <Text style={styles.notificationContent}>
                  {item.content?.en || "No content"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
      <FloatingMenu />
    </LinearGradient>
  );
}

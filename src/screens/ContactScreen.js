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

export default function ContactScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const users = [
    {
      id: 1,
      avatar: theme.images.avatarFemale,
      name: "Nguyen Thi Hong",
      position: "Marketing Director",
      email: "hong123@gmail.com",
    },
    {
      id: 2,
      avatar: theme.images.avatarMale,
      name: "Nguyen Van Hoai",
      position: "System Manager",
      email: "hoai123@gmail.com",
    },
    {
      id: 3,
      avatar: theme.images.avatarMale,
      name: "Nguyen Van Hung",
      position: "Collaborator",
      email: "hung123@gmail.com",
    },
    {
      id: 4,
      avatar: theme.images.avatarFemale,
      name: "Nguyen Thanh Thien",
      position: "Admin",
      email: "thien123@gmail.com",
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
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },

    userCard: {
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
    },
    avatar: {
      width: 50,
      height: 50,
    },
    name: {
      width: "50%",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    rightContainer: {
      alignItems: "center",
    },
    position: {
      width: "50%",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    email: {
      width: "50%",
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
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
        <Text style={styles.title}>Contact</Text>
      </LinearGradient>
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
                </View>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.position}>{item.position}</Text>
                <Text style={styles.email}>{item.email} </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
      <FloatingMenu />
    </LinearGradient>
  );
}

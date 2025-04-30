import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeContext";
import { useSound } from "../audio/SoundContext";
import { Fonts } from "../../constants/Fonts";
export default function AccountScreen() {
  const { theme, isDarkMode } = useTheme();
  const users = [
    {
      id: 1,
      name: "Nguyen Thi Hong",
      avatar: theme.icons.avatarFemale,
    },
    {
      id: 2,
      name: "Nguyen Van Hung",
      avatar: theme.icons.avatarMale,
    },
  ];
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      width: "80%",
      height: "90%",
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 20,
      paddingVertical: 30,
      marginTop: 20,
      alignItems: "center",
      elevation: 8,
    },
    title: {
      fontSize: 28,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.blueDark,
    },
    subtitle: {
      marginBottom: 16,
      color: theme.colors.grayLight,
    },
    button: {
      width: "80%",
      paddingVertical: 10,
      borderRadius: 10,
      marginBottom: 20,
      elevation: 8,
    },
    buttonText: {
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_BLACK,
      fontSize: 18,
      textAlign: "center",
    },
    userCard: {
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.paleBeige,
      borderRadius: 12,
      padding: 10,
      marginBottom: 10,
      elevation: 4,
    },
    avatarContainer: {
      backgroundColor: theme.colors.white,
      padding: 10,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: theme.colors.white,
      marginRight: 10,
      elevation: 4,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 18,
    },
    userName: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.blueGray,
    },
    addButton: {
      marginTop: 20,
      backgroundColor: theme.colors.gradientBlue,
      width: 50,
      height: 50,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      //   elevation: 5,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Selected an account</Text>

        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Parent</Text>
        </LinearGradient>

        {users.map((user) => (
          <TouchableOpacity key={user.id} style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <Image source={user.avatar} style={styles.avatar} />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
          </TouchableOpacity>
        ))}
        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          style={styles.addButton}
        >
          <TouchableOpacity>
            <Ionicons name="person-add" size={36} color={theme.colors.white} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

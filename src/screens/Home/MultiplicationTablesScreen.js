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
import { Ionicons } from "@expo/vector-icons";

export default function MultiplicationTableScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName } = route.params;
  const tables = [
    {
      icon: theme.icons.multiplication2,
      label: "Multiplication table two",
      number: 2,
    },
    {
      icon: theme.icons.multiplication3,
      label: "Multiplication table three",
      number: 3,
    },
    {
      icon: theme.icons.multiplication4,
      label: "Multiplication table four",
      number: 4,
    },
    {
      icon: theme.icons.multiplication5,
      label: "Multiplication table five",
      number: 5,
    },
    {
      icon: theme.icons.multiplication6,
      label: "Multiplication table six",
      number: 6,
    },
    {
      icon: theme.icons.multiplication7,
      label: "Multiplication table seven",
      number: 7,
    },
    {
      icon: theme.icons.multiplication8,
      label: "Multiplication table eight",
      number: 8,
    },
    {
      icon: theme.icons.multiplication9,
      label: "Multiplication table nine",
      number: 9,
    },
  ];
  const getGradient = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: theme.colors.background,
    },
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
    backButton: {
      position: "absolute",
      left: 10,
      backgroundColor: theme.colors.backBackgound,
      marginLeft: 20,
      padding: 8,
      borderRadius: 50,
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    headerText: {
      fontSize: 22,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 20,
      marginBottom: 10,
    },
    volumeContainer: {
      borderColor: theme.colors.white,
      borderRadius: 50,
      padding: 10,
      borderWidth: 1,
      elevation: 3,
    },

    infoText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
      fontSize: 16,
    },
    tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    tableBox: {
      width: "40%",
      borderRadius: 15,
      marginVertical: 10,
      padding: 10,
      alignItems: "center",
      elevation: 4,
    },
    tableIconContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: "center",
      padding: 10,
      borderWidth: 1,
      elevation: 3,
    },
    tableIcon: {
      width: 80,
      height: 80,
      resizeMode: "contain",
    },
    tableLabel: {
      marginTop: 10,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Multiplication table</Text>
      </LinearGradient>
      <View style={styles.infoRow}>
        <TouchableOpacity>
          <LinearGradient colors={getGradient()} style={styles.volumeContainer}>
            <Ionicons
              name="volume-high"
              size={30}
              color={theme.colors.white}
              styles={styles.volumeIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.infoText}>Selected one multiplication table</Text>
      </View>
      <ScrollView contentContainerStyle={styles.tableContainer}>
        {tables.map((item, index) => (
          <LinearGradient colors={getGradient()} style={styles.tableBox}>
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate("MultiplicationTableDetailScreen", {
                  skillName,
                  table: item.number,
                  title: item.label,
                })
              }
            >
              <View style={styles.tableIconContainer}>
                <Image source={item.icon} style={styles.tableIcon} />
              </View>
              <Text style={styles.tableLabel}>{item.label}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
}

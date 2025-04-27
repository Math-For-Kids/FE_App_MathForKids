import React, { useEffect } from "react";
import { Text, Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Images } from "../../constants/Images";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("LoadingProgress");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={Colors.PRIMARY} style={styles.container}>
      <LinearGradient
        colors={["transparent", "#fff"]}
        style={styles.lightLayer}
      />
      <View style={styles.backgroundBox}>
        <View style={styles.logoContainer}>
          <Image
            source={Images.logoDark}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lightLayer: {
    position: "absolute",
    width: 250,
    height: 30,
    top: "60%", // nằm dưới backgroundBox
    borderRadius: 60,
    opacity: 0.6,
    zIndex: 1,
  },
  backgroundBox: {
    width: 250,
    height: 180,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#029DF0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  logoContainer: {
    width: 200,
    height: 220,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 180,
  },
});

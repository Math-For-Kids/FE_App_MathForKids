import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Images } from "../../constants/Images";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";

export default function LoginScreen({ navigation }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={Colors.PRIMARY} style={styles.container}>
        <View style={styles.card}>
          <Image
            source={Images.logoLight}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Log In</Text>

          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
            <LinearGradient
              colors={Colors.PRIMARY}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "85%",
    height: "90%",
    borderRadius: 20,
    padding: 30,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 150,
    height: 150,
    position: "absolute",
    top: -15,
  },

  title: {
    fontSize: 28,
    color: "#029DF0",
    fontFamily: Fonts.NUNITO_EXTRA_BOLD,
    marginBottom: 15,
    marginTop: 110,
  },
  inputWrapper: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputWrapperFocused: {
    borderColor: "#00BFFF",
    shadowColor: "#00BFFF",
    shadowOpacity: 0.3,
    elevation: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#029DF0",
    fontFamily: Fonts.NUNITO_REGULAR,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.NUNITO_BOLD,
  },
  footer: {
    flexDirection: "row",
  },
  footerText: {
    color: "#999",
    fontSize: 14,
    fontFamily: Fonts.NUNITO_REGULAR,
  },
  registerText: {
    color: "#0072FF",
    fontSize: 14,
    fontFamily: Fonts.NUNITO_BOLD,
    marginLeft: 5,
  },
});

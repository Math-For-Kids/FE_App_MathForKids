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
import Checkbox from "expo-checkbox";
import { Images } from "../../constants/Images";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";

export default function RegisterScreen({ navigation }) {
  const [gender, setGender] = useState("female");
  const [termsChecked, setTermsChecked] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={Colors.PRIMARY} style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>
          <LinearGradient colors={Colors.BLUE} style={styles.avatarWrapper}>
            <Image
              source={Images.addavatar}
              style={styles.avatar}
              resizeMode="contain"
            />
          </LinearGradient>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "fullName" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#999"
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "phone" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "address" && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              placeholderTextColor="#999"
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxItem}>
              <Checkbox
                value={gender === "female"}
                onValueChange={() => setGender("female")}
                color={gender === "female" ? "#00BFFF" : undefined}
              />
              <Text style={styles.checkboxLabel}>Female</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                value={gender === "male"}
                onValueChange={() => setGender("male")}
                color={gender === "male" ? "#00BFFF" : undefined}
              />
              <Text style={styles.checkboxLabel}>Male</Text>
            </View>
          </View>
          <View style={styles.termsWrapper}>
            <Checkbox
              value={termsChecked}
              onValueChange={setTermsChecked}
              color={termsChecked ? "#00BFFF" : undefined}
            />
            <Text style={styles.termsText}>
              <Text style={styles.agreeText}> I agree to the </Text>
              Terms and Privacy Policy
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
            <LinearGradient
              colors={Colors.PRIMARY}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.loginText}> Log in</Text>
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
  title: {
    position: "absolute",
    top: 10,
    fontSize: 28,
    color: "#029DF0",
    fontFamily: Fonts.NUNITO_EXTRA_BOLD,
  },
  avatarWrapper: {
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
  },

  inputWrapper: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputWrapperFocused: {
    borderColor: "#00BFFF",
    shadowColor: "#00BFFF",
    shadowOpacity: 0.5,
    elevation: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#029DF0",
    fontFamily: Fonts.NUNITO_REGULAR,
  },
  checkboxGroup: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 6,
    fontFamily: Fonts.NUNITO_REGULAR,
    fontSize: 14,
    color: "#333",
  },
  termsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  termsText: {
    marginLeft: 8,
    fontFamily: Fonts.NUNITO_REGULAR,
    fontSize: 13,
    color: "#999",
    flexShrink: 1,
  },
  agreeText: {
    color: "#00BFFF",
    fontFamily: Fonts.NUNITO_BOLD,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
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
  loginText: {
    color: "#0072FF",
    fontSize: 14,
    fontFamily: Fonts.NUNITO_BOLD,
  },
});

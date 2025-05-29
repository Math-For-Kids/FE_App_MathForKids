import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, profileById } from "../../redux/profileSlice";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePinScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [currentPin, setCurrentPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pinRefs = {
    current: [useRef(), useRef(), useRef(), useRef()],
    new: [useRef(), useRef(), useRef(), useRef()],
    confirm: [useRef(), useRef(), useRef(), useRef()],
  };

  const handleInput = (value, index, pin, setPin, refs) => {
    const newValues = [...pin];
    newValues[index] = value.replace(/[^0-9]/g, "");
    setPin(newValues);
    if (value && index < 3) refs[index + 1].current.focus();
  };

  const renderPinInputs = (pin, setPin, refs, show, setShow) => (
    <View style={styles.pinRowContainer}>
      <View style={styles.pinRow}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={refs[index]}
            style={styles.pinBox}
            value={digit}
            onChangeText={(val) => handleInput(val, index, pin, setPin, refs)}
            maxLength={1}
            keyboardType="number-pad"
            secureTextEntry={!show}
            textAlign="center"
            color={theme.colors.blueDark}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={styles.lockIconContainer}
      >
        <View style={styles.lockIcon}>
          <Ionicons
            name={show ? "lock-closed" : "lock-open"}
            size={20}
            color={theme.colors.blueDark}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleChangePin = async () => {
    const current = currentPin.join("");
    const newCode = newPin.join("");
    const confirm = confirmPin.join("");

    if (![current, newCode, confirm].every((code) => /^\d{4}$/.test(code))) {
      Alert.alert("Invalid PIN", "Each PIN must be exactly 4 digits.");
      return;
    }

    if (newCode !== confirm) {
      Alert.alert("Mismatch", "New PIN and confirmation do not match.");
      return;
    }

    try {
      await dispatch(
        updateProfile({ id: user.id, data: { pin: newCode } })
      ).unwrap();
      dispatch(profileById(user.id));
      Alert.alert("Success", "PIN updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update PIN.");
    }
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
      marginBottom: 30,
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
      fontSize: 30,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      color: theme.colors.white,
    },
    section: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
    label: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      marginBottom: 10,
      fontSize: 16,
    },
    hint: {
      fontSize: 12,
      fontFamily: Fonts.NUNITO_ITALIC,
      color: theme.colors.graySoft,
      marginBottom: 5,
    },

    pinRowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    pinRow: {
      flexDirection: "row",
      gap: 10,
    },
    pinBox: {
      borderWidth: 1,
      borderColor: theme.colors.graySoft,
      borderRadius: 10,
      padding: 10,
      fontSize: 20,
      width: 50,
      height: 50,
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
    },
    lockIconContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 50,
      padding: 10,
      marginLeft: 30,
      elevation: 3,
    },
    confirmButton: {
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    confirmText: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      fontSize: 16,
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
        <Text style={styles.title}>Change PIN</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.label, { marginTop: 10 }]}>Current PIN</Text>
        <Text style={styles.hint}>
          Enter your existing 4-digit PIN to confirm your identity.
        </Text>
        {renderPinInputs(
          currentPin,
          setCurrentPin,
          pinRefs.current,
          showCurrent,
          setShowCurrent
        )}

        <Text style={styles.label}>New PIN</Text>
        <Text style={styles.hint}>
          Set a new 4-digit PIN. Don’t share it with anyone.
        </Text>
        {renderPinInputs(newPin, setNewPin, pinRefs.new, showNew, setShowNew)}

        <Text style={styles.label}>Confirm New PIN</Text>
        <Text style={styles.hint}>Re-enter the new PIN to confirm.</Text>
        {renderPinInputs(
          confirmPin,
          setConfirmPin,
          pinRefs.confirm,
          showConfirm,
          setShowConfirm
        )}
      </View>

      <TouchableOpacity onPress={handleChangePin}>
        <LinearGradient
          colors={theme.colors.gradientBlue}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmText}>Update</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, profileById } from "../../redux/profileSlice";

export default function ChangePhoneScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.info);

  const [newPhone, setNewPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pinModalVisible, setPinModalVisible] = useState(false);

  const validatePhone = (phone) => /^\d{10,11}$/.test(phone);

  const handleConfirmPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      Alert.alert("Invalid PIN", "PIN must be exactly 4 digits.");
      return;
    }

    try {
      await dispatch(
        updateProfile({ id: user.id, data: { phoneNumber: newPhone } })
      ).unwrap();
      dispatch(profileById(user.id));
      Alert.alert("Success", "Phone number updated successfully!");
      setPinModalVisible(false);
      setPin("");
      navigation.navigate("DetailScreen");
    } catch (error) {
      Alert.alert("Error", "Failed to update phone number.");
    }
  };

  const handleOpenPinModal = () => {
    if (!validatePhone(newPhone)) {
      Alert.alert("Invalid Phone Number", "Enter a valid phone number.");
      return;
    }
    setPinModalVisible(true);
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
      fontSize: 30,
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      color: theme.colors.white,
    },
    formContainer: {
      paddingHorizontal: 20,
    },
    iconImage: {
      width: 100,
      height: 100,
      alignSelf: "center",
      marginBottom: 20,
    },
    currentPhoneText: {
      fontFamily: Fonts.NUNITO_BOLD_ITALIC,
      color: theme.colors.white,
      textAlign: "center",
      marginBottom: 10,
    },
    descriptionText: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      fontSize: 14,
      marginBottom: 20,
      textAlign: "center",
    },
    label: {
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      marginBottom: 10,
      fontSize: 16,
    },
    input: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 10,
      padding: 12,
      fontFamily: Fonts.NUNITO_REGULAR,
      marginBottom: 20,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    pinModalContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 40,
      marginHorizontal: 40,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.black,
      marginBottom: 20,
    },
    pinRow: {
      flexDirection: "row",
      gap: 10,
      width: "80%",
      marginBottom: 20,
    },
    pinBox: {
      borderWidth: 1,
      borderColor: theme.colors.graySoft,
      borderRadius: 8,
      padding: 10,
      fontSize: 20,
      textAlign: "center",
      width: 50,
      height: 50,
      backgroundColor: theme.colors.cardBackground,
      elevation: 5,
    },
    modalButtonRow: {
      flexDirection: "row",
      gap: 40,
      width: "100%",
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.red,
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    verifyButton: {
      flex: 1,
      backgroundColor: theme.colors.green,
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      fontFamily: Fonts.NUNITO_BOLD,
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
          onPress={() => navigation.navigate("PrivacyScreen")}
        >
          <Image
            source={theme.icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Change Phone</Text>
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          <Image
            source={theme.icons.changephone}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.currentPhoneText}>
            Current phone: {profile?.phoneNumber}
          </Text>
          <Text style={styles.descriptionText}>
            Enter your new phone number. You will need to confirm it with your
            4-digit PIN.
          </Text>
          <Text style={styles.label}>New Phone Number</Text>
          <TextInput
            style={styles.input}
            value={newPhone}
            onChangeText={setNewPhone}
            keyboardType="phone-pad"
            placeholder="e.g. 0901234567"
            placeholderTextColor={theme.colors.grayMedium}
            color={theme.colors.blueDark}
          />
        </View>
      </View>

      <Modal visible={pinModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pinModalContainer}>
            <Text style={styles.modalTitle}>Enter 4-digit PIN</Text>
            <View style={styles.pinRow}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  value={pin[index] || ""}
                  onChangeText={(val) => {
                    const newPin = pin.split("");
                    newPin[index] = val;
                    setPin(newPin.join(""));
                  }}
                  maxLength={1}
                  keyboardType="number-pad"
                  style={styles.pinBox}
                />
              ))}
            </View>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setPin("");
                  setPinModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleConfirmPin}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleOpenPinModal}>
        <LinearGradient
          colors={theme.colors.gradientBlue}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

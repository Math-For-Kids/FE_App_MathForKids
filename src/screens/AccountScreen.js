import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllPupils, pupilById } from "../redux/pupilSlice";
import { getUserById, setPupilId } from "../redux/authSlice";
import { useIsFocused } from "@react-navigation/native";
import { useSound } from "../audio/SoundContext";
import { useTranslation } from "react-i18next";
import { applySettings } from "../components/applySettings";
import { Fonts } from "../../constants/Fonts";

export default function AccountScreen({ navigation }) {
  const { theme, switchThemeKey, toggleThemeMode, isDarkMode } = useTheme();
  const { setVolume } = useSound();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [modalVisible, setModalVisible] = useState(false);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  const user = useSelector((state) => state.auth.user);
  const pupils = useSelector((state) => state.pupil.pupils || []);
  const userId = user?.id;
  const filteredPupils = pupils.filter(
    (pupil) => String(pupil.userId) === String(userId)
  );

  useEffect(() => {
    if (isFocused) {
      dispatch(getAllPupils());
    }
  }, [isFocused]);

  const handleApplySettings = (profile) => {
    applySettings({
      ...profile,
      switchThemeKey,
      toggleThemeMode,
      isDarkMode,
      setVolume,
      i18n,
    });
  };

  const handlePupilSelect = async (pupil) => {
    Alert.alert(
      "Confirm",
      `Do you want to play as pupil "${pupil.fullName}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const res = await dispatch(pupilById(pupil.id)).unwrap();
              handleApplySettings(res);
              dispatch(setPupilId(pupil.id));
              navigation.navigate("HomeScreen", { pupilId: pupil.id });
            } catch (err) {
              Alert.alert("Error", "Failed to load pupil settings.");
            }
          },
        },
      ]
    );
  };

  const handleParentSelect = () => {
    setPin(["", "", "", ""]);
    setModalVisible(true);
  };

  const handleVerifyPin = async () => {
    const enteredPin = pin.join("");
    if (enteredPin.length < 4) {
      return Alert.alert("Invalid PIN", "Please enter all 4 digits.");
    }

    setLoading(true);
    try {
      const res = await dispatch(getUserById(userId)).unwrap();
      if (enteredPin === res.pin) {
        handleApplySettings(res);
        setModalVisible(false);
        setTimeout(() => {
          navigation.navigate(
            res.role === "user" ? "StatisticScreen" : "HomeScreen",
            { userId }
          );
        }, 300);
      } else {
        Alert.alert("Incorrect PIN", "The PIN you entered is incorrect.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to verify PIN.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
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
      fontFamily: Fonts.NUNITO_EXTRA_BOLD,
      color: theme.colors.blueDark,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 8,
      color: theme.colors.grayLight,
    },
    button: {
      width: "80%",
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.white,
      borderRadius: 10,
      marginBottom: 20,
      elevation: 8,
    },
    buttonText: {
      color: theme.colors.white,
      fontFamily: Fonts.NUNITO_MEDIUM,
      fontSize: 18,
      textAlign: "center",
    },
    userCard: {
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: theme.colors.paleBeige,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.white,
      padding: 5,
      marginBottom: 20,
      elevation: 4,
    },
    avatarContainer: {
      backgroundColor: theme.colors.avatartBackground,
      padding: 5,
      borderRadius: 50,
      borderWidth: 1,
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
      fontFamily: Fonts.NUNITO_MEDIUM,
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
      borderWidth: 1,
      borderColor: theme.colors.white,
      elevation: 3,
    },
    ForgotText: {
      position: "absolute",
      top: -105,
      right: 0,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_LIGHT_ITALIC,
      color: theme.colors.blueDark,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.blueDark,
    },
    loading: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      elevation: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.overlay,
    },
    modal: {
      backgroundColor: theme.colors.cardBackground,
      padding: 20,
      borderRadius: 10,
      width: "80%",
    },
    textModal: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
      marginBottom: 10,
    },
    inputModalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    inputModal: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.graySoft,
      textAlign: "center",
      fontSize: 24,
      borderRadius: 8,
    },
    buttonModalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    buttonConfirm: {
      backgroundColor: theme.colors.green,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonCancel: {
      backgroundColor: theme.colors.red,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Select an account</Text>

        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={handleParentSelect}>
            <Text style={styles.buttonText}>Parent</Text>
          </TouchableOpacity>
        </LinearGradient>

        {filteredPupils.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            onPress={() => handlePupilSelect(user)}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user.gender === "female"
                    ? theme.icons.avatarFemale
                    : theme.icons.avatarMale
                }
                style={styles.avatar}
              />
            </View>
            <Text style={styles.userName}>{user.fullName}</Text>
          </TouchableOpacity>
        ))}

        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.addButton}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("CreatePupilAccountScreen")}
          >
            <Ionicons name="person-add" size={36} color={theme.colors.white} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.white} />
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.textModal}>Enter PIN to continue</Text>
            <View style={styles.inputModalContainer}>
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.inputModal}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry
                  value={digit}
                  ref={pinRefs[index]}
                  onChangeText={(val) => {
                    const newPin = [...pin];
                    newPin[index] = val;
                    setPin(newPin);
                    if (val && index < 3) pinRefs[index + 1].current.focus();
                  }}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPinScreen")}
            >
              <Text style={styles.ForgotText}>Forgot pin</Text>
            </TouchableOpacity>
            <View style={styles.buttonModalContainer}>
              <TouchableOpacity
                onPress={handleVerifyPin}
                style={styles.buttonConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

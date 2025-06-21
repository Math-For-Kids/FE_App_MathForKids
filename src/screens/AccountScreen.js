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
import { getUserById, setPupilId, clearPupilId } from "../redux/authSlice";
import { useIsFocused } from "@react-navigation/native";
import { useSound } from "../audio/SoundContext";
import { useTranslation } from "react-i18next";
import { applySettings } from "../components/applySettings";
import { Fonts } from "../../constants/Fonts";
import { ScrollView } from "react-native";

export default function AccountScreen({ navigation }) {
  const { theme, switchThemeKey, toggleThemeMode, isDarkMode } = useTheme();
  const { setVolume } = useSound();
  const { t, i18n } = useTranslation("account");
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [modalVisible, setModalVisible] = useState(false);
  const [redirectToCreatePupil, setRedirectToCreatePupil] = useState(false);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  const user = useSelector((state) => state.auth.user);
  console.log("user", user);
  // const pupils = useSelector((state) => state.pupil.pupils || []);
  const pupils = useSelector((state) => state.pupil.pupils);

  const userId = user?.id;
  const filteredPupils = pupils.filter(
    (p) => String(p.userId) === String(userId)
  );
  console.log("filteredPupils", filteredPupils);
  useEffect(() => {
    if (isFocused && userId) {
      dispatch(getAllPupils())
        .unwrap()
        .catch((err) => {
          const msg =
            typeof err === "object"
              ? err[i18n.language] ?? err.en
              : err.toString();
          Alert.alert(t("errorTitle"), msg);
        });
      dispatch(getUserById(userId))
        .unwrap()
        .catch((err) => {
          const msg =
            typeof err === "object"
              ? err[i18n.language] ?? err.en
              : err.toString();
          Alert.alert(t("errorTitle"), msg);
        });
    }
  }, [isFocused, userId, dispatch]);

  const handleApplySettings = (profile) => {
    applySettings({
      ...profile,
      switchThemeKey,
      toggleThemeMode,
      isDarkMode,
      setVolume,
      i18n,
      dispatch,
    });
  };

  const handlePupilSelect = (pupil) => {
    Alert.alert(
      t("confirmTitle"),
      t("confirmPupil", { name: pupil.fullName }),
      [
        { text: t("no"), style: "cancel" },
        {
          text: t("yes"),
          onPress: async () => {
            setLoading(true);
            dispatch(pupilById(pupil.id))
              .unwrap()
              .then((res) => {
                handleApplySettings(res);
                dispatch(setPupilId(pupil.id));
                setLoading(false);
                navigation.navigate(
                  res.isAssess ? "HomeScreen" : "TestLevelScreen",
                  { pupilId: pupil.id }
                );
              })
              .catch((err) => {
                setLoading(false);
                const msg =
                  typeof err === "object"
                    ? err[i18n.language] ?? err.en
                    : err.toString();
                Alert.alert(t("errorTitle"), msg);
              });
          },
        },
      ]
    );
  };

  const handleParentSelect = () => {
    setPin(["", "", "", ""]);
    dispatch(clearPupilId());
    setModalVisible(true);
  };
  const handleAddPupil = () => {
    setPin(["", "", "", ""]);
    setRedirectToCreatePupil(true);
    setModalVisible(true);
  };

  const handleVerifyPin = () => {
    const entered = pin.join("");
    if (entered.length < 4) {
      return Alert.alert(t("invalidPinTitle"), t("invalidPinMsg"));
    }
    if (entered === String(user?.pin)) {
      handleApplySettings(user);
      setModalVisible(false);
      setTimeout(() => {
        if (redirectToCreatePupil) {
          navigation.navigate("CreatePupilAccountScreen");
        } else {
          navigation.navigate(
            user.role === "user" ? "StatisticScreen" : "HomeScreen",
            { userId }
          );
        }
        setRedirectToCreatePupil(false);
      }, 300);
    } else {
      Alert.alert(t("incorrectPinTitle"), t("incorrectPinMsg"));
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
    parentCardContainer: {
      width: "90%",
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.white,
      borderRadius: 10,
      marginBottom: 20,
      elevation: 3,
    },
    userCardContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      paddingHorizontal: 10,
      paddingBottom: 80,
    },
    userCard: {
      width: "45%",
      aspectRatio: 1,
      backgroundColor: theme.colors.beigeLight,
      borderWidth: 1,
      borderColor: theme.colors.white,
      borderRadius: 12,
      marginBottom: 15,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    avatarContainer: {
      marginVertical: 10,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.white,
      backgroundColor: theme.colors.avatartBackground,
      elevation: 3,
    },
    avatar: {
      width: 80,
      height: 80,
      resizeMode: "cover",
      borderRadius: 50,
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.grayDark,
      textAlign: "center",
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
        <Text style={styles.title}>{t("title")}</Text>
        <Text style={styles.subtitle}>{t("subtitle")}</Text>

        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.parentCardContainer}
        >
          <TouchableOpacity onPress={handleParentSelect}>
            <Text style={styles.buttonText}>{t("parent")}</Text>
          </TouchableOpacity>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.userCardContainer}>
          {filteredPupils.map((pupil) => (
            <TouchableOpacity
              key={pupil.id}
              style={styles.userCard}
              onPress={() => handlePupilSelect(pupil)}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    pupil?.image
                      ? { uri: pupil?.image }
                      : pupil?.gender === "female"
                      ? theme.icons.avatarFemale
                      : theme.icons.avatarMale
                  }
                  style={styles.avatar}
                />
              </View>
              <Text
                style={styles.userName}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {pupil.fullName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <LinearGradient
          colors={theme.colors.gradientBluePrimary}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.addButton}
        >
          <TouchableOpacity onPress={handleAddPupil}>
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
            <Text style={styles.textModal}>{t("enterPin")}</Text>
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
                    if (val && index < 3) {
                      pinRefs[index + 1].current.focus();
                    }
                    if (!val && index > 0) {
                      pinRefs[index - 1].current.focus();
                    }
                  }}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPinScreen")}
            >
              <Text style={styles.ForgotText}>{t("forgotPin")}</Text>
            </TouchableOpacity>
            <View style={styles.buttonModalContainer}>
              <TouchableOpacity
                onPress={handleVerifyPin}
                style={styles.buttonConfirm}
              >
                <Text style={styles.buttonText}>{t("confirm")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setRedirectToCreatePupil(false);
                }}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

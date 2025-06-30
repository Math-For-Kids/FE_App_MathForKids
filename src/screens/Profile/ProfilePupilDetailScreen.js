import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import DateTimePicker from "@react-native-community/datetimepicker";
import FloatingMenu from "../../components/FloatingMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  pupilById,
  updatePupilProfile,
  uploadPupilAvatar,
} from "../../redux/profileSlice";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function ProfilePupilScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { t } = useTranslation("profile");
  const { t: c } = useTranslation("common");
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [refreshProfile, setRefreshProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);

  const pupilId = useSelector((state) => state.auth.user?.pupilId);
  // console.log("pupilIdeeeeee", pupilId);
  const pupil = useSelector((state) => state.profile.info);

  useEffect(() => {
    if (pupilId) {
      dispatch(pupilById(pupilId));
    }
  }, [pupilId]);

  useEffect(() => {
    if (isFocused && pupilId) {
      dispatch(pupilById(pupilId));
    }
  }, [isFocused, pupilId, refreshProfile]);

  useEffect(() => {
    const dobSeconds = pupil?.dateOfBirth?.seconds;
    const dobDate = dobSeconds ? new Date(dobSeconds * 1000) : null;
    const formattedBirthday = dobDate ? dobDate.toISOString() : "";
    setEditedProfile({
      fullName: pupil.fullName || "none",
      nickName: pupil.nickName || "none",
      Grade: pupil.grade || "none",
      dateOfBirth: formattedBirthday,
      gender: pupil.gender || "none",
      grade: pupil.grade || "none",
    });
  }, [pupil]);
  const formatDateString = (isoStr) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return isNaN(date) ? "" : date.toLocaleDateString("vi-VN");
  };

  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setNewAvatar(uri);

      try {
        await dispatch(uploadPupilAvatar({ id: pupilId, uri })).unwrap();
        dispatch(pupilById(pupilId));
        Alert.alert(c("success"), t("avatarUpdated"));
      } catch (error) {
        Alert.alert(c("error"), error.message || error);
      }
    }
  };
  const handlePickerDate = (fieldName) => {
    setCurrentDateField(fieldName);
    setShowDatePicker(true);
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && currentDateField) {
      const selectedYear = selectedDate.getFullYear();
      const currentYear = new Date().getFullYear();

      const age = currentYear - selectedYear;

      // 1. Kiểm tra nhỏ hơn 8 tuổi
      if (age < 8) {
        Alert.alert("Lỗi", "Năm sinh phải nhỏ hơn năm hiện tại ít nhất 8 năm.");
        return;
      }

      // 2. Kiểm tra lớn hơn 100 tuổi
      if (age > 100) {
        Alert.alert("Lỗi", "Tuổi không được vượt quá 100.");
        return;
      }
      handleChange(currentDateField, selectedDate.toISOString());
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updatePupilProfile({ id: pupilId, data: editedProfile })
      ).unwrap();
      setRefreshProfile((prev) => !prev);
      Alert.alert(c("success"), t("updateSuccess"));
      setModalVisible(false);
    } catch (error) {
      Alert.alert(c("error"), t("updateFailed"));
    }
  };

  const userFields = [
    { label: t("profile:fullName"), fieldName: "fullName", type: "text" },
    { label: t("profile:birthday"), fieldName: "dateOfBirth", type: "date" },
    {
      label: t("profile:gender"),
      fieldName: "gender",
      type: "dropdown",
      options: [t("common:male"), t("common:female")],
    },
    {
      label: t("profile:grade"),
      fieldName: "grade",
      type: "dropdown",
      options: ["1", "2", "3"],
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
      marginBottom: 10,
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
    scrollViewContainer: {
      alignItems: "center",
    },
    imageWrapper: {
      alignItems: "center",
      marginBottom: 10,
    },
    avatarContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.white,
      borderWidth: 1,
      borderRadius: 50,
      elevation: 3,
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 50,
    },
    fieldWrapper: {
      width: "80%",
      marginBottom: 15,
    },
    fieldLabel: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      fontSize: 18,
      marginBottom: 5,
    },
    fieldBox: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.paleBeige,
      elevation: 3,
    },
    fieldText: {
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueGray,
      fontSize: 16,
    },
    editButton: {
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    modalContainer: {
      marginHorizontal: 30,
      padding: 20,
      borderRadius: 20,
      maxHeight: "98%",
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
    },
    fieldInputWrapper: {
      marginBottom: 15,
    },
    fieldLabelModal: {
      marginBottom: 5,
    },
    dropdownMenu: {
      marginTop: 5,
      borderRadius: 8,
      elevation: 5,
      backgroundColor: theme.colors.inputBoxModal,
    },
    modalButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
    },
    inputGroup: {
      marginBottom: 15,
    },
    inputLabel: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueGray,
      marginBottom: 5,
    },
    editChangeButtonContainer: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.blueGray,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      left: 0,
    },

    editChangeTextButton: {
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.white,
      fontSize: 14,
    },

    dropdownButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.inputBoxModal,
      elevation: 3,
    },
    dropdownButtonText: {
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueGray,
    },
    dropdownItem: {
      padding: 10,
      borderBottomColor: theme.colors.grayMedium,
      borderBottomWidth: 1,
    },
    dropdownItemText: {
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.grayDark,
    },
    inputBox: {
      borderRadius: 10,
      backgroundColor: theme.colors.inputBoxModal,
      elevation: 3,
      overflow: "hidden",
      width: "100%",
    },
    inputTextBox: {
      padding: 10,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_MEDIUM,
      color: theme.colors.blueGray,
    },
    modalButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    saveButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.green,
      elevation: 3,
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.red,
      elevation: 3,
    },
    buttonText: { fontFamily: Fonts.NUNITO_MEDIUM, color: theme.colors.white },
    carModalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    carModal: {
      backgroundColor: theme.colors.cardBackground,
      padding: 20,
      borderRadius: 20,
      width: "80%",
      height: "95%",
    },
    textModal: {
      color: theme.colors.blueGray,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_MEDIUM,
      textAlign: "center",
    },
    avatarWrapperModel: {
      marginVertical: 10,
      borderWidth: 2,
      borderColor: theme.colors.white,
      borderRadius: 50,
      backgroundColor: theme.colors.cardBackground,
      elevation: 5,
      alignSelf: "center",
    },
    avatar: { width: 70, height: 70, borderRadius: 40 },
    iconCamera: {
      position: "absolute",
      top: 50,
      left: 120,
      elevation: 5,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      {/* Header */}
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
        <Text style={styles.title}>{t("profile:title")}</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageWrapper}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                pupil.image ? { uri: pupil.image } : theme.icons.avatarFemale
              }
              style={styles.avatarImage}
            />
          </View>
        </View>

        {userFields.map((field, idx) => (
          <View key={idx} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldText}>
                {field.type === "date"
                  ? formatDateString(editedProfile[field.fieldName])
                  : editedProfile[field.fieldName]}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {showDatePicker && (
        <DateTimePicker
          value={
            editedProfile.dateOfBirth
              ? new Date(editedProfile.dateOfBirth)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={handleDateChange}
        />
      )}
      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.carModalContainer}>
                <View style={styles.carModal}>
                  <Text style={styles.textModal}>
                    {t("profile:editProfile")}
                  </Text>
                  <View style={styles.avatarWrapperModel}>
                    <TouchableOpacity onPress={handlePickImage}>
                      <Image
                        source={
                          newAvatar
                            ? { uri: newAvatar }
                            : pupil?.image
                            ? { uri: pupil?.image }
                            : theme.icons.avatarFemale
                        }
                        style={styles.avatar}
                      />
                    </TouchableOpacity>
                  </View>
                  <Ionicons
                    name="camera-reverse-sharp"
                    size={28}
                    color={theme.colors.blueGray}
                    style={styles.iconCamera}
                  />
                </View>
              </View>
              {userFields.map((field, index) => (
                <View key={index} style={styles.inputGroup}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <Text style={styles.inputLabel}>{field.label}</Text>
                  </View>

                  {field.type === "dropdown" ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentField(field.fieldName);
                          setMenuVisible(true);
                        }}
                        style={styles.dropdownButton}
                      >
                        <Text style={styles.dropdownButtonText}>
                          {editedProfile[field.fieldName] ||
                            t("common:selectOption")}
                        </Text>
                      </TouchableOpacity>
                      {menuVisible && currentField === field.fieldName && (
                        <View style={styles.dropdownMenu}>
                          {field.options.map((opt, i) => (
                            <TouchableOpacity
                              key={i}
                              onPress={() => {
                                handleChange(field.fieldName, opt);
                                setMenuVisible(false);
                              }}
                              style={styles.dropdownItem}
                            >
                              <Text style={styles.dropdownItemText}>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </>
                  ) : field.type === "date" ? (
                    <TouchableOpacity
                      onPress={() => handlePickerDate(field.fieldName)}
                      style={[styles.inputBox, { justifyContent: "center" }]}
                    >
                      <Text style={styles.inputTextBox}>
                        {editedProfile[field.fieldName]
                          ? formatDateString(editedProfile[field.fieldName])
                          : t("common:selectDate")}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[
                        styles.inputBox,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                        ["phoneNumber", "email", "pin"].includes(
                          field.fieldName
                        ) && {
                          backgroundColor: theme.colors.grayMedium,
                        },
                      ]}
                    >
                      <TextInput
                        value={editedProfile[field.fieldName]}
                        onChangeText={(text) =>
                          handleChange(field.fieldName, text)
                        }
                        editable={
                          !["phoneNumber", "email", "pin"].includes(
                            field.fieldName
                          )
                        }
                        style={[
                          styles.inputTextBox,
                          { flex: 1 },
                          ["phoneNumber", "email", "pin"].includes(
                            field.fieldName
                          ) && {
                            color: theme.colors.graySoft,
                          },
                        ]}
                        placeholder={t("profile:placeholder", {
                          field: field.label.toLowerCase(),
                        })}
                        placeholderTextColor={theme.colors.grayMedium}
                      />

                      {["phoneNumber", "email", "pin"].includes(
                        field.fieldName
                      ) && (
                        <TouchableOpacity
                          onPress={() => {
                            if (field.fieldName === "phoneNumber") {
                              navigation.navigate("ChangePhoneScreen");
                            } else if (field.fieldName === "email") {
                              navigation.navigate("ChangeEmailScreen");
                            } else if (field.fieldName === "pin") {
                              navigation.navigate("ChangePinScreen");
                            }
                          }}
                          style={styles.editChangeButtonContainer}
                        >
                          <Text style={styles.editChangeTextButton}>
                            {t("common:edit")}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>{t("common:save")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>{t("common:cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={theme.colors.gradientBlue}
          style={styles.editButton}
        >
          <Text style={styles.fieldLabel}>{t("common:edit")}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <FloatingMenu />
    </LinearGradient>
  );
}

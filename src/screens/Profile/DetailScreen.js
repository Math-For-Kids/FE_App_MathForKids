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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import FloatingMenu from "../../components/FloatingMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  profileById,
  updateProfile,
  uploadAvatar,
} from "../../redux/profileSlice";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import FullScreenLoading from "../../components/FullScreenLoading";
import MessageError from "../../components/MessageError";
import MessageSuccess from "../../components/MessageSuccess";
export default function DetailScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { t } = useTranslation("profile");
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorContent, setErrorContent] = useState({
    title: "",
    description: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successContent, setSuccessContent] = useState({
    title: "",
    description: "",
  });
  const users = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile?.info || {});
  const loading =
    useSelector((state) => state.auth.loading) ||
    useSelector((state) => state.profile.loading);

  useEffect(() => {
    if (isFocused) {
      dispatch(profileById(users.id));
    }
  }, [isFocused, users?.id]);

  useEffect(() => {
    const dobSeconds = profile?.dateOfBirth?.seconds || 0;
    const formattedDate =
      dobSeconds && dobSeconds > 0
        ? new Date(dobSeconds * 1000).toLocaleDateString("vi-VN")
        : "";

    setEditedProfile({
      fullName: profile.fullName || "none",
      phoneNumber: profile.phoneNumber || "none",
      email: profile.email || "none",
      pin: profile.pin || "none",
      dateOfBirth: formattedDate,
      gender: profile.gender || "none",
      address: profile.address || "none",
    });
  }, [profile]);

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
        await dispatch(uploadAvatar({ id: users.id, uri })).unwrap();
        dispatch(profileById(users.id));
        setSuccessContent({
          title: t("successTitle"),
          description: t("avatarUpdated"),
        });
        setShowSuccess(true);
      } catch (error) {
        setErrorContent({
          title: t("errorTitle"),
          description: t("uploadFailed"),
        });
        setShowError(true);
      }
    }
  };

  const handleSave = async () => {
    const newErrors = {};

    for (const [key, value] of Object.entries(editedProfile)) {
      if (!value || value === "none") {
        newErrors[key] = t("fieldRequired");
      }
    }

    const age =
      new Date().getFullYear() -
      new Date(editedProfile.dateOfBirth).getFullYear();

    if (editedProfile.dateOfBirth && (age < 18 || age > 100)) {
      newErrors.dateOfBirth = t("ageRangeInvalid");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await dispatch(
        updateProfile({ id: users.id, data: editedProfile })
      ).unwrap();
      dispatch(profileById(users.id));
      setSuccessContent({
        title: t("successTitle"),
        description: t("profileUpdated"),
      });
      setShowSuccess(true);
      setModalVisible(false);
    } catch (error) {
      setErrorContent({
        title: t("errorTitle"),
        description: t("updateProfileFailed"),
      });
      setShowError(true);
    }
  };

  const userFields = [
    { label: t("fullName"), fieldName: "fullName", type: "text" },
    // { label: "Phone number", fieldName: "phoneNumber", type: "text" },
    // { label: "Email", fieldName: "email", type: "text" },
    // { label: "Pin", fieldName: "pin", type: "text" },
    { label: t("birthday"), fieldName: "dateOfBirth", type: "text" },
    {
      label: t("gender"),
      fieldName: "gender",
      type: "dropdown",
      options: [t("male"), t("female")],
    },
    { label: t("address"), fieldName: "address", type: "text" },
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
      fontSize: 28,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      width: "50%",
      textAlign: "center",
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
        <Text style={styles.title}>{t("title")}</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageWrapper}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profile?.image
                  ? { uri: profile?.image }
                  : theme.icons.avatarFemale
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
                {editedProfile[field.fieldName]}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.carModalContainer}>
                <View style={styles.carModal}>
                  <Text style={styles.textModal}>Edit Profile</Text>
                  <View style={styles.avatarWrapperModel}>
                    <TouchableOpacity onPress={handlePickImage}>
                      <Image
                        source={
                          newAvatar
                            ? { uri: newAvatar }
                            : profile?.image
                            ? { uri: profile?.image }
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
                          {editedProfile[field.fieldName] || "Select option..."}
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
                  ) : (
                    <View style={{ marginBottom: 12 }}>
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
                        {field.fieldName === "dateOfBirth" ? (
                          <>
                            <TouchableOpacity
                              onPress={() => setShowDatePicker(true)}
                              style={styles.inputBox}
                            >
                              <Text
                                style={[
                                  styles.inputTextBox,
                                  {
                                    textAlign: "center",
                                    width: "100%",
                                  },
                                ]}
                              >
                                {editedProfile.dateOfBirth || "Select date"}
                              </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                              <DateTimePicker
                                value={
                                  editedProfile.dateOfBirth
                                    ? new Date(editedProfile.dateOfBirth)
                                    : new Date()
                                }
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                  setShowDatePicker(false);
                                  if (selectedDate) {
                                    const isoDate = selectedDate
                                      .toISOString()
                                      .split("T")[0];
                                    handleChange("dateOfBirth", isoDate);
                                  }
                                }}
                              />
                            )}
                          </>
                        ) : (
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
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            placeholderTextColor={theme.colors.grayMedium}
                          />
                        )}

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
                              Edit
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {errors[field.fieldName] && (
                        <Text
                          style={{ color: "red", fontSize: 12, marginTop: 4 }}
                        >
                          {errors[field.fieldName]}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>{t("save")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>{t("cancel")}</Text>
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
          <Text style={styles.fieldLabel}>{t("edit")}</Text>
        </LinearGradient>
      </TouchableOpacity>
      <FloatingMenu />
      <FullScreenLoading visible={loading} color={theme.colors.white} />
      <MessageError
        visible={showError}
        title={errorContent.title}
        description={errorContent.description}
        onClose={() => setShowError(false)}
      />
      <MessageSuccess
        visible={showSuccess}
        title={successContent.title}
        description={successContent.description}
        onClose={() => {
          setShowSuccess(false);
        }}
      />
    </LinearGradient>
  );
}

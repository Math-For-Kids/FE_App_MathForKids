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

export default function ProfilePupilScreen({ navigation }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [refreshProfile, setRefreshProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  const users = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.info || {});

  useEffect(() => {
    if (isFocused) {
      dispatch(profileById(users.id));
    }
  }, [isFocused, users?.id, refreshProfile]);

  useEffect(() => {
    const formattedDate = profile?.dateOfBirth?.seconds
      ? new Date(profile.dateOfBirth.seconds * 1000).toISOString().split("T")[0]
      : "";

    setEditedProfile({
      fullName: profile.fullName || "none",
      nickName: profile.nickName || "none",
      Grade: profile.grade || "none",
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
        Alert.alert("Success", "Avatar updated!");
      } catch (error) {
        Alert.alert("Upload failed", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateProfile({ id: users.id, data: editedProfile })
      ).unwrap();
      setRefreshProfile((prev) => !prev);
      Alert.alert("Success", "Profile updated successfully!");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const userFields = [
    { label: "Full name", fieldName: "fullName", type: "text" },
    { label: "Birthday", fieldName: "dateOfBirth", type: "text" },
    {
      label: "Gender",
      fieldName: "gender",
      type: "dropdown",
      options: ["Male", "Female"],
    },
    { label: "Address", fieldName: "address", type: "text" },
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
      fontSize: 36,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
    },
    scrollViewContainer: {
      alignItems: "center",
      paddingTop: 20,
    },
    imageWrapper: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatarContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderColor: theme.colors.grayMedium,
      borderWidth: 1,
      borderRadius: 50,
      padding: 5,
      elevation: 3,
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
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
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 20,
      maxHeight: "90%",
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
      padding: 10,
      borderWidth: 2,
      borderColor: theme.colors.grayLight,
      borderRadius: 50,
      backgroundColor: theme.colors.cardBackground,
      elevation: 5,
      alignSelf: "center",
    },
    avatar: { width: 50, height: 50 },
    iconCamera: {
      position: "absolute",
      top: 50,
      left: 130,
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
        <Text style={styles.title}>My profile</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageWrapper}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profile.avatar
                  ? { uri: profile.avatar }
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
                            : profile.avatar
                            ? { uri: profile.avatar }
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
                        placeholder={`Enter ${field.label.toLowerCase()}`}
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
                          <Text style={styles.editChangeTextButton}>Edit</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
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
          <Text style={styles.fieldLabel}>Edit</Text>
        </LinearGradient>
      </TouchableOpacity>
      <FloatingMenu />
    </LinearGradient>
  );
}

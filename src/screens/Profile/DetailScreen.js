import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
export default function DetailScreen({ navigation }) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");

  const handleSave = () => {
    Alert.alert("Success", "You have successfully edited your profile!");
    setModalVisible(false);
  };
  const user = {
    name: "Nguyen Thi Hong",
    nickname: "Jolly",
    class: "1",
    birthday: "2018",
    gender: "Daughter",
    avatar: theme.icons.avatarFemale,
  };

  const userFields = [
    { label: "Nickname", value: user.nickname, type: "text" },
    {
      label: "Class",
      value: user.class,
      type: "dropdown",
      options: ["1", "2", "3", "4"],
    },
    { label: "Birthday", value: user.birthday, type: "text" },
    {
      label: "Gender",
      value: user.gender,
      type: "dropdown",
      options: ["Male", "Female", "Daughter", "Other"],
    },
  ];

  const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
      height: "20%",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      paddingHorizontal: 20,
      paddingTop: 40,
      position: "relative",
      elevation: 3,
    },
    backBtn: {
      position: "absolute",
      left: 20,
      top: 40,
      backgroundColor: theme.colors.backBackgound,
      padding: 10,
      borderRadius: 50,
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    title: {
      fontSize: 28,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    content: {
      alignItems: "center",
      paddingTop: 20,
      paddingBottom: 80,
    },
    avatarWrapper: {
      padding: 10,
      borderWidth: 2,
      borderColor: theme.colors.blueDark,
      borderRadius: 50,
      backgroundColor: theme.colors.cardBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      elevation: 3,
    },
    avatar: {
      width: 50,
      height: 50,
    },
    name: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      marginBottom: 20,
    },
    field: {
      width: "80%",
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      color: theme.colors.white,
      marginBottom: 5,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    inputBox: {
      backgroundColor: theme.colors.cardBackground,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 2,
    },
    inputText: {
      fontSize: 16,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.blueDark,
      textAlign: "center",
    },
    editButtonWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    editButton: {
      paddingVertical: 12,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      alignItems: "center",
    },
    editText: {
      color: theme.colors.white,
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    carModalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    carModal: {
      backgroundColor: theme.colors.cardBackground,
      padding: 20,
      borderRadius: 20,
      width: "80%",
    },

    textModal: {
      color: theme.colors.textModal,
      fontSize: 14,
      fontFamily: Fonts.NUNITO_BLACK,
      textAlign: "center",
    },
    avatarWrapperModel: {
      marginVertical: 10,
      padding: 10,
      borderWidth: 2,
      borderColor: theme.colors.blueDark,
      borderRadius: 50,
      backgroundColor: theme.colors.cardBackground,
      elevation: 3,
      alignSelf: "center",
    },
    iconCamera: {
      position: "absolute",
      top: 40,
      left: 160,
      elevation: 5,
    },
    nameModalContainer: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
    },
    nameModal: {
      fontSize: 18,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.textModal,
      marginBottom: 20,
    },
    labelModal: {
      fontSize: 14,
      color: theme.colors.textModal,
      marginBottom: 5,
      fontFamily: Fonts.NUNITO_BLACK,
    },
    inputBoxModal: {
      backgroundColor: theme.colors.inputBoxModal,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 3,
      textAlign: "center",
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.textModal,
    },
    buttonModalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 90,
    },
    saveModal: {
      backgroundColor: theme.colors.green,
      marginVertical: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 3,
    },
    cancelModal: {
      backgroundColor: theme.colors.red,
      marginVertical: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 3,
    },
    buttonText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
    },
    menuContainer: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.grayLight,
      marginTop: 10,
      paddingVertical: 5,
      elevation: 5,
    },
    menuIconContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.inputBoxModal,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 3,
      justifyContent: "center",
    },
    menuIcon: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    menuItem: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.grayLight,
    },
    menuItemLast: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },

    menuText: {
      textAlign: "center",
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.textModal,
    },
  });

  return (
    <LinearGradient colors={theme.colors.gradientBlue} style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradientBluePrimary}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Image source={theme.icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrapper}>
          <Image
            source={user.avatar}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.name}>{user.name}</Text>

        {userFields.map((item, index) => (
          <View style={styles.field} key={index}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>{item.value}</Text>
            </View>
          </View>
        ))}

        <View style={styles.editButtonWrapper}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <LinearGradient
              style={styles.editButton}
              colors={theme.colors.gradientBlue}
            >
              <Text style={styles.editText}>Edit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.carModalContainer}>
          <View style={styles.carModal}>
            <Text style={styles.textModal}>Edit Profile</Text>
            <View style={styles.avatarWrapperModel}>
              <Image
                source={user.avatar}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
            <Ionicons
              name="camera-reverse-sharp"
              size={30}
              color={theme.colors.blueDark}
              style={styles.iconCamera}
            />
            <View style={styles.nameModalContainer}>
              <Text style={styles.nameModal}>{user.name}</Text>
              <Ionicons name="pencil" size={18} color={theme.colors.blueDark} />
            </View>
            {["nickname", "class", "birthday", "gender"].map((field, index) => {
              const isClassOrGender = field === "class" || field === "gender";
              const options =
                field === "class"
                  ? ["1", "2", "3"]
                  : field === "gender"
                  ? ["Daughter", "Son"]
                  : null;

              return (
                <View key={index}>
                  <Text style={styles.labelModal}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                  {isClassOrGender ? (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentField(field);
                        setMenuVisible(true);
                      }}
                    >
                      <View style={styles.menuIconContainer}>
                        <Text style={styles.menuText}>
                          {user[field] || "Select option..."}
                        </Text>
                        <Ionicons
                          name="caret-down-outline"
                          size={20}
                          color={theme.colors.blueDark}
                          style={styles.menuIcon}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={styles.inputBoxModal}
                      value={user[field]}
                    />
                  )}
                  {menuVisible && isClassOrGender && currentField === field && (
                    <View style={styles.menuContainer}>
                      {options.map((option, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.menuItem}
                          onPress={() => {
                            setMenuVisible(false);
                          }}
                        >
                          <Text style={styles.menuText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
            <View style={styles.buttonModalContainer}>
              <TouchableOpacity style={styles.saveModal} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelModal}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FloatingMenu />
    </LinearGradient>
  );
}

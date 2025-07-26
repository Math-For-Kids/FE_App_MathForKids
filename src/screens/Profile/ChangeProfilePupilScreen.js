import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    TextInput,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { getAllPupils, updatePupilProfile } from "../../redux/pupilSlice";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ChangeProfilePupilScreen({ navigation }) {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { t } = useTranslation("profile");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPupil, setSelectedPupil] = useState(null);
    const [editedProfile, setEditedProfile] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentField, setCurrentField] = useState("");

    const users = useSelector((state) => state.auth.user);
    const pupils = useSelector((state) => state.pupil.pupils || []);

    useEffect(() => {
        if (isFocused && users?.id) {
            dispatch(getAllPupils(users.id));
        }
    }, [isFocused, users?.id]);

    useEffect(() => {
        if (selectedPupil) {
            const dobSeconds = selectedPupil?.dateOfBirth?.seconds || 0;
            const formattedDate =
                dobSeconds && dobSeconds > 0
                    ? new Date(dobSeconds * 1000).toLocaleDateString("vi-VN")
                    : "";

            setEditedProfile({
                fullName: selectedPupil.fullName || "",
                nickName: selectedPupil.nickName || "",
                grade: selectedPupil.grade || "",
                dateOfBirth: formattedDate,
                gender: selectedPupil.gender || "",
            });
        }
    }, [selectedPupil]);

    const handleChange = (field, value) => {
        setEditedProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Check for empty fields
        for (const [key, value] of Object.entries(editedProfile)) {
            if (!value || value.trim() === "") {
                Alert.alert("Missing Info", `Please fill in ${key}.`);
                return;
            }
        }

        // Validate age based on grade
        const age =
            new Date().getFullYear() -
            new Date(editedProfile.dateOfBirth).getFullYear();
        const grade = parseInt(editedProfile.grade, 10);

        if (isNaN(age) || !editedProfile.dateOfBirth) {
            Alert.alert("Invalid Date", "Please select a valid date of birth.");
            return;
        }

        if (
            (grade === 1 && age < 6) ||
            (grade === 2 && age < 7) ||
            (grade === 3 && age < 8)
        ) {
            Alert.alert(
                "Invalid Age",
                `Age must be at least ${grade + 5} years for Grade ${grade}.`
            );
            return;
        }

        try {
            await dispatch(
                updatePupilProfile({ id: selectedPupil.id, data: editedProfile })
            ).unwrap();
            dispatch(getAllPupils(users.id));
            Alert.alert("Success", "Pupil profile updated successfully!");
            setModalVisible(false);
            setSelectedPupil(null);
        } catch (error) {
            Alert.alert("Error", "Failed to update pupil profile");
        }
    };

    const handleDropdownToggle = (fieldName) => {
        // Toggle dropdown: if the same field is clicked, close it; otherwise, open the new one
        setCurrentField((prev) => (prev === fieldName ? "" : fieldName));
    };

    const pupilFields = [
        { label: t("fullName"), fieldName: "fullName", type: "text" },
        { label: t("nickName"), fieldName: "nickName", type: "text" },
        {
            label: t("grade"),
            fieldName: "grade",
            type: "dropdown",
            options: ["1", "2", "3"],
        },
        { label: t("birthday"), fieldName: "dateOfBirth", type: "date" },
        {
            label: t("gender"),
            fieldName: "gender",
            type: "dropdown",
            options: [t("male"), t("female")],
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
        backIcon: {
            width: 24,
            height: 24
        },
        titlelable1: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
        },
        titlelable: {
            fontSize: 16,
            fontFamily: Fonts.NUNITO_BOLD,
            color: theme.colors.white,
            textAlign: "center",
        },
        title: {
            fontSize: 28,
            fontFamily: Fonts.NUNITO_BOLD,
            color: theme.colors.white,
            width: "50%",
            textAlign: "center",
        },
        scrollViewContainer: {
            alignItems: "center",
            paddingBottom: 20,
        },
        pupilItem: {
            width: "80%",
            padding: 15,
            borderRadius: 10,
            backgroundColor: theme.colors.paleBeige,
            marginBottom: 10,
            elevation: 3,
        },
        pupilName: {
            fontFamily: Fonts.NUNITO_MEDIUM,
            color: theme.colors.blueGray,
            fontSize: 16,
            textAlign: "center",
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: "center",
        },
        modalContainer: {
            marginHorizontal: 30,
            padding: 20,
            borderRadius: 20,
            backgroundColor: theme.colors.cardBackground,
            elevation: 3,
        },
        textModal: {
            color: theme.colors.blueGray,
            fontSize: 18,
            fontFamily: Fonts.NUNITO_MEDIUM,
            textAlign: "center",
            marginBottom: 20,
        },
        inputGroup: {
            marginBottom: 15,
        },
        inputLabel: {
            fontFamily: Fonts.NUNITO_MEDIUM,
            color: theme.colors.blueGray,
            marginBottom: 5,
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
        dropdownMenu: {
            marginTop: 5,
            borderRadius: 8,
            elevation: 5,
            backgroundColor: theme.colors.inputBoxModal,
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
        buttonText: {
            fontFamily: Fonts.NUNITO_MEDIUM,
            color: theme.colors.white,
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
                <Text style={styles.title}>{t("pupilProfiles")}</Text>
            </LinearGradient>
            <View style={styles.titlelable1}>
                <Text style={styles.titlelable}>{t("selectpupil")}</Text>
            </View>
            {/* Pupil List */}
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {pupils.length === 0 ? (
                    <Text style={styles.pupilName}>{t("noPupilsFound")}</Text>
                ) : (
                    pupils.map((pupil) => (
                        <TouchableOpacity
                            key={pupil.id}
                            style={styles.pupilItem}
                            onPress={() => {
                                setSelectedPupil(pupil);
                                setModalVisible(true);
                            }}
                        >
                            <Text style={styles.pupilName}>{pupil.fullName}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.textModal}>{t("editPupilProfile")}</Text>
                        <ScrollView>
                            {pupilFields.map((field, index) => (
                                <View key={index} style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>{field.label}</Text>
                                    {field.type === "dropdown" ? (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => handleDropdownToggle(field.fieldName)}
                                                style={styles.dropdownButton}
                                            >
                                                <Text style={styles.dropdownButtonText}>
                                                    {editedProfile[field.fieldName] || "Select option..."}
                                                </Text>
                                            </TouchableOpacity>
                                            {currentField === field.fieldName && (
                                                <View style={styles.dropdownMenu}>
                                                    {field.options.map((opt, i) => (
                                                        <TouchableOpacity
                                                            key={i}
                                                            onPress={() => {
                                                                handleChange(field.fieldName, opt);
                                                                setCurrentField("");
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
                                        <>
                                            <TouchableOpacity
                                                onPress={() => setShowDatePicker(true)}
                                                style={styles.inputBox}
                                            >
                                                <Text
                                                    style={[
                                                        styles.inputTextBox,
                                                        { textAlign: "center", width: "100%" },
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
                                        <View style={styles.inputBox}>
                                            <TextInput
                                                value={editedProfile[field.fieldName]}
                                                onChangeText={(text) =>
                                                    handleChange(field.fieldName, text)
                                                }
                                                style={styles.inputTextBox}
                                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                                placeholderTextColor={theme.colors.grayMedium}
                                            />
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
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedPupil(null);
                                    setCurrentField("");
                                }}
                                style={styles.cancelButton}
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
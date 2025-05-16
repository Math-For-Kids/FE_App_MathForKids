import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
} from "react-native";
import { useTheme } from "../../themes/ThemeContext";
import { Fonts } from "../../../constants/Fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import FloatingMenu from "../../components/FloatingMenu";

export default function LessonDetailScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { skillName, title } = route.params;

  const lessonData = {
    define:
      "Lesson content: Define with lots of information heref bgrbbbgbgbgvgeretrrrrrrrrrrrrrrrrrrrrrrrrrrrrrfgbfgbfgfbgbfgbfgbfgbfbfgfefregregrererertrtertergfghfghfghfghfghfghfghfghgfhghgfrrrrrrreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddddddddddddddddddddDefine with lots of information heref bgrbbbgbgbgvgeretrrrrrrrrrrrrrrrrrrrrrrrrrrrrrfgbfgbfgfbgbfgbfgbfgbfbfgfefregregrererertrtertergfghfghfghfghfghfghfghfghgfhghgfrrrrrrreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedddddddddddddddddddddddddddddddddddddddddddddddddddddddddd...dddddddddddddddd...",
    example: "Exercise content: Examples and tasks go here...",
    remember: "Remember content: Review questions and summaries here...",
  };

  const tabs = ["Lesson", "Exercise", "Remember"];
  const tabContents = [
    lessonData.define,
    lessonData.example,
    lessonData.remember,
  ];

  const screenWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimating = useRef(false);

  const position = useRef(new Animated.Value(0)).current;
  const [content, setContent] = useState(tabContents[0]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleSwipe = (direction) => {
    const maxIndex = tabContents.length - 1;

    if (isAnimating.current) return;

    const indexNow = currentIndexRef.current;

    if (direction === "left" && indexNow < maxIndex) {
      const newIndex = indexNow + 1;
      isAnimating.current = true;
      Animated.timing(position, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(newIndex);
        setContent(tabContents[newIndex]);
        position.setValue(screenWidth);
        Animated.timing(position, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          isAnimating.current = false;
        });
      });
    } else if (direction === "right" && indexNow > 0) {
      const newIndex = indexNow - 1;
      isAnimating.current = true;
      Animated.timing(position, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(newIndex);
        setContent(tabContents[newIndex]);
        position.setValue(-screenWidth);
        Animated.timing(position, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          isAnimating.current = false;
        });
      });
    }
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 30,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -100) {
          handleSwipe("left");
        } else if (gesture.dx > 100) {
          handleSwipe("right");
        }
      },
    })
  ).current;
  const getGradient = () => {
    if (skillName === "Addition") return theme.colors.gradientGreen;
    if (skillName === "Subtraction") return theme.colors.gradientPurple;
    if (skillName === "Multiplication") return theme.colors.gradientOrange;
    if (skillName === "Division") return theme.colors.gradientRed;
    return theme.colors.gradientPink;
  };

  const getCardBackground = () => {
    if (skillName === "Addition") return theme.colors.GreenLight;
    if (skillName === "Subtraction") return theme.colors.purpleLight;
    if (skillName === "Multiplication") return theme.colors.orangeLight;
    if (skillName === "Division") return theme.colors.redLight;
    return theme.colors.pinkLight;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: theme.colors.background,
    },
    header: {
      width: "100%",
      height: "18%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      elevation: 3,
      marginBottom: 20,
    },
    backButton: {
      position: "absolute",
      left: 10,
      backgroundColor: theme.colors.backBackgound,
      marginLeft: 20,
      padding: 8,
      borderRadius: 50,
    },
    headerText: {
      fontSize: 32,
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.white,
      width: "60%",
      textAlign: "center",
    },
    soundContainer: {
      width: 40,
      alignItems: "center",
      paddingVertical: 5,
      borderRadius: 50,
      elevation: 3,
      marginLeft: 20,
    },
    cardLesson: {
      paddingHorizontal: 20,
      paddingTop: 40,
      backgroundColor: getCardBackground(),
      borderRadius: 40,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 40,
      elevation: 3,
      minHeight: 250,
      maxHeight: 400,
    },
    lessonTextListContainer: {
      maxHeight: 400,
    },
    lessonTextList: {
      fontSize: 20,
      fontFamily: Fonts.NUNITO_BOLD,
      color: theme.colors.white,
      paddingBottom: 80,
    },
    lessonTitleTextList: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.black,
      fontSize: 22,
    },
    linkButton: {
      marginTop: 30,
      alignSelf: "center",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
    linkTextContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: 350,
      left: 200,
      fontSize: 16,
    },
    linkText: {
      fontFamily: Fonts.NUNITO_BLACK,
      color: theme.colors.blueDark,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.blueDark,
    },
    linkIcon: {
      paddingLeft: 10,
    },
  });
  return (
    <View style={styles.container}>
      <LinearGradient colors={getGradient()} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text
          style={styles.headerText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {title}
        </Text>
      </LinearGradient>

      <LinearGradient colors={getGradient()} style={styles.soundContainer}>
        <TouchableOpacity>
          <Ionicons name="volume-medium" size={28} color={theme.colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.cardLesson,
          {
            transform: [{ translateX: position }],
          },
        ]}
      >
        <Text style={styles.lessonTitleTextList}>{tabs[currentIndex]}</Text>

        <ScrollView style={styles.lessonTextListContainer}>
          <Text style={styles.lessonTextList}>{content}</Text>
        </ScrollView>

        {tabs[currentIndex] === "Remember" && (
          <TouchableOpacity
            style={[styles.linkButton, styles.linkTextContainer]}
            onPress={() => navigation.navigate("TestScreen", { skillName })}
          >
            <Text style={styles.linkText}>Start Test</Text>
            <Ionicons
              name="arrow-forward"
              size={24}
              color={theme.colors.black}
              style={styles.linkIcon}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      <FloatingMenu />
    </View>
  );
}

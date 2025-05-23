import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Common screens
import LoadingScreen from "./screens/LoadingScreen";
import LoadingProgressScreen from "./screens/LoadingProgressScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VerifyScreen from "./screens/VerifyScreen";

// User-only or shared
import SettingScreen from "./screens/SettingScreen";
import AccountScreen from "./screens/AccountScreen";
import CreatePupilAccountScreen from "./screens/CreatePupilAccount";
import NotificationScreen from "./screens/NotificationScreen";
import RankScreen from "./screens/RankScreen";
import TargetScreen from "./screens/TargetScreen";
import RewardScreen from "./screens/RewardScreen";
import ContactScreen from "./screens/ContactScreen";
import TestLevelScreen from "./screens/TestLevelScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import DetailScreen from "./screens/Profile/DetailScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import SkillScreen from "./screens/Home/SkillScreen";
import MultiplicationTableScreen from "./screens/Home/MultiplicationTablesScreen";
import MultiplicationTableDetailScreen from "./screens/Home/MultiplicationTableDetailScreen";
import PracticeMultiplicationTableScreen from "./screens/Home/PracticeMultiplicationTableScreen";
import LessonScreen from "./screens/Home/LessonScreen";
import LessonDetailScreen from "./screens/Home/LessonDetailScreen";
import ExerciseScreen from "./screens/Home/ExerciseScreen";
import ExerciseResultScreen from "./screens/Home/ExerciseResultScreen";
import TestScreen from "./screens/Home/TestScreen";
import StepByStepScreen from "./screens/StepByStep/StepByStepScreen";
import StatisticScreen from "./screens/StatisticScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadRole = async () => {
  //     // const savedRole = await AsyncStorage.getItem("userRole");
  //     const savedRole = await AsyncStorage.getItem("pupil");
  //     setRole(savedRole);
  //     setLoading(false);
  //   };
  //   loadRole();
  // }, []);

  useEffect(() => {
    const testRole = "user";
    setRole(testRole);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role && (
          <>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen
              name="LoadingProgress"
              component={LoadingProgressScreen}
            />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="VerifyScreen" component={VerifyScreen} />
          </>
        )}

        {role === "pupil" && (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="SkillScreen" component={SkillScreen} />
            <Stack.Screen
              name="MultiplicationTableScreen"
              component={MultiplicationTableScreen}
            />
            <Stack.Screen
              name="MultiplicationTableDetailScreen"
              component={MultiplicationTableDetailScreen}
            />
            <Stack.Screen
              name="PracticeMultiplicationTableScreen"
              component={PracticeMultiplicationTableScreen}
            />
            <Stack.Screen name="LessonScreen" component={LessonScreen} />
            <Stack.Screen
              name="LessonDetailScreen"
              component={LessonDetailScreen}
            />
            <Stack.Screen name="ExerciseScreen" component={ExerciseScreen} />
            <Stack.Screen
              name="ExerciseResultScreen"
              component={ExerciseResultScreen}
            />
            <Stack.Screen
              name="StepByStepScreen"
              component={StepByStepScreen}
            />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="DetailScreen" component={DetailScreen} />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
            />
            <Stack.Screen name="RankScreen" component={RankScreen} />
            <Stack.Screen name="TargetScreen" component={TargetScreen} />
            <Stack.Screen name="RewardScreen" component={RewardScreen} />
            <Stack.Screen name="ContactScreen" component={ContactScreen} />
            <Stack.Screen name="TestLevelScreen" component={TestLevelScreen} />
            <Stack.Screen name="TestScreen" component={TestScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} />
            <Stack.Screen
              name="CreatePupilAccountScreen"
              component={CreatePupilAccountScreen}
            />
          </>
        )}

        {role === "user" && (
          <>
            <Stack.Screen name="StatisticScreen" component={StatisticScreen} />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
            />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

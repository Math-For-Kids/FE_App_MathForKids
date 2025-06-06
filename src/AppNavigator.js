import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import LoadingScreen from "./screens/LoadingScreen";
import LoadingProgressScreen from "./screens/LoadingProgressScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VerifyScreen from "./screens/VerifyScreen";
import SettingScreen from "./screens/SettingScreen";
import AccountScreen from "./screens/AccountScreen";
import ForgetPinScreen from "./screens/ForgetPinScreen";
import CreatePupilAccountScreen from "./screens/CreatePupilAccount";
import NotificationScreen from "./screens/NotificationScreen";
import RankScreen from "./screens/RankScreen";
import TargetScreen from "./screens/TargetScreen";
import RewardScreen from "./screens/RewardScreen";
import ContactScreen from "./screens/ContactScreen";
import TestLevelScreen from "./screens/TestLevelScreen";
import PrivacyScreen from "./screens/Profile/PrivacyScreen";
import ChangeEmailScreen from "./screens/Profile/ChangeEmailScreen";
import ChangePhoneScreen from "./screens/Profile/ChangePhoneScreen";
import ChangePinScreen from "./screens/Profile/ChangePinScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import DetailScreen from "./screens/Profile/DetailScreen";
import ProfilePupilDetailScreen from "./screens/Profile/ProfilePupilDetailScreen";
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
import GoalScreen from "./screens/GoalScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const role = useSelector((state) => state.auth.user?.role);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen
          name="LoadingProgressScreen"
          component={LoadingProgressScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="VerifyScreen" component={VerifyScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="ForgetPinScreen" component={ForgetPinScreen} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />

        {/* user */}
        {role === "user" && (
          <>
            <Stack.Screen name="StatisticScreen" component={StatisticScreen} />
            <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
            <Stack.Screen
              name="ChangeEmailScreen"
              component={ChangeEmailScreen}
            />
            <Stack.Screen
              name="ChangePhoneScreen"
              component={ChangePhoneScreen}
            />
            <Stack.Screen name="ChangePinScreen" component={ChangePinScreen} />
            <Stack.Screen name="GoalScreen" component={GoalScreen} />
            <Stack.Screen
              name="CreatePupilAccountScreen"
              component={CreatePupilAccountScreen}
            />
          </>
        )}
        {/* pupil */}
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
          <Stack.Screen name="StepByStepScreen" component={StepByStepScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen
            name="ProfilePupilDetailScreen"
            component={ProfilePupilDetailScreen}
          />
          <Stack.Screen name="RankScreen" component={RankScreen} />
          <Stack.Screen name="TargetScreen" component={TargetScreen} />
          <Stack.Screen name="RewardScreen" component={RewardScreen} />
          <Stack.Screen name="TestLevelScreen" component={TestLevelScreen} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

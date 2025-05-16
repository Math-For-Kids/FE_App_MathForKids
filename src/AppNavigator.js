import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./screens/LoadingScreen";
import LoadingProgressScreen from "./screens/LoadingProgressScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SettingScreen from "./screens/SettingScreen";
import VerifyScreen from "./screens/VerifyScreen";
import AccountScreen from "./screens/AccountScreen";
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
import LessonScreen from "./screens/Home/LessonScreen";
import LessonDetailScreen from "./screens/Home/LessonDetailScreen";
import ExerciseScreen from "./screens/Home/ExerciseScreen";
import ExerciseResultScreen from "./screens/Home/ExerciseResultScreen";
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer style={{ zIndex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen
          name="LoadingProgress"
          component={LoadingProgressScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        <Stack.Screen name="VerifyScreen" component={VerifyScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="RankScreen" component={RankScreen} />
        <Stack.Screen name="TargetScreen" component={TargetScreen} />
        <Stack.Screen name="RewardScreen" component={RewardScreen} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />

        <Stack.Screen name="TestLevelScreen" component={TestLevelScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} /> */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SkillScreen" component={SkillScreen} />
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
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

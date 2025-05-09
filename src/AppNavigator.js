// src/AppNavigator.js
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./screens/LoadingScreen";
import LoadingProgressScreen from "./screens/LoadingProgressScreen";
import LoginScreen from "./screens/LoginScreen"; // màn chính
import RegisterScreen from "./screens/RegisterScreen";
import SettingScreen from "./screens/SettingScreen";
import VerifyScreen from "./screens/VerifyScreen";
import AccountScreen from "./screens/AccountScreen";
import NotificationScreen from "./screens/NotificationScreen";
import RankScreen from "./screens/RankScreen";
import TargetScreen from "./screens/TargetScreen";
import RewardScreen from "./screens/RewardScreen";
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer style={{ zIndex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
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
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
